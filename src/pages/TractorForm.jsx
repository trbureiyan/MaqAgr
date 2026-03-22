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

const estadoInicialTractor = {
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

const ORDER_BY_FIELD = {
  name: 'name',
  engine_power_hp: 'engine_power_hp',
  status: 'status',
};

const TractorCRUD = () => {
  const remoteApiEnabled = isRemoteTractorApiEnabled();
  const [tractores, setTractores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPorPagina = 10;

  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState({
    sort: 'name',
    order: 'asc',
  });
  const [filtros, setFiltros] = useState({
    brand: '',
    minPower: '',
    maxPower: '',
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [tractorAEliminar, setTractorAEliminar] = useState(null);
  const [tractorActual, setTractorActual] = useState(estadoInicialTractor);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const consulta = useMemo(() => {
    return {
      page: paginaActual,
      limit: itemsPorPagina,
      sort: ordenamiento.sort,
      order: ordenamiento.order,
      search: busqueda.trim(),
      brand: filtros.brand,
      minPower: filtros.minPower,
      maxPower: filtros.maxPower,
    };
  }, [paginaActual, ordenamiento, busqueda, filtros]);

  const cargarTabla = useCallback(async () => {
    setCargando(true);
    setErrorCarga('');

    try {
      const response = await getTractors(consulta);
      const datos = Array.isArray(response?.data) ? response.data : [];
      const paginacion = response?.pagination || {};

      setTractores(datos);
      setTotalPaginas(Number(paginacion.totalPages || 1));
      setTotalItems(Number(paginacion.total || datos.length));
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
  }, [busqueda, filtros]);

  const abrirModal = (tractor = null) => {
    if (tractor) {
      setTractorActual({
        tractor_id: tractor.tractor_id,
        name: tractor.name || '',
        brand: tractor.brand || '',
        model: tractor.model || '',
        engine_power_hp: tractor.engine_power_hp ?? '',
        weight_kg: tractor.weight_kg ?? '',
        traction_force_kn: tractor.traction_force_kn ?? '',
        traction_type: tractor.traction_type || '4x4',
        tire_type: tractor.tire_type || '',
        tire_width_mm: tractor.tire_width_mm ?? '',
        tire_diameter_mm: tractor.tire_diameter_mm ?? '',
        tire_pressure_psi: tractor.tire_pressure_psi ?? '',
        status: tractor.status || 'available',
      });
      setModoEdicion(true);
    } else {
      setTractorActual(estadoInicialTractor);
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
    setTractorActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const obtenerPayload = () => {
    const payload = {
      name: tractorActual.name?.trim(),
      brand: tractorActual.brand?.trim(),
      model: tractorActual.model?.trim(),
      engine_power_hp: tractorActual.engine_power_hp,
      traction_type: tractorActual.traction_type,
      status: tractorActual.status,
    };

    const optionalNumberFields = [
      'weight_kg',
      'traction_force_kn',
      'tire_width_mm',
      'tire_diameter_mm',
      'tire_pressure_psi',
    ];

    optionalNumberFields.forEach((field) => {
      const value = tractorActual[field];
      if (value !== '' && value !== null && value !== undefined) {
        payload[field] = Number(value);
      }
    });

    if (tractorActual.tire_type?.trim()) {
      payload.tire_type = tractorActual.tire_type.trim();
    }

    payload.engine_power_hp = Number(payload.engine_power_hp);

    return payload;
  };

  const validarFormulario = () => {
    if (!tractorActual.name?.trim()) {
      return 'El nombre es obligatorio.';
    }
    if (!tractorActual.brand?.trim()) {
      return 'La marca es obligatoria.';
    }
    if (!tractorActual.model?.trim()) {
      return 'El modelo es obligatorio.';
    }
    if (tractorActual.engine_power_hp === '' || Number(tractorActual.engine_power_hp) <= 0) {
      return 'La potencia del motor debe ser mayor a 0.';
    }
    if (!tractorActual.traction_type) {
      return 'El tipo de tracción es obligatorio.';
    }

    return null;
  };

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
      const message = error.message?.includes('401') || error.message?.includes('403')
        ? 'No autorizado. Necesitas un token válido y rol administrador para guardar cambios.'
        : error.message || 'No se pudo guardar el tractor.';
      window.alert(message);
      setGuardando(false);
    }
  };

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
    if (!tractorAEliminar?.tractor_id) {
      return;
    }

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

  const alternarOrden = (fieldKey) => {
    const backendField = ORDER_BY_FIELD[fieldKey] || 'name';

    setOrdenamiento((prev) => {
      if (prev.sort === backendField) {
        return {
          sort: backendField,
          order: prev.order === 'asc' ? 'desc' : 'asc',
        };
      }

      return {
        sort: backendField,
        order: 'asc',
      };
    });
  };

  const renderIndicadorOrden = (fieldKey) => {
    const backendField = ORDER_BY_FIELD[fieldKey] || 'name';
    if (ordenamiento.sort !== backendField) {
      return <ArrowDownAZ className="ml-2" data-icon="inline-end" />;
    }

    return ordenamiento.order === 'asc' ? (
      <ArrowDownAZ className="ml-2" data-icon="inline-end" />
    ) : (
      <ArrowUpAZ className="ml-2" data-icon="inline-end" />
    );
  };

  const hayFiltrosActivos = Boolean(
    busqueda.trim() || filtros.brand || filtros.minPower || filtros.maxPower
  );

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Tractores</h1>
          <p className="text-sm text-muted-foreground">
            {remoteApiEnabled
              ? 'Modo API remota: paginación, filtros y ordenamiento server-side.'
              : 'Modo local/mock: listo para frontend en Vercel mientras el VPS está en progreso.'}
          </p>
        </div>

        <Button onClick={() => abrirModal()}>
          <Plus data-icon="inline-start" />
          Añadir Tractor
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Búsqueda y filtros</CardTitle>
          <CardDescription>
            Filtra por marca y rango de potencia.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-2 left-2.5 size-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Buscar por nombre o marca"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </div>

            <Button variant="outline" onClick={() => setMostrarFiltros((prev) => !prev)}>
              <Filter data-icon="inline-start" />
              {mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'}
            </Button>
          </div>

          {mostrarFiltros && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Marca</label>
                <Input
                  placeholder="Ej: John Deere"
                  value={filtros.brand}
                  onChange={(event) =>
                    setFiltros((prev) => ({ ...prev, brand: event.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Potencia mínima (HP)</label>
                <Input
                  type="number"
                  min="0"
                  value={filtros.minPower}
                  onChange={(event) =>
                    setFiltros((prev) => ({ ...prev, minPower: event.target.value }))
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Potencia máxima (HP)</label>
                <Input
                  type="number"
                  min="0"
                  value={filtros.maxPower}
                  onChange={(event) =>
                    setFiltros((prev) => ({ ...prev, maxPower: event.target.value }))
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {cargando ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Cargando tractores desde backend...
            </div>
          ) : errorCarga ? (
            <div className="py-10 text-center text-sm text-destructive">{errorCarga}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => alternarOrden('name')}>
                        Nombre
                        {renderIndicadorOrden('name')}
                      </Button>
                    </TableHead>
                    <TableHead>Marca / Modelo</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => alternarOrden('engine_power_hp')}
                      >
                        Potencia
                        {renderIndicadorOrden('engine_power_hp')}
                      </Button>
                    </TableHead>
                    <TableHead>Tracción</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => alternarOrden('status')}>
                        Estado
                        {renderIndicadorOrden('status')}
                      </Button>
                    </TableHead>
                    <TableHead>Peso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tractores.length > 0 ? (
                    tractores.map((tractor) => (
                      <TableRow key={tractor.tractor_id}>
                        <TableCell className="font-medium">{tractor.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{tractor.brand}</span>
                            <span className="text-xs text-muted-foreground">{tractor.model}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1">
                            <Gauge className="size-4" />
                            {tractor.engine_power_hp} HP
                          </span>
                        </TableCell>
                        <TableCell>{tractor.traction_type || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={tractor.status === 'available' ? 'default' : 'secondary'}>
                            {tractor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {tractor.weight_kg ? `${tractor.weight_kg} kg` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => abrirModal(tractor)}
                              aria-label={`Editar ${tractor.name}`}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => abrirConfirmacionEliminacion(tractor)}
                              aria-label={`Eliminar ${tractor.name}`}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
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
                              <Plus data-icon="inline-start" />
                              Añadir Tractor
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="mt-4 flex flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
                <span>
                  Mostrando {tractores.length} de {totalItems} tractores
                </span>
                <span>Orden: {ordenamiento.sort} ({ordenamiento.order})</span>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{modoEdicion ? 'Editar Tractor' : 'Añadir Tractor'}</DialogTitle>
            <DialogDescription>
              Formulario alineado al modelo tractor para transición sin fricción a API remota.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  type="number"
                  min="0"
                  name="engine_power_hp"
                  value={tractorActual.engine_power_hp}
                  onChange={manejarCambio}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Peso (kg)</label>
                <Input
                  type="number"
                  min="0"
                  name="weight_kg"
                  value={tractorActual.weight_kg}
                  onChange={manejarCambio}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Fuerza de tracción (kN)</label>
                <Input
                  type="number"
                  min="0"
                  name="traction_force_kn"
                  value={tractorActual.traction_force_kn}
                  onChange={manejarCambio}
                />
              </div>
            </div>

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
                  type="number"
                  min="0"
                  name="tire_width_mm"
                  value={tractorActual.tire_width_mm}
                  onChange={manejarCambio}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Diámetro de llanta (mm)</label>
                <Input
                  type="number"
                  min="0"
                  name="tire_diameter_mm"
                  value={tractorActual.tire_diameter_mm}
                  onChange={manejarCambio}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Presión de llanta (psi)</label>
                <Input
                  type="number"
                  min="0"
                  name="tire_pressure_psi"
                  value={tractorActual.tire_pressure_psi}
                  onChange={manejarCambio}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={cerrarModal} disabled={guardando}>
              Cancelar
            </Button>
            <Button onClick={guardarTractor} disabled={guardando}>
              {guardando
                ? 'Guardando...'
                : modoEdicion
                  ? 'Actualizar Tractor'
                  : 'Guardar Tractor'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={modalConfirmacionAbierto} onOpenChange={setModalConfirmacionAbierto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              {tractorAEliminar
                ? `¿Está seguro de eliminar el tractor ${tractorAEliminar.name}?`
                : 'Esta acción no se puede deshacer.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
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
