import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header'
import Title from '../shared/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import ChatList from '../specific/ChatList'
import { useNavigate, useParams } from 'react-router-dom'
import Profile from '../specific/Profile'
import { useMyChatsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu, setIsMobile, setSelectedDeletChat } from '../../redux/reducers/misc'
import { sockethandler, useErrors } from '../../hooks/hooks'
import { getSocket } from '../../socket'
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../constants/events'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat'
import { getOrsaveFromStorage } from '../../lib/features'
import DeleteChatMenu from '../dialogs/DeleteChatMenu'
const Applayout = ()=> (WrapedComponent) => {
  return (props)=>{
    const params = useParams();
    const chatId = params.chatId;
    const navigate =useNavigate()

    const socket = getSocket();

    const dispatch = useDispatch()

    const {isMobile}= useSelector((state)=> state.misc);
    const {user}= useSelector((state)=>state.auth);
    const {newMessagesAlert} = useSelector((state)=>state.chat)

    const deleteMenuAnchore = useRef(null);
    const [onlineUsers,setOnlineUsers] =useState([]);

    


    const {isLoading,data,error,isError,refetch} = useMyChatsQuery("");
   
    useErrors([{isError,error}]);

    useEffect(()=>{
      getOrsaveFromStorage({key: NEW_MESSAGE_ALERT,value:newMessagesAlert})
    },[newMessagesAlert])

    const handleDeleteChat=(e,chatId,groupChat)=>{
      e.preventDefault();
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeletChat({chatId,groupChat}))
      deleteMenuAnchore.current = e.currentTarget;
    }

    const handelMobileClose=()=>{
      dispatch(setIsMobile(false))
    }


    const newMessageAlertHandler= useCallback((data)=>{
      if(data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data))
    },[chatId])



    const newRequestHandler= useCallback(()=>{
      dispatch(incrementNotification());
    },[])

    const refetchListner= useCallback(()=>{
      refetch();
      navigate("/")
    },[refetch,navigate])


    const onlineUseresListner= useCallback((data)=>{
      setOnlineUsers(data)
    },[])

    const eventHandelers ={
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestHandler,
      [REFETCH_CHATS]: refetchListner,
      [ONLINE_USERS]: onlineUseresListner,
    }

    sockethandler(socket,eventHandelers)


    return (
        <>
        <Title/>
        <Header/>

        <DeleteChatMenu dispatch={dispatch} deleteOptionAnchore={deleteMenuAnchore}/>

        {
          isLoading? (<Skeleton/>): (
            <Drawer open={isMobile} onClose={handelMobileClose}>
              <ChatList w='70vw' chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers}/>
            </Drawer>
          )
        }


        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid item sm={4} md={3} sx={{
            display:{ xs:"none", sm:"block"},
            overflow:"auto"
          }} height={"100%"} >
            {isLoading? (<Skeleton/>) : (<ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers}/>)}
          </Grid>
          <Grid item xs={12}  sm={8} md={5} lg={6} height={"100%"}><WrapedComponent {...props} chatId={chatId} user={user}/></Grid>
          <Grid item md={4} lg={3} sx={{
            display:{ xs:"none", sm:"block"},
            padding: "2rem",
            bgcolor:"rgba(0,0,0,0.85)"
          }}  height={"100%"} ><Profile user={user}/></Grid>
        </Grid>
        </>
    )
  }
}

export default Applayout;