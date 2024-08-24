"use client"

import { useEffect, useState } from "react"
import { logout, getSession } from "../../action"
import Link from "next/link"
import { useRouter } from "next/navigation"


export default function Logout(){
    const [html, setLayout] = useState(null)
    const router = useRouter()
    const handleClick = () =>{
        logout()
        router.push('/Home')
    }
    useEffect(() =>{
        const checkLoginStatus = async () =>{
          const session = await getSession()
          if (!session.isLoggedIn){
            setLayout(
              <>
              <h1>You're session has expired</h1>
              <Link href = "/auth">Login</Link>
              </>
            )
          }
          else{
            setLayout(
              <>
              <button onClick = {handleClick}>Logout</button>
              </>
            )
          }
        }
        checkLoginStatus()
    
        const intervalId = setInterval(() => {
          checkUserIsAdmin();  // Periodic session check
        }, 1000 * 60 * 5);  // Check every 5 minutes
      
        return () => clearInterval(intervalId)
    },[setLayout]
    );  // Cleanup interval on component unmount
    return (
        html
    )
}