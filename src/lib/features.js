import moment from "moment";

const fileFormate =(url='')=>{
    const fileExtension = url.split('.').pop();
    if(fileExtension=== "mp4" || fileExtension=== "webm" || fileExtension=== "ogg"){
        return 'video'
    }

    if(fileExtension=== "mp3" || fileExtension=== "wav" ){
        return 'audio'
    }
    if(fileExtension=== "png" || fileExtension=== "jpg" || fileExtension=== "jpeg" || fileExtension=== "gif"){
        return 'image'
    }
    return 'file'
};

const transformImage=(url="",width=100)=>{
    // https://res.cloudinary.com/djvboxq7x/image/upload/dpr_auto/w_200/v1712329179/cf644584-e965-4d10-a625-acc0b337f4e6.jpg

    const newUrl = url.replace("upload/",`upload/dpr_auto/w_${width}/`);
    return newUrl;
}


const getLast7days=()=>{
    const current = moment();
    const last7days = [];
    for(let i=0;i<7;i++ ){
        const dateDay = current.clone().subtract(i,"days");
        const dayName = dateDay.format("dddd");
        last7days.push(dayName);
    }
    return last7days;
}


const getOrsaveFromStorage=({key,value,get})=>{
    if(get) return localStorage.getItem(key) 
        ? JSON.parse(localStorage.getItem(key))
        :null;
    else localStorage.setItem(key,JSON.stringify(value));
}


export {fileFormate,transformImage,getLast7days,getOrsaveFromStorage}