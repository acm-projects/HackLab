"use client";

import { useRouter } from "next/navigation";

interface Notification {
  type: "joinRequest" | "like";
  user: {
    name: string;
    profilePic: string;
    project?: string; // For join requests
    post?: string; // For likes
  };
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onClose,
}) => {
  const router = useRouter();

  const handleUserProfileClick = (userId: string) => {
    router.push(`/profile/${userId}`); // Redirect to user profile
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-[1000]">
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">Notifications</h3>
        {notifications.map((notification, index) => (
          <div key={index} className="mb-4">
            {notification.type === "joinRequest" ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={notification.user.profilePic}
                    alt={notification.user.name}
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onClick={() => handleUserProfileClick("user-id")} // Replace with actual user ID
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {notification.user.name} wants to join{" "}
                      <span className="font-bold">{notification.user.project}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-500 text-white rounded-lg">
                    Accept
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded-lg">
                    Decline
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <img
                  src={notification.user.profilePic}
                  alt={notification.user.name}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  onClick={() => handleUserProfileClick("user-id")} // Replace with actual user ID
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {notification.user.name} liked your post:{" "}
                    <span className="font-bold">{notification.user.post}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;