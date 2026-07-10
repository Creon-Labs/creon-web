import { cn } from "@/shared/utils/cn"

type HeadingProps = {
  children?: React.ReactNode
  className?: string
} & React.ComponentProps<"h1">

function H1(props: HeadingProps) {
  return (
    <h1
      className={cn(
        "text-4xl leading-[1.1] font-extrabold tracking-tight",
        props.className
      )}
    >
      {props.children}
    </h1>
  )
}
function H2(props: HeadingProps) {
  return (
    <h2
      className={cn(
        "text-3xl leading-[1.15] font-extrabold tracking-tight",
        props.className
      )}
    >
      {props.children}
    </h2>
  )
}
function H3(props: HeadingProps) {
  return (
    <h3 className={cn("text-2xl leading-tight font-bold", props.className)}>
      {props.children}
    </h3>
  )
}

function H4(props: HeadingProps) {
  return (
    <h4 className={cn("text-xl leading-snug font-bold", props.className)}>
      {props.children}
    </h4>
  )
}

function H5(props: HeadingProps) {
  return (
    <h5 className={cn("text-lg leading-snug font-semibold", props.className)}>
      {props.children}
    </h5>
  )
}

function H6(props: HeadingProps) {
  return (
    <h6 className={cn("text-base leading-snug font-semibold", props.className)}>
      {props.children}
    </h6>
  )
}

export { H1, H2, H3, H4, H5, H6 }
