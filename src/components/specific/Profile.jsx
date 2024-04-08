import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import {Face as FaceIcon, AlternateEmail as UserNameIcon, CalendarMonth as CalenderIcon} from '@mui/icons-material'
import moment from 'moment';
import { transformImage } from '../../lib/features';

const Profile = ({user}) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar sx={{
        width:200,
        height:200,
        objectFit:"contain",
        marginBottom:"1rem",
        border:"5px solid white",
      }} src={transformImage(user?.avatar?.url,500)}/>
      <ProfileCard heading={"Bio"} text={user?.bio}/>
      <ProfileCard heading={"Username"} text={user.username} Icon={<UserNameIcon/>}/>
      <ProfileCard heading={"Name"} text={user.name} Icon={<FaceIcon/>}/>
      <ProfileCard heading={"Joined"}  Icon={<CalenderIcon/>} text={moment(user?.createdAt).fromNow()}/>
    </Stack>
  )
}

const ProfileCard=({text,Icon,heading})=> {
  return (
    <Stack 
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
    >
      {
        Icon && Icon
      }

      <Stack>
        <Typography variant='body1'>
          {text}
        </Typography>
        <Typography color={"grey"} variant='caption'>{heading}</Typography>
      </Stack>

    </Stack>
  )
}

export default Profile