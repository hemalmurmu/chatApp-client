import { Skeleton, keyframes, styled } from "@mui/material"
import { Link as LinkedComponent } from "react-router-dom"
import { greyC, matBlack } from "../constants/color"

export const VisuallyHiddenInput = styled("input")({
    boarder:0,
    clip:"rect(0 0 0 0)",
    height:1,
    margin:-1,
    overflow:"hidden",
    padding:0,
    position:"absolute",
    whiteSpace:"nowrap",
    width:1,

})


export const Link =styled(LinkedComponent)`
    text-decoration:none;
    color:inherit;
    &:hover{
        background-color:#f0f0f0;
    }
}`


export const InputBox = styled("input")`
    width:100%;
    height:100%;
    border:none;
    outline:none;
    padding:0 3rem;
    border-radius:1.5rem;
    background-color: ${greyC};
`



export const SearchField=styled("input")`
padding:1rem 3rem;
width:20vmax;
border:none;
outline:none;
border-radius:1.5rem;
background-color: ${greyC};
font-size:1.1rem;
`


export const CurveButton=styled('button')`
border-radius:1.5rem;
padding:1rem 2rem;
border:none;
outline:none;
cursor:pointer;
background-color:${matBlack};
color: white;
font-size:1.1rem;
&:hover {
    background-color:rgba(0,0,0,0.8)
}

`

const Bounce = keyframes`
0%{transform:scale(1);}
50%{transform:scale(1.5);}
100%{transform:scale(1);}
`

export const BouncingSkeleton=styled(Skeleton)(()=>({
    animation: `${Bounce} 1s inflate`
}))