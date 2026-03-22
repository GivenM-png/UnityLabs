import { useState } from "react";
import Login from "./Login"
import Signup from "./Signup";

const LandingForm = () => {

  const [activeComponent, setActiveComponent] = useState("signup");

  return (

    <div className="w-full h-screen bg-gradient-to-br from-[#000C40] to-[#4c6470] flex-col flex justify-center items-center ">
      <div className="flex p-3 justify-between items-center">
        <button className="m-7 w-25 h-5 bg-blue-300 px-2 py-7 items-center justify-center flex rounded-2xl text-white font-medium cursor-pointer" onClick={() => setActiveComponent("signup")}>Sign up</button>
        <button className="m-7 w-25 h-5 bg-blue-300 px-2 py-7 items-center justify-center flex rounded-2xl text-white font-medium cursor-pointer" onClick={() => setActiveComponent("Login")}>Login</button>
      </div>
      <div className="justify-center items-center">
        {activeComponent === "signup"?  <Signup/> : <Login/> }
      </div>
    </div>

  )
}

export default LandingForm
