import * as Heading from "@/shared/components/typography/heading"
import { Text } from "@/shared/components/typography/text"
import { Button } from "@shadcn-ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <>
      <div className="flex p-6">
        <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <div>
            <h1 className="font-medium">Project ready!</h1>
            <p>You may now add components and start building.</p>
            <p>We&apos;ve already added the button component for you.</p>
            <Button className="mt-2">Button</Button>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <Heading.H1>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas enim
          dolores placeat quia architecto eaque, cumque delectus et repellat
          modi ducimus alias iusto quos rerum accusamus laborum, obcaecati ipsum
          culpa!
        </Heading.H1>
        <Heading.H2>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas enim
          dolores placeat quia architecto eaque, cumque delectus et repellat
          modi ducimus alias iusto quos rerum accusamus laborum, obcaecati ipsum
          culpa!
        </Heading.H2>
        <Heading.H3>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas enim
          dolores placeat quia architecto eaque, cumque delectus et repellat
          modi ducimus alias iusto quos rerum accusamus laborum, obcaecati ipsum
          culpa!
        </Heading.H3>
        <Heading.H4>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas enim
          dolores placeat quia architecto eaque, cumque delectus et repellat
          modi ducimus alias iusto quos rerum accusamus laborum, obcaecati ipsum
          culpa!
        </Heading.H4>
        <Heading.H5>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas enim
          dolores placeat quia architecto eaque, cumque delectus et repellat
          modi ducimus alias iusto quos rerum accusamus laborum, obcaecati ipsum
          culpa!
        </Heading.H5>
        <Heading.H6>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas enim
          dolores placeat quia architecto eaque, cumque delectus et repellat
          modi ducimus alias iusto quos rerum accusamus laborum, obcaecati ipsum
          culpa!
        </Heading.H6>
        <Text variant={"overline"}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas enim
          dolores placeat quia architecto eaque, cumque delectus et repellat
          modi ducimus alias iusto quos rerum accusamus laborum, obcaecati ipsum
          culpa! <Link href={"#"}>Hello!</Link>
        </Text>
      </div>
    </>
  )
}
