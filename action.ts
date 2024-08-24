"use server";

import { sessionOptions, SessionData, defaultSession } from "./lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {supabase} from "./app/supabase.js";
import bcrypt from "bcryptjs";


export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
};

export const login = async (
  prevState: { error: undefined | string },
  formData: FormData,
) => {
  const session = await getSession();
  const formID = formData.get("id") as string;
  const formPassword = formData.get("password") as string;

  // CHECK USER IN THE DB
  // const user = await db.getUser({username,password})
  const {data, error} = await supabase
  .from("member_info")
  .select()
  .eq("id", formID)
  .single()
  if (data){
    const isMatch = await bcrypt.compare(formPassword, data.password)
    console.log(isMatch)
    if (!isMatch) {
      return { error: "Wrong Password!" };
    }

    session.userId = formID;
    session.username = data.name;
    session.type = data.type
    session.class = data.class
    session.marks = data.marks
    session.isLoggedIn = true;

    await session.save();
    redirect("./Marks");
}
else if (!data){
  return { error: "Wrong ID!" };
}
if (error){
  console.log("Error: " + error)
}
};

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/Home");
};

export const signup = async (
  prevState: { error: undefined | string },
  formData: FormData,
) =>{
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const password = formData.get("password") as string
  const confirmPass = formData.get("confirm-password")
  const kelas = formData.get("class") as string


  const {data, error} = await supabase
  .from('member_info')
  .select()
  .eq('id', id)
  .single()
  if (data && data.id === id){
    return {error: "This user has already existed"}
  }
  if (password == confirmPass){
      const hash = await bcrypt.hash(password, 10)
      const { data:data2, error:error2 } = await supabase
      .from('member_info')
      .insert([
        { id:id, name: name, class:kelas, marks:100, password: hash, type:"User" },
      ])
      .select()
      if (data2) {
        const session = await getSession()
        session.userId = id;
        session.username = name;
        session.type = "User";
        session.class = kelas;
        session.marks = 100
        session.isLoggedIn = true;
        await session.save()
        redirect("/Marks")
      }
      if (error2){
        return {error: "Unable to fetch data"}
      }
    }
  else{
    return {error: "Password Incorrect"}
  }
}
