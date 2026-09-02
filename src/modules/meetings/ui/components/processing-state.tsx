import { EmptyState } from "@/components/empty-state";



export const ProcessingState = () => {
    return(
        <div className="bg-card rounded-lg px-4 py-5 flex flex-col gap-y-4 items-center justify-center">
            <EmptyState 
            image="/processing.svg"
            title="Processing meeting"
            description="The meeting has ended. Its transcript and summary will be ready shortly."
            />
        </div>
    )
}