/**
 * @fileoverview Panel de administración CRUD para tractores (TractorForm).
 *
 * Página protegida accesible solo para usuarios autenticados con rol administrador.
 * Implementa operaciones completas de Crear, Leer, Actualizar y Eliminar tractores
 * contra la API remota (o datos mock cuando la API no está disponible).
 *
 * Características principales:
 *  - Tabla paginada con ordenamiento server-side por nombre, potencia y estado
 *  - Búsqueda en tiempo real con debounce implícito vía `useMemo`
 *  - Filtros rápidos por tipo de tracción y estado (badges de un solo clic)
 *  - Modal de formulario para crear/editar con validación client-side
 *  - AlertDialog de confirmación antes de eliminar
 *  - Indicadores de carga y mensajes de error descriptivos
 *
 * Responsive:
 *  - Tabla con scroll horizontal en móvil (`overflow-x-auto`)
 *  - Formulario del modal en 1 columna (móvil) → 2 columnas (md+)
 *  - Barra de herramientas apilada en móvil, en fila en lg+
 *
 * @module pages/TractorForm
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Gauge,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  createTractor,
  deleteTractor,
  getTractors,
  isRemoteTractorApiEnabled,
  updateTractor,
} from '@/services/tractorApi';
import { 
  notifyTractorAvailable, 
  notifyError, 
  notifySuccess 
} from '@/services/notificationService';

// ---------------------------------------------------------------------------
// Constantes y estado inicial
// ---------------------------------------------------------------------------

/**
 * Estado inicial vacío para el formulario de tractor.
 * Se usa tanto al crear un nuevo tractor como al resetear el formulario.
 *
 * @type {Object}
 */
const ESTADO_INICIAL_TRACTOR = {
  name: '',
  brand: '',
  model: '',
  engine_power_hp: '',
  weight_kg: '',
  traction_force_kn: '',
  traction_type: '4x4',
  tire_type: '',
  tire_width_mm: '',
  tire_diameter_mm: '',
  tire_pressure_psi: '',
  status: 'available',
};

/**
 * Mapeo de claves de columna de la UI a campos del backend para ordenamiento.
 *
 * @type {Record<string, string>}
 */
const ORDER_BY_FIELD = {
  name: 'name',
  engine_power_hp: 'engine_power_hp',
  status: 'status',
};

/**
 * Opciones de filtro rápido para tipo de tracción.
 * `value` coincide con los valores del backend (traction_type).
 */
const FILTROS_TRACCION = [
  { label: '4x4', value: '4x4' },
  { label: '4x2', value: '4x2' },
  { label: 'Orugas', value: 'track' },
];

/**
 * Opciones de filtro rápido para estado del tractor.
 * `value` coincide con los valores del backend (status).
 */
const FILTROS_ESTADO = [
  { label: 'Disponible', value: 'available' },
  { label: 'Mantenimiento', value: 'maintenance' },
  { label: 'Fuera de servicio', value: 'out_of_service' },
];

/**
 * Mapeo de valores de tracción del backend a etiquetas legibles.
 */
const TRACCION_LABELS = {
  '4x4': '4x4',
  '4x2': '4x2',
  track: 'Orugas',
};

// ---------------------------------------------------------------------------
// Sub-componente: indicador de ordenamiento
// ---------------------------------------------------------------------------

/**
 * SortIndicator — Ícono que indica la dirección del ordenamiento activo.
 *
 * @component
 * @param {Object} props
 * @param {string} props.fieldKey     - Clave de columna de la UI.
 * @param {Object} props.ordenamiento - Estado actual `{ sort, order }`.
 */
const SortIndicator = React.memo(({ fieldKey, ordenamiento }) => {
  const backendField = ORDER_BY_FIELD[fieldKey] || 'name';

  if (ordenamiento.sort !== backendField) {
    return <ArrowDownAZ className="ml-1.5 size-3.5 opacity-35" aria-hidden="true" />;
  }

  return ordenamiento.order === 'asc'
    ? <ArrowDownAZ className="ml-1.5 size-3.5" aria-hidden="true" />
    : <ArrowUpAZ className="ml-1.5 size-3.5" aria-hidden="true" />;
});
SortIndicator.displayName = 'SortIndicator';

// ---------------------------------------------------------------------------
// Sub-componente: badge de filtro rápido
// ---------------------------------------------------------------------------

