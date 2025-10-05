import React, { useState, useEffect } from 'react';
import applicantService from '../../services/applicantService';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const notiData = await applicantService.getNotifications();
      setNotifications(notiData);
      setUnreadCount(notiData.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await applicantService.markNotificationAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Thông báo {unreadCount > 0 && `(${unreadCount} mới)`}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-gray-600 text-sm">{notification.message}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 text-sm">
                      {notification.time}
                    </span>
                    {!notification.read && (
                      <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có thông báo nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;