"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useState } from "react";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation,useQueryClient,useSuspenseQuery } from "@tanstack/react-query";
import { useConfirm } from "../../../../hooks/use-confirm";
import { UpdateAgentDialogue } from "../components/update-agent-dialogue";
interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
const [updateAgentDialogueOpen, setUpdateAgentDialogueOpen] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(`Failed to remove agent: ${error.message}`);
      },
    })
  );
const [RemoveConfirmation, confirmRemove] = useConfirm(
  "Are you sure you want to remove this agent?",
  `The following action will remove the agent ${data.name} with all its ${data.meetingCount} meetings.`,

);
const handleRemoveAgent = async () => {
  const ok = await confirmRemove()
  if(!ok) return;
await removeAgent.mutateAsync({ id: agentId });
  toast.success("Agent removed successfully");


};
  return (
    <>
      <RemoveConfirmation />
   <UpdateAgentDialogue
   open={updateAgentDialogueOpen}
   onOpenChange={setUpdateAgentDialogueOpen}
   initialValues={data}

   />
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => setUpdateAgentDialogueOpen(true)}
        onRemove={handleRemoveAgent}
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
            <GeneratedAvatar
              variant="bottsNeutral"
              seed={data.name}
              className="size-10"
            />
            <h2 className="text-2xl font-medium ">
                {data.name}</h2>
          </div>
          <Badge
            variant="outline"
            className="flex items-center gap-x-2 [&>svg]:size-4"
          >
            <VideoIcon className="text-blue-700" />
            {data.meetingCount}{" "}
            {data.meetingCount === 1 ? "Meeting" : "Meetings"}
          </Badge>
          <div className="flex flex-col gap-y-4">
            <p className="text-lg font-medium">Instructions</p>
            <p className="text-neutral-800">{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
     </>
  );
};

export const AgentsIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds"
    />
  );
};

export const AgentsIdViewError = () => {
  return (
    <ErrorState
      title="Error loading agents"
      description="Something went wrong"
    />
  );
};
