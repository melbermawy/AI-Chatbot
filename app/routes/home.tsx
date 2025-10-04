import type { Route } from "./+types/home";
import { Link } from "react-router"
import { Welcome } from "../welcome/welcome";
import { useLoaderData, redirect, type LoaderFunctionArgs } from "react-router";
import { auth } from "../auth.server";
import Signup from "../ui/sign-up"
import Signin from "../ui/sign-in"
import FixturesList from "./FixturesList"
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
    return <FixturesList />
  } else {
    return <div className="p-1.5 m-1.5">
      <h1>Please Sign up or Sign in</h1>
      <Signup />
      <Signin />
    </div>
  }
}
