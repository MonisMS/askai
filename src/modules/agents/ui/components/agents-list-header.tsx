"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDialogue } from "./new-agent-dialogue";
import { useState } from "react";
export const AgentsListHeader = () => {
    const [isDialogOpen, setDialogOpen] = useState(false);
  return (
    <>
    <NewAgentDialogue open={isDialogOpen} onOpenChange={setDialogOpen} />
    <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium">My agents</h5>
        <Button onClick={() => setDialogOpen(true)} >
            <PlusIcon/>
            new agents</Button>
      </div>
    </div>
    </>
  );
};
