import { FileText } from "lucide-react"





const Feature = () => {
  return (
   <div className="pt-6 "> 
    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
        <div className="-mt-6">
            <div>
                <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                    <FileText className="h-6 w-6 text-white"/>
                </span>
            </div>
            <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Organize Effortlessly</h3>
            <p className="mt-5 text-base text-gray-500">
            Connect notes, build knowledge webs, and create a personal system that works for you.
            </p>
        </div>
    </div>
   </div>
)
}

export default Feature