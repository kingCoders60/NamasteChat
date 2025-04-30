import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js"
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUo:false,
    isLogginIng:false,
    isUpdating:false,

    isCheckingAuth: true,

    checkAuth: async()=>{
        try {
            const res=await axiosInstance.get("http://localhost:5001/api/auth/check");
        } catch (error) {
            console.log("Error in checkAuth:",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    }
}));