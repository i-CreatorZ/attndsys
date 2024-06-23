'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import {supabase} from '../supabase.js'
import {useRouter} from 'next/navigation'
const GuestType = 'Admin'
const schoolNum = "D5001"
function Authentication() {
  const [member_Details ,setDetails]  = useState([])

if (GuestType === 'User') {
  useEffect(() =>{
    const fetchMemberData = async ()=>{
      const {data, error} = await supabase
        .from("member_info")
        .select()
        .eq("id", schoolNum)
        .single()
      if (error){
        console.log("Member marks error: " + error)
      }
      else if(data){
        setDetails(data)
      }
    }
    fetchMemberData()
  })
  return (
    <tr key= {member_Details.id} >
      <td>{member_Details.id}</td>
      <td>{member_Details.name}</td>
      <td>{member_Details.class}</td>
      <td>{member_Details.merit}</td>
    </tr>
  );
}
else {
  useEffect(() =>{
    const fetchAllMemberData = async ()=>{
      const {data, error} = await supabase
        .from("member_info")
        .select()
  
      if (error){
        console.log("Member marks error: " + error)
      }
      else if(data){
        setDetails(data)
      }
    }
    fetchAllMemberData()
  }),[]
  const detailsList = member_Details.map(person =>
    <tr key={person.id}>
      <td>{person.id}</td>
      <td>{person.name}</td>
      <td>{person.class}</td>
      <td>{person.merit}</td>
      <td><Link
      href = {{
        pathname:'/Merit',
        query:{id:person.id, name: person.name}
      }}
      >Merit</Link></td>
      <td><Link
      href = {{
        pathname:'/Demerit',
        query:{id:person.id, name: person.name}
      }}
      >Demerit</Link></td>
    </tr>
  )
  return (
    detailsList
  )
}
}
function Records({database}) {
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
        const { data, error } = await supabase
          .from(database)
          .select()
          .eq('school_num', schoolNum);

        if (error) {
          console.error("Error fetching records:", error);
          setFetchError(error);
          setRecords(null)
        } 
        else if (data) {
          setRecords(data);
          setFetchError(null)
        }
      } 
      fetchRecords();
    })
   ,[schoolNum];
const recordList = records.map(record => 
  <tr key={record.id}>
    <td>{record.date}</td>
    <td>{record.reason}</td>
    <td>{record.mark}</td>
  </tr>
)
  return (
    recordList
  )
}


function ShowRecord() {

  return (
    GuestType === 'User' &&
    <div>
      <h2 className="flex justify-center">Demerit Records</h2>
      <table className="table-auto border-separate border-spacing-x-5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Reason</th>
            <th>Marks Deducted</th>
          </tr>
        </thead>
        <tbody>
        <Records database = "demerit_records"></Records>
        </tbody>
      </table>
      <h2 className="flex justify-center mt-10">Merit Records</h2>
      <table className="table-auto border-separate border-spacing-x-5">
        <thead>
          <tr>
            <th>Date</th>
            <th>Reason</th>
            <th>Marks Added</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <Records database= "merit_records"></Records>
        </tbody>
      </table>
    </div>
  )
}

export default function Home() {
  console.log(supabase)
    return (
      <><main className="flex min-h-screen flex-col items-center justify-between p-24">
          <table className="table-auto border-separate border-spacing-x-5">
            <thead>
              <tr>
                <th>School Number</th>
                <th>Name</th>
                <th>Class</th>
                <th>Marks</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <Authentication />
            </tbody>
          </table>
          <ShowRecord />
        </main></>
    )
  }
