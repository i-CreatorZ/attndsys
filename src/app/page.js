import Image from "next/image";
import Login from "../../auth/Login.js";
export default function Home() {
  let session = false;
  return (
    <div>
      {!session && <Login />}
      {session && <div>Home page</div>}
    </div>
  );
}
