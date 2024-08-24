import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?:string;
  username?:string;
  type?:string
  class?:string
  marks?:number
  isLoggedIn:boolean
}

export const defaultSession:SessionData = {
  isLoggedIn:false
}

export const sessionOptions: SessionOptions ={
  password: process.env.SECRET_KEY!,
  cookieName: "i-CreatorZ User Session",
  cookieOptions:{
    httpOnly:true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
  }
}