
"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import {supabase} from '../supabase.js'
import { useSearchParams } from 'next/navigation';
import {getSession} from "../../action"

export function Form({database, type, type2,type3}) {
    const [com_name, setName] = useState('')
    const [mark,setMarks] = useState(0)
    const [reason,setReason] = useState('')
    const [date,setdate] = useState(new Date())
    const [submit, setSubmit] = useState(false)
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const name = searchParams.get('name')
    const router = useRouter()
    console.log("id: " + id + " name: " + name)
    const handleSubmit = async (e) =>{
      e.preventDefault()

      const { data, error } = await supabase
      .from(database)
      .insert([
        { school_num: id, name: name, date: date, reason: reason, mark:mark, com_name: com_name },
      ])
      .select()
        if (error){
          console.log("Error: " + error)
        }
        else if (data){
          setSubmit(true)
          const {data: data2, error: error2} = await supabase
          .from("member_info")
          .select("marks")
          .eq("id",id)
          .single()
        if (data2){
          const originalMark = data2.marks
          //console.log("originalMark: " + typeof originalMark + " mark: " + typeof mark)
          let newMark = 0;
          {type3 === "+" ? newMark = (originalMark + mark): newMark = originalMark - mark}
          const {data:data3, data:error3} = await supabase
            .from("member_info")
            .update({'marks': newMark})
            .eq("id", id)
            .select()
          if (error3){
            console.log("Error 3: " + error3)
          }
        }
        else if (error2){
          console.log("Error 2: " + error2)
        }
        }


    }
    return( submit ? 
      <>
      <h3>Form submitted</h3>
      <button onClick = {() => router.push("/Marks")}> return to page</button>
      </>
    :
    <form onSubmit = {handleSubmit}>
      <div className="space-y-12 ml-10">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                Committee Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                  onChange = {(e) => setName(e.target.value)}
                  value = {com_name}
                />
              </div>
            </div>
            <br/>
            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                Reason of {type}
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  onChange = {(e) => setReason(e.target.value)}
                  value = {reason}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>
            <br/>
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                Marks {type2}
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required 
                  min = "0"
                  max = "100"
                  onChange = {(e) => setMarks(+(e.target.value))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6 mr-10">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Save
        </button>
      </div>
    </form>
    )}

  export default function Layout(){
    const [html, setHtml] = useState(null)
    useEffect(() =>{
      const checkUserIsAdmin = async () =>{
        const session = await getSession()
        if (session.type !== "Admin"){
          setHtml(
            <>
            <h1>You are not authorized to access this page or your session has expired.</h1>
            </>
          )
        }
        else{
          setHtml(
            <>
            <Form database = "merit_records" type = "Merit" type2 = "Added" type3 = "+"></Form>
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