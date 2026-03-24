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

const ESTADO_INICIAL_IMPLEMENTO = {
  implement_name: '',
  brand: '',
  power_requirement_hp: '',
  working_width_m: '',
  soil_type: 'All',
  working_depth_cm: '',
  weight_kg: '',
  implement_type: '',
  status: 'available',
};

const ORDER_BY_FIELD = {
  implement_name: 'implement_name',
  power_requirement_hp: 'power_requirement_hp',
  status: 'status',
};

const FILTROS_TIPO = [
  { label: 'Arado', value: 'Plow' },
  { label: 'Sembradora', value: 'Seeder' },
  { label: 'Rastra', value: 'Harrow' },
];

const FILTROS_ESTADO = [
  { label: 'Disponible', value: 'available' },
  { label: 'Mantenimiento', value: 'maintenance' },
  { label: 'Fuera de servicio', value: 'out_of_service' },
];

const TIPO_LABELS = {
  'Plow': 'Arado',
  'Seeder': 'Sembradora',
  'Harrow': 'Rastra',
};

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

const ImplementCRUD = () => {
  const remoteApiEnabled = isRemoteImplementApiEnabled();

  const [implementos, setImplementos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPorPagina = 10;

  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState({ sort: 'implement_name', order: 'asc' });

  const [filtroRapido, setFiltroRapido] = useState({ tipo: '', estado: '' });

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [implementoAEliminar, setImplementoAEliminar] = useState(null);

  const [implementoActual, setImplementoActual] = useState(ESTADO_INICIAL_IMPLEMENTO);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const consulta = useMemo(() => ({
    page: paginaActual,
    limit: itemsPorPagina,
    sort: ordenamiento.sort,
    order: ordenamiento.order,
    search: busqueda.trim(),
  }), [paginaActual, ordenamiento, busqueda]);

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

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroRapido]);

  const implementosFiltrados = useMemo(() => {
    return implementos.filter((i) => {
      const matchTipo = !filtroRapido.tipo || i.implement_type === filtroRapido.tipo;
      const matchEstado = !filtroRapido.estado || i.status === filtroRapido.estado;
      return matchTipo && matchEstado;
    });
  }, [implementos, filtroRapido]);

  const abrirModal = (implemento = null) => {
    if (implemento) {
      setImplementoActual({
        implement_id: implemento.implement_id,
        implement_name: implemento.implement_name ?? '',
        brand: implemento.brand ?? '',
        power_requirement_hp: implemento.power_requirement_hp ?? '',
        working_width_m: implemento.working_width_m ?? '',
        soil_type: implemento.soil_type ?? 'All',
        working_depth_cm: implemento.working_depth_cm ?? '',
        weight_kg: implemento.weight_kg ?? '',
        implement_type: implemento.implement_type ?? '',
        status: implemento.status ?? 'available',
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

  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setImplementoActual((prev) => ({ ...prev, [name]: value }));
  };

  const obtenerPayload = () => {
    const payload = {
      implement_name: implementoActual.implement_name?.trim(),
      brand: implementoActual.brand?.trim(),
      power_requirement_hp: Number(implementoActual.power_requirement_hp),
      implement_type: implementoActual.implement_type?.trim(),
      soil_type: implementoActual.soil_type,
      status: implementoActual.status,
    };

    const camposNumericos = [
      'working_width_m', 'working_depth_cm', 'weight_kg',
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
    if (!implementoActual.implement_name?.trim())  return 'El nombre es obligatorio.';
    if (!implementoActual.brand?.trim()) return 'La marca es obligatoria.';
    if (!implementoActual.implement_type?.trim()) return 'El tipo de implemento es obligatorio.';
    if (implementoActual.power_requirement_hp === '' || Number(implementoActual.power_requirement_hp) <= 0) {
      return 'El requerimiento de potencia (HP) debe ser mayor a 0.';
    }
    return null;
  };

  const guardarImplemento = async () => {
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      window.alert(errorValidacion);
      return;
    }

    setGuardando(true);

    try {
      const payload = obtenerPayload();

      if (modoEdicion) {
        await updateImplement(implementoActual.implement_id, payload);
      } else {
        await createImplement(payload);
      }

      cerrarModal();
      await cargarTabla();
    } catch (error) {
      const message = error.message?.includes('401') || error.message?.includes('403')
        ? 'No autorizado. Necesitas un token válido y rol administrador para guardar cambios.'
        : error.message || 'No se pudo guardar el implemento.';
      window.alert(message);
      setGuardando(false);
    }
  };

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
    if (!implementoAEliminar?.implement_id) return;

    setEliminando(true);

    try {
      await deleteImplement(implementoAEliminar.implement_id);
      cerrarConfirmacionEliminacion();
      await cargarTabla();
    } catch (error) {
      const message = error.message?.includes('401') || error.message?.includes('403')
        ? 'No autorizado. Necesitas un token válido y rol administrador para eliminar.'
        : error.message || 'No se pudo eliminar el implemento.';
      window.alert(message);
      setEliminando(false);
    }
  };

  const alternarOrden = (fieldKey) => {
    const backendField = ORDER_BY_FIELD[fieldKey] || 'implement_name';

    setOrdenamiento((prev) => ({
      sort: backendField,
      order: prev.sort === backendField && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const alternarFiltroRapido = (tipo, valor) => {
    setFiltroRapido((prev) => ({
      ...prev,
      [tipo]: prev[tipo] === valor ? '' : valor,
    }));
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroRapido({ tipo: '', estado: '' });
  };

  const hayFiltrosActivos = Boolean(
    busqueda.trim() || filtroRapido.tipo || filtroRapido.estado
  );

  return (
    <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
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

      <Card className="border border-border bg-card shadow-none">
        <CardHeader className="border-b border-border pb-3 pt-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex flex-col gap-3">
              <div className="relative w-full max-w-xs">
                <Search
                  className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  className="pl-8 text-sm"
                  placeholder="Buscar implemento por nombre o marca..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar implementos por nombre o marca"
                />
              </div>

              <div className="flex flex-wrap gap-2">
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

                <span className="hidden sm:inline-block w-px bg-border self-stretch" aria-hidden="true" />

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

            <div className="flex items-start lg:items-center lg:pt-0 pt-1">
              <Button onClick={() => abrirModal()} size="sm" className="w-full sm:w-auto">
                <Plus className="mr-1.5 size-3.5" aria-hidden="true" />
                Añadir Implemento
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-0">
          {cargando ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Cargando implementos...
            </div>
          ) : errorCarga ? (
            <div className="py-12 text-center text-sm text-destructive">{errorCarga}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table className="min-w-[700px]">
                  <TableHeader>
                    <TableRow className="border-b border-border hover:bg-transparent">
                      <TableHead className="pl-4 sm:pl-6">
                        <button
                          type="button"
                          onClick={() => alternarOrden('implement_name')}
                          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Nombre
                          <SortIndicator fieldKey="implement_name" ordenamiento={ordenamiento} />
                        </button>
                      </TableHead>

                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Marca
                      </TableHead>

                      <TableHead>
                        <button
                          type="button"
                          onClick={() => alternarOrden('power_requirement_hp')}
                          className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Límite de Potencia
                          <SortIndicator fieldKey="power_requirement_hp" ordenamiento={ordenamiento} />
                        </button>
                      </TableHead>

                      <TableHead className="text-xs font-medium text-muted-foreground">
                        Ancho de Trabajo
                      </TableHead>

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
                          key={implemento.implement_id}
                          className="border-b border-border/60 hover:bg-muted/40 transition-colors"
                        >
                          <TableCell className="pl-4 sm:pl-6 font-medium text-sm whitespace-nowrap">
                            {implemento.implement_name}
                          </TableCell>

                          <TableCell>
                            <span className="text-sm">{implemento.brand}</span>
                          </TableCell>

                          <TableCell>
                            <span className="inline-flex items-center gap-1 text-sm whitespace-nowrap">
                              <Gauge className="size-3.5 text-muted-foreground" aria-hidden="true" />
                              {implemento.power_requirement_hp} HP
                            </span>
                          </TableCell>

                          <TableCell className="text-sm">
                            {implemento.working_width_m ? `${implemento.working_width_m} m` : '—'}
                          </TableCell>

                          <TableCell>
                            <Badge 
                              variant={
                                implemento.status === 'available' ? 'default' :
                                implemento.status === 'maintenance' ? 'secondary' : 'destructive'
                              }
                            >
                               {implemento.status === 'available' ? 'Disponible' :
                                implemento.status === 'maintenance' ? 'Mantenimiento' : 'Fuera de uso'}
                            </Badge>
                          </TableCell>

                          <TableCell className="pr-4 sm:pr-6">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirModal(implemento)}
                                className="size-8 text-muted-foreground hover:text-foreground"
                              >
                                <Pencil className="size-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => abrirConfirmacionEliminacion(implemento)}
                                className="size-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
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

      <Pagination
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
      />

      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="w-full max-w-lg sm:max-w-2xl md:max-w-4xl mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {modoEdicion ? 'Editar Implemento' : 'Registrar Implemento'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={(e) => { e.preventDefault(); guardarImplemento(); }} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              
              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-medium">Nombre del implemento<span className="text-destructive">*</span></label>
                <Input name="implement_name" value={implementoActual.implement_name} onChange={manejarCambio} required />
              </div>

              <div className="flex flex-col gap-1 text-sm font-medium">
                <label>Marca<span className="text-destructive">*</span></label>
                <Input name="brand" value={implementoActual.brand} onChange={manejarCambio} required />
              </div>

              <div className="flex flex-col gap-1 text-sm font-medium">
                <label>Tipo de implemento<span className="text-destructive">*</span></label>
                <Input name="implement_type" value={implementoActual.implement_type} onChange={manejarCambio} required />
              </div>

              <InputConUnidad
                label="Requerimiento de Potencia"
                unit="HP"
                name="power_requirement_hp"
                type="number"
                min="1"
                required
                value={implementoActual.power_requirement_hp}
                onChange={manejarCambio}
              />

              <InputConUnidad
                label="Ancho de Trabajo"
                unit="m"
                name="working_width_m"
                type="number"
                min="0"
                step="0.01"
                value={implementoActual.working_width_m}
                onChange={manejarCambio}
              />

              <div className="flex flex-col gap-1 text-sm font-medium">
                <label>Tipo de Suelo<span className="text-destructive">*</span></label>
                <Select
                  value={implementoActual.soil_type || 'All'}
                  onValueChange={(val) => setImplementoActual({ ...implementoActual, soil_type: val })}
                >
                  <SelectTrigger>
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

              <InputConUnidad
                label="Profundidad de Trabajo"
                unit="cm"
                name="working_depth_cm"
                type="number"
                min="0"
                value={implementoActual.working_depth_cm}
                onChange={manejarCambio}
              />

              <InputConUnidad
                label="Peso"
                unit="kg"
                name="weight_kg"
                type="number"
                min="0"
                value={implementoActual.weight_kg}
                onChange={manejarCambio}
              />

              <div className="flex flex-col gap-1 text-sm font-medium">
                <label>Estado<span className="text-destructive">*</span></label>
                <Select
                  value={implementoActual.status || 'available'}
                  onValueChange={(val) => setImplementoActual({ ...implementoActual, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="out_of_service">Fuera de servicio</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <DialogFooter className="mt-8 flex items-center gap-3">
              <Button type="button" variant="outline" onClick={cerrarModal} disabled={guardando}>
                Cancelar
              </Button>
              <Button type="submit" disabled={guardando}>
                {guardando ? 'Guardando...' : modoEdicion ? 'Guardar Cambios' : 'Añadir Implemento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={modalConfirmacionAbierto} onOpenChange={setModalConfirmacionAbierto}>
        <AlertDialogContent className="w-[90%] sm:max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este implemento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El implemento{' '}
              <span className="font-semibold text-foreground">{implementoAEliminar?.implement_name}</span>{' '}
              será eliminado del catálogo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
            <AlertDialogCancel disabled={eliminando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:ring-destructive/20"
              onClick={(e) => {
                e.preventDefault();
                confirmarEliminacionImplemento();
              }}
              disabled={eliminando}
            >
              {eliminando ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </section>
  );
};

export default ImplementCRUD;
