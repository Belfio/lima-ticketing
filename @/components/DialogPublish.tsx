import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { MessageType } from "@/lib/types";
import { useFetcher } from "@remix-run/react";
import { CornerDownLeft } from "lucide-react";

function DialogPublish({
  open,
  msg,
  closeDialog,
}: {
  open: boolean;
  msg: MessageType;
  closeDialog: () => void;
}) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <Dialog defaultOpen={false} open={open} onOpenChange={() => closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm publishing</DialogTitle>
          <DialogDescription>
            <div className="py-8 px-0">
              <p className="my-2 px-4 py-2 w-full rounded-md bg-slate-100 text-gray-900">
                {msg?.answer}
              </p>
            </div>
            <DialogClose asChild>
              <div className="flex items-center">
                <Button
                  type="button"
                  name="button"
                  variant="ghost"
                  className="flex items-center"
                  onClick={() => closeDialog()}
                >
                  Cancel
                  <div className="border-solid border-gray-500 border-[1px] rounded-md p-1 ml-1 w-[32px] h-[24px] text-center flex items-center">
                    <span className="font-normal text-xs text-gray-500 py-1">
                      Esc
                    </span>
                  </div>
                </Button>
                <fetcher.Form method="POST" action="/feed">
                  <Button
                    type="submit"
                    name="button"
                    value="PUBLISH"
                    className="px-4 mx-1 bg-pink-700 outline-none"
                  >
                    {isSubmitting ? "Sending..." : "Confirm"}
                    <div className="border-solid border-white border-[1px] rounded-md p-1 ml-2">
                      <CornerDownLeft className="w-[14px] h-[14px]" />
                    </div>
                  </Button>
                </fetcher.Form>
              </div>
            </DialogClose>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default DialogPublish;
