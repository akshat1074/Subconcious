import { useEffect, useState } from "react"
import { useContent } from "../hooks/useContent"
import { Sidebar } from "../components/Sidebar";
import { CreateContentModal } from "../components/CreateContentModal";
import { Button } from "../components/Button";
import { PlusIcon } from "../icons/PlusIcon";
import { BACKEND_URL } from "../config";
import { ShareIcon } from "../icons/ShareIcon";
import Card from "../components/Card";
import axios from "axios";



export function Dashboard(){
    const [modalOpen,setModalOpen] = useState(false)
    const {contents,refresh} = useContent();

    useEffect(()=>{
        refresh();
    },[modalOpen])

  
    return <div>
        <Sidebar/>
        <div className="p-4 ml-72 min-h-screen bg-slate-200 ">
            <CreateContentModal open={modalOpen} onClose={()=>{
                setModalOpen(false)
            }}/>
         <div className="flex justify-end gap-4">
            <Button onClick={()=>{
                setModalOpen(true)
            }} variant="primary" text="Add content" startIcon={<PlusIcon/>}>
             </Button>
             <Button onClick={async () =>{
                const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`,{
                    share:true
                },{
                    headers:{
                        "Authorization":localStorage.getItem("token")
                    }
                });
                const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
                alert(shareUrl);
             }} variant="secondary" text="Share brain" startIcon={<ShareIcon/>}>

             </Button>

         </div>
         <div className="flex gap-4 flex-wrap pt-4">
         
         {contents.map(({type, link, title}) => <Card 
            type={type}
            link={link}
            title={title}
            />)}
         </div>
          
        </div>
    </div>


}
