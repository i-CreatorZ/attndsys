"use client"
import { useState } from "react"
import {supabase} from "../supabaseClient"
export default function Login() {
    async function signInWithEmail() {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'example@email.com',
          password: 'example-password',
        })
      }
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <div>
            <div>
                <h1>Sign In</h1>
                <form>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
}