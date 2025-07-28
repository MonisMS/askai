import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { agentsInsertSchema } from "../../schemas";
import {Form ,
    FormControl,

    FormField,
    FormItem,   
    FormLabel,
    FormMessage,


} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initalValues?: AgentGetOne;
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initalValues,
}: AgentFormProps) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
            onSuccess: async() => {
              await queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions({})
                );
                if(initalValues?.id) {
                 await queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({ id: initalValues.id })
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
    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initalValues?.name??"",
            instructions: initalValues?.instructions??"",
        },
    })
    const IsEdit = !!initalValues?.id;
    const isPending = createAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if (IsEdit) {
            // Update existing agent
            console.log("TODO: Update agent logic here");
            
        } else {
            // Create new agent
            createAgent.mutate(values)
        }
    }
    return (
        <Form {...form}>
<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
<GeneratedAvatar
seed={form.watch("name")}
variant="bottsNeutral"
className="border size-16"
/>
<FormField
name="name"
control={form.control}
render={({ field }) => (
    <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
            <Input placeholder="Agent Name" {...field} />
        </FormControl>
        <FormMessage />
    </FormItem>
)}
/>

<FormField
name="instructions"
control={form.control}
render={({ field }) => (
    <FormItem>
        <FormLabel>Instructions</FormLabel>
        <FormControl>
            <Textarea placeholder="Agent Instructions" {...field} />
        </FormControl>
       
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
    )
}