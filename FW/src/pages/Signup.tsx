import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import { Input } from "../components/Input";
import { LogIn } from "lucide-react";

export function Signup(){
    const usernameRef = useRef<HTMLInputElement|null>(null);
    const passwordRef = useRef<HTMLInputElement|null>(null);
    const navigate = useNavigate();

    async function signup() {
        const username=usernameRef.current?.value;
        const password=passwordRef.current?.value;
        await axios.post(BACKEND_URL+"/api/v1/signup",{
            username,
            password
        })
        navigate("/signin")
        alert("You have signed up")
        
    }

    return <div className="fixed z-10 inset-0 -top-100 ">
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
       <div className="fixed  transition-opacity" aria-hidden="true">
          <div className="static  opacity-75"></div>
       </div>
       <span className="hidden sm:inline-block sm:middle sm:h-screen" aria-hidden="true"></span>
       <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
        <div>
            <div  className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
            <LogIn className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Sign Up to your account</h3>
            <div className="mt-3">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left pb-2">
                          Username
                        </label>
            <Input reference={usernameRef} placeholder="Username" type="text"/>
            </div>
            <div className="mt-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left pb-2">
                          Password
                        </label>
              <Input reference={passwordRef} placeholder="Password" type="password"/>
            </div> 
            <div className="mt-5 sm:mt-6">
            <button
                      onClick={signup}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Sign Up
                    </button>
                    <div className="py-4">
                
                <button
                  
                   onClick={()=>navigate('/')}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Cancel
                </button>
                </div>
                </div>

            
            </div>
        </div>
       </div>
    </div>
  </div>

}