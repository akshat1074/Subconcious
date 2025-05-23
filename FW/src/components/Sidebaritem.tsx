import { ReactElement } from "react";

export function SidebarItem({text,icon}:{
    text:string;
    icon:ReactElement;
}){
    return <div className=" gap-2 flex text-gray-700 py-2 cursor-pointer hover:bg-gray-200 rounded w-64 pl-4 transition-all duration-150">
        <div className="pr-2">
            {icon}
        </div>
        <div>
            {text}
        </div>
    </div>
}