import React, { useCallback, useEffect, useRef, useState } from 'react'
import Applayout from '../components/layout/Applayout'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { greyC,orange} from '../components/constants/color';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponent';
import FileMenu from '../components/dialogs/FileMenu';
import MessageComponents from '../components/shared/MessageComponents';
import { getSocket } from '../socket';
import { ALERT, CHAT_JOINED, CHAT_LEFT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../components/constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { sockethandler, useErrors } from '../hooks/hooks';
import {useInfiniteScrollTop} from "6pp"
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeMessagesAlert } from '../redux/reducers/chat';
import {TypingLoader} from "../components/layout/Loaders"
import { useNavigate } from 'react-router-dom';


const Chats = ({chatId,user}) => {

  const containerRef = useRef(null);
  const bottomRef = useRef(null)
  const socket = getSocket();
  const dispatch = useDispatch();

  const nevigate = useNavigate();

  const [message,SetMessage] = useState("");
  const [messages,setMessages] = useState([]);
  const [page,setPage] = useState(1);
  const [fileAnchore,setFileAnchore]=useState(null)


  const [typing,setTyping] =useState(false);
  const [otherTyping,setOtherTyping] = useState(false);
  const typingtimeout = useRef(null);
  



  const chatDetails=useChatDetailsQuery({chatId,skip:!chatId});
  const oldMessagesChunk = useGetMessagesQuery({chatId, page})
  const {data:oldMessages,setData:setOldMessages} = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalpages,
    page,
    setPage,
    oldMessagesChunk.data?.message
    );

    const errors = [
      {isError:chatDetails.isError,error:chatDetails.error},
      {isError:oldMessagesChunk.isError,error:oldMessagesChunk.error}
    ]
  const members = chatDetails?.data?.chat?.members



  const messageOnChange=(e)=>{
    SetMessage(e.target.value);
    if(!typing){
      socket.emit(START_TYPING,{members,chatId})
      setTyping(true);
    }
    if(typingtimeout.current) clearTimeout(typingtimeout.current);
    typingtimeout.current=setTimeout(()=>{
      socket.emit(STOP_TYPING,{members,chatId});
      setTyping(false);
    },[2000])
    
  }
 


  const submitHandler=(e)=>{
    e.preventDefault()
    if(!message.trim()){
      return;
    }

    socket.emit(NEW_MESSAGE,{chatId,members,message});
    SetMessage("");
  }

  const handleFileOpen=(e)=>{
    dispatch(setIsFileMenu(true));
    setFileAnchore(e.currentTarget)
  }


  useEffect(()=>{
    
    socket.emit(CHAT_JOINED,{userId:user._id,members});
    dispatch(removeMessagesAlert(chatId))
   
    return ()=>{
      setMessages([]);
      SetMessage("");
      setOldMessages([]);
      setPage(1)
      socket.emit(CHAT_LEFT,{userId:user._id,members})
    }
  },[chatId])


  useEffect(()=>{
    if(bottomRef.current) 
      bottomRef.current.scrollIntoView({behaviour:"smooth"})
  },[messages]);



  useEffect(()=>{
    if(chatDetails.isError) return nevigate("/")
  },[chatDetails.isError])





  const newMessageFun =useCallback((data)=>{
   
    if(data.chatId !== chatId) return;
    setMessages((prev)=> [...prev,data.message])
   
  },[chatId])


  const startTypingListner =useCallback((data)=>{
    if(data.chatId !== chatId) return;
    setOtherTyping(true)
  },[chatId])

  const stopTypingListner =useCallback((data)=>{
    if(data.chatId !== chatId) return;
    setOtherTyping(false)
  },[chatId])


  const alertListner= useCallback((data)=>{
    if(data.chatId) return;
    const messageAlert = {
            content:data.message,
            sender:{
                _id:"ibweikkngwe",
                name:"Admin",
            },
            chat:chatId,
            createdAt: new Date().toISOString(),

    }

    setMessages((prev=>[...prev,messageAlert]))
  },[chatId])

  const eventArr ={[ALERT]: alertListner,[NEW_MESSAGE]: newMessageFun,[START_TYPING]: startTypingListner,[STOP_TYPING]:stopTypingListner}

  sockethandler(socket,eventArr)
  useErrors(errors)

  const allMessages =[...oldMessages,...messages]
  return chatDetails.isLoading?(<Skeleton/>)
  :
  (
    <>
    <Stack ref={containerRef} 
    boxSizing={"border-box"}
    padding={"1rem"}
    spacing={"1rem"}
    bgcolor={greyC}
    height={"90%"}
    sx={{
      overflowX:"hidden",
      overflowY:"auto"
    }}
    >
      {
        allMessages.map((i)=>(
          <MessageComponents user={user} message={i} key={i._id}/>
        ))
      }
      {otherTyping && <TypingLoader/>}
      <div ref={bottomRef}/>
    </Stack>
      <form style={{  
        height:"10%",
      }} onSubmit={submitHandler}>
        <Stack direction={"row"} height={"100%"} alignItems={"center"} padding={"1rem"} position={"relative"}>
          <IconButton sx={{
            position:"absolute",
            left:"1.5rem"
          }} onClick={handleFileOpen}>
            <AttachFileIcon />
          </IconButton>


          <InputBox placeholder='Message' value={message} onChange={messageOnChange}/>

        <IconButton type='submit' sx={{
          bgcolor:orange,
          color:'white',
          marginLeft:"1rem",
          padding:'0.5rem',
          "&:hover":{
            bgcolor:"error.dark"
          }

        }}>
          <SendIcon/>
        </IconButton>
        </Stack>

      </form>
      
      <FileMenu anchorEl={fileAnchore} chatId={chatId}/>
    </>
  )
}

export default Applayout()(Chats);


