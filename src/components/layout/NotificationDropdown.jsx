import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, CheckCircle, Info, AlertCircle, Tractor } from 'lucide-react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '@/services/notificationApi';

const getIconForType = (type) => {
  switch (type) {
    case 'RECOMMENDATION':
      return <CheckCircle className="w-4 h-4 text-primary" />;
    case 'TRACTOR_AVAILABLE':
      return <Tractor className="w-4 h-4 text-accent" />;
    case 'SYSTEM':
      return <Info className="w-4 h-4 text-primary" />;
    case 'ERROR':
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    default:
      return <Bell className="w-4 h-4 text-muted-foreground" />;
  }
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Escuchar clics fuera del dropdown para cerrarlo
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const resp = await getUnreadCount();
      if (resp?.data?.count !== undefined) {
        setUnreadCount(resp.data.count);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const resp = await getNotifications({ limit: 10 });
      if (resp?.data) {
        setNotifications(Array.isArray(resp.data) ? resp.data : []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Refrescar cada 1 minuto (Opcional, evita saturar el SV)
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="relative p-2.5 rounded-full bg-transparent hover:bg-white/10 text-white transition-colors focus:outline-none"
        aria-label="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-lg bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-border">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
            <h3 className="text-sm font-semibold text-foreground">Notificaciones</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Cargando...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-muted-foreground">
                <Bell className="w-8 h-8 opacity-20 mb-2" />
                <p className="text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notif) => (
                  <div 
                    key={notif.notification_id} 
                    className={`p-4 flex gap-3 transition-colors hover:bg-muted/40 ${!notif.is_read ? 'bg-primary/5' : ''}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                       {getIconForType(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notif.is_read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {notif.title || notif.type}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {new Date(notif.created_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                    {!notif.is_read && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.notification_id)}
                        className="flex-shrink-0 text-muted-foreground hover:text-primary p-1 rounded-full hover:bg-muted transition-colors"
                        title="Marcar como leída"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-2 border-t border-border bg-muted/20 text-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Cerrar panel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
