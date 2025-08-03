import { EmptyState } from "@/components/empty-state";



export const CancelledState = () => {
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-4 items-center justify-center">
            <EmptyState 
            image="/cancelled.svg"
            title="Meeting Cancelled"
            description="This meeting has been cancelled and will not take place."
            />
        </div>
    )
}