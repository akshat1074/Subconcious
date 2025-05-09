import { LogIn } from 'lucide-react'
import { useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Input } from '../components/Input';

const Login = () => {
  const usernameRef = useRef<HTMLInputElement|null>(null);
  const passwordRef = useRef<HTMLInputElement|null>(null);
  const navigate = useNavigate();

  async function signin() {
      const username =usernameRef.current?.value;
      const password = passwordRef.current?.value;
      const response = await axios.post(BACKEND_URL+"/api/v1/signin",{

         username,
         password
      })

      const jwt = response.data.token;
      localStorage.setItem("token",jwt)
      navigate("/dashboard")

    }
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username1, setUsername] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  
    const handleLogin = (e:any) => {
        e.preventDefault();
        setIsLoggedIn(true);
        setUsername(loginEmail.split('@')[0]); // Use part of email as username
        setShowLogin(false);
        setLoginEmail("");
        setLoginPassword("");
      };
      
      // Mock signup function
      const handleSignup = (e:any) => {
        e.preventDefault();
        setIsLoggedIn(true);
        setUsername(signupName);
        setShowSignup(false);
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
      };
      
      // Mock logout function
      const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername("");
      };
    
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0  opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <LogIn className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Log in to your account</h3>
                  <div className="mt-2">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">
                          Email address
                        </label>
                        <div className="mt-1">
                        <Input reference={usernameRef} placeholder="Username"/>
                        <Input reference={passwordRef} placeholder="Password"/>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 text-left">
                          Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                          </label>
                        </div>

                        <div className="text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                          </a>
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Log in
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default Login