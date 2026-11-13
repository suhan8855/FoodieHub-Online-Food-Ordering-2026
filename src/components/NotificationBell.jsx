import { useEffect, useState } from "react";
import socket from "../socket/socket";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Food created
    const handleFoodCreated = (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: data.message,
        },
        ...prev,
      ]);
    };

    // Food updated
    const handleFoodUpdated = (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: data.message,
        },
        ...prev,
      ]);
    };

    // Food deleted
    const handleFoodDeleted = (data) => {
      setNotifications((prev) => [
        {
          id: Date.now(),
          message: data.message,
        },
        ...prev,
      ]);
    };

    socket.on("foodCreated", handleFoodCreated);
    socket.on("foodUpdated", handleFoodUpdated);
    socket.on("foodDeleted", handleFoodDeleted);

    return () => {
      socket.off("foodCreated", handleFoodCreated);
      socket.off("foodUpdated", handleFoodUpdated);
      socket.off("foodDeleted", handleFoodDeleted);
    };
  }, []);

  return (
    <div className="relative">
      <button className="text-2xl relative">
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
            {notifications.length}
          </span>
        )}
      </button>

      {notifications.length > 0 && (
        <div className="absolute right-0 mt-3 w-80 bg-white text-gray-800 shadow-xl rounded-lg p-4 z-50">
          <h3 className="font-bold text-lg mb-3">
            Notifications
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm"
              >
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;