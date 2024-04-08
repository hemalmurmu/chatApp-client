import React,{Suspense, lazy, useEffect} from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute';
import {LayoutLoader} from './components/layout/Loaders';
import axios from "axios";
import { server } from './components/constants/config';
import {useDispatch, useSelector} from "react-redux"
import { userExist, userNotExist } from './redux/reducers/auth';
import {Toaster} from 'react-hot-toast'
import { SocketProvider } from './socket';
const Home = lazy(()=>import("./pages/Home"));
const Login = lazy(()=>import("./pages/Login"));
const Chats = lazy(()=>import("./pages/Chats"));
const Groups = lazy(()=>import("./pages/Groups"));
const AdminLogin = lazy(()=>import("./pages/admin/AdminLogin"));
const DashBoard = lazy(()=>import("./pages/admin/DashBoard"));
const ChatManagement = lazy(()=>import("./pages/admin/ChatManagement"));
const UserManagement = lazy(()=>import("./pages/admin/UserManagement"));
const MessageManagement = lazy(()=>import("./pages/admin/MessageManagement"));
const NotFound = lazy(()=>import("./pages/NotFound"));

const App = () => {

  const {user,loader} = useSelector((state)=>state.auth)

  const dispatch = useDispatch();
  useEffect(()=>{
    axios.get(`${server}/api/v1/user/me`,{withCredentials:true}).then(({data})=>{
      dispatch(userExist(data.user))
    }).catch((error)=> dispatch(userNotExist()));
  },[])
  return loader? <LayoutLoader/>:(
    <BrowserRouter>
    <Suspense fallback={<LayoutLoader/>}>
    <Routes>
      <Route element={<SocketProvider>
        <ProtectRoute user={user}/>
      </SocketProvider>}>
        <Route path='/' element={<Home/>}/>
        <Route path='/chats/:chatId' element={<Chats/>}/>
        <Route path='/groups' element={<Groups/>}/>
      </Route>
      
      <Route path='/login' element={<ProtectRoute user={!user} redirect='/'>
        <Login/>
      </ProtectRoute>}/>
      <Route path='/admin' element={<AdminLogin/>}/>
      <Route path='/admin/dashboard' element={<DashBoard/>}/>
      <Route path='/admin/users' element={<UserManagement/>}/>
      <Route path='/admin/chats' element={<ChatManagement/>}/>
      <Route path='/admin/messages' element={<MessageManagement/>}/>
      
      <Route path='*' element={<NotFound/>}/>
    </Routes> 
    </Suspense>

    <Toaster position='top-center'/>
    </BrowserRouter>
  )
}

export default App