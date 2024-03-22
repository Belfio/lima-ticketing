import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Button } from "@/components/ui/button";
import Feed from "@/components/Feed";
import { CommunityType, MessageType } from "@/lib/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Lima ticketing system" },
    {
      name: "description",
      content: "A gamified AI powered ticketing system you would love to use.",
    },
  ];
};

export default function Index() {
  return (
    <div className=" w-[1000px] p-12 m-auto text-center">
      <h1 className="text-3xl font-bold">Welcome to Lima ticketing ⚡ </h1>
      <Feed
        community={community}
        filters={{ hideArchived: true, hideNonStarred: true }}
        messages={messages}
      />
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  return {};
}

const community: CommunityType = {
  communityId: "1",
  name: "Community",
  description: "This is a community",
  creationDate: new Date().toISOString(),
  settings: {
    traininng: {
      status: "PENDING",
      lastTrainingDate: new Date().toISOString(),
    },
  },
};

const messages: MessageType[] = [
  {
    messageId: "1",
    communityId: "1",
    text: "Hello world!",
    creationDate: new Date().toISOString(),
    author: "John Doe",
    channel: "general",
    status: "PENDING",
  },
  {
    messageId: "2",
    communityId: "1",
    text: "How are you?",
    creationDate: new Date().toISOString(),
    author: "Jane Smith",
    channel: "general",
    status: "PENDING",
  },
  {
    messageId: "3",
    communityId: "1",
    text: "Nice to meet you!",
    creationDate: new Date().toISOString(),
    author: "Alice Johnson",
    channel: "general",
    status: "STARRED",
  },
  {
    messageId: "4",
    communityId: "1",
    text: "Nice to meet you!",
    creationDate: new Date().toISOString(),
    author: "Alice Johnson",
    channel: "general",
    status: "PENDING",
  },
];
