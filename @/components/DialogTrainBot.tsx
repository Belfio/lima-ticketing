import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { NavLink } from "@remix-run/react";
import AI from "@/assets/ai.svg";

function DialogTrainBot({
  open,
  closeDialog,
}: {
  open: boolean;
  closeDialog: (flag: boolean) => void;
}) {
  return (
    <Dialog
      defaultOpen={false}
      open={open}
      onOpenChange={() => closeDialog(false)}
    >
      <DialogContent>
        <DialogHeader onClick={() => closeDialog(false)}>
          <DialogTitle className="flex items-center">
            <img src={AI} className="w-8 h-8 inline-block mr-1" alt="AI" />
            Train your bot
          </DialogTitle>
          <DialogDescription>
            <div className="py-8 px-0">
              <p className="text-gray-900">
                Your bot is not trained yet. You can train it on your past slack
                messages and any text document you would like to use.
              </p>
            </div>
            <DialogClose asChild onClick={() => closeDialog(false)}>
              <div className="flex items-center">
                <NavLink to="/train">
                  <Button>Proceed</Button>
                </NavLink>
              </div>
            </DialogClose>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default DialogTrainBot;
