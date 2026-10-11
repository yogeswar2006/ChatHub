import {create} from "zustand"
import {axiosInstance} from "../lib/axios"
import toast from 'react-hot-toast'
import { useAuthStore } from "./useAuthStore";



export const useChatStore = create((set,get)=>({
    allContacts:[],
    chats:[],
    messages:[],
    activeTab:"chats",
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled"))===true,


    toggleSound:()=>{
        localStorage.setItem("isSoundEnabled",!get().isSoundEnabled);
        set({isSoundEnabled:!get().isSoundEnabled})
    },
    setActiveTab:(tab)=> set({activeTab:tab}),
    setSelectedUser:(selectedUser)=>set({selectedUser}),

    getAllContacts:async()=>{
        set({isUsersLoading:true})
        try{
            const res= await axiosInstance.get("/message/contacts");
            set({allContacts:res.data})
        }catch(error){
            toast.error(error.response.data.message)
            set({allContacts:[]})
        }finally{
              set({isUsersLoading:false})
        }
    },

    getMyChatPartners:async()=>{
        set({isUsersLoading:true})
        try{
            const res= await axiosInstance.get("/message/chats");
            set({chats:res.data.chatPartners})
        }catch(error){
            toast.error(error.response.data.message)
            set({chats:[]})
        }finally{
              set({isUsersLoading:false})
        }
    },

    getMessagesUserById:async(userId)=>{
       
        set({isMessagesLoading:true})
        try{
                const res =  await axiosInstance.get(`/message/${userId}`);
                console.log(res.data)
                set({messages:res.data.messages})
        }catch(error){
                toast.error(error.response.data.message)
                set({messages:[]})
        }finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessage:async(messageData)=>{
        const {selectedUser,messages}=get()
        const formData=new FormData()
        const {authUser}=useAuthStore.getState()
        const temp_id=`temp_${Date.now()}`
        const optimisticMessage={
            _id:temp_id,
            senderId:authUser._id,
            receiverId:selectedUser._id,
            text:messageData.text,
            image:messageData.image

        }
        set({messages:[...messages,optimisticMessage]})
        if(messageData.text){
            formData.append("text",messageData.text)
        }
        if(messageData.image){
            formData.append("image",messageData.image)
        }
        try{
            
            const res=await axiosInstance.post(`/message/send/${selectedUser._id}`,formData)
            set({messages:messages.concat(res.data.newMessage)})
           
        }catch(error){
            set({messages:messages})
            toast.error(error.response?.data?.message)
        }
    },

    subscribeToMessages:()=>{
        const {selectedUser,isSoundEnabled}=get();

        if(!selectedUser) return;

        const socket= useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{

            const isMessageSentFromSelectedUser=newMessage.senderId===selectedUser._id;
            if(!isMessageSentFromSelectedUser) return ;

            const currMessages=get().messages;
            set({messages:[...currMessages,newMessage]})
        });

        if (isSoundEnabled) {
            const notificationSound = new Audio("/sounds/notification.mp3");

            notificationSound.currentTime = 0; // reset to start
            notificationSound.play().catch((e) => console.log("Audio play failed:", e));
       }
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

}))