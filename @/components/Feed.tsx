import { useEffect, useState } from "react";
import { useNavigate, useFetcher } from "@remix-run/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import SlackAnswer from "./SlackAnswer";
import SlackEmpty from "./SlackEmpty";
import SlackMessage from "./SlackMessage";
import DialogPublish from "./DialogPublish";
import { CommunityType, MessageType } from "@/lib/types";
import DialogTrainBot from "./DialogTrainBot";
import SlackMessageThread from "./SlackMessageThread";

export default function Feed({
  className,
  notActive,
  messages = [],
  community,
  setWriting,
  filters,
}: {
  className?: string;
  notActive?: boolean;
  messages?: MessageType[] | [];
  community: CommunityType;
  setWriting: (flag: boolean) => void;
  filters: {
    hideArchived: boolean;
    hideNonRequests: boolean;
  };
}) {
  const [msgIndex, setIndex] = useState(-1);
  const [keyState, setKeyState] = useState("");
  const [focusedId, setFocusedId] = useState("");
  const [focusedAnswerId, setFocusedAnswerId] = useState("");
  const [msgs, setMsgs] = useState<MessageType[]>([
    ...messages.slice(0, messages.length > 6 ? 6 : messages.length),
  ]);
  const [isAlertPublishOpen, setIsAlertPublishOpen] = useState(false);
  const [isTrainBot, setTrainBot] = useState(false);
  const navigate = useNavigate();
  const fetcher = useFetcher();
  useEffect(() => {
    const filtersMsgs = messages.filter((m) => {
      if (filters.hideArchived && m?.status === "ARCHIVED") return false;
      if (filters.hideNonRequests) return false;
      return true;
    });
    let newSetOfMsgs = [
      ...filtersMsgs.slice(
        msgIndex,
        filtersMsgs.length > 6 ? 6 : filtersMsgs.length
      ),
    ];
    if (newSetOfMsgs.length === 0) {
      setIndex(0);
    }
    newSetOfMsgs = [
      ...filtersMsgs.slice(0, filtersMsgs.length > 6 ? 6 : filtersMsgs.length),
    ];
    setMsgs([...newSetOfMsgs]);
  }, [filters.hideArchived, filters.hideNonRequests]);

  useEffect(() => {
    const handleKey = (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        console.log("arrowDown");
        e.preventDefault();

        arrowDown();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        arrowUp();
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();

        if (messages[msgIndex]?.status === "ARCHIVED") return;
        // if (messages[msgIndex].answer?.status === "PUBLISHED") return;
        if (isTrainBot) {
          console.log("navigate to train");
          navigate("/train");
          return;
        }
        if (isAlertPublishOpen) {
          (async () => {
            await publish();
          })();
          setIsAlertPublishOpen(false);
          return;
        }
        if (focusedAnswerId !== "" && focusedId !== "") {
          setIsAlertPublishOpen(true);
          return;
        }
        setFocusedAnswerId(messages[msgIndex].id);
        setKeyState("Enter");
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setIsAlertPublishOpen(false);
        if (focusedAnswerId !== "") {
          setFocusedAnswerId("");
          (async () => {
            await updateAnswer();
          })();
          setFocusedId(messages[msgIndex].id);
        } else if (
          keyState === "ArrowDown" ||
          keyState === "ArrowUp" ||
          keyState === "Escape"
        ) {
          setFocusedAnswerId("");
          setFocusedId("");
        }
        setKeyState("Escape");
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        (async () => {
          await generate();
        })();
        return;
      }
      if (e.key === "a") {
        if (focusedAnswerId === "" && focusedId !== "") {
          e.preventDefault();
          (async () => {
            await archive();
          })();
        }
        return;
      }
      if (e.key === "u") {
        if (focusedAnswerId === "" && focusedId !== "") {
          e.preventDefault();
          (async () => {
            await unarchive();
          })();
        }
        return;
      }
      if (e.key === "r") {
        if (focusedAnswerId === "" && focusedId !== "") {
          e.preventDefault();
          const msg = messages.filter((m) => m.id === focusedId)[0];
          if (msg.status === "OPPORTUNITY") {
            (async () => {
              await nonrelevant();
            })();
          } else {
            (async () => {
              await relevant();
            })();
          }
        }
        return;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [
    focusedAnswerId,
    focusedId,
    isAlertPublishOpen,
    keyState,
    msgIndex,
    isTrainBot,
    msgs,
  ]);

  useEffect(() => {
    if (msgIndex < 2) {
      setMsgs([
        ...messages.slice(0, messages.length > 6 ? 6 : messages.length),
      ]);
    } else {
      setMsgs([...messages.slice(msgIndex - 1, msgIndex + 5)]);
    }
  }, [messages]);

  useEffect(() => {
    if (focusedAnswerId !== "") {
      setWriting(true);
    } else {
      setWriting(false);
    }
  }, [focusedAnswerId]);

  const arrowDown = () => {
    if (msgIndex === messages.length - 1) return;
    if (focusedAnswerId !== "") {
      setFocusedAnswerId("");
      (async () => {
        await updateAnswer();
      })();
    }
    setFocusedAnswerId("");
    setFocusedId(messages[msgIndex + 1].id);

    setIndex((currentIndex) => currentIndex + 1);
    setKeyState("ArrowDown");
    if (msgIndex > 0) {
      setMsgs([...messages.slice(msgIndex, msgIndex + 6)]);
    }
  };

  const arrowUp = () => {
    if (msgIndex < 1) return;
    if (focusedAnswerId !== "") {
      setFocusedAnswerId("");
      (async () => {
        await updateAnswer();
      })();
    }
    setFocusedAnswerId("");
    setFocusedId(messages[msgIndex - 1].id);

    setIndex((currentIndex) => currentIndex - 1);
    setKeyState("ArrowUp");
    if (msgIndex < 2) {
      setMsgs([
        ...messages.slice(0, messages.length > 6 ? 6 : messages.length),
      ]);
    } else {
      setMsgs([...messages.slice(msgIndex - 1, msgIndex + 5)]);
    }
  };
  const archive = async () => {
    try {
      const id = messages[msgIndex].id;
      const newMsgs = msgs.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            answer: m.answer,
          };
        } else {
          return m;
        }
      });
      setMsgs(newMsgs);

      const formData = new FormData();
      formData.append("creationDate", String(messages[msgIndex].creationDate));
      formData.append("button", "ARCHIVE");
      formData.append("id", community.id);
      fetcher.submit(formData, { method: "post" });
    } catch (error) {
      console.log("error archiving", error);
    }
  };

  const unarchive = async () => {
    try {
      const id = messages[msgIndex].id;
      const newMsgs = msgs.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            answer: m.answer,
          };
        } else {
          return m;
        }
      });
      setMsgs(newMsgs);

      const formData = new FormData();
      formData.append("creationDate", messages[msgIndex].creationDate);
      formData.append("button", "UNARCHIVE");
      formData.append("id", community.id);
      fetcher.submit(formData, { method: "post" });
    } catch (error) {
      console.log("error archiving", error);
    }
  };

  const relevant = async () => {
    try {
      const id = messages[msgIndex].id;
      const newMsgs = msgs.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            opportunity: true,
          };
        } else {
          return m;
        }
      });
      setMsgs(newMsgs);

      const formData = new FormData();
      formData.append("creationDate", messages[msgIndex].creationDate);
      formData.append("button", "RELEVANT");
      formData.append("id", community.id);
      fetcher.submit(formData, { method: "post" });
    } catch (error) {
      console.log("error archiving", error);
    }
  };

  const nonrelevant = async () => {
    try {
      const id = messages[msgIndex].id;
      const newMsgs = msgs.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            opportunity: false,
          };
        } else {
          return m;
        }
      });
      setMsgs(newMsgs);

      const formData = new FormData();
      formData.append("creationDate", messages[msgIndex].creationDate);
      formData.append("button", "NONRELEVANT");
      formData.append("id", community.id);
      fetcher.submit(formData, { method: "post" });
    } catch (error) {
      console.log("error archiving", error);
    }
  };

  const updateAnswer = async () => {
    const msg: MessageType = msgs.filter((m) => m.id === focusedId)[0];
    const answer = msg.answer;
    if (!msg) return;
    try {
      const formData = new FormData();
      formData.append("creationDate", msg.creationDate);
      formData.append("button", "UPDATE_ANSWER");
      formData.append("answer", String(answer));
      fetcher.submit(formData, { method: "post" });
    } catch (error) {
      console.log("error updatingAnswer", error);
    }
  };

  const publish = async () => {
    console.log("publish");
    try {
      const id = messages[msgIndex].id;
      const newMsgs = msgs.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: "PUBLISHING",
            // thread: [...m.thread],
          };
        } else {
          return m;
        }
      });
      setMsgs(newMsgs);
      setIsAlertPublishOpen(false);
      const newMsg = newMsgs.filter((m) => m.id === id)[0];
      if (!newMsg) throw new Error("no message found");
      const formData = new FormData();
      formData.append("creationDate", newMsg.creationDate);
      formData.append("answer", String(newMsg.answer));
      formData.append("button", "PUBLISH");
      fetcher.submit(formData, { method: "post" });
    } catch (error) {
      console.log("error publishing", error);
      throw error;
    }
  };

  const generate = async () => {
    if (community.trainingSettings?.trainingStatus !== "TRAINED") {
      setTrainBot(true);
      return;
    }

    try {
      const id = messages[msgIndex].id;
      const newMsgs = msgs.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            answer: {
              ...m.answer,
              status: "GENERATING",
            },
          };
        } else {
          return m;
        }
      });
      setMsgs(newMsgs);

      const newMsg = newMsgs.filter((m) => m.id === id)[0];
      if (!newMsg) throw new Error("no message found");
      const formData = new FormData();
      formData.append("creationDate", newMsg.creationDate);
      formData.append("answer", newMsg.answer?.message);
      formData.append("button", "GENERATE");
      formData.append("id", community.id);
      fetcher.submit(formData, { method: "post" });
    } catch (error) {
      console.log("error archiving", error);
    }
  };

  const clickSelect = (id: string) => {
    setFocusedAnswerId(id);
    setFocusedId(id);
  };

  const back = () => {
    setFocusedAnswerId("");
    setFocusedId("");
  };

  return (
    <div className={cn("w-full mt-4", className)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center justify-start"></div>
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            className="text-gray-500 font-bold text-xs select-none"
            onClick={arrowUp}
          >
            Select the messages with Up
            <div className="border-solid border-gray-500 border-[1px] rounded-md p-1 ml-1 w-[24px] h-[24px] text-center">
              <ArrowUp className="w-[14px] h-[14px] font-normal " />
            </div>
          </Button>
          <Button
            variant="ghost"
            className="text-gray-500 font-bold text-xs"
            onClick={arrowDown}
          >
            and Down
            <div className="border-solid border-gray-500 border-[1px] rounded-md p-1 ml-1 w-[24px] h-[24px] text-center">
              <ArrowDown className="w-[14px] h-[14px] font-normal " />
            </div>
          </Button>
        </div>
      </div>
      <div className="w-full  sm:flex ">
        {/* <div className="w-0 sm:w-24 bg-[#3A123E] sm:h-auto text-white font-bold text-sm p-2 hidden sm:block"></div> */}
        <div
          className={cn(
            "w-full block sm:flex sm:flex-col",
            !notActive && "max-h-screen"
          )}
        >
          {notActive && (
            <>
              <div className="relative h-4">
                <div className="absolute z-10 w-full">
                  <div className=" m-auto border border-solid rounded-3xl bg-white card-shadow text-center font-bold w-fit px-4 py-1 text-sm">
                    Not active
                  </div>
                </div>
                <Separator className="w-full absolute mt-4 z-0" />
              </div>

              <ScrollArea className="h-[180px] overflow-auto p-4">
                <SlackEmpty />
              </ScrollArea>
            </>
          )}
          {!notActive && (
            <div className="flex-1  p-0 sm:p-4 sm:pt-0">
              {MessagesAndDayComponents(
                msgs,
                community,
                focusedId,
                focusedAnswerId,
                setMsgs,
                clickSelect,
                back
              ).map((m) => m)}
              <DialogPublish
                open={isAlertPublishOpen}
                closeDialog={() => setIsAlertPublishOpen(false)}
                msg={
                  msgs.filter((m) => m.id === focusedAnswerId)[0] as MessageType
                }
              />
              <DialogTrainBot open={isTrainBot} closeDialog={setTrainBot} />
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 text-left font-normal mt-4 ">
        Last update at {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

const MessageDate = ({ date }: { date: string }) => {
  return (
    <div className="relative h-4 w-full mt-4">
      <div className="absolute z-10 w-full">
        <div className="m-auto border border-solid rounded-3xl bg-white card-shadow text-center font-bold w-fit px-4 py-1 text-xs sm:text-sm">
          {new Date(date)
            .toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .toString()}
        </div>
      </div>
      <Separator className="w-full absolute mt-4 z-0" />
    </div>
  );
};

const MessagesAndDayComponents = (
  messages: MessageType[],
  community: CommunityType,
  focusedId: string,
  focusedAnswerId: string,
  setMsgs: Function,
  clickSelect: Function,
  back: Function
) => {
  const ComponentsArray: any[] = [];
  const setAnswer = (newAnswer: string) => {
    const newMsgs = messages.map((m) => {
      if (m.id === focusedId) {
        return {
          ...m,
          answer: {
            ...m.answer,
            message: newAnswer,
          },
        };
      } else {
        return m;
      }
    });
    setMsgs(newMsgs);
  };
  messages.forEach((m: StoredMessageType, index: number) => {
    if (index === 0) {
      ComponentsArray.push(
        <MessageDate date={m.creationDate} key={index + "msg"} />
      );
      ComponentsArray.push(
        <div key={index}>
          <SlackMessage
            message={m}
            focus={focusedId === m.id}
            focusAnswer={focusedAnswerId === m.id}
            onClick={() => clickSelect(m.id)}
            back={() => back()}
          >
            {m.thread && <SlackMessageThread messages={m.thread} />}
            <SlackAnswer
              answer={m.answer}
              event={m}
              focus={focusedAnswerId === m.id}
              updateAnswer={setAnswer}
            />
          </SlackMessage>
        </div>
      );
    } else {
      if (!isSameDay(m.creationDate, messages[index - 1].creationDate)) {
        ComponentsArray.push(
          <MessageDate date={m.creationDate} key={index + "msg1"} />
        );
        ComponentsArray.push(
          <div key={index}>
            <SlackMessage
              message={m}
              focus={focusedId === m.id}
              focusAnswer={focusedAnswerId === m.id}
              onClick={() => clickSelect(m.id)}
              back={() => back()}
            >
              {m.thread && <SlackMessageThread messages={m.thread} />}

              <SlackAnswer
                answer={m?.answer}
                event={m}
                focus={focusedAnswerId === m.id}
                updateAnswer={setAnswer}
              />
            </SlackMessage>
          </div>
        );
      } else {
        ComponentsArray.push(
          <div key={index + "msg2"}>
            <SlackMessage
              message={m}
              focus={focusedId === m.id}
              focusAnswer={focusedAnswerId === m.id}
              onClick={() => clickSelect(m.id)}
              back={() => back()}
            >
              {m.thread && <SlackMessageThread messages={m.thread} />}
              <SlackAnswer
                answer={m.answer}
                event={m}
                focus={focusedAnswerId === m.id}
                updateAnswer={setAnswer}
              />
            </SlackMessage>
          </div>
        );
      }
    }
  });
  if (ComponentsArray.length === 0) {
    ComponentsArray.push(
      <div className="h-[60px]" key={"msgData"}>
        <MessageDate date={new Date().toISOString()} key={0} />
      </div>
    );
  }
  return ComponentsArray;
};

function isSameDay(date1: string, date2: string) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
