import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "meet-at-2",
  eventKey: process.env.INNGEST_EVENT_KEY,
});