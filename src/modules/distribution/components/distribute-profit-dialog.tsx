"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@shadcn-ui/dialog"
import { Button } from "@shadcn-ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@shadcn-ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shadcn-ui/input-group"

export function DistributeProfitDialog() {
  const [isOpen, setIsOpen] = useState(false)

  // This is a UI-only component. API implementation will be added later.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Distribute Profit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Distribute Profit</DialogTitle>
          <DialogDescription>
            Enter the amount of profit in USDC you want to distribute to your
            investors as dividends.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="amount">Distribution Amount</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  USDC
                </InputGroupAddon>
                <InputGroupInput
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </InputGroup>
              <FieldDescription>
                This amount will be distributed proportionally based on shares.
              </FieldDescription>
            </Field>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Prepare Transaction</Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
