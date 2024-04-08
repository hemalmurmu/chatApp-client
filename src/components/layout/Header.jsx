import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { Suspense, lazy, useState } from 'react'
import { orange } from '../constants/color'
import {Notifications as NotificatonsIcon,Add as AddIcon, Menu as MenuIcon, Search as SearchIcon,Group as GroupIcon,Logout as LogoutIcon} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { server } from '../constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExist } from '../../redux/reducers/auth'
import { SetIsNotification, setIsMobile, setIsNewGroup, setIsSearch } from '../../redux/reducers/misc'
import { resetNotificationCount } from '../../redux/reducers/chat'


const SearchDialogs = lazy(()=>import('../specific/Search'));
const NotificationDialogs = lazy(()=>import('../specific/Notifications'));
const NewGroupDialogs = lazy(()=>import('../specific/NewGroup'));

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {isSearch,isNotification,isNewGroup}= useSelector((state)=>state.misc)
    const {notificationsCount}= useSelector((state)=>state.chat)

    // const [isSearch,setSearch] = useState(false);





    const handleMobile=()=>{
        dispatch(setIsMobile(true));
    }
    const openSearchBox=()=>{
        dispatch(setIsSearch(true));
    }

    const openNewGroup=()=>{
        dispatch(setIsNewGroup(true));
    }

    const notificationHandler=()=>{
        dispatch(SetIsNotification(true))
        dispatch(resetNotificationCount())
    }
    const navigateToGroups=()=>{
        return navigate("/groups")
    }

    const logouthandler= async()=>{
        try {
            
            const {data}=await axios.get(`${server}/api/v1/user/logout`,{
                withCredentials:true,
            })
            dispatch(userNotExist());
            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something Went Wrong")
        }
    }
  return (
    <>
    <Box sx={{flexGrow:1}} height={"4rem"}>
        <AppBar position='static' sx={{
            bgcolor:orange,
        }}>
            <Toolbar>
                <Typography variant='h6' sx={{
                    display:{xs:"none", sm:"block"}
                }}>
                    My Chat
                </Typography>

                <Box sx={{
                    display:{
                        xs:"block",
                        sm:"none"
                    }
                }}>
                <IconButton onClick={handleMobile}>
                    <Typography color={"inherit"}>
                        <MenuIcon/>
                    </Typography>
                </IconButton>
            </Box>
            <Box sx={{
                flexGrow:1
            }}/>
            <Box>
                <Iconbtn title={"Search"} icon={<SearchIcon/>} onClick={openSearchBox}/>
                <Iconbtn title={"New Group"} icon={<AddIcon/>} onClick={openNewGroup}/>
                <Iconbtn title={"Manage Group"} icon={<GroupIcon/>} onClick={navigateToGroups}/>
                <Iconbtn title={"Notifications"} icon={<NotificatonsIcon />} onClick={notificationHandler} value={notificationsCount}/>
                <Iconbtn title={"Logout"} icon={<LogoutIcon/>} onClick={logouthandler}/>
                
                              
            </Box>
            </Toolbar>
        </AppBar>
    </Box>

    {
        isSearch && (
            <Suspense fallback={<Backdrop open/>}>
                <SearchDialogs/>
            </Suspense>
            
        )
    }

    {
        isNotification && (
            <Suspense fallback={<Backdrop open />}>
                <NotificationDialogs/>
            </Suspense>
            )
    }

{
        isNewGroup && (
            <Suspense fallback={<Backdrop open/>}>
                <NewGroupDialogs/>
            </Suspense>
            )
    }




    </>
  )
};

const Iconbtn = ({title,icon,onClick,value})=>{
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
                {
                    value ? <Badge badgeContent={value} color='error'>{icon}</Badge> : icon
                }
            </IconButton>
        </Tooltip>
    )
}

export default Header