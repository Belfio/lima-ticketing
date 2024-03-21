import SlackEmpty from "./MessageEmpty";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

export default function FeedPlaceholder() {
  return (
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
  );
}
