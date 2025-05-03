import { create } from "zustand";
import { axiosInstance } from "/src/lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false, 
    isUpdating: false,
    isCheckingAuth: true,
    onlineUsers:[],
    socket:null,

    
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check"); 
            get().connectSocket();
            set({ authUser: res.data }); 
        } catch (error) {
            console.log("Error in checkAuth:", error);

            if (useAuthStore.getState().authUser) {
            toast.error("Failed to check authentication!");
        }
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data); 
            console.log("Signup Response:", res.data); 
            set({ authUser: res.data.user }); 
            toast.success("Account created successfully");
            get.connectSocket()
        } catch (error) {
            toast.error(error.response?.data || "An unexpected error occurred");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } finally {
            console.log("Updated Zustand Store:", useAuthStore.getState()); 
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
    set({ isLoggingIn: true });
    try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Logged in successfully!");

        get().connectSocket();
    } catch (error) {
        console.log("Login Error:", error);
        toast.error(error.response?.data?.message || "An unexpected error occurred");
        setTimeout(() => {
                window.location.reload();
            }, 1000);
    } finally {
        set({ isLoggingIn: false });
    }
},

    logout: async()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out successfully!");
            get().disconnectSocket();
        } catch (error) {
            console.log("Error in Logout",error);
            toast.error(error.response.data.message);
        }
    },
    updateProfile:async (data)=>{
        set({isUpdating:true});
        try {
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Image Uploaded Successfully");
        } catch (error) {
            console.log("Error in Updaitng Profile",error);
            toast.error(error.response.data.message);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }finally{
            set({isUpdating:false});
        }
    },
    connectSocket: ()=>{
        const {authUser}=get()
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id,
            },
        });
        socket.connect();

        set({socket : socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({ onlineUsers:userIds})
        })
    },
    disconnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}));
