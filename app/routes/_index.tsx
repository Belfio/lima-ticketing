import { type MetaFunction } from "@remix-run/node";
import Feed from "@/components/Feed";
import { CommunityType, MessageType, UserType } from "@/lib/types";
import { useLoaderData } from "@remix-run/react";

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
  const { community, filters, messages } = useLoaderData<typeof loader>();
  return (
    <div className=" w-[1000px] p-12 m-auto text-center">
      <h1 className="text-3xl font-bold">Welcome to Lima ticketing ⚡ </h1>
      <Feed
        community={community}
        filters={{ ...filters }}
        latestMessages={messages}
      />
    </div>
  );
}

export async function loader() {
  // ------------------------------------
  //
  // This is where you load the data for your system (the GET calls to the db)
  // NB. all the POSTs are managed in the API route via html form submits as per Remix guidelines.
  //
  // ------------------------------------

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

  const users: UserType[] = [
    {
      userId: "1",
      name: "John Doe",
      email: "jd@gmail.com",
      creationDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      status: "ACTIVE",
      role: "ADMIN",
      img_url: "https://randomuser.me/api/port",
    },
    {
      userId: "2",
      name: "Jane Smith",
      email: "js@gmail.com",
      creationDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      status: "ACTIVE",
      role: "USER",
      img_url: "https://randomuser.me/api/port",
    },
    {
      userId: "3",
      name: "Alice Johnson",
      email: "aj@gmail.com",
      creationDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString(),
      status: "ACTIVE",
      role: "USER",
      img_url: "https://randomuser.me/api/port",
    },
  ];

  // I like the userProfile to be included in the message object
  const messagesWithUserProfile = messages.map((message) => {
    const userProfile = users.find((user) => user.userId === message.author);
    return { ...message, userProfile };
  });

  return {
    messages: messagesWithUserProfile,
    community,
    filters: {
      hideArchived: false,
      hideNonStarred: false,
    },
  };
}
