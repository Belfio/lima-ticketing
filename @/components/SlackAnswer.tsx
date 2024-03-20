import { useRef, useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import { ArrowRightToLine, CornerDownRight } from "lucide-react";
import AI from "@/assets/ai.svg";
import { MessageType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SlackAnswer = ({
  answer,
  event,
  focus,
  updateAnswer,
}: {
  answer?: MessageType;
  event: MessageType;
  focus: boolean;
  updateAnswer: (ans: string) => void;
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleFocus = (focus: boolean) => {
    if (inputRef.current) {
      if (focus) {
        const end = inputRef.current.value.length;

        inputRef.current.setSelectionRange(end, end);
        (inputRef.current as HTMLTextAreaElement).focus();
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const fetcher = useFetcher();
  useEffect(() => {
    handleFocus(focus);
  }, [focus]);

  const isSubmitting =
    fetcher.state === "submitting" || answer?.status === "PUBLISHING";

  return (
    <div
      className="ml-10 pt-1 border-solid rounded-lg "
      onClick={(e) => {
        e.stopPropagation();
      }}
      tabIndex={0}
      role="button" // Add role attribute
      onKeyDown={(e) => {
        // Add keyboard interaction
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
        }
      }}
    >
      <div className="block ">
        <div className="mt-0 text-gray-600 text-sm ml-2 flex items-center italic ">
          <Textarea
            value={answer?.message}
            onChange={(e) => updateAnswer(e.target.value)}
            name="message"
            className="h-auto w-full text-sm text-left resize-none mx-2 mt-2 "
            ref={inputRef}
            disabled={answer?.status === "GENERATING"}
          />
        </div>
        <fetcher.Form
          method={answer?.status === "GENERATING" ? "get" : "post"}
          id="opportinityForm"
          action="/feed"
        >
          <div className="mt-4 text-right mr-2 flex justify-end ">
            <Button
              className="w-fit px-4 mx-1 text-gray-500 flex"
              variant="ghost"
              name="button"
              value={`GENERATE`}
              disabled={answer?.status === "GENERATING" || isSubmitting}
            >
              <img
                src={AI}
                alt="AI"
                className="w-[18px] h-[18px] mr-1 font-normal text-gray-500"
              />
              {answer?.status === "GENERATING" ? "Generating..." : "Generate"}
              <div className="border-solid border-gray-500 border-[1px] rounded-md p-1 ml-2 flex items-center ">
                <span className="font-normal mr-1 text-xs text-gray-500">
                  Tab
                </span>
                <ArrowRightToLine className="w-[14px] h-[14px] font-normal text-gray-500" />
              </div>
            </Button>
            <Button
              className="w-fit px-4 mx-1 bg-pink-700"
              type="submit"
              name="button"
              value={`PUBLISH`}
              disabled={
                answer?.status === "GENERATING" ||
                answer?.message === "" ||
                isSubmitting
              }
            >
              {isSubmitting ? "Publishing..." : "Publish"}
              <div className="border-solid border-white border-[1px] rounded-md p-1 ml-2">
                <CornerDownRight className="w-[14px] h-[14px]" />
              </div>
            </Button>
            <input
              type="hidden"
              name="creationDate"
              value={String(event.creationDate)}
            />
            <input
              type="hidden"
              name="answer"
              value={String(answer?.message)}
            />
          </div>
        </fetcher.Form>
      </div>
    </div>
  ) as React.ReactElement;
};

export default SlackAnswer;
