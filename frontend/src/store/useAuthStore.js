import { create } from 'zustand';
import { axiosInstance } from "../lib/axios"
import axios from 'axios';
import toast from 'react-hot-toast';
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE=="development"? "http://localhost:3000" : import.meta.env.VITE_SOCKET_BASE_URL

export const useAuthStore = create((set,get) => ({

    authUser: null,
    isCheckingAuth: true,
    isSigningUp:false,
    isLoggingIn:false,
    isLoggingOut:false,
     onlineUsers: [],
     socket:null,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data.user });
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
            set({authUser:res.data.user})
            get().connectSocket()
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
            set({authUser:res.data.user})
          
            toast.success("Logged in successfully!");
              get().connectSocket()
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
    },

    logout:async()=>{
        set({isLoggingOut:true})
        try{
            const res= await axiosInstance.post("/auth/logout");
             set({authUser:null})
            toast.success("Logging out")
            get().disconnectSocket()
           

        }catch(error){
            toast.error(error.response.data.message)
        }finally{
          set({isLoggingOut:false})
        }
    },

    connectSocket:()=>{
        const {authUser}=get()
        if(!authUser || get().socket?.connected) return

        const newSocket=io(BASE_URL,{
            withCredentials:true // this ensures cookies are sent with the connection
        })

        newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        });

        newSocket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            console.log("online users",userIds)
            set({ onlineUsers: userIds });
        });

        set({ socket: newSocket });
    },

   disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
        socket.disconnect();
        set({ socket: null, onlineUsers: [] });
    }
},
}))