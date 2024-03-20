import { Separator } from "@/components/ui/separator";

const SeparatorDate = ({ date }: { date: string }) => {
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

export default SeparatorDate;
