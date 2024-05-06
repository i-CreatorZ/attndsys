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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { user, error } = await supabase.auth.signIn({ email, password });
      if (error) {
        throw error;
      }
      // Redirect user to dashboard or any other page after successful login
      router.push('/attendance');
    } catch (error) {
      console.error('Login error:', error.message);
      // Handle login error
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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