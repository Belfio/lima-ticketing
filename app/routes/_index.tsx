import {
  redirect,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
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

// Vorrei che fosse "really presentable" quindi mi servono un paio di animazioni
// e un codice pulito, una struttura che permetta a chiunque di utilizzare il sito.

// 1 - Concetto iniziale è che sia semplice
// 2 - Veloce ed efficace
// 3 - Abbia una possibilità di essere usato?
// 4 - Polling for new messages
// 5 -
// Ricominciare il discorso di lavoro con AI

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const json = Object.fromEntries(formData);
  console.log(json);
  return redirect("/");
}

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
