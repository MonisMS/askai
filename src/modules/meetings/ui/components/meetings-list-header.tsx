"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewMeetingDialogue } from "./new-meeting-dialogue";
import { useState } from "react";


export const MeetingsListHeader = () => {

const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
    <NewMeetingDialogue open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium">My MEETINGS</h5>
        <Button onClick={() => setIsDialogOpen(true) }>
            <PlusIcon/>
            new meetings</Button>
      </div>
      <div className="flex items-center gap-x-2 p-1">
       TDOO:FILTERS
        
        </div>
    </div>
    </>
  );
};
