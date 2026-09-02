"use client"

import { useTRPC } from "@/trpc/client"
import { DataTable } from "@/components/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";
export const MeetingsView = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const [filters,setFilters] = useMeetingsFilters();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
      ...filters
    }))
    const isFiltered = !!filters.search || !!filters.status || !!filters.agentId;

    if (data.items.length === 0) {
        return (
            <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
                {isFiltered ? (
                    <EmptyState
                        title="No meetings found"
                        description="No meetings match your filters. Try adjusting them, or clear the filters to see all of your meetings."
                    />
                ) : (
                    <EmptyState
                        title="Create your first meeting"
                        description="Schedule a meeting with one of your agents. Each meeting lets you talk in real time, then keeps the transcript and summary afterwards."
                    />
                )}
            </div>
        );
    }

    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
           <DataTable
           data={data.items}
           columns={ columns }
           onRowClick={(row) => router.push(`/meetings/${row.id}`)}
           />
           <DataPagination 
           page={filters.page}
           totalPages={data.totalPages}
           onPageChange={(page) => setFilters({ page })}
           />
        </div>
    )
}

export const MeetingsViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meetings"
      description="This may take a few seconds"
    />
  );
};

export const MeetingsViewError = () => {
  return (
    <ErrorState
      title="Error loading meetings"
      description="Something went wrong"
    />
  );
};