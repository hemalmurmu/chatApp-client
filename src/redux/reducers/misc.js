import { createSlice } from "@reduxjs/toolkit";



const initialState ={
    isNewGroup:false,
    isAddMember:false,
    isNotification:false,
    isMobile:false,
    isSearch:false,
    isFileMenu:false,
    isDeleteMenu:false,
    uploadingLoader:false,
    selectedDeletChat:{
        chatId:"",
        groupChat:false,
    }
}

const miscSlice = createSlice({
    name:"misc",
    initialState,
    reducers:{
        setIsNewGroup:(state,action)=>{
            state.isNewGroup= action.payload
        },
        setIsAddMember:(state,action)=>{
            state.isAddMember= action.payload
        },
        SetIsNotification:(state,action)=>{
            state.isNotification= action.payload
        },
        setIsMobile:(state,action)=>{
            state.isMobile= action.payload
        },
        setIsSearch:(state,action)=>{
            state.isSearch= action.payload
        },
        setIsFileMenu:(state,action)=>{
            state.isFileMenu= action.payload
        },
        setIsDeleteMenu:(state,action)=>{
            state.isDeleteMenu= action.payload
        },
        setUploadingLoader:(state,action)=>{
            state.uploadingLoader= action.payload
        },
        setSelectedDeletChat:(state,action)=>{
            state.selectedDeletChat= action.payload
        },
        
    }
})


export default miscSlice;
export const{
    setIsNewGroup,
    setIsAddMember,
    SetIsNotification,
    setIsMobile,
    setIsSearch,
    setIsFileMenu,
    setIsDeleteMenu,
    setUploadingLoader,
    setSelectedDeletChat
} = miscSlice.actions;