"use client"

import { useState } from "react"
import { z } from "zod"
import { toast } from "sonner"
import { Spinner } from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shadcn-ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shadcn-ui/input-group"
import { useHookForm } from "@/shared/lib/hook-form"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { usePrepareDistributionDeposit } from "../api/prepare-distribution-deposit"
import { useSubmitDistributionDeposit } from "../api/submit-distribution-deposit"
import { getDistributionDepositErrorMessage } from "../utils/distribution-error"

const schema = z.object({
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .regex(/^\d+(\.\d{1,7})?$/, {
      message: "Invalid amount format (up to 7 decimals)",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0",
    }),
})

type DistributeProfitFormValues = z.infer<typeof schema>

interface DistributeProfitDialogProps {
  campaignId: string
  onDistributeSuccess?: () => void
}

export function DistributeProfitDialog({
  campaignId,
  onDistributeSuccess,
}: DistributeProfitDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { signTransaction, connectedAddress } = useStellarWallet()

  const form = useHookForm({
    schema,
    defaultValues: {
      amount: "",
    },
  })

  const { mutateAsync: prepareDeposit, isPending: isPreparing } =
    usePrepareDistributionDeposit()
  const { mutateAsync: submitDeposit, isPending: isSubmitting } =
    useSubmitDistributionDeposit()

  const [isSigning, setIsSigning] = useState(false)

  const isLoading = isPreparing || isSigning || isSubmitting

  const onSubmit = async (data: DistributeProfitFormValues) => {
    if (!connectedAddress) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet first.",
      })
      return
    }

    try {
      // 1. Prepare
      const { xdr } = await prepareDeposit({
        campaignId,
        data: { amount: data.amount },
      })

      // 2. Sign
      setIsSigning(true)
      const { signedTxXdr: signedXdr } = await signTransaction(xdr)
      setIsSigning(false)

      // 3. Submit
      await submitDeposit({
        campaignId,
        data: { signedXdr },
      })

      toast.success("Profit deposit submitted", {
        description:
          "The shareholder snapshot is now being prepared. Dividends are not claimable until processing completes.",
      })

      setIsOpen(false)
      form.reset()
      onDistributeSuccess?.()
    } catch (error: unknown) {
      setIsSigning(false)
      toast.error("Distribution failed", {
        description: getDistributionDepositErrorMessage(error),
      })
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (isLoading) return
    setIsOpen(open)
    if (!open) {
      form.reset()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <Alert>
              <AlertTitle>USDC wallet requirement</AlertTitle>
              <AlertDescription>
                Your entrepreneur wallet needs a USDC trustline and enough USDC
                to cover the full profit amount before signing.
              </AlertDescription>
            </Alert>
            <Field>
              <FieldLabel htmlFor="amount">Distribution Amount</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">USDC</InputGroupAddon>
                <InputGroupInput
                  id="amount"
                  type="text"
                  placeholder="0.00"
                  {...form.register("amount")}
                  disabled={isLoading}
                />
              </InputGroup>
              <FieldError errors={[form.formState.errors.amount]} />
              <FieldDescription>
                This amount will be distributed proportionally based on shares.
              </FieldDescription>
            </Field>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner
                      data-icon="inline-start"
                      className="animate-spin"
                    />
                    {isPreparing
                      ? "Preparing..."
                      : isSigning
                        ? "Waiting for Wallet..."
                        : "Submitting..."}
                  </>
                ) : (
                  "Distribute Profit"
                )}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
