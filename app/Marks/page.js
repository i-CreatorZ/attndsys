'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase.js';
import { getSession } from "../../action";

function UserType() {
  const [member_Details, setDetails] = useState([]);

  useEffect(() => {
    const fetchMemberData = async () => {
      const session = await getSession()     
      if (session.type === 'User') {
         setDetails(session)
      } else {
        const fetchAllMemberData = async () => {
          const { data, error } = await supabase
            .from("member_info")
            .select();

          if (error) {
            console.log("Member marks error: " + error);
          } else if (data) {
            setDetails(data);
          }
        };
        fetchAllMemberData();
      }
    };
    fetchMemberData();
  }, [setDetails]);

  if (member_Details.type === 'User') {
    return (
      <tr key={member_Details.userId}>
        <td>{member_Details.userId}</td>
        <td>{member_Details.username}</td>
        <td>{member_Details.class}</td>
        <td>{member_Details.marks}</td>
      </tr>
    );
  } else {
    const detailsList = member_Details.map(person => (
      <tr key={person.id}>
        <td>{person.id}</td>
        <td>{person.name}</td>
        <td>{person.class}</td>
        <td>{person.marks}</td>
        <td>
          <Link
            href={{
              pathname: '/Merit',
              query: { id: person.id, name: person.name },
            }}
          >
            Merit
          </Link>
        </td>
        <td>
          <Link
            href={{
              pathname: '/Demerit',
              query: { id: person.id, name: person.name },
            }}
          >
            Demerit
          </Link>
        </td>
      </tr>
    ));
    return detailsList;
  }
}

function Records({ database }) {
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      const session = await getSession();
      const { data, error } = await supabase
        .from(database)
        .select()
        .eq('school_num', session.userId);

      if (error) {
        console.error("Error fetching records:", error);
        setFetchError(error);
        setRecords(null);
      } else if (data) {
        setRecords(data);
        setFetchError(null);
      }
    };
    fetchRecords();
  },[database, setFetchError, setRecords]);

  const recordList = records.map(record => (
    <tr key={record.id}>
      <td>{record.date}</td>
      <td>{record.reason}</td>
      <td>{record.mark}</td>
    </tr>
  ));

  return recordList;
}

function ShowRecord() {
  const [htmlReturn, setReturn] = useState(null)
  useEffect(() => {
    const showrecord = async () =>{
      const session = await getSession();
      console.log(session.type)
       if  (session.type === 'User' ){
        return(
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
                <Records database="demerit_records" />
              </tbody>
            </table>
            <h2 className="flex justify-center mt-10">Merit Records</h2>
            <table className="table-auto border-separate border-spacing-x-5">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Marks Added</th>
                </tr>
              </thead>
              <tbody>
                <Records database="merit_records" />
              </tbody>
            </table>
          </div>
        )
      }
    }
    setReturn(showrecord())
    }, [setReturn])
    return htmlReturn
  }

export default function Marks() {
  const [html, setLayout] = useState(null)
  useEffect(() =>{
    const checkLoginStatus = async () =>{
      const session = await getSession();
      if (!session.isLoggedIn){
        setLayout(
          <>
          <h1>
            You are either not logged in or your session has expired!
          </h1>
          <Link href = "/auth">Log in</Link>
          </>
        )
      }
      else{
        setLayout(
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
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
              <UserType />
            </tbody>
          </table>
          <ShowRecord />
        </main>
        )
      }
    }
    checkLoginStatus()

    const intervalId = setInterval(() => {
      checkLoginStatus();  // Periodic session check
    }, 1000 * 60 * 5);  // Check every 5 minutes
  
    return () => clearInterval(intervalId);  // Cleanup interval on component unmount
  }, [setLayout])
  return (html);
}

