"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialogue } from "./new-agent-dialogue";
import { AgentsSearchFilter } from "./agents-search-filter";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { useState } from "react";
import { DEFAULT_PAGE } from "@/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
export const AgentsListHeader = () => {
  const [filters,setFilters] = useAgentsFilters();
    const [isDialogOpen, setDialogOpen] = useState(false);


    const isAnyFilterModified = !!filters.search;
    const onClearFilters = () => {
      setFilters({
        search: "",
        page: DEFAULT_PAGE
      });
    };
  return (
    <>
    <NewAgentDialogue open={isDialogOpen} onOpenChange={setDialogOpen} />
    <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium">My agents</h5>
        <Button onClick={() => setDialogOpen(true)} >
            <PlusIcon/>
            New agents</Button>
      </div>
      <ScrollArea>
      <div className="flex items-center gap-x-2 p-1">
        <AgentsSearchFilter />
        {isAnyFilterModified && (
          <Button 
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          >
            <XCircleIcon />
            Clear Filters
          </Button>
        )}
        </div>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
    </>
  );
};
