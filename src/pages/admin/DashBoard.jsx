import { useFetchData } from "6pp"
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material'
import { Box, Container, Paper, Skeleton, Stack, Typography } from '@mui/material'
import moment from 'moment'
import React from 'react'
import { server } from '../../components/constants/config'
import AdminLayout from '../../components/layout/AdminLayout'
import { DoughnutChart, LineChart } from '../../components/specific/Charts'
import { CurveButton, SearchField } from '../../components/styles/StyledComponent'
import { useErrors } from "../../hooks/hooks"

const DashBoard = () => {

  const {loading,data,error} = useFetchData(`${server}/api/v1/admin/stats`,"dashBoard-stats")
  const  {stats}  = data || {}
  useErrors([{
    isError:error,
    error:error
  }])


  
  const AppBar=(
    <Paper elevation={3} sx={{
      padding:"2rem",
      margin:"2rem 0",
       borderRadius:"2rem"
    }}>
      <Stack direction={"row"}>
        <AdminPanelSettingsIcon sx={{
          fontSize:"3rem"
        }}/>
        <SearchField/>
        <CurveButton>Search</CurveButton>
        <Box flexGrow={1}/>
        <Typography display={{
          xs:'none',
          lg:"block"
        }}
        color={"rgba(0,0,0,0.7)"} 
        textAlign={"center"}
        >
          {moment().format("dddd, D MMMM YYYY")}
        </Typography>
        <NotificationsIcon/>
      </Stack>
      </Paper>
  );
  
  const Widgets = <Stack direction={{
    xs:"column",
    sm:"row"
  }}
  spacing={"2rem"}
  justifyContent="space-between"
  alignItems={"center"}
  margin={"2rem 0"}
  >
    <Widget title={"User"} value={stats?.usersCount}  Icon={<PersonIcon/>}/>
    <Widget title={"Chats"} value={stats?.totalChatCount} Icon={<GroupIcon/>}/>
    <Widget title={"Messages"} value={stats?.messagesCount} Icon={<MessageIcon/>}/>
  </Stack>
  
  return (

    <AdminLayout>
      {
        loading? <Skeleton height={"100vh"}/> :(
          <Container component={"main"}>
        {AppBar}
        <Stack direction={"row"} flexWrap={"wrap"} sx={{
          gap:"2rem"
        }}>
          <Paper elevation={3} sx={{
            width:"100%",
            padding:"2rem 3.5rem",
            maxWidth:"40rem",
            borderRadius:"1rem",
          }}>
            <Typography margin={"2rem 0"} variant='h4'>{" "}Last Messages</Typography>
            
            <LineChart dataArray={stats?.messageChart || []}/>




          </Paper>
          <Paper
           elevation={3}
           sx={{
            padding:"1rem",
            borderRadius:"1rem",
            display:"flex",
            alignItems:"center",
            width:{
              xs:"100%",
              sm:"50%",
            },
            position:"relative",
            width:"100%",
            maxWidth:"25rem",
           }}
          >
            

            <DoughnutChart labels={["Single Chats","Group chats"]} dataArray={[stats?.totalChatCount-stats?.groupsCount || 0,stats?.groupsCount || 0]}/>

            <Stack position={"absolute"} direction={"row"} justifyContent={"center"} alignItems={"center"} spacing={"0.5rem"} width={"100%"} height={"100%"}>
              <GroupIcon/>
              <Typography>
                Vs
              </Typography>
              <PersonIcon/>
            </Stack>
          </Paper>
        </Stack>

        {
          Widgets
        }
      </Container>
        )
      }
    </AdminLayout>
  )
}

const Widget=({title,value,Icon})=>{
  return (
  <Paper elevation={3} sx={{
    padding:"2rem",
    margin:"2rem 0",
    borderRadius:"1rem",
    width:"20rem"
  }}>
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
      sx={{
        color:"rgbs(0,0,0,0.7)",
        borderRadius:"50%",
        border:"5px solid rgba(0,0,0,0.9)",
        width:"5rem",
        height:"5rem",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}
      >{value}</Typography>
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        {Icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
    
  </Paper>
  )
}

export default DashBoard