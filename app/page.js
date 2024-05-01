'use client'
import { useRouter } from 'next/navigation'

const GuestType = 'User'
const details = [{
  id : "D6661",
  Name : "Chang Hua keat",
  Class : "2SK1",
  Marks : "100",
}, 
{
  id : "D6666",
  Name : "Chang Hua keat",
  Class : "2SK1",
  Marks : "10",
}]

function Authentication(){
  const router = useRouter()
  if (GuestType === 'User'){
    const Member = details.filter(person =>
      person.id === "D6661"
  )[0]
  return(
    <tr key = {Member.id} >
      <td>{Member.id}</td>
      <td>{Member.Name}</td>
      <td>{Member.Class}</td>
      <td>{Member.Marks}</td>
    </tr>
  );
  }
  else{
  const detailsList = details.map(person =>
  <tr key = {person.id}>
  <td>{person.id}</td>
  <td>{person.Name}</td>
  <td>{person.Class}</td>
  <td>{person.Marks}</td>
  <td><button onClick = {() => router.push('/Merit')}>Merit</button></td>
  <td><button onClick = {() => router.push('/Demerit')}>Demerit</button></td>
</tr>
)
  return (
    detailsList
  )
  }
}

function ShowRecord(){
  return (
    GuestType === 'User' && 
    <div>
    <h2 className = "flex justify-center">Demerit Records</h2>
    <table className ="table-auto border-separate border-spacing-x-5">
      <thead>
        <tr>
          <th>Date</th>
          <th>Reason</th>
          <th>Marks Deducted</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th></th>
        </tr>
      </tbody>
    </table>
    <h2 className = "flex justify-center mt-10">Merit Records</h2>
    <table className ="table-auto border-separate border-spacing-x-5">
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
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <table className ="table-auto border-separate border-spacing-x-5">
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
  <Authentication/>
  </tbody>
</table>
<ShowRecord/>
    </main>
  );
}
