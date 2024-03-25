import { type MetaFunction } from "@remix-run/node";
import Feed from "@/components/Feed";
import { CommunityType, MessageType, UserType } from "@/lib/types";
import { useLoaderData } from "@remix-run/react";
import Footer from "@/components/Footer";
import Buy from "@/components/Buy";

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
  const loader: {
    community: CommunityType;
    messages: MessageType[];
    filters: {
      hideArchived: boolean;
      hideNonStarred: boolean;
    };
  } = useLoaderData();
  return (
    <div className=" w-[1000px] p-12 m-auto text-center">
      <h1 className="text-3xl font-bold">Welcome to Lima ticketing ⚡ </h1>
      <p>
        This system mixes 2 paradigms:gamification and AI, to turn email support
        into a fun and engaging experience.try it!
      </p>
      <div>Stats</div>
      Messages left:{" "}
      {
        loader?.messages.filter(
          (m) => m.status === "PENDING" || m.status === "STARRED"
        ).length
      }
      Score:{" "}
      {loader?.messages.filter((m) => m.status === "PUBLISHED").length * 10}
      <Feed
        community={loader?.community}
        filters={{ ...loader?.filters }}
        latestMessages={loader?.messages}
      />
      <Buy />
      <Footer />
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
      text: `Dear Lima, 
      I find this ticketing system and I am intrigued, love the idea, how does it work?
      I use my keybord and the arrow keys to navigate and then what?`,
      creationDate: new Date().toISOString(),
      author: "John Doe",
      channel: "general",
      status: "STARRED",
    },
    {
      messageId: "2",
      communityId: "1",
      text: "Hey this is cool, how does the AI generates the answers?",
      creationDate: new Date().toISOString(),
      author: "Jane Smith",
      channel: "general",
      status: "PENDING",
    },
    {
      messageId: "3",
      communityId: "1",
      text: "Can I look at the previous messages? Can I a create a note for every previous user?",
      creationDate: new Date().toISOString(),
      author: "Alice Johnson",
      channel: "general",
      status: "PENDING",
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
