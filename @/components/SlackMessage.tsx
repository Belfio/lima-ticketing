import type { ReactNode } from "react";
import React from "react";
import { NavLink, useFetcher } from "@remix-run/react";
import { CornerDownLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import EmojiConvertor from "emoji-js";
import { cn } from "@/lib/utils";
import type { MessageType } from "@/lib/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SlackMessageProps {
  message: MessageType;
  children: ReactNode;
  focus: boolean;
  focusAnswer: boolean;
  onClick: () => void;
  back: () => void;
}

const SlackMessage: React.FC<SlackMessageProps> = ({
  message,
  focus,
  focusAnswer,
  children,
  onClick,
  back,
}) => {
  const date = new Date(message.creationDate);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const PMAM = hour > 12 ? "PM" : "AM";
  const time = `${hour > 12 ? hour - 12 : hour}:${
    minutes < 10 ? "0" + minutes : minutes
  } ${PMAM}`;

  const fetcher = useFetcher();
  // a message should be highlighted if it's an opportunity and has no thread messages OR if contains thread_messages and the last one is ananswered
  const isHighlighted = () => {
    if (message.status === "ARCHIVED") {
      return false;
    }

    if (!message.thread) {
      return message?.status === "OPPORTUNITY";
    }

    return false;
  };

  return (
    <div
      className={cn(
        `mt-4 w-full border-solid border-2 border-transparent hover:border-solid hover:border-gray-300 hover:bg-white rounded-md p-2 transition-all `,
        focus ? "border-solid border-gray-300 bg-white shadow-md " : ""
      )}
    >
      <div className={`flex items-center justify-between w-full`}>
        <button
          className={`flex items-start w-[80%]`}
          onClick={onClick}
          type="button"
        >
          <div
            className={`w-8 sm:w-12 items-start text-left  ${
              !isHighlighted() && "opacity-30"
            }`}
          >
            <Avatar className="rounded-md w-8 h-8 sm:w-12 sm:h-12">
              <AvatarImage />
              <AvatarFallback>{String("user"[0]).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-2 w-full">
            <div
              className={`flex items-baseline ${
                !isHighlighted() && "opacity-30"
              }`}
            >
              <div className="font-bold text-sm sm:text-base">
                {/* {message?.userProfile?.first_name || "user"} */}
              </div>
              {message?.channel && (
                <div className="ml-2 text-gray-500 text-xs">
                  #{message?.channel}
                </div>
              )}
              {message.link && (
                <div className="ml-1 text-gray-500 text-xs hover:underline w-[11px] h-[10px] ">
                  <NavLink to={message.link} target="_blank">
                    <ExternalLink className="w-[11px] h-[12px]" />
                  </NavLink>
                </div>
              )}
              <div className="ml-2 text-gray-500 text-xs">{time}</div>
            </div>
            <div
              className={`mt-0 text-gray-600 text-sm  ${
                !isHighlighted() && "opacity-60"
              }`}
            >
              {!focusAnswer && message?.text.length > 260
                ? parsedText(message?.text.slice(0, 260) + "...")
                : parsedText(message?.text)}
            </div>
          </div>
        </button>
        <div
          className={`flex w-[20%] justify-end text-right ${
            focus ? "block" : "hidden"
          }`}
        >
          {focusAnswer && (
            <>
              <Button
                variant="ghost"
                className="text-gray-500 font-bold text-xs bg-white shadow-sm"
                onClick={back}
              >
                Back
                <div className="border-solid border-gray-500 border-[1px] rounded-md p-1 ml-1 w-[32px] h-[24px] text-center">
                  <span className="w-[24px] h-[14px] font-normal text-xs text-gray-500 ">
                    Esc
                  </span>
                </div>
              </Button>
            </>
          )}
          {!focusAnswer && (
            <>
              {(message?.status === "PENDING" ||
                message?.status === "PUBLISHED") && (
                <div className=" flex justify-end">
                  <fetcher.Form
                    method="post"
                    id="opportinityForm"
                    action="/feed"
                    className="flex items-center"
                  >
                    <Button
                      variant="ghost"
                      className="text-gray-500 bg-white font-bold text-xs flex items-center shadow-sm"
                      onClick={onClick}
                    >
                      Enter
                      <div className="border-solid border-gray-500 border-[1px] rounded-md p-1 ml-1">
                        <CornerDownLeft className="w-[14px] h-[14px]" />
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-500 font-bold text-xs bg-white shadow-sm"
                      name="button"
                      value="ARCHIVE"
                      onClick={() => {
                        if (message?.answer)
                          return (message.status = "ARCHIVED");
                      }}
                    >
                      Archive
                      <div className="border-solid border-gray-500 border-[1px] rounded-md p-1 ml-1 w-[24px] h-[24px] text-center">
                        <span className="w-[14px] h-[14px] font-normal ">
                          A
                        </span>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-500 font-bold text-xs bg-white shadow-sm"
                      name="button"
                      value={
                        message.status === "OPPORTUNITY"
                          ? "NONRELAVANT"
                          : "RELEVANT"
                      }
                    >
                      {message.status === "OPPORTUNITY"
                        ? "Irrelevant"
                        : "Relevant"}
                      <div className="border-solid border-gray-500 border-[1px] rounded-md p-1 ml-1 w-[24px] h-[24px] text-center">
                        <span className="w-[14px] h-[14px] font-normal ">
                          R
                        </span>
                      </div>
                    </Button>

                    <input
                      type="hidden"
                      name="creationDate"
                      value={String(message.creationDate)}
                    />
                  </fetcher.Form>
                </div>
              )}
              {message?.status === "ARCHIVED" && (
                <>
                  <fetcher.Form
                    method="post"
                    id="opportinityForm"
                    action="/feed"
                  >
                    <Button
                      variant="ghost"
                      className="text-gray-500 font-bold text-xs bg-white shadow-sm"
                      name="button"
                      value="UNARCHIVE"
                      onClick={() => {
                        if (message?.answer)
                          return (message.status = "PENDING");
                      }}
                    >
                      Unarchive
                      <div className="border-solid border-gray-500 border-[1px] rounded-md p-1 ml-1 w-[24px] h-[24px] text-center">
                        <span className="w-[14px] h-[14px] font-normal ">
                          U
                        </span>
                      </div>
                    </Button>
                    <input
                      type="hidden"
                      name="creationDate"
                      value={String(message.creationDate)}
                    />
                  </fetcher.Form>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {focusAnswer && <motion.div>{children}</motion.div>}
    </div>
  );
};

export default SlackMessage;

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
