import { ResponsiveDialog } from "@/components/responsive-dialogue";
import { MeetingForm } from "./meeting-form";
import { useRouter } from "next/navigation";

interface NewMeetingDialogueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialogue = ({
  open,
  onOpenChange,
}: NewMeetingDialogueProps) => {
  const router = useRouter()
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="New Meeting"
      description="Create a new meeting."
    >
      <MeetingForm
      onSuccess={(id => {
        onOpenChange(false)
        router.push(`/meetings/${id}`)
      })}
    onCancel={() => onOpenChange}
    
      />
    </ResponsiveDialog>
  );
};
