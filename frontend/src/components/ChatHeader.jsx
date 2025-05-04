import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

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
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">
              {selectedUser?.fullName || "Unknown User"}
            </h3>
            <p className="text-sm text-base-content/70">
              {selectedUser?._id && Array.isArray(onlineUsers)
                ? onlineUsers.includes(selectedUser._id)
                  ? "Online"
                  : "Offline"
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
    </div>
  );
};

export default ChatHeader;
