import { useInputValidation } from '6pp'
import { Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampelUsers } from '../../components/constants/sample'
import UserItem from "../shared/UserItem"
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNewGroup } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'
const NewGroup = () => {

  const {isNewGroup}= useSelector((state)=>state.misc)
  const dispatch = useDispatch();
  const {isError,error,isLoading,data} = useAvailableFriendsQuery();

  const [newGroup,isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)







  const groupName = useInputValidation("");
  // const [members,setMembers] = useState(sampelUsers);
  const [SelectMembers, setSelectedMembers] = useState([]);




  const errors=[{
    isError,
    error
  }]
  useErrors(errors)


  const selectMemberHandler=(id)=>{
    setSelectedMembers((prev)=>prev.includes(id)? prev.filter((currentItem)=> currentItem!==id) :[...prev,id])
  }


  
  const submitHandler=()=>{
    if(!groupName.value) return toast.error("Group name is Required");
    if(SelectMembers.length<2) return toast.error("Group less the 3 members can't be created");

    newGroup("Greating New Group...",{name:groupName.value,members:SelectMembers});
    closeHandler();
  }
  const closeHandler=()=>{
    dispatch(setIsNewGroup(false))
  }
  return (
    
    <Dialog open={isNewGroup} onClose={closeHandler}>
    <Stack padding={{xs: "1rem", sm:"2rem"}} width={"25rem"} spacing={"2rem"}>
      <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>
      <TextField label={"Group Name"} value={groupName.value} onChange={groupName.changeHandler}/>
      <Typography>
        Members
      </Typography>
      <Stack>
      {isLoading?(<Skeleton/>) : data?.friends.map((i)=>(
            <ListItem>
              <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={SelectMembers.includes(i._id)}/>
            </ListItem>
          ))}
      </Stack>
      <Stack direction={"row"} justifyContent={"space-evenly"}>
        <Button variant="outlined" color='error' onClick={closeHandler}>Cancel</Button>
        <Button variant='contained' onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button>
      </Stack>
    </Stack>
  </Dialog>
  )
}

export default NewGroup