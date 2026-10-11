import { create } from 'zustand';
import { axiosInstance } from "../lib/axios"
import axios from 'axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({

    authUser: null,
    isCheckingAuth: true,
    isSigningUp:false,
    isLoggingIn:false,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error at checking auth", error);
            set({ authUser: null });

        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signUp:async(formData)=>{
        console.log(FormData)

        set({isSigningUp:true})
        try{
            const data = new FormData();

            data.append("username", formData.username);
            data.append("email", formData.email);
            data.append("password", formData.password);

            if (formData.profilePic) {
                data.append("profilePic", formData.profilePic);
            }
            const res = await axiosInstance.post("/auth/register",data);
            set({authUser:res.data})
            toast.success("Account created successfully!");
        }catch(error){
            const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong during signup";

            toast.error(message);
        }finally{
            set({isSigningUp:false})
        }
    },

    login:async(data)=>{
        console.log(data)

        set({isLoggingIn:true})
        try{
     
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data})
            toast.success("Logged in successfully!");
        }catch(error){
            const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong during signup";
            set({authUser:null})
            toast.error(message);
        }finally{
            set({isLoggingIn:false})
        }
    }
}))