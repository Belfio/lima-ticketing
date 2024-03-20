import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

export default function Controller({
  arrowUp,
  arrowDown,
}: {
  arrowUp: () => void;
  arrowDown: () => void;
}) {
  return (
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
  );
}
