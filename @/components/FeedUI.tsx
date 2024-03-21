import { MessageType } from "@/lib/types";
import { isSameDay } from "@/lib/utils";
import SlackMessage from "./Message";
import SlackAnswer from "./MessageAnswer";
import SeparatorDate from "./MessageSeparatorDate";
import SlackMessageThread from "./MessageThread";

export default function FeedUI({
  messages,
  focusedId,
  focusedAnswerId,
  setMsgs,
  clickSelect,
  back,
}: {
  messages: MessageType[];
  focusedId: string;
  focusedAnswerId: string;
  setMsgs: (msgs: MessageType[]) => void;
  clickSelect: (id: string) => void;
  back: () => void;
}) {
  const ComponentsArray: React.ReactNode[] = [];
  const setAnswer = (newAnswer: string) => {
    const newMsgs: MessageType[] = messages.map((m) => {
      if (m.messageId === focusedId) {
        return {
          ...m,
          message: String(newAnswer),
        };
      } else {
        return m;
      }
    });
    setMsgs(newMsgs);
  };
  messages.forEach((m: MessageType, index: number) => {
    if (index === 0) {
      ComponentsArray.push(
        <SeparatorDate date={m.creationDate} key={index + "msg"} />
      );
      ComponentsArray.push(
        <div key={index}>
          <SlackMessage
            message={m}
            focus={focusedId === m.messageId}
            focusAnswer={focusedAnswerId === m.messageId}
            onClick={() => clickSelect(m.messageId)}
            back={() => back()}
          >
            {m.thread && <SlackMessageThread messages={m.thread} />}
            <SlackAnswer
              answer={m.answer}
              event={m}
              focus={focusedAnswerId === m.messageId}
              updateAnswer={setAnswer}
            />
          </SlackMessage>
        </div>
      );
    } else {
      if (!isSameDay(m.creationDate, messages[index - 1].creationDate)) {
        ComponentsArray.push(
          <SeparatorDate date={m.creationDate} key={index + "msg1"} />
        );
        ComponentsArray.push(
          <div key={index}>
            <SlackMessage
              message={m}
              focus={focusedId === m.messageId}
              focusAnswer={focusedAnswerId === m.messageId}
              onClick={() => clickSelect(m.messageId)}
              back={() => back()}
            >
              {m.thread && <SlackMessageThread messages={m.thread} />}

              <SlackAnswer
                answer={m?.answer}
                event={m}
                focus={focusedAnswerId === m.messageId}
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
              focus={focusedId === m.messageId}
              focusAnswer={focusedAnswerId === m.messageId}
              onClick={() => clickSelect(m.messageId)}
              back={() => back()}
            >
              {m.thread && <SlackMessageThread messages={m.thread} />}
              <SlackAnswer
                answer={m.answer}
                event={m}
                focus={focusedAnswerId === m.messageId}
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
        <SeparatorDate date={new Date().toISOString()} key={0} />
      </div>
    );
  }
  return ComponentsArray;
}
