import { ResponsiveDialog } from "@/components/responsive-dialogue";
import { AgentForm } from "./agent-form";

import { AgentGetOne } from "../../types";

interface UpdateAgentDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentGetOne;
}

export const UpdateAgentDialogue = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateAgentDialogueProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Agent"
      description="Update your existing agent settings."
    >
      <AgentForm
        onSuccess={() => {onOpenChange(false)}}
        onCancel={() => {onOpenChange(false)}}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};

