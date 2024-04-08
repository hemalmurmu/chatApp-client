import { Close as CloseIcon, Dashboard as DashBoardicon, ExitToApp as ExitToAppIcon, Group as GroupIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcion } from '@mui/icons-material';
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as LinkComponent, Navigate, useLocation } from 'react-router-dom';
import { adminLogout } from '../../redux/thunks/admin';


const Link = styled(LinkComponent)`
text-decoration:none;
border-radius: 2rem;
padding: 1rem 2rem;
color: black;
&:hover{
    color:rgba(0,0,0,0.54);
}
`;

const adminTabs = [
    {
    name:"Dash Board",
    path:"/admin/dashboard",
    icon:<DashBoardicon/>
},
{
    name:"Users",
    path:"/admin/users",
    icon:<ManageAccountsIcon/>
},
{
    name:"Chats",
    path:"/admin/chats",
    icon:<GroupIcon/>
},
{
    name:"Messages",
    path:"/admin/messages",
    icon:<MessageIcion/>
},
]


const SideBar=({w="100%"})=>{
    const location = useLocation();
    const dispatch = useDispatch()

    const logoutHandler=()=>{
        dispatch(adminLogout())
    }
    return(
       <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
        <Typography variant='h4' textTransform={"uppercase"}>Chat App admin</Typography>
        <Stack spacing={"1rem"} >
            {
                adminTabs.map((i)=>(
                    <Link key={i.path} to={i.path} sx={
                        location.pathname==i.path &&{
                            bgcolor:'black',
                            color:"white",
                            ":hover": {
                                color:"white"
                            }
                        }
                    }>
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            {i.icon}
                            <Typography>{i.name}</Typography>
                        </Stack>
                    </Link>
                ))
            }
             <Link onClick={logoutHandler}>
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            <ExitToAppIcon/>
                            <Typography>Logout</Typography>
                        </Stack>
                    </Link>
        </Stack>
       </Stack>
    )
}




const AdminLayout = ({children}) => {

    const [isMobile,setIsMobile] = useState(false);
    const {isAdmin} = useSelector((state)=> state.auth)
    const dispatch = useDispatch();

    const handleMobile=()=>{
        setIsMobile(!isMobile);
    }
    const handleClose=()=>{
        setIsMobile(false);
    }
    if(!isAdmin){
        return <Navigate to={"/admin"}/>
    }
  return (
    <Grid container minHeight={"100vh"}>
        <Box sx={{
            display:{
                xs:"block", md:"none"
            },
            position:"fixed",
            right:"1rem",
            top:"1rem",

        }}>
            <IconButton onClick={handleMobile}>
            {
                isMobile? <CloseIcon/>: <MenuIcon/>
            }
            </IconButton>
           

        </Box>
        <Grid item md={4} lg={3} 
        sx={{
            display:{
                xs:"none",
                md:"block"
            } }}
            >
            <SideBar/>  
        </Grid>
        <Grid item xs={12}
        md={8}
        lg={9}
        sx={{
            bgcolor: '#f5f5f5'
        }}
        >
            {children}
            
        </Grid>
        <Drawer open={isMobile} onClose={handleClose}>
            <SideBar w="50vw"/>
        </Drawer>
        
    </Grid>
  )
}

export default AdminLayout