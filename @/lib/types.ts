export type MessageType = {
  messageId: string;
  communityId: string;
  text: string;
  creationDate: string;
  author: string;
  threadId?: string;
  channel: string;
  link?: string;
  status:
    | "PENDING"
    | "ARCHIVED"
    | "STARRED"
    | "PUBLISHED"
    | "PUBLISHING"
    | "GENERATING";
  answer?: MessageType;
  thread?: MessageType[];
};

export type CommunityType = {
  communityId: string;
  name: string;
  description: string;
  creationDate: string;
  settings: {
    traininng: {
      status: "PENDING" | "TRAINING" | "TRAINED";
      lastTrainingDate: string;
    };
  };
};
