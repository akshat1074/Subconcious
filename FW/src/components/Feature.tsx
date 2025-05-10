import { Brain, FileText,Search,type LucideIcon } from "lucide-react"

interface Featureprops {
     icon: keyof typeof iconComponents;
     title:string;
     subtitle:string
}

const iconComponents={
    FileText:FileText,
    Brain:Brain,
    Search:Search
}


const Feature =({icon,title,subtitle}:Featureprops) => {
    const IconComponent = iconComponents[icon]
  return (
   <div className="pt-6 "> 
    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
        <div className="-mt-6">
            <div>
                <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    < IconComponent className="h-6 w-6 text-white"/>
                </span>
            </div>
            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{title}</h3>
            <p className="mt-5 text-base text-gray-500">
              {subtitle}
            </p>
        </div>
    </div>
   </div>
)
}

export default Feature