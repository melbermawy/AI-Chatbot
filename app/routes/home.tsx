import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { useLoaderData, redirect, type LoaderFunctionArgs } from "react-router";
import { auth } from "../auth.server";
import Signup from "../ui/sign-up"
import Signin from "../ui/sign-in"
// Import or define authClient
import { authClient } from "../auth-client";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession({
    headers: request.headers, 
  });
  return { session };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { data, isPending, error } = authClient.useSession()
   if (data) {
    return <div>Hello, {data.user.email}!</div>
  } else {
    return <div className="p-1.5 m-1.5">
      <h1>Please Sign up</h1>
      <Signup />
    </div>
  }
}