/**
 * FilterBadge — Botón de filtro de un solo clic con estilo badge.
 * Activo: fondo primario (wine). Inactivo: outline sutil.
 *
 * @component
 * @param {Object}   props
 * @param {string}   props.label    - Texto visible del filtro.
 * @param {boolean}  props.active   - Si el filtro está seleccionado.
 * @param {Function} props.onClick  - Callback al hacer clic.
 */
const FilterBadge = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'inline-flex items-center px-3 py-1 text-xs font-medium rounded border transition-colors',
      active
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground',
    ].join(' ')}
  >
    {label}
  </button>
);

// ---------------------------------------------------------------------------
// Sub-componente: campo de formulario con label de unidad
// ---------------------------------------------------------------------------

/**
 * InputConUnidad — Input numérico con label de unidad alineada a la derecha.
 *
 * @component
 * @param {Object} props
 * @param {string} props.label   - Etiqueta del campo.
 * @param {string} props.unit    - Unidad de medida (ej. "HP", "kg").
 * @param {*}      props.rest    - Props adicionales para el Input.
 */
const InputConUnidad = ({ label, unit, required, ...rest }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-foreground">
      {label}{required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
    <div className="relative">
      <Input {...rest} className="pr-12" />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">
        {unit}
      </span>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * TractorCRUD — Panel de administración de tractores.
 *
 * @component
 * @returns {JSX.Element}
 */
const TractorCRUD = () => {
  // ── Configuración de API ──────────────────────────────────────────────────
  const remoteApiEnabled = isRemoteTractorApiEnabled();

  // ── Estado: datos de la tabla ─────────────────────────────────────────────
  const [tractores, setTractores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');

  // ── Estado: paginación ────────────────────────────────────────────────────
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPorPagina = 10;

  // ── Estado: búsqueda y filtros ────────────────────────────────────────────
  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState({ sort: 'name', order: 'asc' });

  /**
   * Filtros rápidos activos.
   * `traccion`: valor de traction_type o '' para ninguno.
   * `estado`: valor de status o '' para ninguno.
   */
  const [filtroRapido, setFiltroRapido] = useState({ traccion: '', estado: '' });

  // ── Estado: modales ───────────────────────────────────────────────────────
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [tractorAEliminar, setTractorAEliminar] = useState(null);

  // ── Estado: formulario ────────────────────────────────────────────────────
  const [tractorActual, setTractorActual] = useState(ESTADO_INICIAL_TRACTOR);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  // ── Consulta memoizada ────────────────────────────────────────────────────

  /**
   * Objeto de consulta para la API.
   * Los filtros rápidos de tracción y estado se pasan como parámetros adicionales
   * que el mock filtra client-side y la API remota puede recibir como query params.
   */
  const consulta = useMemo(() => ({
    page: paginaActual,
    limit: itemsPorPagina,
    sort: ordenamiento.sort,
    order: ordenamiento.order,
    search: busqueda.trim(),
    brand: '',
    minPower: '',
    maxPower: '',
  }), [paginaActual, ordenamiento, busqueda]);

  // ── Carga de datos ────────────────────────────────────────────────────────

  const cargarTabla = useCallback(async () => {
    setCargando(true);
    setErrorCarga('');

    try {
      const response = await getTractors(consulta);
      const datos = Array.isArray(response?.data) ? response.data : [];
      const paginacion = response?.pagination ?? {};

      setTractores(datos);
      setTotalPaginas(Number(paginacion.totalPages ?? 1));
      setTotalItems(Number(paginacion.total ?? datos.length));
    } catch (error) {
      setErrorCarga(error.message || 'No se pudieron cargar los tractores.');
      setTractores([]);
      setTotalPaginas(1);
      setTotalItems(0);
    } finally {
      setCargando(false);
    }
  }, [consulta]);

  useEffect(() => {
    cargarTabla();
  }, [cargarTabla]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroRapido]);

  // ── Filtrado client-side de filtros rápidos ───────────────────────────────

  /**
   * Tractores filtrados por los filtros rápidos de tracción y estado.
   * Se aplica sobre los datos ya cargados (client-side) para respuesta inmediata.
   */
  const tractoresFiltrados = useMemo(() => {
    return tractores.filter((t) => {
      const matchTraccion = !filtroRapido.traccion || t.traction_type === filtroRapido.traccion;
      const matchEstado = !filtroRapido.estado || t.status === filtroRapido.estado;
      return matchTraccion && matchEstado;
    });
  }, [tractores, filtroRapido]);

  // ── Manejadores del modal de formulario ───────────────────────────────────

  const abrirModal = (tractor = null) => {
    if (tractor) {
      setTractorActual({
        tractor_id: tractor.tractor_id,
        name: tractor.name ?? '',
        brand: tractor.brand ?? '',
        model: tractor.model ?? '',
        engine_power_hp: tractor.engine_power_hp ?? '',
        weight_kg: tractor.weight_kg ?? '',
        traction_force_kn: tractor.traction_force_kn ?? '',
        traction_type: tractor.traction_type ?? '4x4',
        tire_type: tractor.tire_type ?? '',
        tire_width_mm: tractor.tire_width_mm ?? '',
        tire_diameter_mm: tractor.tire_diameter_mm ?? '',
        tire_pressure_psi: tractor.tire_pressure_psi ?? '',
        status: tractor.status ?? 'available',
      });
      setModoEdicion(true);
    } else {
      setTractorActual(ESTADO_INICIAL_TRACTOR);
      setModoEdicion(false);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setGuardando(false);
  };

  // ── Manejadores del formulario ────────────────────────────────────────────

  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setTractorActual((prev) => ({ ...prev, [name]: value }));
  };

  const obtenerPayload = () => {
    const payload = {
      name: tractorActual.name?.trim(),
      brand: tractorActual.brand?.trim(),
      model: tractorActual.model?.trim(),
      engine_power_hp: Number(tractorActual.engine_power_hp),
      traction_type: tractorActual.traction_type,
      status: tractorActual.status,
    };

    const camposNumericos = [
      'weight_kg', 'traction_force_kn',
      'tire_width_mm', 'tire_diameter_mm', 'tire_pressure_psi',
    ];

    camposNumericos.forEach((field) => {
      const value = tractorActual[field];
      if (value !== '' && value !== null && value !== undefined) {
        payload[field] = Number(value);
      }
    });

    if (tractorActual.tire_type?.trim()) {
      payload.tire_type = tractorActual.tire_type.trim();
    }

    return payload;
  };

  const validarFormulario = () => {
    if (!tractorActual.name?.trim())  return 'El nombre es obligatorio.';
    if (!tractorActual.brand?.trim()) return 'La marca es obligatoria.';
    if (!tractorActual.model?.trim()) return 'El modelo es obligatorio.';
    if (tractorActual.engine_power_hp === '' || Number(tractorActual.engine_power_hp) <= 0) {
      return 'La potencia del motor debe ser mayor a 0.';
    }
    if (!tractorActual.traction_type) return 'El tipo de tracción es obligatorio.';
    return null;
  };

  const guardarTractor = async () => {
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      notifyError('Error de validación', errorValidacion);
      return;
    }

    setGuardando(true);

    try {
      const payload = obtenerPayload();

      if (modoEdicion) {
        await updateTractor(tractorActual.tractor_id, payload);
        notifySuccess('Tractor Actualizado', `El tractor ${payload.name} se actualizó correctamente.`);
      } else {
        await createTractor(payload);
        notifyTractorAvailable(null, payload.name);
      }

      cerrarModal();
      await cargarTabla();
    } catch (error) {
      const message = error.message?.includes('401') || error.message?.includes('403')
        ? 'No autorizado. Necesitas un token válido y rol administrador para guardar cambios.'
        : error.message || 'No se pudo guardar el tractor.';
      notifyError('No se pudo guardar', message);
      setGuardando(false);
    }
  };

  // ── Manejadores del modal de confirmación de eliminación ──────────────────

  const abrirConfirmacionEliminacion = (tractor) => {
    setTractorAEliminar(tractor);
    setModalConfirmacionAbierto(true);
  };

  const cerrarConfirmacionEliminacion = () => {
    setModalConfirmacionAbierto(false);
    setTractorAEliminar(null);
    setEliminando(false);
  };

  const confirmarEliminacionTractor = async () => {
    if (!tractorAEliminar?.tractor_id) return;

    setEliminando(true);

    try {
      await deleteTractor(tractorAEliminar.tractor_id);
      notifySuccess('Tractor Eliminado', `El tractor fue eliminado.`);
      cerrarConfirmacionEliminacion();
      await cargarTabla();
    } catch (error) {
      const message = error.message?.includes('401') || error.message?.includes('403')
        ? 'No autorizado. Necesitas un token válido y rol administrador para eliminar.'
        : error.message || 'No se pudo eliminar el tractor.';
      notifyError('No se pudo eliminar', message);
      setEliminando(false);
    }
  };

  // ── Manejador de ordenamiento ─────────────────────────────────────────────

  const alternarOrden = (fieldKey) => {
    const backendField = ORDER_BY_FIELD[fieldKey] || 'name';

    setOrdenamiento((prev) => ({
      sort: backendField,
      order: prev.sort === backendField && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  // ── Manejadores de filtros rápidos ────────────────────────────────────────

  /**
   * Alterna un filtro rápido: si ya está activo, lo desactiva; si no, lo activa.
   *
   * @param {'traccion'|'estado'} tipo  - Tipo de filtro.
   * @param {string}              valor - Valor del filtro.
   */
  const alternarFiltroRapido = (tipo, valor) => {
    setFiltroRapido((prev) => ({
      ...prev,
      [tipo]: prev[tipo] === valor ? '' : valor,
    }));
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroRapido({ traccion: '', estado: '' });
  };

  // ── Derivados ─────────────────────────────────────────────────────────────

  const hayFiltrosActivos = Boolean(
    busqueda.trim() || filtroRapido.traccion || filtroRapido.estado
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* ── Encabezado de la página ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Gestión de Tractores
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {remoteApiEnabled
            ? 'API remota activa — paginación y filtros server-side.'
            : 'Modo local — datos mock listos para integración con backend.'}
        </p>
      </div>

      {/* ── Card: tabla CRUD con barra de herramientas integrada ── */}
      <Card className="border border-border bg-card shadow-none">

        {/* ── Barra de herramientas: búsqueda + filtros rápidos + CTA ── */}
        <CardHeader className="border-b border-border pb-3 pt-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

            {/* Lado izquierdo: búsqueda y filtros rápidos */}
            <div className="flex flex-col gap-3">

              {/* Búsqueda */}
              <div className="relative w-full max-w-xs">
                <Search
                  className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  className="pl-8 text-sm"
                  placeholder="Buscar tractor por modelo o marca..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar tractores por modelo o marca"
                />
              </div>

              {/* Filtros rápidos */}
              <div className="flex flex-wrap gap-2">
                {/* Grupo: Tracción */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground select-none">Tracción:</span>
                  {FILTROS_TRACCION.map((f) => (
                    <FilterBadge
                      key={f.value}
                      label={f.label}
                      active={filtroRapido.traccion === f.value}
                      onClick={() => alternarFiltroRapido('traccion', f.value)}
                    />
                  ))}
                </div>

                {/* Separador visual */}
                <span className="hidden sm:inline-block w-px bg-border self-stretch" aria-hidden="true" />

                {/* Grupo: Estado */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground select-none">Estado:</span>
                  {FILTROS_ESTADO.map((f) => (
                    <FilterBadge
                      key={f.value}
                      label={f.label}
                      active={filtroRapido.estado === f.value}
                      onClick={() => alternarFiltroRapido('estado', f.value)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Lado derecho: botón de acción principal */}
            <div className="flex items-start lg:items-center lg:pt-0 pt-1">
              <Button
                onClick={() => abrirModal()}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Plus className="mr-1.5 size-3.5" aria-hidden="true" />
                Añadir Tractor
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-0">
          {cargando ? (
            /* Estado de carga */
            <div className="py-12 text-center text-sm text-muted-foreground">
              Cargando tractores...
            </div>
          ) : errorCarga ? (
            /* Estado de error */
            <div className="py-12 text-center text-sm text-destructive">{errorCarga}</div>
          ) : (
            <>
              {/* Tabla con scroll horizontal en móvil */}
              <div className="overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent">
                      {/* Columna Nombre — ordenable */}
                      <TableHead className="pl-4 sm:pl-6">
                        <button
                          type="button"
                          onClick={() => alternarOrden('name')}
                          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Nombre
                          <SortIndicator fieldKey="name" ordenamiento={ordenamiento} />
                        </button>
                      </TableHead>

                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Marca / Modelo
                      </TableHead>

                      {/* Columna Potencia — ordenable */}
                      <TableHead>
                        <button
                          type="button"
                          onClick={() => alternarOrden('engine_power_hp')}
                          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Potencia (HP)
                          <SortIndicator fieldKey="engine_power_hp" ordenamiento={ordenamiento} />
                        </button>
                      </TableHead>

                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Tracción
                      </TableHead>

                      {/* Columna Estado — ordenable */}
                      <TableHead>
                        <button
                          type="button"
                          onClick={() => alternarOrden('status')}
                          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Estado
                          <SortIndicator fieldKey="status" ordenamiento={ordenamiento} />
                        </button>
                      </TableHead>

                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Peso
                      </TableHead>

                      <TableHead className="text-right pr-4 sm:pr-6 text-xs font-medium text-muted-foreground">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {tractoresFiltrados.length > 0 ? (
                      tractoresFiltrados.map((tractor) => (
                        <TableRow
                          key={tractor.tractor_id}
                          className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                        >
                          {/* Nombre */}
                          <TableCell className="pl-4 sm:pl-6 font-medium text-sm whitespace-nowrap">
                            {tractor.name}
                          </TableCell>

                          {/* Marca y modelo */}
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{tractor.brand}</span>
                              <span className="text-xs text-muted-foreground">{tractor.model}</span>
                            </div>
                          </TableCell>

                          {/* Potencia */}
                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-sm whitespace-nowrap">
                              <Gauge className="size-3.5 text-muted-foreground" aria-hidden="true" />
                              {tractor.engine_power_hp} HP
                            </span>
                          </TableCell>

                          {/* Tipo de tracción */}
                          <TableCell className="text-sm">
                            {TRACCION_LABELS[tractor.traction_type] || tractor.traction_type || '—'}
                          </TableCell>

                          {/* Estado */}
                          <TableCell>
                            <StatusBadge status={tractor.status} />
                          </TableCell>

                          {/* Peso */}
                          <TableCell className="text-sm text-muted-foreground">
                            {tractor.weight_kg ? `${tractor.weight_kg} kg` : '—'}
                          </TableCell>

                          {/* Acciones */}
                          <TableCell className="pr-4 sm:pr-6">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirModal(tractor)}
                                aria-label={`Editar ${tractor.name}`}
                                className="size-8 text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirConfirmacionEliminacion(tractor)}
                                aria-label={`Eliminar ${tractor.name}`}
                                className="size-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      /* Estado vacío */
                      <TableRow>
                        <TableCell colSpan={7} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-sm text-muted-foreground">
                              {hayFiltrosActivos
                                ? 'Sin resultados para los filtros aplicados.'
                                : 'No hay tractores registrados.'}
                            </p>
                            {hayFiltrosActivos ? (
                              <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                                Limpiar filtros
                              </Button>
                            ) : (
                              <Button size="sm" onClick={() => abrirModal()}>
                                <Plus className="mr-1.5 size-3.5" aria-hidden="true" />
                                Añadir Tractor
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Metadatos de la tabla */}
              <div className="px-4 sm:px-6 py-3 flex flex-col items-start justify-between gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center border-t border-border/60">
                <span>
                  {tractoresFiltrados.length} de {totalItems} tractores
                  {hayFiltrosActivos && ' (filtrados)'}
                </span>
                <span>
                  Orden: {ordenamiento.sort} · {ordenamiento.order === 'asc' ? '↑' : '↓'}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Paginación ── */}
      <Pagination
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
      />

      {/* ── Modal: formulario de crear/editar tractor ── */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {modoEdicion ? 'Editar Tractor' : 'Registrar Tractor'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Completa los campos obligatorios (<span className="text-destructive">*</span>) para guardar el tractor.
            </DialogDescription>
          </DialogHeader>

          {/*
           * Formulario en 1 columna (móvil) → 2 columnas (md+).
           * Columna izquierda: datos básicos. Columna derecha: tracción, estado y llantas.
           */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-h-[60vh] overflow-y-auto pr-1">

            {/* ── Columna izquierda: datos básicos ── */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Nombre <span className="text-destructive">*</span>
                </label>
                <Input name="name" value={tractorActual.name} onChange={manejarCambio} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Marca <span className="text-destructive">*</span>
                </label>
                <Input name="brand" value={tractorActual.brand} onChange={manejarCambio} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Modelo <span className="text-destructive">*</span>
                </label>
                <Input name="model" value={tractorActual.model} onChange={manejarCambio} />
              </div>

              <InputConUnidad
                label="Potencia del motor"
                unit="HP"
                required
                type="number"
                min="0"
                name="engine_power_hp"
                value={tractorActual.engine_power_hp}
                onChange={manejarCambio}
              />

              <InputConUnidad
                label="Peso"
                unit="kg"
                type="number"
                min="0"
                name="weight_kg"
                value={tractorActual.weight_kg}
                onChange={manejarCambio}
              />

              <InputConUnidad
                label="Fuerza de tracción"
                unit="kN"
                type="number"
                min="0"
                name="traction_force_kn"
                value={tractorActual.traction_force_kn}
                onChange={manejarCambio}
              />
            </div>

            {/* ── Columna derecha: tracción, estado y llantas ── */}
            <div className="flex flex-col gap-3">
              {/* Tipo de tracción */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Tipo de tracción <span className="text-destructive">*</span>
                </label>
                <Select
                  value={tractorActual.traction_type}
                  onValueChange={(value) =>
                    setTractorActual((prev) => ({ ...prev, traction_type: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tracción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="4x2">4x2 — Tracción simple</SelectItem>
                      <SelectItem value="4x4">4x4 — Doble tracción</SelectItem>
                      <SelectItem value="track">Orugas</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Estado */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={tractorActual.status}
                  onValueChange={(value) =>
                    setTractorActual((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="maintenance">En mantenimiento</SelectItem>
                      <SelectItem value="out_of_service">Fuera de servicio</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de llanta */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Tipo de llanta</label>
                <Input name="tire_type" value={tractorActual.tire_type} onChange={manejarCambio} placeholder="Ej: Radial 16.9R30" />
              </div>

              <InputConUnidad
                label="Ancho de llanta"
                unit="mm"
                type="number"
                min="0"
                name="tire_width_mm"
                value={tractorActual.tire_width_mm}
                onChange={manejarCambio}
              />

              <InputConUnidad
                label="Diámetro de llanta"
                unit="mm"
                type="number"
                min="0"
                name="tire_diameter_mm"
                value={tractorActual.tire_diameter_mm}
                onChange={manejarCambio}
              />

              <InputConUnidad
                label="Presión de llanta"
                unit="psi"
                type="number"
                min="0"
                name="tire_pressure_psi"
                value={tractorActual.tire_pressure_psi}
                onChange={manejarCambio}
              />
            </div>
          </div>

          {/* Pie del modal */}
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={cerrarModal} disabled={guardando} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button onClick={guardarTractor} disabled={guardando} className="w-full sm:w-auto">
              {guardando
                ? 'Guardando...'
                : modoEdicion
                  ? 'Actualizar Tractor'
                  : 'Guardar Tractor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── AlertDialog: confirmación de eliminación ── */}
      <AlertDialog open={modalConfirmacionAbierto} onOpenChange={setModalConfirmacionAbierto}>
        <AlertDialogContent className="mx-4 sm:mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              {tractorAEliminar
                ? `¿Está seguro de eliminar "${tractorAEliminar.name}"? Esta acción no se puede deshacer.`
                : 'Esta acción no se puede deshacer.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel onClick={cerrarConfirmacionEliminacion} disabled={eliminando}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminacionTractor} disabled={eliminando}>
              {eliminando ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Sub-componente: badge de estado semántico
// ---------------------------------------------------------------------------

/**
 * StatusBadge — Badge de estado con color semántico según el valor del backend.
 *
 * @component
 * @param {Object} props
 * @param {string} props.status - Valor de status del backend.
 */
const StatusBadge = ({ status }) => {
  const config = {
    available: {
      label: 'Disponible',
      className: 'border-transparent bg-emerald-50 text-emerald-700',
    },
    maintenance: {
      label: 'Mantenimiento',
      className: 'border-transparent bg-amber-50 text-amber-700',
    },
    out_of_service: {
      label: 'Fuera de servicio',
      className: 'border-transparent bg-red-50 text-red-700',
    },
    inactive: {
      label: 'Inactivo',
      className: 'border-transparent bg-muted text-muted-foreground',
    },
  };

  const { label, className } = config[status] ?? {
    label: status,
    className: 'border-transparent bg-muted text-muted-foreground',
  };

  return (
    <Badge variant="outline" className={`text-xs font-normal ${className}`}>
      {label}
    </Badge>
  );
};

export default TractorCRUD;
