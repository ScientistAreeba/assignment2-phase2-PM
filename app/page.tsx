import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-balance text-4xl font-semibold tracking-tight">PRISMO</h1>
      <p className="text-muted-foreground">Project Management Standards Intelligence & Comparison</p>
      <Link href="/phase-two">
        <Button>Process Proposal</Button>
      </Link>
    </main>
  )
}
