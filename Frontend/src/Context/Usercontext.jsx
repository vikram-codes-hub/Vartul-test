import { useEffect, useState } from "react";
import { Children } from "react";
import { createContext } from "react";
import axios from "axios"
import { io } from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";


export const Usercontext=createContext();
const backendUrl=import.meta.env.VITE_BACKEND_URL

axios.defaults.baseURL=backendUrl
const UserContextProvider=(props)=>{

      const [token, settoken] = useState(localStorage.getItem("token"));
      const [authMode, setAuthMode] = useState(null);

    const [authuser,setauthuser]=useState()
    const [socket,setsocket]=useState(null)
    const [onlineuser,setonlineuser]=useState([])

 const checkauth = async () => {
    try {
        const { data } = await axios.get('/api/auth/checkauth');

        if (data.success) {
            setauthuser(data.user);
            connectsocket(data.token);
        }
    } catch (error) {
    
        localStorage.removeItem("token");
        settoken(null);
        setauthuser(null);
    }
};


    const Login=async({state,credentials})=>{
        try {
            const {data}=await axios.post(`/api/auth/${state}`,credentials)
            console.log(data)
            if(data.success){
                setauthuser(data.UserData)
                connectsocket(data.token)
                axios.defaults.headers.common["token"]=data.token
                 setAuthMode(state);
                settoken(data.token)
                localStorage.setItem("token",data.token)
                toast.success(data.mssg)
            }else{
                toast.error(data.mssg)
            }
            return data
        } catch (error) {
            toast.error(error.message)
        }
    }

    //complting the user profile after the singup
    const completeprofile=async(basicinfo)=>{
        try {
            const {data}=await axios.post('/api/auth/profile-setup',basicinfo,{ headers: {token: localStorage.getItem("token") }})

            if(data.success){
                setauthuser(data.user)
                return data
            }else{
                toast.error(data.mssg)
            } } catch (error) {
                console.log(error)
                toast.error(error.mssg)
            }
   
    }

    //entering the interst and the content interst the user need
const updateUserInterests = async ({ interests, contentCategories }) => {
  try {
    const { data } = await axios.post(
      '/api/auth/interests',
      { interests, contentCategories },
      {
        headers: {
          token: localStorage.getItem("token")
        }
      }
    );

    setauthuser(data.user);

    return data;
  } catch (error) {
    return { success: false };
  }
};


    const connectsocket=async(UserData)=>{
        if(!UserData || socket?.connected)return

        const newsocket=io(backendUrl,{
            query:{userId:UserData._id}
        })

          newsocket.on("connect", () => {
    console.log("✅ Socket connected:", newsocket.id);
  });
    newsocket.on("getOnlineUsers", (ids) => {
    console.log("🔵 Received online users:", ids);
    setonlineuser(ids);
  });

  setsocket(newsocket);
    }

  const Logout = async () => {
    console.log("before logout:", token);

   
    socket?.disconnect();
    setsocket(null);

   
    setauthuser(null);
    setonlineuser([]);

   
    localStorage.removeItem("token");

    
    axios.defaults.headers.common["token"] = null;

   
    settoken(null);

    console.log("after logout:", token);
    toast.success("Logout successfully");
};

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"]=token
            checkauth()
        }
    },[token])


    const values={
      token,authuser,onlineuser,socket,Login,authMode,Logout,checkauth,updateUserInterests,completeprofile
    }

    return (
        <Usercontext.Provider value={values}>
            {props.children}
        </Usercontext.Provider>
    )
}

export default UserContextProvider