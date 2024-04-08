import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import UserItem from "../shared/UserItem"
import { useAsyncMutation, useErrors } from '../../hooks/hooks';
import { useAddMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/misc';

const AddMemberDialog = ({chatId}) => {


  const {isAddMember} = useSelector((state)=> state.misc)
  const dispatch = useDispatch();
  const [addMember,isLoadingAddMember] = useAsyncMutation(useAddMembersMutation)

  const {isLoading,data,isError,error} = useAvailableFriendsQuery(chatId)



 

  const [SelectMembers, setSelectedMembers] = useState([]);

  

  const selectMemberHandler=(id)=>{
    setSelectedMembers((prev)=>prev.includes(id)? prev.filter((currentItem)=> currentItem!==id) :[...prev,id])
  }
 
 
 
  const addMemberSubmitHandler=()=>{
    addMember("Adding Members...",{
      members:SelectMembers,
      chatId
    })
    closeHandler();
  }
  const closeHandler=()=>{
    dispatch(setIsAddMember(false))
  }



  useErrors([{isError,error}])
  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
        {isLoading?(<Skeleton/>) :
        data?.friends?.length>0 ?
          (data?.friends?.map((i)=>(
            <UserItem key={i.id} user={i} handler={selectMemberHandler} isAdded={SelectMembers.includes(i._id)}/>
          ))):(
            <Typography textAlign={"center"}>No Friends</Typography>
          )
        }
        </Stack>
       
        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
        <Button color='error' onClick={closeHandler}>Cancle</Button>
        <Button onClick={addMemberSubmitHandler} variant='contained' disabled={isLoadingAddMember}>Submit Changes</Button>
        </Stack>
        
      </Stack>
    </Dialog>
  )
}

export default AddMemberDialog