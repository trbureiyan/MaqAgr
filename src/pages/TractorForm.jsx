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
 *  - Filtros avanzados por marca y rango de potencia
 *  - Modal de formulario para crear/editar con validación client-side
 *  - AlertDialog de confirmación antes de eliminar
 *  - Indicadores de carga y mensajes de error descriptivos
 *
 * Responsive:
 *  - Tabla con scroll horizontal en móvil (`overflow-x-auto`)
 *  - Formulario del modal en 1 columna (móvil) → 2 columnas (md+)
 *  - Barra de búsqueda y filtros apilados en móvil, en fila en lg+
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
  CardDescription,
  CardHeader,
  CardTitle,
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
  Filter,
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
 * Permite desacoplar los nombres de columna del esquema de la API.
 *
 * @type {Record<string, string>}
 */
const ORDER_BY_FIELD = {
  name: 'name',
  engine_power_hp: 'engine_power_hp',
  status: 'status',
};

// ---------------------------------------------------------------------------
// Sub-componente: indicador de ordenamiento
// ---------------------------------------------------------------------------

/**
 * SortIndicator — Ícono que indica la dirección del ordenamiento activo.
 *
 * Muestra `ArrowDownAZ` cuando el campo no está activo o el orden es ascendente,
 * y `ArrowUpAZ` cuando el campo está activo y el orden es descendente.
 * Extraído como componente puro (`React.memo`) para evitar re-renders innecesarios.
 *
 * @component
 *
 * @param {Object} props
 * @param {string} props.fieldKey    - Clave de columna de la UI (ej. 'name').
 * @param {Object} props.ordenamiento - Estado actual de ordenamiento `{ sort, order }`.
 * @param {string} props.ordenamiento.sort  - Campo activo de ordenamiento.
 * @param {string} props.ordenamiento.order - Dirección: 'asc' | 'desc'.
 *
 * @returns {JSX.Element} Ícono de flecha indicando la dirección de orden.
 */
const SortIndicator = React.memo(({ fieldKey, ordenamiento }) => {
  const backendField = ORDER_BY_FIELD[fieldKey] || 'name';

  // Si el campo no está activo, mostrar flecha descendente como indicador neutro
  if (ordenamiento.sort !== backendField) {
    return <ArrowDownAZ className="ml-2 size-4 opacity-40" aria-hidden="true" />;
  }

  // Campo activo: mostrar dirección real del ordenamiento
  return ordenamiento.order === 'asc'
    ? <ArrowDownAZ className="ml-2 size-4" aria-hidden="true" />
    : <ArrowUpAZ className="ml-2 size-4" aria-hidden="true" />;
});
SortIndicator.displayName = 'SortIndicator';

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

/**
 * TractorCRUD — Panel de administración de tractores.
 *
 * Gestiona el ciclo de vida completo de los datos de tractores:
 * carga inicial, búsqueda, filtrado, ordenamiento, paginación,
 * creación, edición y eliminación.
 *
 * El estado se organiza en grupos semánticos:
 *  1. Datos de la tabla (tractores, carga, error)
 *  2. Paginación (página actual, total de páginas, total de ítems)
 *  3. Búsqueda y filtros (búsqueda, ordenamiento, filtros, visibilidad)
 *  4. Estado de modales (modal de formulario, modal de confirmación)
 *  5. Estado del formulario (tractor actual, modo edición, guardando, eliminando)
 *
 * @component
 * @returns {JSX.Element} Panel CRUD completo con tabla, filtros y modales.
 *
 * @example
 * // Registrada en App.jsx como ruta protegida
 * <Route path="/admin/TractorForm" element={<TractorForm />} />
 */
