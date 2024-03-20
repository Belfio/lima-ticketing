export type MessageType = {
  id: string;
  message: string;
  creationDate: string;
  author: string;
  threadId?: string;
  channel: string;
  status:
    | "PENDING"
    | "ARCHIVED"
    | "OPPORTUNITY"
    | "PUBLISHED"
    | "PUBLISHING"
    | "GENERATING";
  answer?: string;
  thread?: string;
};

export type CommunityType = {
  id: string;
  name: string;
  description: string;
  creationDate: string;
};
