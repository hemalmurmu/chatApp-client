import { FileOpen } from '@mui/icons-material';
import React from 'react'
import { transformImage } from '../../lib/features';


const RenderAttachment = (file,url) => {
 switch (file) {
    case "video":
        return <video src={url} preload='"none' width={"200px"} controls/>;
    case "image":
        // console.log(transformImage(url,200))
        return <img src={transformImage(url,200)}
        alt='Attachment'
        height={"200px"}
        width={"200px"}
        style={{
            objectFit:"contain"
        }}
        />;
    case "audio":
        return <audio src={url} preload='"none' controls/>
    
    default:
        return (<FileOpen/>);
 }
}

export default RenderAttachment