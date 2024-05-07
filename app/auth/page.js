"use client"
// import { useState } from "react"
// import { supabase } from "../supabase.js"
// export default function Login() {
//     async function signInWithEmail() {
//         const { data, error } = await supabase.auth.signInWithPassword({
//             email: email,
//             password: password,
//         })
//     }
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")

//     const  handleChange = (event) => {
// 		setEmail(event.target.value);
//         setPassword(event.target.value);
// 	};
//     return (
//         <div>
//             <form>
//                 <label>Input Value:
//                     <input type="text" value={setEmail} onChange={handleChange} />
//                     <input type="text" value={setPassword} onChange={handleChange} />
//                 </label>
//                 <p>Input Value: {email}</p>
//             </form>
//         </div>

//     );
// }



import { useState } from 'react';
import { supabase } from "../supabase.js";
import { useRouter } from 'next/navigation';


export default function Login() {
  const router = useRouter();
  const [id, setid] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  try{
    const { data, error } = await supabase
      .from("member_info")
      .select('id,  password')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // If user not found
    if (!data) {
      throw new Error('User not found');
    }

    // Compare passwords
    if (data.password === password) {
      // Passwords match, redirect to home page
      router.push('/home'); // Adjust the route as per your setup
    } else {
      throw new Error('Invalid password');
    }
  } catch (error) {
    console.error('Login error:', error.message);
    // Handle login error (e.g., display error message)
  }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="id">ID:</label>
          <input
            id="id"
            value={id}
            onChange={(e) => setid(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}