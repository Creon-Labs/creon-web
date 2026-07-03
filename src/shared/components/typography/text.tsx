import { cn } from "@/shared/utils/cn"
import { cva, VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

type TextProps = {
  asChild?: boolean
} & VariantProps<typeof textVariants> &
  React.ComponentProps<"p">

const textVariants = cva(
  "group/p leading- text-balance text-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:font-medium",
  {
    variants: {
      variant: {
        "body-large": "text-lg",
        body: "text-base",
        "body-small": "text-sm",
        caption: "text-sm text-muted-foreground",
        "caption-sm": "text-xs text-muted-foreground",
        label: "text-sm font-medium",
        "label-small": "text-xs font-medium",
        overline: "text-xs font-medium tracking-wider uppercase",
      },
    },
    defaultVariants: {
      variant: "body",
    },
  }
)

function Text(props: TextProps) {
  const Comp = props.asChild ? Slot.Root : "p"

  return (
    <Comp
      data-slot="p"
      data-variant={props.variant}
      className={cn(textVariants({ variant: props.variant }), props.className)}
    >
      {props.children}
    </Comp>
  )
}

export { Text, textVariants }
