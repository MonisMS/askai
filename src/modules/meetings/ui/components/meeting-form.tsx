import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MeetingGetOne } from "../../types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { meetingsInsertSchema } from "../../server/schemas";
import {Form ,
    FormControl,

    FormDescription,

    FormField,
    FormItem,   
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialogue } from "@/modules/agents/ui/components/new-agent-dialogue";
import { useRouter } from "next/navigation";

interface MeetingFormProps {
    onSuccess?: (id?:string) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues,
}: MeetingFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");
const agents = useQuery(
    trpc.agents.getMany.queryOptions({
        pageSize: 100,
        search:agentSearch
    })
)

    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: async(data) => {
              await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );
                await queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions()
                );
                onSuccess?.(data.id);
            },
            onError: (error) => {
                toast.error(error.message || "Failed to create agent");
                 if(error.data?.code === "FORBIDDEN") {
                    router.push("upgrade");
                }
            }
            //TODO CHECK IF ERROR CODE IS FORBIDDEN 

        })
    )


     const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: async() => {
              await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );
                if(initialValues?.id) {
                 await queryClient.invalidateQueries(
                        trpc.meetings.getOne.queryOptions({ id: initialValues.id })
                    );
                }
                onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message || "Failed to create agent");
            }
            //TODO CHECK IF ERROR CODE IS FORBIDDEN 

        })
    )
    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name??"",
            agentId: initialValues?.agentId??"",
        },
    })
    const IsEdit = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if (IsEdit) {
            // Update existing agent
            updateMeeting.mutate({
                ...values,
                id: initialValues?.id
            });
        } else {
            // Create new agent
            createMeeting.mutate(values)
        }
    }
    return (
        <>
        <NewAgentDialogue open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
        <Form {...form}>
<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

<FormField
name="name"
control={form.control}
render={({ field }) => (
    <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
            <Input placeholder="e.g. Coding consultations" {...field} />
        </FormControl>
        <FormMessage />
    </FormItem>
)}
/>

<FormField
name="agentId"
control={form.control}
render={({ field }) => (
    <FormItem>
        <FormLabel>Agent</FormLabel>
        <FormControl>
           <CommandSelect 
           options={(agents.data?.items ?? []).map((agent)=> ({
            id:agent.id,
            value: agent.id,
            children: (
                <div className="flex items-center gap-x-2">
                    <GeneratedAvatar 
                    seed={agent.name}
                    variant="botttsNeutral"
                    className="border size-6"
                    />
                    <span>
                        {agent.name}
                    </span>
                 
                </div>
            )
           }))}
onSelect={field.onChange}
onSearch={setAgentSearch}
value={field.value}
placeholder="Select an agent"

           />
        </FormControl>
        <FormDescription>
            Not found what you&apos;re looking for?{" "}
            <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => setOpenNewAgentDialog(true)}
            >
                Create new Agent
            </button>
        </FormDescription>
        <FormMessage />
    </FormItem>
)}
/>


<div className="flex justify-end gap-x-2">
    {onCancel && (
        <Button 
        variant="ghost" 
        type="button"
        onClick={() => onCancel()} 
        disabled={isPending}>
            Cancel
        </Button>
    )}
    <Button disabled={isPending} type="submit">
        {IsEdit ? "Update" : "Create"}
    </Button>
</div>
</form>
        </Form>
        </>
    )
}