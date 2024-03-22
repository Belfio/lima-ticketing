import { ActionFunctionArgs, redirect } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const json = Object.fromEntries(formData);
  console.log(json);
  return redirect("/");
}

export default function Index() {
  return "Hello this is API stuff";
}
