import type { MetaFunction } from "@remix-run/node";
import { Button } from "@/components/ui/button";
import Feed from "@/components/Feed";
import { CommunityType } from "@/lib/types";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className=" w-[1000px] p-12">
      <h1>Welcome to Remix ci siamo evvai</h1>
      <Button>Click me</Button>
      <Feed
        community={community}
        setWriting={() => {}}
        filters={{ hideArchived: true, hideNonRequests: true }}
      />
    </div>
  );
}

const community: CommunityType = {
  id: "1",
  name: "Community",
  description: "This is a community",
  creationDate: new Date().toISOString(),
};
