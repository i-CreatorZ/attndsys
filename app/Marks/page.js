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
function DemeritRecords() {
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const { data, error } = await supabase
          .from('demerit_records')
          .select()
          .eq('id', Member.id);

        if (error) {
          console.error("Error fetching records:", error);
          setFetchError(error);
        } 
        else if (data) {
          setRecords(data);
        }
      } 
      catch (error) {
        console.error("Error fetching records:", error);
        setFetchError(error.message);
      }
    };

    fetchRecords();
  }, [Member]);
  //console.log(53)
  return (
    //{fetchError && <div>Error: {fetchError.message}</div>}
    {records.map(record => (
      <tr key={record.id}>
        <td>{record.date}</td>
        <td>{record.reason}</td>
        <td>{record.marks}</td>
      </tr>
    ))
    }
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
        <DemeritRecords/>
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
