import React, { useState } from 'react'
import {Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography} from '@mui/material'
import {CameraAlt as CameraIcon} from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponent';
import {useFileHandler, useInputValidation,useStrongPassword} from '6pp'
import { usernameValidator } from '../utils/validators';
import axios from 'axios';
import { server } from '../components/constants/config';
import { useDispatch } from 'react-redux';
import { userExist } from '../redux/reducers/auth';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin,setIsLogin] = useState(true);

  const [isLoading,setIsLoading] = useState(false);

  const toggle=()=>{
    setIsLogin(!isLogin);
  }

  const name = useInputValidation("",);
  const bio = useInputValidation("");
  const password = useStrongPassword();
  const username = useInputValidation("",usernameValidator);

  const avatar = useFileHandler("single");
  const dishpatch = useDispatch();

  const handleLogin=async(e)=>{
    e.preventDefault();

    setIsLoading(true)
    const toastId=toast.loading("logging In...")
    const config={
      withCredentials:true,
      headers:{
        "Content-Type":"application/json"
      }
    };
    try {
      const {data}=await axios.post(`${server}/api/v1/user/login`,{
        username:username.value,
        password:password.value
      },config
      )


      dishpatch(userExist(data.user));
      toast.success(data.message,{id:toastId});
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong",{
        id:toastId
      })
    }finally{
      setIsLoading(false)
    }
  }


  

  const handleSignin=async(e)=>{
    e.preventDefault();
    const toastId=toast.loading("Signing up...")
    setIsLoading(true)
    const formData = new FormData();
    formData.append("avatar",avatar.file);
    formData.append("name",name.value);
    formData.append("bio",bio.value);
    formData.append("username",username.value);
    formData.append("password",password.value);

    const config={
      withCredentials:true,
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }

    try {
      const {data} = await axios.post(`${server}/api/v1/user/new`,formData,config);
      

      dishpatch(userExist(data.user));
      toast.success(data.message,{
        id:toastId
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong",{
        id:toastId
      })
    }finally{
      setIsLoading(false)
    }

  }



  return (
    <div style={{
      backgroundImage:"linear-gradient(#93A5CF,#E4EfE9)"
    }}>
    <Container component={"main"} maxWidth="xs" sx={{
      height:"100vh",
      display:"flex",
      justifyContent:'center',
      alignItems:'center',

    }}>
      <Paper elevation={3}
      sx={{
        padding:4,
        display:'flex',
        flexDirection:"column",
        alignItems:"center",
      }}
      >
        {
          isLogin ? 
          (<>
          <Typography variant='h5'>Login</Typography>
          <form style={{width:'100%',marginTop:'1rem'}} onSubmit={handleLogin}>
          <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler}/>
          <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' value={password.value} onChange={password.changeHandler}/>
          <Button sx={{
            marginTop:"1rem"
          }} variant='contained' color='primary' type='submit' fullWidth disabled={isLoading}>Login</Button>
          <Typography textAlign={'center'} m={"1rem"}>OR</Typography>
          <Button sx={{
            marginTop:"1rem"
          }}fullWidth variant='text' onClick={toggle} disabled={isLoading}>Sign-up</Button>
          </form>
          
          </>):(
          <>
          <Typography variant='h5'>Sign Up</Typography>
          <form style={{width:'100%',marginTop:'1rem'}} onSubmit={handleSignin}>

            <Stack position={'relative'} width={"10rem"} margin={"auto"}>
              <Avatar 
              src={avatar.preview}
              sx={{
                width:"10rem",
                height:"10rem",
                objectFit:"contain"
              }}/>
               {
            avatar.error && (
            <Typography color="error" variant='caption' margin="1rem">
              {avatar.error}
            </Typography>
            )
          }
              <IconButton
              component="label"
               sx={{
                position:"absolute",
                bottom:"0",
                right:"0",
                color:"white",
                bgcolor:"rgba(0,0,0,0.5)",
                ":hover":{
                  bgcolor:"rgba(0,0,0,0.7)"
                },
              }}>
                
                <>
                <CameraIcon/>
                <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
                </>
              </IconButton>
            </Stack>
          <TextField required fullWidth label="Name" margin='normal' variant='outlined' value={name.value} onChange={name.changeHandler}/>
          <TextField fullWidth label="Bio" margin='normal' variant='outlined' value={bio.value} onChange={bio.changeHandler}/>
          <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler}/>
          {
            username.error && (
            <Typography color="error" variant='caption'>
              {username.error}
            </Typography>
            )
          }
          <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' value={password.value} onChange={password.changeHandler}/>
          {
            password.error && (
            <Typography color="error" variant='caption'>
              {password.error}
            </Typography>
            )
          }
          <Button sx={{
            marginTop:"1rem"
          }} variant='contained' color='primary' type='submit' fullWidth disabled={isLoading}>SIGN UP</Button>
          <Typography textAlign={'center'} m={"1rem"}>OR</Typography>
          <Button sx={{
            marginTop:"1rem"
          }}fullWidth variant='text' onClick={toggle} disabled={isLoading}>LOGIN</Button>
          </form>
          </>
          )
        }

      </Paper>
    </Container>
    </div>
    
  )
}

export default Login