'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase.js';
import { useSearchParams } from 'next/navigation';


function UserType() {
  const router = useRouter()
  const [member_Details, setDetails] = useState([]);
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const type = searchParams.get('type')
  console.log("type: ", type)
  console.log("id: ", id)
  useEffect(() => {
    const fetchMemberData = async () => {
      if (type === 'User') {
        const { data, error } = await supabase
          .from("member_info")
          .select()
          .eq("id", id)
          .single();

        if (error) {
          console.log("Member marks error: " + error);
        } else if (data) {
          setDetails(data);
        }
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
  }, [id, type]);

  if (type === 'User') {
    return (
      <tr key={member_Details.id}>
        <td>{member_Details.id}</td>
        <td>{member_Details.name}</td>
        <td>{member_Details.class}</td>
        <td>{member_Details.merit}</td>
      </tr>
    );
  } else {
    const detailsList = member_Details.map(person => (
      <tr key={person.id}>
        <td>{person.id}</td>
        <td>{person.name}</td>
        <td>{person.class}</td>
        <td>{person.merit}</td>
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
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from(database)
        .select()
        .eq('school_num', id);

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
  }, [id, database]);

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
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  return (
    type === 'User' && (
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
  );
}

export default function Marks() {
  return (
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
  );
}

