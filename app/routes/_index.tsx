import type { MetaFunction } from "@remix-run/node";
import { Button } from "@/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className=" w-[1000px] p-12">
      <h1>Welcome to Remix </h1>
      <Button>Click me</Button>
    </div>
  );
}
