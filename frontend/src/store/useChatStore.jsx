import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  lastSeen: null,
  isUserLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected!");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  markMessageAsRead: async (messageId) => {
    try {
      await axiosInstance.put(`/messages/read/${messageId}`);

      // Emit WebSocket event to notify sender
      const socket = useAuthStore.getState().socket;
      if (socket && socket.connected) {
        socket.emit("messageRead", messageId);
      }

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        ),
      }));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  },

  getLastSeen: async (userId) => {
    try {
      const res = await axiosInstance.get(`/users/${userId}`);
      set({ lastSeen: res.data.lastSeen });
    } catch (error) {
      console.error("Error fetching last seen:", error);
      set({ lastSeen: null });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket || !socket.connected) {
      console.error("WebSocket is not initialized or connected.");
      return;
    }

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId === selectedUser._id) {
        set({ messages: [...get().messages, newMessage] });
      }
    });

    // Listen for read receipt updates
    socket.on("updateMessageStatus", (updatedMessage) => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === updatedMessage._id
            ? { ...msg, read: updatedMessage.read }
            : msg
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("updateMessageStatus");
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
    get().subscribeToMessages();
  },
}));
