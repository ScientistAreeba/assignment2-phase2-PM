"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SCENARIOS } from "@/lib/process-schema"

export function ScenarioSelector(props: { value: string; onChange: (v: string) => void }) {
  const { value, onChange } = props
  return (
    <div className="grid grid-cols-1 gap-3">
      {SCENARIOS.map((s) => (
        <Button
          key={s.id}
          variant={value === s.id ? "default" : "outline"}
          className={cn("justify-start text-left", value === s.id && "ring-2 ring-primary")}
          onClick={() => onChange(s.id)}
        >
          {s.name}
        </Button>
      ))}
    </div>
  )
}
