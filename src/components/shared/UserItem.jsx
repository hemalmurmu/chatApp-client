import { Add as AddIcon,Remove as RemoveIcon } from '@mui/icons-material'
import { Avatar, IconButton, ListItem, Stack, Typography,} from '@mui/material'
import React, { memo } from 'react'
import { transformImage } from '../../lib/features'

const UserItem = ({user,handler,handelerIsLoading,isAdded=false,styling={}}) => {
    const {name,_id,avatar} = user
  return (
    <ListItem>
        <Stack direction={"row"} width={"100%"} alignItems={"center"} spacing={"1rem"} {...styling}>
          
            <Avatar src={transformImage(avatar)}/>
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
                {name}
            </Typography>
            <IconButton onClick={()=>handler(_id)} disabled={handelerIsLoading}
            size='small'
            sx={{
                bgcolor:isAdded? 'error.main':"primary.main",
                color:"white",
                "&:hover": {
                    bgcolor:isAdded? 'error.dark':"primary.dark"
                }
            }}
            >
                {
                    isAdded? <RemoveIcon/>:<AddIcon/>
                }
                
            </IconButton>
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem)