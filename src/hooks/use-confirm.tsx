import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";

import { ResponsiveDialog } from "@/components/responsive-dialogue";


interface ConfirmOptions {
  confirmLabel?: string;
  cancelLabel?: string;
  /** Destructive actions must not be styled as the positive/primary choice. */
  variant?: "default" | "destructive";
}

export const useConfirm = (
  title: string,
  description: string,
  options: ConfirmOptions = {}
): [() => JSX.Element, () => Promise<boolean>] => {
  const {
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "default",
  } = options;
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
            {cancelLabel}
        </Button>
        <Button 
        onClick={handleConfirm}
        variant={variant}
        className="w-full lg:w-auto">
            {confirmLabel}
        </Button>
      </div>
    </ResponsiveDialog>
  );
  return [ConfirmationDialog, confirm];
};
