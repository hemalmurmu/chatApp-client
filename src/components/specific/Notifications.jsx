import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { SetIsNotification } from '../../redux/reducers/misc'

const Notifications = () => {
  const dispatch = useDispatch()
  const {isNotification} = useSelector((state)=> state.misc)

  const {isLoading,data,error,isError}= useGetNotificationsQuery()
 


  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation)

  const friendRequestHandler=async({_id,accept})=>{
    dispatch(SetIsNotification(false));
    await acceptRequest("Accepting...",{requestId:_id,accept})
    
  }

  const onClosehandler=()=>{
    dispatch(SetIsNotification(false))
  }
  useErrors([{error,isError}])
  return (
    <Dialog open={isNotification} onClose={onClosehandler}>
      <Stack padding={{xs: "1rem", sm:"2rem"}} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading? (<Skeleton/>):(<>
          {
         data?.allRequest.length >0 ? 
         <>
         {data?.allRequest.map(({sender,_id})=><NotificationItem sender={sender} _id={_id} handler={friendRequestHandler} />)}
         </>:<Typography textAlign={"center"}>0 Notifications</Typography>
        }
        </>)}
      </Stack>
    </Dialog>
  )
}

const NotificationItem=memo(({sender,_id,handler})=>{

  const {name,avatar} = sender;
  return (
    <ListItem>
        <Stack direction={"row"} width={"100%"} alignItems={"center"} spacing={"1rem"}>
            <Avatar />
            <Typography 
            variant='body1'
            sx={{
                flexGrow:1,
                display:"-webkit-box",
                WebkitLineClamp:1,
                WebkitBoxOrient:"vertical",
                overflow:"hidden",
                textOverflow:"ellipsis"
            }}
            >
                {`${name} send you a friend request`}
            </Typography>
            <Stack direction={{
              xs:'column',
              sm:"row"
            }}>
              <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
              <Button color='error' onClick={()=>handler({_id,accept:false})}>Reject</Button>
            </Stack>
        </Stack>
    </ListItem>
  )
})

export default Notifications