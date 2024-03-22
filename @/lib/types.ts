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
  userProfile?: UserType;
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

export type UserType = {
  userId: string;
  name: string;
  email: string;
  creationDate: string;
  lastLoginDate: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  role: "USER" | "ADMIN";
  img_url: string;
};
