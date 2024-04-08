import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import { Dialog, DialogTitle, InputAdornment, List, ListItem, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncMutation } from '../../hooks/hooks'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api'
import { setIsSearch } from '../../redux/reducers/misc'
import UserItem from '../shared/UserItem'
const Search = () => {
  const dispatch = useDispatch();
  const {isSearch}= useSelector((state)=>state.misc)

  const {user} = useSelector((state)=> state.auth);
  // console.log(user._id)

  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest,isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);


  const search = useInputValidation("");


  const [users, setUsers] = useState([]);


  const addFriendHandler=async(id)=>{
    sendFriendRequest("Sending Friedn request...",{userId:id});
    
  }

  const searchCloseHandler=()=>{
    dispatch(setIsSearch(false))
  }


  useEffect(()=>{
    const timeout = setTimeout(()=>{
      searchUser(search.value).then(({data})=> setUsers(data.searchUsersList.filter((member)=> member._id.toString()!== user._id.toString()))).catch((err)=> console.log(err))
    },1000)
    return ()=>{
      clearTimeout(timeout)
    }
  },[search.value])



  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField label="" value={search.value} variant='outlined' onChange={search.changeHandler} size='small'
        InputProps={{
          startAdornment:(
            <InputAdornment position='start'>
              <SearchIcon/>
            </InputAdornment>
          )
        }}
        />
        <List>
          {users.map((i)=>(
            <ListItem>
              <UserItem key={i._id} user={i} handler={addFriendHandler} handelerIsLoading={isLoadingSendFriendRequest}/>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search