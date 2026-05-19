/**
 * @fileoverview Panel de administración CRUD para implementos mecánicos (ImplementForm).
 *
 * Página protegida accesible solo para usuarios autenticados con rol administrador.
 * Implementa operaciones completas de Crear, Leer, Actualizar y Eliminar implementos
 * contra la API remota (o datos mock cuando la API no está disponible).
 *
 * Características principales:
 *  - Tabla paginada con ordenamiento server-side por nombre, potencia y estado
 *  - Búsqueda en tiempo real con debounce implícito vía `useMemo`
 *  - Filtros rápidos por tipo de implemento y estado (badges de un solo clic)
 *  - Modal de formulario para crear/editar con validación client-side
 *  - AlertDialog de confirmación antes de eliminar
 *  - Indicadores de carga y mensajes de error descriptivos
 *
 * Responsive:
 *  - Tabla con scroll horizontal en móvil (`overflow-x-auto`)
 *  - Formulario del modal en 1 columna (móvil) → 2 columnas (md+)
 *  - Barra de herramientas apilada en móvil, en fila en lg+
 *
 * @module pages/ImplementForm
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Pagination from '@/components/common/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
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
  createImplement,
  deleteImplement,
  getImplements,
  isRemoteImplementApiEnabled,
  updateImplement,
} from '@/services/implementApi';
import { 
  notifyError, 
  notifySuccess 
} from '@/services/notificationService';
import { uploadImage, deleteImage } from '@/services/uploadApi';
import { UploadCloud, X as XIcon, Loader2 } from 'lucide-react';

// ---------------------------------------------------------------------------
// Constantes y estado inicial
// ---------------------------------------------------------------------------

/**
 * Estado inicial vacío para el formulario de implemento.
 * Se usa tanto al crear un nuevo implemento como al resetear el formulario.
 *
 * @type {Object}
 */
const ESTADO_INICIAL_IMPLEMENTO = {
  implementName: '',
  brand: '',
  powerRequirementHp: '',
  workingWidthM: '',
  soilType: 'All',
  workingDepthCm: '',
  weightKg: '',
  implementType: '',
  status: 'available',
  imageUrl: '',
};

/**
 * Mapeo de claves de columna de la UI a campos del backend para ordenamiento.
 *
 * @type {Record<string, string>}
 */
const ORDER_BY_FIELD = {
  implementName: 'implement_name',
  powerRequirementHp: 'power_requirement_hp',
  status: 'status',
};

/**
 * Opciones de filtro rápido para tipo de implemento.
 */
const FILTROS_TIPO = [
  { label: 'Arado', value: 'Plow' },
  { label: 'Sembradora', value: 'Seeder' },
  { label: 'Rastra', value: 'Harrow' },
];

/**
 * Opciones de filtro rápido para estado del implemento.
 */
const FILTROS_ESTADO = [
  { label: 'Disponible', value: 'available' },
  { label: 'Mantenimiento', value: 'maintenance' },
  { label: 'Fuera de servicio', value: 'out_of_service' },
];

/**
 * Mapeo de valores de tipo del backend a etiquetas legibles.
 */
const TIPO_LABELS = {
  'Plow': 'Arado',
  'Seeder': 'Sembradora',
  'Harrow': 'Rastra',
};

// ---------------------------------------------------------------------------
// Sub-componente: indicador de ordenamiento
// ---------------------------------------------------------------------------

