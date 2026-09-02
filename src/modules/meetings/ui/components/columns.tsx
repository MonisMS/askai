"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
  ClockArrowUpIcon,
  VideoIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MeetingGetMany } from "../../types";
import { cn, formatDuration } from "@/lib/utils";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.



const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: VideoIcon,
  completed: CircleCheckIcon,
  cancelled: CircleXIcon,
  processing: LoaderIcon,
};

const statusColorMap = {
  upcoming:
    "bg-status-upcoming/10 text-status-upcoming border-status-upcoming/20",
  active: "bg-status-active/10 text-status-active border-status-active/20",
  completed:
    "bg-status-completed/10 text-status-completed border-status-completed/20",
  cancelled:
    "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20",
  processing:
    "bg-status-processing/10 text-status-processing border-status-processing/20",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-semibold">{row.original.name}</span>
        <div className="flex items-center gap-x-2">
          <div className="flex items-center gap-x-1">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate">
              {row.original.agent.name}
            </span>
          </div>  
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.agent.name}
            className="size-4"
          />
          <span className= "text-sm text-muted-foreground">
            {row.original.startedAt ? format(row.original.startedAt, "MMM d") : "Not started"}
            </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap];
      return(
        <Badge
        variant="outline"
        className={cn(
          "capitalize [&>svg]:size-4",
          statusColorMap[row.original.status as keyof typeof statusColorMap]
        )}
        >
          <Icon 
          className={cn(
            row.original.status === "processing" && "animate-spin"
          )}
          />
          {row.original.status}
          </Badge>
      )
  }
},
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge 
      variant="outline"
      className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
      >
        <ClockFadingIcon className="text-muted-foreground" />
        {row.original.duration ? formatDuration(row.original.duration) : "No duration"}
        </Badge>
    )
  }
  
];
