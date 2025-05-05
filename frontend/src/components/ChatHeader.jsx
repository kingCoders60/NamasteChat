import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, lastSeen, setLastSeen } = useAuthStore();

  const [popupImage, setPopupImage] = useState(null);
  const [formattedLastSeen, setFormattedLastSeen] = useState("Unknown");

  // Update Last Seen when user disconnects
  useEffect(() => {
    if (lastSeen) {
      const date = new Date(lastSeen);
      if (!isNaN(date)) {
        setFormattedLastSeen(date.toLocaleString());
      } else {
        console.warn("Invalid lastSeen date:", lastSeen);
      }
    }
  }, [lastSeen]);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.profilePic || "/avatar.png"}
                alt={selectedUser?.fullName || "User"}
                onClick={() =>
                  setPopupImage(selectedUser?.profilePic || "/avatar.png")
                }
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-medium">
              {selectedUser?.fullName || "Unknown User"}
            </h3>
            <p className="text-sm text-base-content/70">
              {selectedUser?._id && Array.isArray(onlineUsers)
                ? onlineUsers.includes(selectedUser._id)
                  ? "Online"
                  : `Last seen at ${formattedLastSeen}`
                : "Status Unknown"}
            </p>
          </div>
        </div>

        {/* Close button */}
        {selectedUser && (
          <button
            className="absolute top-2 right-2 cursor-pointer hover:text-orange-700"
            onClick={() => setSelectedUser(null)}
            style={{ position: "relative", top: "10px", right: "10px" }}>
            <X />
          </button>
        )}
      </div>

      {popupImage && (
        <div
          className="fixed inset-5 bg-opacity-50 flex items-center justify-center border-rounded-lg"
          onClick={() => setPopupImage(null)}>
          <div className="relative p-4 size-100 shadow-2xs animate-pulse">
            <img
              src={popupImage}
              alt="Profile Pic"
              className="max-w-full max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
