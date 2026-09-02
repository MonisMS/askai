import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MAX_FREE_AGENTS, MAX_FREE_MEETINGS } from "@/modules/premium/constants";

const steps = [
  {
    title: "Describe the agent",
    body: "Give it a name and a set of instructions. That is the whole setup — the instructions decide how it behaves once the call starts.",
  },
  {
    title: "Meet on video",
    body: "Join a real-time call. The agent joins as a participant: it listens, answers, and holds the thread of the conversation.",
  },
  {
    title: "Read it back",
    body: "When the call ends you get the transcript, a written summary, and a chat you can ask about anything that was said.",
  },
];

const afterTheCall = [
  { term: "Transcript", detail: "Every turn, attributed to whoever said it, searchable." },
  { term: "Summary", detail: "An overview and sectioned notes, written from the transcript." },
  { term: "Recording", detail: "The call itself, kept alongside the notes." },
  { term: "Ask AI", detail: "Follow-up questions answered from the meeting, days later." },
];

export const LandingView = () => {
  return (
    <div className="min-h-svh bg-background flex flex-col">
      <header className="border-b">
        <div className="mx-auto w-full max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="" width={28} height={28} />
            <span className="text-lg font-semibold">AskAI</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Start free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Statement-led opener, left-biased rather than a centred hero */}
        <section className="mx-auto w-full max-w-5xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
          <h1 className="max-w-3xl text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
            An AI you can actually
            <br className="hidden sm:block" /> sit down and meet with.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Write the instructions once. It joins the video call, talks with you
            in real time, and hands back a transcript and a summary when you
            hang up.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/sign-up">Start free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free plan includes {MAX_FREE_AGENTS} agent and {MAX_FREE_MEETINGS}{" "}
            meetings. No card required.
          </p>
        </section>

        {/* Ordered because the steps genuinely happen in sequence */}
        <section className="border-t">
          <div className="mx-auto w-full max-w-5xl px-6 py-16">
            <h2 className="text-sm font-medium text-muted-foreground">
              How it works
            </h2>
            <ol className="mt-8 flex flex-col">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t py-8 first:border-t-0 first:pt-0 md:grid-cols-[3rem_16rem_1fr] md:gap-x-8"
                >
                  <span className="text-sm tabular-nums text-muted-foreground pt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-medium">{step.title}</h3>
                  <p className="col-start-2 text-muted-foreground leading-relaxed md:col-start-3 md:row-start-1 md:max-w-xl">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t bg-muted/40">
          <div className="mx-auto w-full max-w-5xl px-6 py-16">
            <h2 className="text-2xl font-medium tracking-tight">
              The meeting does not end when the call does.
            </h2>
            <dl className="mt-8 grid gap-x-12 gap-y-6 sm:grid-cols-2">
              {afterTheCall.map((item) => (
                <div key={item.term} className="border-t pt-4">
                  <dt className="font-medium">{item.term}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto w-full max-w-5xl px-6 py-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-medium tracking-tight">
                Create your first agent.
              </h2>
              <p className="mt-2 text-muted-foreground">
                It takes a name and a paragraph of instructions.
              </p>
            </div>
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link href="/sign-up">Start free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto w-full max-w-5xl px-6 py-8 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>AskAI</span>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="hover:text-foreground underline underline-offset-4">
              Sign in
            </Link>
            <Link href="/sign-up" className="hover:text-foreground underline underline-offset-4">
              Create an account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
