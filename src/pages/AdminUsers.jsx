import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser } from '../services/adminApi';
import { 
  Users, 
  Search, 
  Edit2, 
  X,
  AlertCircle,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700 border-green-200",
    inactive: "bg-gray-100 text-gray-700 border-gray-200",
    suspended: "bg-red-100 text-red-700 border-red-200"
  };

  const labels = {
    active: "Activo",
    inactive: "Inactivo",
    suspended: "Suspendido"
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.inactive}`}>
      {labels[status] || status}
    </span>
  );
};

const RoleBadge = ({ roleId, roleName }) => {
  return (
    <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
      {roleId === 1 ? <ShieldAlert className="w-4 h-4 text-purple-600" /> : <UserCheck className="w-4 h-4 text-blue-600" />}
      {roleId === 1 ? 'Administrador' : 'Usuario'}
    </span>
  );
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Search/Filter state
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAllUsers();
      if (res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (Array.isArray(res)) {
        setUsers(res);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la lista de usuarios.');
      console.error('Error al obtener usuarios');
      // alert('Error al obtener usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser({ ...user }); // clone the user object
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setIsSaving(true);
      
      const payload = {
        name: editingUser.name,
        email: editingUser.email,
        roleId: Number(editingUser.roleId),
        status: editingUser.status
      };

      await updateUser(editingUser.userId, payload);
      alert('Usuario actualizado correctamente');
      
      // Update local state to avoid full reload
      setUsers(prev => prev.map(u => u.userId === editingUser.userId ? { ...u, ...payload } : u));
      
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert('No se pudo actualizar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">Administra los roles, estados y accesos del sistema.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o correo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Total: {filteredUsers.length} usuarios
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            <p>{error}</p>
            <button onClick={fetchUsers} className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100">
              Reintentar
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No se encontraron usuarios.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Usuario</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Última Sesión</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{user.name}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <RoleBadge roleId={user.roleId} roleName={user.roleName} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4">
                      {user.lastSession ? (
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(user.lastSession).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Nunca</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                        title="Editar usuario"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && editingUser && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            {/* Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Editar Usuario</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input 
                    type="text" 
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select 
                      value={editingUser.roleId}
                      onChange={(e) => setEditingUser({...editingUser, roleId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="2">Usuario</option>
                      <option value="1">Administrador</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select 
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="suspended">Suspendido</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 mt-6">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Guardando...
                      </>
                    ) : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
