"use client"
import { useState } from "react";
import { supabase } from "../supabase.js";

export default function Signup() {
        const router = useRouter();
        const [id, setid] = useState('');
        const [password, setPassword] = useState('');
        const [name, setName] = useState('');
        const [kelas, setKelas] = useState('')
      
        const handleLogin = async (e) => {
          e.preventDefault();
        try{
          const { data, error } = await supabase
            .from("member_info")
            .insert({ id: {id}, name: {name}, class: {kelas}})
      
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