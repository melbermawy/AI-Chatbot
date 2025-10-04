import { useState } from "react"
import { authClient } from "~/auth-client"

export default function Signin() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

   async function handleSignIn(e: React.FormEvent) {
       e.preventDefault();
       await authClient.signIn.email({ email, password, callbackURL: "/" })
   }


   return (
       <div className="bg-yellow">
       <form onSubmit={handleSignIn} className="flex flex-row gap-5 p-5 rounded-2xl ">
       <input className="border border-white" name="email" type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} required />
       <input className="border border-white" name="password" type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} required />
       <button className="border border-white" type="submit">Sign In</button>
       </form>
       </div>




   )

}