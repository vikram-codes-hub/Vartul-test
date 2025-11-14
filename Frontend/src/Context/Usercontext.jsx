import { useState } from "react";
import { Children } from "react";
import { createContext } from "react";
import axios from "axios"
import { io } from "socket.io-client";
import { toast, Toaster } from "react-hot-toast";

export const Usercontext=createContext();
const backendUrl=import.meta.env.VITE_BACKEND_URL

axios.default.baseurl=backendUrl
const UserContextProvider=(props)=>{

      const [token, settoken] = useState(localStorage.getItem("token"));
    const [authuser,setauthuser]=useState()
    const [socket,setsocker]=useState(null)
    const [onlineuser,setonlineuser]=useState([])

    const checkauth=async()=>{
        try {
            const {data}=await axios.get('/api/auth/checkauth')

            if(data.success){
                setauthuser(data.user)
                connectsocket(data.token)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const Login=async({state,credentials})=>{
        try {
            const {data}=await axios.post(`/api/auth/${state}`,credentials)

            if(data.success){
                setauthuser(data.UserData)
                connectsocket(data.token)
                axios.defaults.headers.common["token"]=data.token
                settoken(data.token)
                localStorage.setItem("token",data.token)
                toast.success(data.mssg)
            }else{
                toast.error(data.mssg)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const Logout=async()=>{
        localStorage.removeItem("token")
        settoken(null);
    setauthuser(null);
    setonlineuser([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logout successfully");
    socket?.disconnect();
    }


    const values={
      token,authuser,onlineuser,socket,Login,Logout,checkauth
    }

    return (
        <Usercontext.Provider value={values}>
            {props.children}
        </Usercontext.Provider>
    )
}

export default UserContextProvider