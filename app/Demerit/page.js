
"use client"
import React, { useEffect, useState } from 'react';
import {Form} from '../Merit/page.js'
import { getSession } from '../../action';

export default function Layout(){
  const [html, setHtml] = useState(null)
  useEffect(() =>{
    const checkUserIsAdmin = async () =>{
      const session = await getSession()
      if (session.type !== "Admin"){
        setHtml(
          <>
          <h1>You are not authorized to access this page or your session has expired</h1>
          </>
        )
      }
      else{
        setHtml(
          <>
          <Form database = 'demerit_records' type = "Demerit" type2 = "Deducted" type3 = "-"></Form>
          </>
        )
      }
    }
    checkUserIsAdmin()

    const intervalId = setInterval(() => {
      checkUserIsAdmin();  // Periodic session check
    }, 1000 * 60 * 5);  // Check every 5 minutes
  
    return () => clearInterval(intervalId);  // Cleanup interval on component unmount
  },[setHtml]
)
  return(html)
}
