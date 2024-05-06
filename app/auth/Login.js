"use client"
import { useState } from "react"
import { supabase } from "../supabase.js"
export default function Login() {
    async function signInWithEmail() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
    }
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const  handleChange = (event) => {
		setEmail(event.target.value);
        setPassword(event.target.value);
	};
    return (
        <div>
            <form>
                <label>Input Value:
                    <input type="text" value={setEmail} onChange={handleChange} />
                    <input type="text" value={setPassword} onChange={handleChange} />
                </label>
                <p>Input Value: {email}</p>
            </form>
        </div>

    );
}