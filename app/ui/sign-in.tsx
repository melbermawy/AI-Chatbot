import { Form } from "react-router"

export default function Signin() {


    return (
        <div className="border border-white">
        <Form method="post" action="/api/auth/sign-in">
        <input className="border border-white" name="email" type="email"  placeholder="Enter Email" required />
        <input className="border border-white" name="password" type="password" placeholder="Enter Password" required />
        <button className="border border-white" type="submit">Sign In</button>
        </Form>
        </div>
    )
}