"use client"
import { getSession } from "../../action"
import { supabase } from "../supabase.js"
import React, { useEffect, useState } from "react"
import bcrypt from "bcryptjs"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ChangePass() {
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmNewPass, setConfirmNewPass] = useState('')
    const [errors, setError] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(null)
    const router = useRouter()

    //handle change password submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        const session = await getSession()
        //console.log("sessionuserId: ", session.userId)
        //console.log(oldPass)
        const { data: data1, error: error1 } = await supabase
            .from("member_info")
            .select()
            .eq("id", session.userId)
            .single()

        if (data1) {
            console.log("Successfully fetched database data")
            const oldPasswordCorrect = await bcrypt.compare(oldPass, data1.password)
            // If old password and new password correct, update user password in hashed text in supabase
            if (oldPasswordCorrect) {
                if (newPass === confirmNewPass) {
                    const hashPass = await bcrypt.hash(newPass, 10);
                    const { data: data2, error: error2 } = await supabase
                        .from("member_info")
                        .update({ 'password': hashPass })
                        .eq("id", session.userId)
                        .select()
                    if (error2) {
                        console.log('error2: ', error2)
                    }
                    console.log("Successfully changed password")
                    router.push("/Marks")
                } else {
                    setError("Confirm new password incorrect")
                }
            } else {
                setError("Old password incorrect")
            }
        }
        if (error1) {
            console.log("error1: ", error1)
        }
    }

    useEffect(() => {
        //Check if user is logged in
        const checkLoginStatus = async () => {
            const session = await getSession();
            if (!session.isLoggedIn) {
                setIsLoggedIn(false)
            } else {
                setIsLoggedIn(true)
            }
        }
        checkLoginStatus()

        const intervalId = setInterval(() => {
            checkLoginStatus();  // Periodic session check
        }, 1000 * 60 * 5);  // Check every 5 minutes

        return () => clearInterval(intervalId);  // Cleanup interval on component unmount
    }, [])

    if (isLoggedIn === null) {
        return <p>Loading...</p>
    }

    if (!isLoggedIn) {
        return (
            <>
                <h1>You are either not logged in or your session has expired!</h1>
                <Link href="/auth">Log in</Link>
            </>
        )
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Change Password
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    onChange={e => setOldPass(e.target.value)}
                                    value={oldPass}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New password</label>
                                <input
                                    type="password"
                                    name="confirm-password"
                                    id="confirm-password"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    onChange={e => setNewPass(e.target.value)}
                                    value={newPass}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm New password</label>
                                <input
                                    type="password"
                                    name="confirm-password2"
                                    id="confirm-password2"
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    onChange={e => setConfirmNewPass(e.target.value)}
                                    value={confirmNewPass}
                                />
                            </div>
                            {errors && <p>{errors}</p>}
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Change Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