const SortIndicator = React.memo(({ fieldKey, ordenamiento }) => {
  const backendField = ORDER_BY_FIELD[fieldKey] || 'implement_name';

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

const InputConUnidad = ({ label, unit, required, error, ...rest }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-foreground">
      {label}{required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
    <div className="relative">
      <Input {...rest} className={`pr-12 ${error ? 'border-destructive' : ''}`} />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground select-none">
        {unit}
      </span>
    </div>
    {error && <span className="text-xs text-destructive">{error}</span>}
  </div>
);

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * ImplementCRUD — Panel de administración de implementos.
 *
 * @component
 * @returns {JSX.Element}
 */
const ImplementCRUD = () => {
  // ── Configuración de API ──────────────────────────────────────────────────
  const remoteApiEnabled = isRemoteImplementApiEnabled();

  // ── Estado: datos de la tabla ─────────────────────────────────────────────
  const [implementos, setImplementos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');

  // ── Estado: paginación ────────────────────────────────────────────────────
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPorPagina = 10;

  // ── Estado: búsqueda y filtros ────────────────────────────────────────────
  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounced = useDebounce(busqueda, 300);
  const [ordenamiento, setOrdenamiento] = useState({ sort: 'implement_name', order: 'asc' });

  const [filtroRapido, setFiltroRapido] = useState({ tipo: '', estado: '' });

  // ── Estado: modales ───────────────────────────────────────────────────────
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [implementoAEliminar, setImplementoAEliminar] = useState(null);

  // ── Estado: formulario ────────────────────────────────────────────────────
  const [implementoActual, setImplementoActual] = useState(ESTADO_INICIAL_IMPLEMENTO);
  const [erroresFila, setErroresFila] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  
  // ── Estado: Imagen ──
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [eliminandoImagen, setEliminandoImagen] = useState(false);

  // ── Consulta memoizada ────────────────────────────────────────────────────

  const consulta = useMemo(() => ({
    page: paginaActual,
    limit: itemsPorPagina,
    sort: ordenamiento.sort,
    order: ordenamiento.order,
    search: busquedaDebounced.trim(),
    type: '',
    minPower: '',
    maxPower: '',
  }), [paginaActual, ordenamiento, busquedaDebounced]);

  // ── Carga de datos ────────────────────────────────────────────────────────

  const cargarTabla = useCallback(async () => {
    setCargando(true);
    setErrorCarga('');

    try {
      const response = await getImplements(consulta);
      const datos = Array.isArray(response?.data) ? response.data : [];
      const paginacion = response?.pagination ?? {};

      setImplementos(datos);
      setTotalPaginas(Number(paginacion.totalPages ?? 1));
      setTotalItems(Number(paginacion.total ?? datos.length));
    } catch (error) {
      setErrorCarga(error.message || 'No se pudieron cargar los implementos.');
      setImplementos([]);
      setTotalPaginas(1);
      setTotalItems(0);
    } finally {
      setCargando(false);
    }
  }, [consulta]);

  useEffect(() => {
    cargarTabla();
  }, [cargarTabla]);

  // ── Filtrado client-side de filtros rápidos ───────────────────────────────

  const implementosFiltrados = useMemo(() => {
    return implementos.filter((i) => {
      const matchTipo = !filtroRapido.tipo || i.implementType === filtroRapido.tipo;
      const matchEstado = !filtroRapido.estado || i.status === filtroRapido.estado;
      return matchTipo && matchEstado;
    });
  }, [implementos, filtroRapido]);

  // ── Manejadores del modal de formulario ───────────────────────────────────

  const abrirModal = (implemento = null) => {
    if (implemento) {
      setImplementoActual({
        implementId: implemento.implementId,
        implementName: implemento.implementName ?? '',
        brand: implemento.brand ?? '',
        powerRequirementHp: implemento.powerRequirementHp ?? '',
        workingWidthM: implemento.workingWidthM ?? '',
        soilType: implemento.soilType ?? 'All',
        workingDepthCm: implemento.workingDepthCm ?? '',
        weightKg: implemento.weightKg ?? '',
        implementType: implemento.implementType ?? '',
        status: implemento.status ?? 'available',
        imageUrl: implemento.imageUrl ?? '',
      });
      setModoEdicion(true);
    } else {
      setImplementoActual(ESTADO_INICIAL_IMPLEMENTO);
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
    setImplementoActual((prev) => ({ ...prev, [name]: value }));

    if (erroresFila[name]) {
      setErroresFila((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const obtenerPayload = () => {
    const payload = {
      implementName: implementoActual.implementName?.trim(),
      brand: implementoActual.brand?.trim(),
      powerRequirementHp: Number(implementoActual.powerRequirementHp),
      implementType: implementoActual.implementType?.trim(),
      soilType: implementoActual.soilType,
      status: implementoActual.status,
      ...(implementoActual.imageUrl ? { imageUrl: implementoActual.imageUrl } : {}),
    };

    const camposNumericos = [
      'workingWidthM', 'workingDepthCm', 'weightKg',
    ];

    camposNumericos.forEach((field) => {
      const value = implementoActual[field];
      if (value !== '' && value !== null && value !== undefined) {
        payload[field] = Number(value);
      }
    });

    return payload;
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!implementoActual.implementName?.trim()) nuevosErrores.implementName = 'Requerido';
    if (!implementoActual.brand?.trim()) nuevosErrores.brand = 'Requerido';
    if (!implementoActual.implementType?.trim()) nuevosErrores.implementType = 'Requerido';
    if (implementoActual.powerRequirementHp === '' || Number(implementoActual.powerRequirementHp) <= 0) {
      nuevosErrores.powerRequirementHp = 'Debe ser mayor a 0';
    }
    
    setErroresFila(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardarImplemento = async () => {
    if (!validarFormulario()) {
      notifyError('Campos incompletos', 'Por favor revisa los errores en el formulario.');
      return;
    }

    setGuardando(true);

    try {
      const payload = obtenerPayload();

      if (modoEdicion) {
        await updateImplement(implementoActual.implementId, payload);
        notifySuccess('Implemento Actualizado', `El implemento ${payload.implementName} se actualizó correctamente.`);
      } else {
        await createImplement(payload);
        notifySuccess('Implemento Creado', `El implemento ${payload.implementName} fue registrado con exito.`);
      }

      cerrarModal();
      await cargarTabla();
    } catch (error) {
      const message = error.message?.includes('401') || error.message?.includes('403')
        ? 'No autorizado. Necesitas un token válido y rol administrador para guardar cambios.'
        : error.message || 'No se pudo guardar el implemento.';
      notifyError('No se pudo guardar', message);
      setGuardando(false);
    }
  };

  // ── Manejadores del modal de confirmación de eliminación ──────────────────

  const abrirConfirmacionEliminacion = (implemento) => {
    setImplementoAEliminar(implemento);
    setModalConfirmacionAbierto(true);
  };

  const cerrarConfirmacionEliminacion = () => {
    setModalConfirmacionAbierto(false);
    setImplementoAEliminar(null);
    setEliminando(false);
  };

  const confirmarEliminacionImplemento = async () => {
    if (!implementoAEliminar?.implementId) return;

    setEliminando(true);

    try {
      await deleteImplement(implementoAEliminar.implementId);
      notifySuccess('Implemento Eliminado', `El implemento fue eliminado.`);
      cerrarConfirmacionEliminacion();
      await cargarTabla();
    } catch (error) {
      const message = error.message?.includes('401') || error.message?.includes('403')
        ? 'No autorizado. Necesitas un token válido y rol administrador para eliminar.'
        : error.message || 'No se pudo eliminar el implemento.';
      notifyError('No se pudo eliminar', message);
      setEliminando(false);
    }
  };

  // ── Manejador de ordenamiento ─────────────────────────────────────────────

  const alternarOrden = (fieldKey) => {
    const backendField = ORDER_BY_FIELD[fieldKey] || 'implement_name';

    setOrdenamiento((prev) => ({
      sort: backendField,
      order: prev.sort === backendField && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  // ── Manejadores de Imagen ─────────────────────────────────────────────────

  const handleSubirImagen = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoImagen(true);
    try {
      const res = await uploadImage(file, 'implements');
      if (res.success && res.data?.url) {
        setImplementoActual((prev) => ({ ...prev, imageUrl: res.data.url }));
        notifySuccess('Imagen subida', 'La imagen se cargó correctamente al almacenamiento.');
      }
    } catch (err) {
      notifyError('Error al subir', err.message || 'No se pudo cargar la imagen.');
    } finally {
      setSubiendoImagen(false);
      e.target.value = null; // Reset input
    }
  };

  const handleEliminarImagen = async () => {
    if (!implementoActual.imageUrl) return;

    setEliminandoImagen(true);
    try {
      await deleteImage(implementoActual.imageUrl);
      setImplementoActual((prev) => ({ ...prev, imageUrl: '' }));
      notifySuccess('Imagen eliminada', 'La imagen fue borrada del almacenamiento.');
    } catch (err) {
      notifyError('Error al eliminar', err.message || 'No se pudo borrar la imagen.');
    } finally {
      setEliminandoImagen(false);
    }
  };

  // ── Manejadores de filtros rápidos ────────────────────────────────────────

  const alternarFiltroRapido = (tipo, valor) => {
    setFiltroRapido((prev) => ({
      ...prev,
      [tipo]: prev[tipo] === valor ? '' : valor,
    }));
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroRapido({ tipo: '', estado: '' });
    setPaginaActual(1);
  };

  // ── Derivados ─────────────────────────────────────────────────────────────

  const hayFiltrosActivos = Boolean(
    busqueda.trim() || filtroRapido.tipo || filtroRapido.estado
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* ── Encabezado de la página ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Gestión de Implementos
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
                  placeholder="Buscar implemento por nombre o marca..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1);
                  }}
                  aria-label="Buscar implementos por nombre o marca"
                />
              </div>

              {/* Filtros rápidos */}
              <div className="flex flex-wrap gap-2">
                {/* Grupo: Tipo */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground select-none">Tipo:</span>
                  {FILTROS_TIPO.map((f) => (
                    <FilterBadge
                      key={f.value}
                      label={f.label}
                      active={filtroRapido.tipo === f.value}
                      onClick={() => alternarFiltroRapido('tipo', f.value)}
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
                Añadir Implemento
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-0">
          {cargando ? (
            /* Estado de carga */
            <div className="py-12 text-center text-sm text-muted-foreground">
              Cargando implementos...
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
                          onClick={() => alternarOrden('implementName')}
                          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Nombre
                          <SortIndicator fieldKey="implementName" ordenamiento={ordenamiento} />
                        </button>
                      </TableHead>

                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Marca / Tipo
                      </TableHead>

                      {/* Columna Potencia — ordenable */}
                      <TableHead>
                        <button
                          type="button"
                          onClick={() => alternarOrden('powerRequirementHp')}
                          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          req. Potencia (HP)
                          <SortIndicator fieldKey="powerRequirementHp" ordenamiento={ordenamiento} />
                        </button>
                      </TableHead>

                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Ancho de Trabajo
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

                      <TableHead className="text-right pr-4 sm:pr-6 text-xs font-medium text-muted-foreground">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {implementosFiltrados.length > 0 ? (
                      implementosFiltrados.map((implemento) => (
                        <TableRow
                          key={implemento.implementId}
                          className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                        >
                          {/* Nombre */}
                          <TableCell className="pl-4 sm:pl-6 font-medium text-sm whitespace-nowrap">
                            {implemento.implementName}
                          </TableCell>

                          {/* Marca y tipo */}
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{implemento.brand}</span>
                              <span className="text-xs text-muted-foreground">{TIPO_LABELS[implemento.implementType] || implemento.implementType}</span>
                            </div>
                          </TableCell>

                          {/* Potencia */}
                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-sm whitespace-nowrap">
                              <Gauge className="size-3.5 text-muted-foreground" aria-hidden="true" />
                              {implemento.powerRequirementHp} HP
                            </span>
                          </TableCell>

                          {/* Ancho de Trabajo */}
                          <TableCell className="text-sm">
                            {implemento.workingWidthM ? `${implemento.workingWidthM} m` : '—'}
                          </TableCell>

                          {/* Estado */}
                          <TableCell>
                            <StatusBadge status={implemento.status} />
                          </TableCell>

                          {/* Acciones */}
                          <TableCell className="pr-4 sm:pr-6">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirModal(implemento)}
                                aria-label={`Editar ${implemento.implementName}`}
                                className="size-8 text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirConfirmacionEliminacion(implemento)}
                                aria-label={`Eliminar ${implemento.implementName}`}
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
                        <TableCell colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-sm text-muted-foreground">
                              {hayFiltrosActivos
                                ? 'Sin resultados para los filtros aplicados.'
                                : 'No hay implementos registrados.'}
                            </p>
                            {hayFiltrosActivos ? (
                              <Button variant="outline" size="sm" onClick={limpiarFiltros}>
                                Limpiar filtros
                              </Button>
                            ) : (
                              <Button size="sm" onClick={() => abrirModal()}>
                                <Plus className="mr-1.5 size-3.5" aria-hidden="true" />
                                Añadir Implemento
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
                  {implementosFiltrados.length} de {totalItems} implementos
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

      {/* ── Modal: formulario de crear/editar implemento ── */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {modoEdicion ? 'Editar Implemento' : 'Registrar Implemento'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Completa los campos obligatorios (<span className="text-destructive">*</span>) para guardar el implemento.
            </DialogDescription>
          </DialogHeader>

          {/* Formulario en 1 columna (móvil) → 2 columnas (md+). */}
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">

            {/* ── Subida de Imagen ── */}
            <div className="border border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center bg-muted/20 relative">
              {implementoActual.imageUrl ? (
                <div className="relative group w-full max-w-[200px] rounded-md overflow-hidden border border-border">
                  <img src={implementoActual.imageUrl} alt="Implement preview" className="w-full h-auto object-cover aspect-video" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="destructive" size="sm" onClick={handleEliminarImagen} disabled={eliminandoImagen}>
                      {eliminandoImagen ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4 mr-1" />}
                      Eliminar
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="size-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">Subir imagen del implemento</p>
                  <p className="text-xs text-muted-foreground mb-4 text-center">Formatos soportados: JPG, PNG, WEBP (Max 5MB)</p>
                  <div className="relative">
                    <Button type="button" variant="secondary" size="sm" disabled={subiendoImagen}>
                      {subiendoImagen ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
                      {subiendoImagen ? 'Subiendo...' : 'Seleccionar archivo'}
                    </Button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      onChange={handleSubirImagen}
                      disabled={subiendoImagen}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* ── Columna izquierda: datos básicos ── */}
              <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Nombre del implemento <span className="text-destructive">*</span>
                </label>
                <Input name="implementName" value={implementoActual.implementName} onChange={manejarCambio} className={erroresFila.implementName ? 'border-destructive' : ''} />
                {erroresFila.implementName && <span className="text-xs text-destructive">{erroresFila.implementName}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Marca <span className="text-destructive">*</span>
                </label>
                <Input name="brand" value={implementoActual.brand} onChange={manejarCambio} className={erroresFila.brand ? 'border-destructive' : ''} />
                {erroresFila.brand && <span className="text-xs text-destructive">{erroresFila.brand}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Tipo de implemento <span className="text-destructive">*</span>
                </label>
                <Input name="implementType" value={implementoActual.implementType} onChange={manejarCambio} placeholder="Ej: Sembradora, Arado..." className={erroresFila.implementType ? 'border-destructive' : ''} />
                {erroresFila.implementType && <span className="text-xs text-destructive">{erroresFila.implementType}</span>}
              </div>

              <InputConUnidad
                label="Requerimiento de Potencia"
                unit="HP"
                required
                type="number"
                min="1"
                name="powerRequirementHp"
                value={implementoActual.powerRequirementHp}
                onChange={manejarCambio}
                error={erroresFila.powerRequirementHp}
              />
              
              <InputConUnidad
                label="Ancho de Trabajo"
                unit="m"
                type="number"
                min="0"
                step="0.01"
                name="workingWidthM"
                value={implementoActual.workingWidthM}
                onChange={manejarCambio}
              />
            </div>

            {/* ── Columna derecha: Detalles operativos ── */}
            <div className="flex flex-col gap-3">

              <InputConUnidad
                label="Profundidad de Trabajo"
                unit="cm"
                type="number"
                min="0"
                name="workingDepthCm"
                value={implementoActual.workingDepthCm}
                onChange={manejarCambio}
              />

              <InputConUnidad
                label="Peso"
                unit="kg"
                type="number"
                min="0"
                name="weightKg"
                value={implementoActual.weightKg}
                onChange={manejarCambio}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">
                  Tipo de Suelo <span className="text-destructive">*</span>
                </label>
                <Select
                  value={implementoActual.soilType || 'All'}
                  onValueChange={(val) => setImplementoActual({ ...implementoActual, soilType: val })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un tipo de suelo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="All">Cualquiera (All)</SelectItem>
                      <SelectItem value="Clay">Arcilloso (Clay)</SelectItem>
                      <SelectItem value="Loam">Franco (Loam)</SelectItem>
                      <SelectItem value="Sandy">Arenoso (Sandy)</SelectItem>
                      <SelectItem value="Silt">Limoso (Silt)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Estado</label>
                <Select
                  value={implementoActual.status || 'available'}
                  onValueChange={(val) => setImplementoActual({ ...implementoActual, status: val })}
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
            </div>
            </div>
          </div>

          {/* Pie del modal */}
          <DialogFooter className="flex-col gap-2 sm:flex-row mt-4">
            <Button variant="outline" onClick={cerrarModal} disabled={guardando} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button onClick={guardarImplemento} disabled={guardando} className="w-full sm:w-auto">
              {guardando
                ? 'Guardando...'
                : modoEdicion
                  ? 'Actualizar Implemento'
                  : 'Guardar Implemento'}
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
              {implementoAEliminar
                ? `¿Está seguro de eliminar el implemento "${implementoAEliminar.implementName}"? Esta acción no se puede deshacer.`
                : 'Esta acción no se puede deshacer.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel onClick={cerrarConfirmacionEliminacion} disabled={eliminando}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminacionImplemento} disabled={eliminando} className="bg-destructive hover:bg-destructive/90">
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

export default ImplementCRUD;
