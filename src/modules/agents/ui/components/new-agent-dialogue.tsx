import { ResponsiveDialog } from "@/components/responsive-dialogue";
import { AgentForm } from "./agent-form";

interface NewAgentDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewAgentDialogue = ({
  open,
  onOpenChange,
}: NewAgentDialogueProps) => {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New Agent"
      description="Create a new agent to assist you."
    >
      <AgentForm
      onSuccess={() => {
        onOpenChange(false);
      }}
      onCancel={() => { 
        onOpenChange(false);
      }}
      />
    </ResponsiveDialog>
  );
};
