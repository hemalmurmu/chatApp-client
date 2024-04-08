import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon,Menu as MenuIcon } from '@mui/icons-material';
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import React, { Suspense, lazy, memo, useEffect, useState } from 'react';
import { matBlack } from '../components/constants/color';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Link} from "../components/styles/StyledComponent";
import AvatarCard from '../components/shared/AvatarCard';
import {sampelUsers, sampleChats} from "../components/constants/sample"
import UserItem from '../components/shared/UserItem';
import { useAddMembersMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hooks';
import { LayoutLoader } from '../components/layout/Loaders';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';

const ConfirmDialogue=lazy(()=>import('../components/dialogs/ConfirmDialogue'));
const AddMemberDialog=lazy(()=>import('../components/dialogs/AddMemberDialog'));


const Groups = () => {


  
  const chatId = useSearchParams()[0].get("group");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {isAddMember} = useSelector((state)=> state.misc)

  const myGroups =  useMyGroupsQuery("")

  const groupDetails = useChatDetailsQuery({chatId,populate:true},{
    skip: !chatId
  })




  const [updategroup,isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
  const [removeMember,isLoadingRemoveMember] = useAsyncMutation(useRemoveMemberMutation)
  const [deleteGroup,isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)
 
  // const members = groupDetails?.data?.chat?.members || []

  const [isMobileOpen,setIsMobileOpen] = useState(false);
  const [isEdit,setIsEdit]=useState(false);

  const [groupName,setGroupName] = useState("");
  const [groupNameUpdateValue,setGroupNameUpdateValue]=useState("");
  const [confirmDeleteDialoge,setConfirmDeleteDialoge]=useState(false);
  const [members,setMembers] =useState([]);



  const errors=[{
    isError: myGroups.isError,
    error: myGroups.error
  },
  {
    isError: groupDetails.isError,
    error: groupDetails.error
  }
]


  useErrors(errors);
  
  useEffect(()=>{
    const groupData = groupDetails?.data
    if(groupData){
      setGroupName(groupData?.chat.name)
      setGroupNameUpdateValue(groupData?.chat.name)
      setMembers(groupData?.chat.members)
    }
    

    return()=>{
      setGroupName("")
      setGroupNameUpdateValue("")
      setMembers("")
      setIsEdit(false)
    }
  },[groupDetails.data])

  
  const navigateBack=()=>{
    navigate('/');
  }
  const handleMobile=()=>{
    setIsMobileOpen((prev=>!prev))
  }

  const handleMobileClose=()=>{
    setIsMobileOpen(false); 
  }

  const updateGroupNameHandler=()=>{
    setIsEdit(false);
    updategroup("Updating Group Name",{chatId,name: groupNameUpdateValue})
  }

  const openConfirmDeletehandler=()=>{
    setConfirmDeleteDialoge(true);

  }

  const closeConfirmDeletehandler=()=>{
    setConfirmDeleteDialoge(false);
    
  }

  const openAddMemberHandler=()=>{
    dispatch(setIsAddMember(true))
  }


  const deleteHandler=()=>{
    deleteGroup("Deleting Group", chatId);
    closeConfirmDeletehandler();
    navigate("/groups");
    // navigate("/groups")
  }

  const removeMemberHandler=(userId)=>{
    removeMember("Removing Members...",{
      chatId,
      userId,
    })
  }


  useEffect(()=>{
    if(chatId){
      setGroupName(`Group Chat ${chatId}`);
      setGroupNameUpdateValue(`Group Chat ${chatId}`)
    }
    

    return ()=>{
      setGroupName("");
      setGroupNameUpdateValue("");
      setIsEdit(false);
    }
  },[chatId])



  const ButtonGroup=(
    <Stack direction={{
      sm:"row",
      xs:"column-reverse",
    }}
    spacing={"1rem"}
    p={{
      xs:"0",
      sm:"1rem" , 
      md:'1rem 4rem'
    }}
    >
      <Button size='large' color='error' variant='outlined' startIcon={<DeleteIcon/>} onClick={openConfirmDeletehandler}>Delete Group</Button>
      <Button size='large' startIcon={<AddIcon/>} variant='contained' onClick={openAddMemberHandler}>Add Member</Button>
    </Stack>
  )


  const GroupName=(
  <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} padding={"1rem"}>
    {isEdit? 
    <>
    <TextField value={groupNameUpdateValue} onChange={(e)=> setGroupNameUpdateValue(e.target.value)} disabled={isLoadingGroupName}/>
    <IconButton onClick={updateGroupNameHandler}>
      <DoneIcon/>
    </IconButton>
    </>:
    <>
    <Typography variant='h4'>
      {groupName}
      </Typography>
      <IconButton disabled={isLoadingGroupName} onClick={()=> setIsEdit(true)}><EditIcon/></IconButton>
    </>}
  </Stack>
  )




  const IconBtn=(
  <>
  <Box sx={{
    display:{
      xs:'block',
      sm:"none",
      position:'fixed',
      right:"1rem",
      top:"1rem"
    }
  }}>
    <IconButton onClick={handleMobile}>
    <MenuIcon />
  </IconButton>
    
  </Box>

  <Tooltip title="back">
    <IconButton sx={{
      position:"absolute",
      top:"2rem",
      left:"2rem",
      bgcolor:matBlack,
      color:"white",
      ":hover":{
        bgcolor:"rgba(0,0,0,0.7)"
      }
    }} onClick={navigateBack}>
      <KeyboardBackspaceIcon/>
    </IconButton>
  </Tooltip>
  </>)
  return myGroups.isLoading ? 
  <LayoutLoader/> :
   (
    <Grid container height={"100vh"}>
      <Grid item sx={{
        display:{
          xs:"none",
          sm:"block",
        },
    }} sm={4}  >
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Grid>
      <Grid item xs={12} sm={8} sx={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        position:"relative",
        padding:"1rem 2rem"
      }}>

        {
          IconBtn
        }
        {
          groupName && <>
          {GroupName}
          <Typography 
          margin={"2rem"}
          alignSelf={"flex-start"}
          variant='body1'
          >
            Members
          </Typography>
          <Stack
          maxWidth={"45rem"}
          width={"100%"}
          boxSizing={"border-box"}
          padding={{
            sm:"1rem",
            xs:"0",
            md:'1rem 4rem'
          }} 
          spacing={"2rem"}
          height={"50vh"}
          overflow={"auto"}
          >
            {/* Members */}
            { isLoadingRemoveMember? (<CircularProgress/>):

             (members? members.map((i)=>(
                <UserItem user={i} isAdded styling={{
                  boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",
                  padding:"1rem 2rem",
                  borderadius:"1rem"
                }} handler={removeMemberHandler} key={i._id}/>
              )):[])
            }
          </Stack>
          {ButtonGroup}
          </>
        }
      </Grid>

      {
        isAddMember && (
          <Suspense fallback={<Backdrop open/>}>
            <AddMemberDialog chatId={chatId}/>
          </Suspense>
        )
      }

      {
        confirmDeleteDialoge && (
          <Suspense fallback={<Backdrop/>}>
            <ConfirmDialogue open={confirmDeleteDialoge} handleClose={closeConfirmDeletehandler} deleteHandler={deleteHandler}/>
          </Suspense>
        )
      }




      <Drawer open={isMobileOpen} onClick={handleMobileClose} sx={{
         display:{
          xs:"block",
          sm:"none",
        }
      }}> <GroupList w={"50vw"} myGroups={myGroups?.data?.groups} chatId={chatId}/></Drawer>
    </Grid>
  )
}

const GroupList=({w="100%",myGroups=[],chatId})=>(
  <Stack width={w} sx={{
    backgroundImage:"linear-gradient(#93A5CF,#E4EfE9)",
    height:"100vh"
  }}>
    {myGroups.length>0 ?( myGroups.map((group)=><GroupListItem group={group} chatId={chatId} key={group._id}/>)):(<Typography>No Groups</Typography>)}
  </Stack>
)

 
const GroupListItem=memo(({group,chatId})=>{
  const {name,avatar,_id} = group;
  return( <Link to={`?group=${_id}`} onClick={e=>{
    if(chatId===_id) e.preventDefault();
  }}>
  <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} sx={{
    marginBottom:"1rem",
    padding:"1.5rem"
  }}>
    <AvatarCard avatar={avatar}/>
    <Typography>{name}</Typography>
  </Stack>
  </Link>)
})

export default Groups;