const TractorCRUD = () => {
  // ── Configuración de API ──────────────────────────────────────────────────

  /** Indica si la API remota está habilitada o se usan datos mock. */
  const remoteApiEnabled = isRemoteTractorApiEnabled();

  // ── Estado: datos de la tabla ─────────────────────────────────────────────

  /** Lista de tractores cargados desde la API para la página actual. */
  const [tractores, setTractores] = useState([]);

  /** Indica si hay una carga de datos en progreso. */
  const [cargando, setCargando] = useState(false);

  /** Mensaje de error de carga, vacío si no hay error. */
  const [errorCarga, setErrorCarga] = useState('');

  // ── Estado: paginación ────────────────────────────────────────────────────

  /** Número de la página actualmente visible (base 1). */
  const [paginaActual, setPaginaActual] = useState(1);

  /** Total de páginas disponibles según la respuesta de la API. */
  const [totalPaginas, setTotalPaginas] = useState(1);

  /** Total de tractores en la base de datos (para mostrar conteo). */
  const [totalItems, setTotalItems] = useState(0);

  /** Cantidad de ítems por página enviada al backend. */
  const itemsPorPagina = 10;

  // ── Estado: búsqueda y filtros ────────────────────────────────────────────

  /** Texto de búsqueda libre por nombre o marca. */
  const [busqueda, setBusqueda] = useState('');

  /**
   * Estado de ordenamiento activo.
   * @type {{ sort: string, order: 'asc' | 'desc' }}
   */
  const [ordenamiento, setOrdenamiento] = useState({ sort: 'name', order: 'asc' });

  /**
   * Filtros avanzados por marca y rango de potencia.
   * @type {{ brand: string, minPower: string, maxPower: string }}
   */
  const [filtros, setFiltros] = useState({ brand: '', minPower: '', maxPower: '' });

  /** Controla la visibilidad del panel de filtros avanzados. */
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // ── Estado: modales ───────────────────────────────────────────────────────

  /** Controla la visibilidad del modal de formulario (crear/editar). */
  const [modalAbierto, setModalAbierto] = useState(false);

  /** Controla la visibilidad del AlertDialog de confirmación de eliminación. */
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);

  /** Tractor seleccionado para eliminar (null si no hay ninguno pendiente). */
  const [tractorAEliminar, setTractorAEliminar] = useState(null);

  // ── Estado: formulario ────────────────────────────────────────────────────

  /** Datos del formulario del tractor actualmente en edición o creación. */
  const [tractorActual, setTractorActual] = useState(ESTADO_INICIAL_TRACTOR);

  /** `true` cuando el modal está en modo edición, `false` para creación. */
  const [modoEdicion, setModoEdicion] = useState(false);

  /** Indica si hay una operación de guardado en progreso. */
  const [guardando, setGuardando] = useState(false);

  /** Indica si hay una operación de eliminación en progreso. */
  const [eliminando, setEliminando] = useState(false);

  // ── Consulta memoizada ────────────────────────────────────────────────────

  /**
   * Objeto de consulta para la API, memoizado para evitar re-renders
   * innecesarios. Se recalcula solo cuando cambian sus dependencias.
   *
   * @type {{ page: number, limit: number, sort: string, order: string,
   *          search: string, brand: string, minPower: string, maxPower: string }}
   */
  const consulta = useMemo(() => ({
    page: paginaActual,
    limit: itemsPorPagina,
    sort: ordenamiento.sort,
    order: ordenamiento.order,
    search: busqueda.trim(),
    brand: filtros.brand,
    minPower: filtros.minPower,
    maxPower: filtros.maxPower,
  }), [paginaActual, ordenamiento, busqueda, filtros]);

  // ── Carga de datos ────────────────────────────────────────────────────────

  /**
   * Carga la lista de tractores desde la API usando los parámetros de `consulta`.
   * Actualiza el estado de la tabla, paginación y errores.
   * Envuelto en `useCallback` para estabilizar la referencia entre renders.
   */
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

  // Cargar datos cuando cambia la consulta
  useEffect(() => {
    cargarTabla();
  }, [cargarTabla]);

  // Resetear a la primera página cuando cambian búsqueda o filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtros]);

  // ── Manejadores del modal de formulario ───────────────────────────────────

  /**
   * Abre el modal de formulario en modo creación o edición.
   * Si se pasa un tractor, pre-rellena el formulario con sus datos.
   *
   * @param {Object|null} [tractor=null] - Tractor a editar, o `null` para crear uno nuevo.
   */
  const abrirModal = (tractor = null) => {
    if (tractor) {
      // Modo edición: pre-rellenar con datos del tractor seleccionado
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
      // Modo creación: resetear formulario al estado inicial
      setTractorActual(ESTADO_INICIAL_TRACTOR);
      setModoEdicion(false);
    }

    setModalAbierto(true);
  };

  /**
   * Cierra el modal de formulario y resetea el estado de guardado.
   */
  const cerrarModal = () => {
    setModalAbierto(false);
    setGuardando(false);
  };

  // ── Manejadores del formulario ────────────────────────────────────────────

  /**
   * Actualiza un campo del formulario de tractor cuando el usuario escribe.
   * Usa la propiedad computada `[name]` para actualizar el campo correcto.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio del input.
   */
  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setTractorActual((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Construye el payload limpio para enviar a la API.
   * Convierte campos numéricos opcionales y omite los vacíos.
   *
   * @returns {Object} Payload listo para `createTractor` o `updateTractor`.
   */
  const obtenerPayload = () => {
    const payload = {
      name: tractorActual.name?.trim(),
      brand: tractorActual.brand?.trim(),
      model: tractorActual.model?.trim(),
      engine_power_hp: Number(tractorActual.engine_power_hp),
      traction_type: tractorActual.traction_type,
      status: tractorActual.status,
    };

    // Campos numéricos opcionales — solo se incluyen si tienen valor
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

    // Tipo de llanta — solo si tiene valor no vacío
    if (tractorActual.tire_type?.trim()) {
      payload.tire_type = tractorActual.tire_type.trim();
    }

    return payload;
  };

  /**
   * Valida los campos obligatorios del formulario.
   * Retorna un mensaje de error si hay algún campo inválido, o `null` si todo es válido.
   *
   * @returns {string|null} Mensaje de error, o `null` si el formulario es válido.
   */
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

  /**
   * Guarda el tractor (crea o actualiza) tras validar el formulario.
   * Muestra alertas nativas para errores de validación y de API.
   */
  const guardarTractor = async () => {
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      window.alert(errorValidacion);
      return;
    }

    setGuardando(true);

    try {
      const payload = obtenerPayload();

      if (modoEdicion) {
        await updateTractor(tractorActual.tractor_id, payload);
      } else {
        await createTractor(payload);
      }

      cerrarModal();
      await cargarTabla();
    } catch (error) {
      // Mensaje específico para errores de autorización
      const message = error.message?.includes('401') || error.message?.includes('403')
        ? 'No autorizado. Necesitas un token válido y rol administrador para guardar cambios.'
        : error.message || 'No se pudo guardar el tractor.';
      window.alert(message);
      setGuardando(false);
    }
  };

  // ── Manejadores del modal de confirmación de eliminación ──────────────────

  /**
   * Abre el AlertDialog de confirmación para eliminar un tractor.
   *
   * @param {Object} tractor - Tractor a eliminar (debe tener `tractor_id` y `name`).
   */
  const abrirConfirmacionEliminacion = (tractor) => {
    setTractorAEliminar(tractor);
    setModalConfirmacionAbierto(true);
  };

  /**
   * Cierra el AlertDialog de confirmación y limpia el estado de eliminación.
   */
  const cerrarConfirmacionEliminacion = () => {
    setModalConfirmacionAbierto(false);
    setTractorAEliminar(null);
    setEliminando(false);
  };

  /**
   * Ejecuta la eliminación del tractor tras la confirmación del usuario.
   * Recarga la tabla si la operación es exitosa.
   */
  const confirmarEliminacionTractor = async () => {
    if (!tractorAEliminar?.tractor_id) return;

    setEliminando(true);

    try {
      await deleteTractor(tractorAEliminar.tractor_id);
      cerrarConfirmacionEliminacion();
      await cargarTabla();
    } catch (error) {
      const message = error.message?.includes('401') || error.message?.includes('403')
        ? 'No autorizado. Necesitas un token válido y rol administrador para eliminar.'
        : error.message || 'No se pudo eliminar el tractor.';
      window.alert(message);
      setEliminando(false);
    }
  };

  // ── Manejador de ordenamiento ─────────────────────────────────────────────

  /**
   * Alterna el ordenamiento de una columna.
   * Si la columna ya está activa, invierte la dirección.
   * Si es una columna nueva, establece orden ascendente.
   *
   * @param {string} fieldKey - Clave de columna de la UI (ej. 'name', 'status').
   */
  const alternarOrden = (fieldKey) => {
    const backendField = ORDER_BY_FIELD[fieldKey] || 'name';

    setOrdenamiento((prev) => ({
      sort: backendField,
      order: prev.sort === backendField && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  // ── Derivados ─────────────────────────────────────────────────────────────

  /**
   * Indica si hay algún filtro activo (búsqueda o filtros avanzados).
   * Se usa para mostrar el botón "Limpiar filtros" en el estado vacío.
   */
  const hayFiltrosActivos = Boolean(
    busqueda.trim() || filtros.brand || filtros.minPower || filtros.maxPower
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* ── Encabezado de la página ── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Gestión de Tractores
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {remoteApiEnabled
              ? 'Modo API remota: paginación, filtros y ordenamiento server-side.'
              : 'Modo local/mock: listo para frontend en Vercel mientras el VPS está en progreso.'}
          </p>
        </div>

        {/* Botón de acción principal — añadir nuevo tractor */}
        <Button onClick={() => abrirModal()} className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Añadir Tractor
        </Button>
      </div>

      {/* ── Card: búsqueda y filtros ── */}
      <Card className="mb-6 border-red-100 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Búsqueda y filtros</CardTitle>
          <CardDescription>Filtra por marca y rango de potencia.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">

          {/* Fila de búsqueda + botón de filtros */}
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Input de búsqueda con ícono */}
            <div className="relative flex-1">
              <Search
                className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                className="pl-8"
                placeholder="Buscar por nombre o marca"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar tractores"
              />
            </div>

            {/* Botón para mostrar/ocultar filtros avanzados */}
            <Button
              variant="outline"
              onClick={() => setMostrarFiltros((prev) => !prev)}
              className="w-full lg:w-auto"
              aria-expanded={mostrarFiltros}
            >
              <Filter className="mr-2 size-4" aria-hidden="true" />
              {mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'}
            </Button>
          </div>

          {/* Panel de filtros avanzados — visible solo cuando mostrarFiltros es true */}
          {mostrarFiltros && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {/* Filtro por marca */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Marca</label>
                <Input
                  placeholder="Ej: John Deere"
                  value={filtros.brand}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, brand: e.target.value }))}
                />
              </div>

              {/* Filtro por potencia mínima */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Potencia mínima (HP)</label>
                <Input
                  type="number"
                  min="0"
                  value={filtros.minPower}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, minPower: e.target.value }))}
                />
              </div>

              {/* Filtro por potencia máxima */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Potencia máxima (HP)</label>
                <Input
                  type="number"
                  min="0"
                  value={filtros.maxPower}
                  onChange={(e) => setFiltros((prev) => ({ ...prev, maxPower: e.target.value }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Card: tabla CRUD ── */}
      <Card className="border-red-100 bg-white shadow-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-[#991b1b] text-base sm:text-lg">Dashboard CRUD</CardTitle>
          <CardDescription>
            Administra tractores con una tabla limpia y alineada a la paleta semántica.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {cargando ? (
            /* Estado de carga */
            <div className="py-10 text-center text-sm text-muted-foreground">
              Cargando tractores desde backend...
            </div>
          ) : errorCarga ? (
            /* Estado de error */
            <div className="py-10 text-center text-sm text-destructive">{errorCarga}</div>
          ) : (
            <>
              {/* Tabla con scroll horizontal en móvil */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <Table className="rounded-lg min-w-[640px]">
                  <TableHeader className="bg-red-50/70">
                    <TableRow>
                      {/* Columna Nombre — ordenable */}
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => alternarOrden('name')}>
                          Nombre
                          <SortIndicator fieldKey="name" ordenamiento={ordenamiento} />
                        </Button>
                      </TableHead>

                      <TableHead>Marca / Modelo</TableHead>

                      {/* Columna Potencia — ordenable */}
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => alternarOrden('engine_power_hp')}>
                          Potencia
                          <SortIndicator fieldKey="engine_power_hp" ordenamiento={ordenamiento} />
                        </Button>
                      </TableHead>

                      <TableHead>Tracción</TableHead>

                      {/* Columna Estado — ordenable */}
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => alternarOrden('status')}>
                          Estado
                          <SortIndicator fieldKey="status" ordenamiento={ordenamiento} />
                        </Button>
                      </TableHead>

                      <TableHead>Peso</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {tractores.length > 0 ? (
                      /* Filas de datos */
                      tractores.map((tractor) => (
                        <TableRow key={tractor.tractor_id}>
                          {/* Nombre del tractor */}
                          <TableCell className="font-medium whitespace-nowrap">
                            {tractor.name}
                          </TableCell>

                          {/* Marca y modelo apilados */}
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{tractor.brand}</span>
                              <span className="text-xs text-muted-foreground">{tractor.model}</span>
                            </div>
                          </TableCell>

                          {/* Potencia con ícono de gauge */}
                          <TableCell>
                            <span className="inline-flex items-center gap-1 whitespace-nowrap">
                              <Gauge className="size-4" aria-hidden="true" />
                              {tractor.engine_power_hp} HP
                            </span>
                          </TableCell>

                          {/* Tipo de tracción */}
                          <TableCell>{tractor.traction_type || '-'}</TableCell>

                          {/* Badge de estado con color semántico */}
                          <TableCell>
                            <Badge
                              variant={tractor.status === 'available' ? 'secondary' : 'outline'}
                              className={
                                tractor.status === 'available'
                                  ? 'bg-red-100 text-red-900 hover:bg-red-100'
                                  : 'border-red-200 text-red-900'
                              }
                            >
                              {tractor.status}
                            </Badge>
                          </TableCell>

                          {/* Peso en kg */}
                          <TableCell>
                            {tractor.weight_kg ? `${tractor.weight_kg} kg` : '-'}
                          </TableCell>

                          {/* Botones de acción: editar y eliminar */}
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => abrirModal(tractor)}
                                aria-label={`Editar ${tractor.name}`}
                              >
                                <Pencil className="size-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon-sm"
                                onClick={() => abrirConfirmacionEliminacion(tractor)}
                                aria-label={`Eliminar ${tractor.name}`}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      /* Estado vacío — sin resultados */
                      <TableRow>
                        <TableCell colSpan={7} className="py-10 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <p className="text-muted-foreground">
                              {hayFiltrosActivos
                                ? 'No hay resultados para los filtros aplicados.'
                                : 'No hay tractores registrados.'}
                            </p>
                            {hayFiltrosActivos ? (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setBusqueda('');
                                  setFiltros({ brand: '', minPower: '', maxPower: '' });
                                }}
                              >
                                Limpiar filtros
                              </Button>
                            ) : (
                              <Button onClick={() => abrirModal()}>
                                <Plus className="mr-2 size-4" aria-hidden="true" />
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

              {/* Metadatos de la tabla: conteo y ordenamiento activo */}
              <div className="mt-4 flex flex-col items-start justify-between gap-2 text-xs sm:text-sm text-muted-foreground sm:flex-row sm:items-center">
                <span>
                  Mostrando {tractores.length} de {totalItems} tractores
                </span>
                <span>
                  Orden: {ordenamiento.sort} ({ordenamiento.order})
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
            <DialogTitle>
              {modoEdicion ? 'Editar Tractor' : 'Añadir Tractor'}
            </DialogTitle>
            <DialogDescription>
              Formulario alineado al modelo tractor para transición sin fricción a API remota.
            </DialogDescription>
          </DialogHeader>

          {/*
           * Formulario en 1 columna (móvil) → 2 columnas (md+).
           * Los campos se agrupan semánticamente: datos básicos | datos técnicos de llanta.
           */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-h-[60vh] overflow-y-auto pr-1">

            {/* ── Columna izquierda: datos básicos del tractor ── */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nombre *</label>
                <Input name="name" value={tractorActual.name} onChange={manejarCambio} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Marca *</label>
                <Input name="brand" value={tractorActual.brand} onChange={manejarCambio} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Modelo *</label>
                <Input name="model" value={tractorActual.model} onChange={manejarCambio} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Potencia del motor (HP) *</label>
                <Input
                  type="number" min="0"
                  name="engine_power_hp"
                  value={tractorActual.engine_power_hp}
                  onChange={manejarCambio}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Peso (kg)</label>
                <Input
                  type="number" min="0"
                  name="weight_kg"
                  value={tractorActual.weight_kg}
                  onChange={manejarCambio}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Fuerza de tracción (kN)</label>
                <Input
                  type="number" min="0"
                  name="traction_force_kn"
                  value={tractorActual.traction_force_kn}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            {/* ── Columna derecha: tipo de tracción, estado y datos de llanta ── */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Tipo de tracción *</label>
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
                      <SelectItem value="4x2">4x2</SelectItem>
                      <SelectItem value="4x4">4x4</SelectItem>
                      <SelectItem value="track">track</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

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
                      <SelectItem value="available">available</SelectItem>
                      <SelectItem value="maintenance">maintenance</SelectItem>
                      <SelectItem value="inactive">inactive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Tipo de llanta</label>
                <Input name="tire_type" value={tractorActual.tire_type} onChange={manejarCambio} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Ancho de llanta (mm)</label>
                <Input
                  type="number" min="0"
                  name="tire_width_mm"
                  value={tractorActual.tire_width_mm}
                  onChange={manejarCambio}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Diámetro de llanta (mm)</label>
                <Input
                  type="number" min="0"
                  name="tire_diameter_mm"
                  value={tractorActual.tire_diameter_mm}
                  onChange={manejarCambio}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Presión de llanta (psi)</label>
                <Input
                  type="number" min="0"
                  name="tire_pressure_psi"
                  value={tractorActual.tire_pressure_psi}
                  onChange={manejarCambio}
                />
              </div>
            </div>
          </div>

          {/* Pie del modal: botones de cancelar y guardar */}
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
                ? `¿Está seguro de eliminar el tractor "${tractorAEliminar.name}"? Esta acción no se puede deshacer.`
                : 'Esta acción no se puede deshacer.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel onClick={cerrarConfirmacionEliminacion} disabled={eliminando}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmarEliminacionTractor} disabled={eliminando}>
              {eliminando ? 'Eliminando...' : 'Eliminar Tractor'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default TractorCRUD;
