import { Brain, Menu, X } from "lucide-react"
import { useState } from "react"
import SideHero from "../components/SideHero";
import Feature from "../components/Feature";


const Home = () => {
     const [isLoggedIn,setIsLoggedIn] = useState(false)
     const [username, setUsername] = useState("");
     const [showLogin, setShowLogin] = useState(false);
     const [showSignup, setShowSignup] = useState(false);
     const [menuOpen, setMenuOpen] = useState(false);
    
     // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  
  // Mock login function
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
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-purple-200">
      <header className="bg-white shadow-sm">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
             <div className="flex items-center">
               <div className="flex flex-shrink-0 items-center">
                   <Brain className="h-8 w-8 text-indigo-600"/>
                   <span className="ml-2 text-2xl font-bold text-indigo-900 font-mono">Subconscious</span>
               </div>
             </div>

                         {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                {isLoggedIn ? (
                  <>
                   <span className="text-gray-700 mr-4">Welcome,{username}</span>
                   <button 
                     onClick={handleLogout}
                     className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent
                      rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                   >Logout</button>
                  </>
                ):(
                  <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="whitespace-nowrap text-base font-medium text-gray-700 hover:text-indigo-600"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign up
                  </button>
                  </>
                )}
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none"
              >
                {menuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 text-gray-700">Welcome, {username}!</div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {setShowLogin(true); setMenuOpen(false);}}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {setShowSignup(true); setMenuOpen(false);}}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    {/* Main Content */}
      <main>
        <div className="pt-10 sm:pt-6 lg:pt-8 lg:pb-14 lg:overflow-hidden">
          <div className="mx-auto max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
            <div className="lg:py-24">
              <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6">
                <span className="block">Your Second Brain for </span>
                <span className="block text-indigo-600">Better Thinking</span>
              </h1>
              <p className="mt-3 text-lgxt-base text-gray-600 sm:mt-5 sm:text-xl lg:text-lg">
                {isLoggedIn 
                  ? `Welcome back,${username}! Continue organizing your thoughts and notes in your personal knowledge base.` 
                  : "Capture,organize,and retrieve your thoughts and notes. Never lose an idea again."}
              </p>
              <div className="mt-10 sm:mt-12">
                {!isLoggedIn? (
                  <div className="sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <button 
                         onClick={()=>setShowSignup(true)}
                         className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md
                          text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                        Get started
                      </button>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                         <button
                           onClick={()=>setShowLogin(true)}
                           className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium round-md
                            text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 ">
                            Log in
                         </button>
                        </div>
                    </div>
                ):(
                  <div className="sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <button className="w-full flex-items-center justify-center  px-8 py-3 border border-transparent 
                      text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                        Go to Dashboard
                      </button>
                      </div>
                    </div>
                )}

              </div>
            </div>
            </div>
            <div className="flex justify-start items-center mb-18 pl-36 ">
            <SideHero />
            </div>
            
            
          </div>
          <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Everything you need for better thinking</p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                Streamline your thinking process and never lose an important idea again.
              </p>
            </div>
            <div className="mt-10 ">
               <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                   <Feature
                     icon='Brain'
                     title="Capture Ideas Instantly"
                     subtitle="Quickly note down your thoughts wherever you are. No more lost ideas or forgotten insights."
                     />
                   
                   
                   
                   <Feature
                     icon='FileText'
                     title="Organize Effortlessly"
                     subtitle="Connect notes, build knowledge webs, and create a personal system that works for you."
                     />

                   <Feature
                     icon='Search'
                     title="Find Anything Fast"
                     subtitle=" Powerful search and connections help you rediscover your ideas exactly when you need them."/>  
                     
               </div>
            </div>
            </div>
        </div>
        </div>
        </div>
      </main>
    </div>
  )
}

export default Home