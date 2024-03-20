import React, { useEffect } from "react";
import EmojiConvertor from "emoji-js";
import { CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageType } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SlackMessageProps {
  messages: MessageType[];
}

const parsedText = (raw: string) => {
  const urlRegex = /<([^|>]+)\|([^>]+)>/g;
  const boldRegex = /\*([^*]+)\*/g;
  const emoji = new EmojiConvertor();
  emoji.replace_mode = "unified";
  emoji.allow_native = true;

  const text = raw
    .replace(urlRegex, '<a href="$1">$2</a>')
    .replace(boldRegex, "<strong>$1</strong>")
    .split("\n")
    .map((paragraph, index) => (
      <p
        key={index}
        dangerouslySetInnerHTML={{ __html: emoji.replace_colons(paragraph) }}
      />
    ));

  return text;
};

const SlackMessageThread: React.FC<SlackMessageProps> = ({ messages }) => {
  const [msgs, setMsgs] = React.useState<MessageType[]>(messages);
  useEffect(() => {
    setMsgs(messages);
  }, [messages]);
  return (
    <div
      className={cn(
        `mt-4 border-solid border-2 border-transparent  rounded-md p-2`,
        ""
      )}
    >
      <div>
        {msgs.map((message, index) => (
          <div
            key={String("thread" + index)}
            className={`flex items-center justify-between w-full`}
          >
            <div className="w-12 h-[18px] flex justify-end">
              {index === 0 && (
                <CornerDownRight className="w-[18px] h-[18px] font-normal text-gray-500" />
              )}
            </div>
            <div className="w-[18px] h-[18px] ml-1 items-start text-left">
              <Avatar className="rounded-md w-[18px] h-[18px] ">
                <AvatarImage />
                <AvatarFallback>
                  {String("user"[0]).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-2 w-full">
              <div className="flex items-baseline">
                <div className="font-bold text-xs sm:text-xs">
                  {/* {message?.userProfile?.first_name || "user"}: */}
                </div>

                {/* <div className="ml-2 text-gray-500 text-xs">{time}</div> */}
                <div className="mt-0 text-gray-600 text-xs ml-1">
                  {parsedText(message?.text)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlackMessageThread;
