'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import {supabase} from '../supabase.js'
const GuestType = 'User'
const details = [{
  id: "D6661",
  Name: "Chang Hua keat",
  Class: "2SK1",
  Marks: "100",
},
{
  id: "D6666",
  Name: "Chang Hua keat",
  Class: "2SK1",
  Marks: "10",
}]
const Member = details.filter(person =>
  person.id === "D6661"
)[0]

function Authentication() {
  const router = useRouter()
  if (GuestType === 'User') {
    return (
      <tr key={Member.id} >
        <td>{Member.id}</td>
        <td>{Member.Name}</td>
        <td>{Member.Class}</td>
        <td>{Member.Marks}</td>
      </tr>
    );
  }
  else {
    const detailsList = details.map(person =>
      <tr key={person.id}>
        <td>{person.id}</td>
        <td>{person.Name}</td>
        <td>{person.Class}</td>
        <td>{person.Marks}</td>
        <td><button onClick={() => router.push('/Merit')}>Merit</button></td>
        <td><button onClick={() => router.push('/Demerit')}>Demerit</button></td>
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
          .eq('school_num', Member.id);

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
   ,[Member];
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
  const router = useRouter();
  const handleRedirect = () => {
    router.push('/Attendance');
  };
    return (
      <><div>
        <button onClick={handleRedirect}>Go to Attendance</button>
      </div><main className="flex min-h-screen flex-col items-center justify-between p-24">
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
