import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/trpc/routers/_app";

export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export enum MeetingStatus {
  Upcoming = "upcoming",
  Active = "active",
  Completed = "completed",
  Cancelled = "cancelled",
  Processing = "processing",
}

export type StreamTranscriptItem = {
  speaker_Id:string;
  type:string;
  text:string;
  start_ts:number;
  stop_ts:number;
}
