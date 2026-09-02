import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";

import { ResponsiveDialog } from "@/components/responsive-dialogue";


export const useConfirm = (
  title: string,
  description: string
): [() => JSX.Element, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  };
  // Every exit path must settle the promise, otherwise `await confirm()` hangs
  // forever when the dialog is dismissed with Escape or an overlay click.
  const settle = (value: boolean) => {
    promise?.resolve(value);
    setPromise(null);
  };
  const handleConfirm = () => settle(true);
  const handleCancel = () => settle(false);

  const ConfirmationDialog = () => (
    <ResponsiveDialog
      open={promise !== null}
      onOpenChange={handleCancel}
      title={title}
      description={description}
    >
      <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
        <Button 
        onClick={handleCancel}
        variant="outline"
        className="w-full lg:w-auto">
            Cancel
        </Button>
        <Button 
        onClick={handleConfirm}
        className="w-full lg:w-auto">
            Confirm
        </Button>
      </div>
    </ResponsiveDialog>
  );
  return [ConfirmationDialog, confirm];
};
