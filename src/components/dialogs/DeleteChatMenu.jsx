import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hooks'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'

const DeleteChatMenu = ({dispatch,deleteOptionAnchore}) => {

    const navigate = useNavigate();


    const {isDeleteMenu, selectedDeletChat} = useSelector((state)=> state.misc)
    const [deleteChat,_,deleteChatData] = useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup,__,leaveGroupData] = useAsyncMutation(useLeaveGroupMutation)
    const leaveGroupHandelr=()=>{
        closeHandler();
        leaveGroup("Leaving Group...",selectedDeletChat.chatId)
    }

    const deleteChatHandler=()=>{
        closeHandler();
        deleteChat("Deleting Chat...",selectedDeletChat.chatId)
    }

    const closeHandler=()=>{
        dispatch(setIsDeleteMenu(false))
        deleteOptionAnchore.current =null;
    }

    useEffect(()=>{
        if(deleteChatData || leaveGroupData){
            navigate("/")
        }

    },[deleteChatData,leaveGroupData])

  return (
<Menu onClose={closeHandler} anchorEl={deleteOptionAnchore.current} open={isDeleteMenu} anchorOrigin={{
    vertical:"bottom",
    horizontal:"right"
}} transformOrigin={{
    vertical:"center",
    horizontal:"center"
}}>
    <Stack 
    onClick={selectedDeletChat.groupChat ? leaveGroupHandelr: deleteChatHandler}
    sx={{
        width:"10rem",
        padding:"0.5rem",
        cursor:"pointer"
    }}
    direction={"row"} alignItems={"center"} spacing={"0.5rem"}
    >
       {
        selectedDeletChat.groupChat ? <><ExitToAppIcon/><Typography>Leave Group</Typography></>:<><DeleteIcon/><Typography>Delete Chat</Typography></>
       }

    </Stack>

</Menu>
  )
}
{/*  : <><</> */}
export default DeleteChatMenu