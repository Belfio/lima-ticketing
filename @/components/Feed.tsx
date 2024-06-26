import { useEffect, useState } from "react";
import { useNavigate, useFetcher, useRevalidator } from "@remix-run/react";
import { cn } from "@/lib/utils";
import DialogPublish from "./DialogPublish";
import { CommunityType, MessageType } from "@/lib/types";
import DialogTrainBot from "./DialogTrainBot";
import Controller from "./Controller";
import FeedUI from "./FeedUI";
import KeyboardController from "./KeyboardController";
import FeedPlaceholder from "./FeedPlaceholder";

export default function Feed({
  className,
  notActive,
  latestMessages = [],
  community,
}: // filters,
{
  className?: string;
  notActive?: boolean;
  latestMessages?: MessageType[];
  community: CommunityType;
  filters: {
    hideArchived: boolean;
    hideNonStarred: boolean;
  };
}) {
  const [isInit, setInit] = useState(false);
  const [msgIndex, setIndex] = useState(-1);
  const [focusedId, setFocusedId] = useState("");
  const [focusedAnswerId, setFocusedAnswerId] = useState("");

  const [prevKey, setPrevKey] = useState("");
  const [key, setKey] = useState("");

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [msgsForUI, setMsgsForUI] = useState<{ list: MessageType[] }>({
    list: [],
  });
  const [newMsgs, setNewMsgs] = useState<MessageType[]>([]);

  const [isAlertPublishOpen, setIsAlertPublishOpen] = useState(false);
  const [isTrainBot, setTrainBot] = useState(false);

  const navigate = useNavigate();
  const fetcher = useFetcher();

  // -------------------
  // Initialization and Polling management
  // Manage the arrival of new messages during the polling
  // I store the old messages in the localStorage and I initialize the state of the variable msgsForUI with them
  // The state varibale msgsForUI is the one that is displayed in the UI
  // All the latest messages are coming from the loader and stored in the variable latestMessages
  // -------------------
  useEffect(() => {
    console.log("Running the init");
    if (isInit) return;
    console.log("Init is running");
    setInit(true);
    const messages: MessageType[] = JSON.parse(
      window.localStorage.getItem("messages") || "[]"
    );
    if (messages.length === 0 && latestMessages.length === 0) return;

    if (messages.length === 0) {
      window.localStorage.setItem(
        "messages",
        JSON.stringify([...latestMessages])
      );
      setMsgsForUI({
        list: [...latestMessages.slice(0, Math.min(latestMessages.length, 6))],
      });
    }

    if (messages.length > 0) {
      if (latestMessages.length > 0) {
        const newMsgs = latestMessages.filter((m) => {
          return new Date(m.creationDate) > new Date(messages[0].creationDate);
        });
        setNewMsgs(newMsgs);
      }
      setMessages(messages);
      setMsgsForUI({
        list: [...messages.slice(0, Math.min(messages.length, 6))],
      });
    }
  }, [isInit, latestMessages]);

  // -------------------
  // Polling
  // -------------------
  const revalidator = useRevalidator();
  useEffect(() => {
    if (focusedAnswerId !== "") return;
    const intervalId = setInterval(() => {
      revalidator.revalidate();
    }, 9000);
    return () => clearInterval(intervalId);
  });

  // -------------------
  // Updates msgsForUI with the filters
  // -------------------
  // useEffect(() => {
  //   const filtersMsgs = messages.filter((m) => {
  //     if (filters.hideArchived && m.status === "ARCHIVED") return false;
  //     if (filters.hideNonStarred && m.status !== "STARRED") return false;
  //     return true;
  //   });

  //   let newSetOfMsgs = [
  //     ...filtersMsgs.slice(
  //       msgIndex,
  //       filtersMsgs.length > 6 ? 6 : filtersMsgs.length
  //     ),
  //   ];
  //   if (newSetOfMsgs.length === 0) {
  //     setIndex(-1);
  //     newSetOfMsgs = [
  //       ...filtersMsgs.slice(
  //         0,
  //         filtersMsgs.length > 6 ? 6 : filtersMsgs.length
  //       ),
  //     ];
  //   }
  //   setMsgsForUI({ list: [...newSetOfMsgs] });
  // }, [filters.hideArchived, filters.hideNonStarred]);

  // -------------------
  // Keyboard events handler
  // -------------------
  useEffect(() => {
    if (key === "") return;
    if (key in keysLib) keysLib[key as keyof typeof keysLib]();
  }, [key]);

  const keysLib = {
    ArrowDown: () => {
      setKey("");
      if (msgIndex === messages.length - 1) return;
      if (focusedAnswerId !== "") {
        setFocusedAnswerId("");
        (async () => {
          await messagesLib.updateAnswer();
        })();
      }
      setFocusedAnswerId("");
      setFocusedId((messages[msgIndex + 1] as MessageType).messageId);
      setIndex((currentIndex) => currentIndex + 1);
      setPrevKey("ArrowDown");
      if (msgIndex > 0) {
        setMsgsForUI({ list: [...messages.slice(msgIndex, msgIndex + 6)] });
      }
    },

    ArrowUp: () => {
      setKey("");

      if (msgIndex < 1) return;
      if (focusedAnswerId !== "") {
        setFocusedAnswerId("");
        (async () => {
          await messagesLib.updateAnswer();
        })();
      }
      setFocusedAnswerId("");
      setFocusedId(messages[msgIndex - 1].messageId);

      setIndex((currentIndex) => currentIndex - 1);
      setPrevKey("ArrowUp");
      if (msgIndex < 2) {
        setMsgsForUI({
          list: [
            ...messages.slice(0, messages.length > 6 ? 6 : messages.length),
          ],
        });
      } else {
        setMsgsForUI({ list: [...messages.slice(msgIndex - 1, msgIndex + 5)] });
      }
    },
    Enter: () => {
      if (messages[msgIndex]?.status === "ARCHIVED") return;
      // if (messages[msgIndex].answer?.status === "PUBLISHED") return;
      if (isTrainBot) {
        console.log("navigate to train");
        navigate("/train");
        return;
      }
      if (isAlertPublishOpen) {
        (async () => {
          await messagesLib.publish();
        })();
        setIsAlertPublishOpen(false);
        return;
      }
      if (focusedAnswerId !== "" && focusedId !== "") {
        setIsAlertPublishOpen(true);
        return;
      }
      setFocusedAnswerId(messages[msgIndex].messageId);
      setPrevKey("Enter");
    },
    Escape: () => {
      setIsAlertPublishOpen(false);
      if (focusedAnswerId !== "") {
        setFocusedAnswerId("");
        (async () => {
          await messagesLib.updateAnswer();
        })();
        setFocusedId(messages[msgIndex].messageId);
      } else if (
        prevKey === "ArrowDown" ||
        prevKey === "ArrowUp" ||
        prevKey === "Escape"
      ) {
        setFocusedAnswerId("");
        setFocusedId("");
      }
      setPrevKey("Escape");
    },
    Tab: () => {
      (async () => {
        await messagesLib.generate();
      })();
    },
    u: () => {
      if (focusedAnswerId === "" && focusedId !== "") {
        (async () => {
          await messagesLib.unarchive();
        })();
      }
    },
    r: () => {
      if (focusedAnswerId === "" && focusedId !== "") {
        const msg = messages.filter((m) => m.messageId === focusedId)[0];
        if (msg.status === "STARRED") {
          (async () => {
            await messagesLib.nonstarred();
          })();
        } else {
          (async () => {
            await messagesLib.starred();
          })();
        }
      }
    },

    a: () => {
      if (focusedAnswerId === "" && focusedId !== "") {
        (async () => {
          await messagesLib.archive();
        })();
      }
    },
  };

  const messagesLib = {
    archive: async () => {
      try {
        const id = messages[msgIndex].messageId;
        const newMsgs: MessageType[] = msgsForUI.list.map((m: MessageType) => {
          if (m.messageId === id) {
            return {
              ...m,
              status: "ARCHIVED",
            };
          } else {
            return m;
          }
        });
        setMsgsForUI({ list: newMsgs });

        const formData = new FormData();
        formData.append(
          "creationDate",
          String(messages[msgIndex].creationDate)
        );
        formData.append("button", "ARCHIVE");
        formData.append("id", community.communityId);
        fetcher.submit(formData, { method: "post", action: "/API" });
      } catch (error) {
        console.log("error archiving", error);
      }
    },

    unarchive: async () => {
      try {
        const id = messages[msgIndex].messageId;
        const newMsgs: MessageType[] = msgsForUI.list.map((m: MessageType) => {
          if (m.messageId === id) {
            return {
              ...m,
              status: "PENDING",
            };
          } else {
            return m;
          }
        });
        setMsgsForUI({ list: newMsgs });

        const formData = new FormData();
        formData.append("creationDate", messages[msgIndex].creationDate);
        formData.append("button", "UNARCHIVE");
        formData.append("id", community.communityId);
        fetcher.submit(formData, { method: "post", action: "/API" });
      } catch (error) {
        console.log("error archiving", error);
      }
    },

    starred: async () => {
      try {
        const id = messages[msgIndex].messageId;
        const newMsgs: MessageType[] = msgsForUI.list.map((m: MessageType) => {
          if (m.messageId === id) {
            return {
              ...m,
              status: "STARRED",
            };
          } else {
            return m;
          }
        });
        setMsgsForUI({ list: newMsgs });

        const formData = new FormData();
        formData.append("creationDate", messages[msgIndex].creationDate);
        formData.append("button", "starred");
        formData.append("id", community.communityId);
        fetcher.submit(formData, { method: "post", action: "/API" });
      } catch (error) {
        console.log("error archiving", error);
      }
    },

    nonstarred: async () => {
      try {
        const id = messages[msgIndex].messageId;
        const newMsgs = msgsForUI.list.map((m) => {
          if (m.messageId === id) {
            return {
              ...m,
              STARRED: false,
            };
          } else {
            return m;
          }
        });
        setMsgsForUI({ list: newMsgs });

        const formData = new FormData();
        formData.append("creationDate", messages[msgIndex].creationDate);
        formData.append("button", "NONstarred");
        formData.append("id", community.communityId);
        fetcher.submit(formData, { method: "post", action: "/API" });
      } catch (error) {
        console.log("error archiving", error);
      }
    },

    updateAnswer: async () => {
      const msg: MessageType = msgsForUI.list.filter(
        (m) => m.messageId === focusedId
      )[0];
      const answer = msg.answer;
      if (!msg) return;
      try {
        const formData = new FormData();
        formData.append("creationDate", msg.creationDate);
        formData.append("button", "UPDATE_ANSWER");
        formData.append("answer", String(answer));
        fetcher.submit(formData, { method: "post", action: "/API" });
      } catch (error) {
        console.log("error updatingAnswer", error);
      }
    },

    publish: async () => {
      console.log("publish");
      try {
        const id = messages[msgIndex].messageId;
        const newMsgs: MessageType[] = msgsForUI.list.map((m) => {
          if (m.messageId === id) {
            return {
              ...m,
              status: "PUBLISHING",
              // thread: [...m.thread],
            };
          } else {
            return m;
          }
        });
        setMsgsForUI({ list: newMsgs });
        setIsAlertPublishOpen(false);
        const newMsg = newMsgs.filter((m) => m.messageId === id)[0];
        if (!newMsg) throw new Error("no message found");
        const formData = new FormData();
        formData.append("creationDate", newMsg.creationDate);
        formData.append("answer", String(newMsg.answer));
        formData.append("button", "PUBLISH");
        fetcher.submit(formData, { method: "post", action: "/API" });
      } catch (error) {
        console.log("error publishing", error);
        throw error;
      }
    },

    generate: async () => {
      if (community.settings.traininng.status !== "TRAINED") {
        setTrainBot(true);
        return;
      }

      try {
        const id = messages[msgIndex].messageId;
        const newMsgs: MessageType[] = msgsForUI.list.map((m) => {
          if (m.messageId === id) {
            return {
              ...m,
              status: "GENERATING",
            };
          } else {
            return m;
          }
        });
        setMsgsForUI({ list: newMsgs });

        const newMsg = newMsgs.filter((m) => m.messageId === id)[0];
        if (!newMsg) throw new Error("no message found");
        const formData = new FormData();
        formData.append("creationDate", newMsg.creationDate);
        formData.append("answer", String(newMsg.answer));
        formData.append("button", "GENERATE");
        formData.append("id", community.communityId);
        fetcher.submit(formData, { method: "post", action: "/API" });
      } catch (error) {
        console.log("error archiving", error);
      }
    },

    clickSelect: (id: string) => {
      setFocusedAnswerId(id);
      setFocusedId(id);
    },

    deselect: () => {
      setFocusedAnswerId("");
      setFocusedId("");
    },
  };
  const shouldPreventDefault = (key: string) => {
    switch (key) {
      case "ArrowDown":
        return true;
      case "ArrowUp":
        return true;
      case "Enter":
        return true;
      case "a":
        if (focusedAnswerId === "" && focusedId !== "") return true;
        else return false;
      case "r":
        if (focusedAnswerId === "" && focusedId !== "") return true;
        else return false;
      case "u":
        if (focusedAnswerId === "" && focusedId !== "") return true;
        else return false;
      case "Escape":
        return true;
      case "Tab":
        return true;
      default:
        return false;
    }
  };

  return (
    <KeyboardController
      setKey={setKey}
      shouldPreventDefault={shouldPreventDefault}
    >
      <div className={cn("w-full mt-4 min-h-screen", className)}>
        <Controller arrowDown={keysLib.ArrowDown} arrowUp={keysLib.ArrowUp} />
        <div className="w-full  sm:flex ">
          {/* <div className="w-0 sm:w-24 bg-[#3A123E] sm:h-auto text-white font-bold text-sm p-2 hidden sm:block"></div> */}
          <div
            className={cn(
              "w-full block sm:flex sm:flex-col",
              !notActive && "max-h-screen"
            )}
          >
            {!notActive && (
              <div className="flex-1  p-0 sm:p-4 sm:pt-0 h-full">
                {msgIndex} +{messages.length}+{msgsForUI.list.length} +
                {newMsgs.length}
                <FeedUI
                  messages={msgsForUI.list}
                  focusedId={focusedId}
                  focusedAnswerId={focusedAnswerId}
                  setMsgs={(list) => setMsgsForUI({ list })}
                  clickSelect={messagesLib.clickSelect}
                  back={messagesLib.deselect}
                />
                <DialogPublish
                  open={isAlertPublishOpen}
                  closeDialog={() => setIsAlertPublishOpen(false)}
                  msg={
                    msgsForUI.list.filter(
                      (m) => m.messageId === focusedAnswerId
                    )[0] as MessageType
                  }
                />
                <DialogTrainBot open={isTrainBot} closeDialog={setTrainBot} />
              </div>
            )}
            {notActive && <FeedPlaceholder />}
          </div>
        </div>
        <p className="text-xs text-gray-500 text-left font-normal mt-4 ">
          Last update at {new Date().toLocaleTimeString()}
        </p>
      </div>
    </KeyboardController>
  );
}
