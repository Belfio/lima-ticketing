import limaThunder from "@/assets/lima_thunder.svg";
import { Link } from "@remix-run/react";
const SlackEmpty = () => {
  return (
    <div className="ml-2 pt-1 border-solid rounded-lg h-[68px]">
      <div className="flex items-center">
        <div className="bg-white flex items-center justify-center rounded-sm border-solid w-[48px] h-[32px]">
          <img
            src={limaThunder}
            className="h-[24px] w-[24px]"
            alt="lima thunder"
          />
        </div>
        <div className="mt-0 text-gray-600 text-sm ml-2  ">
          Lima bot is not active. To activate please go to the{" "}
          <Link to="/dashboard">dashboard</Link> and set up the bot.
        </div>
      </div>
    </div>
  );
};
export default SlackEmpty;
