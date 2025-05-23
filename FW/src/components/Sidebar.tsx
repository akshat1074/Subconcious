import { Brain, FileText, NotebookTabsIcon, Youtube } from "lucide-react";
import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./Sidebaritem";

export function Sidebar(){
    return <div className="h-screen bg-slate-100  w-72 fixed left-0 top">
         <div className="flex text-2xl pt-8 pl-4 items-center"> 
         <Brain className="h-12 w-12 text-indigo-600"/>
         <span className="ml-2 text-3xl font-bold text-indigo-900 font-mono">Subconscious</span>
         </div>
         <div className="pt-8 pl-4 gap-4">
              <SidebarItem text="Twitter" icon={<TwitterIcon/>}/>
              <SidebarItem text="Youtube" icon={<Youtube className="w-6 h-6"/>}/>
              <SidebarItem text="Notes" icon={<FileText/>}/>
         </div>
    </div>
}