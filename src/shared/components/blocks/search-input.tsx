"use client"

import { ButtonGroup } from "@shadcn-ui/button-group"
import { cn } from "../../utils/cn"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@shadcn-ui/input-group"
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import { useState } from "react"

interface SearchInputProps {
  placeholder?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSearch?: (value: string) => void
  className?: string
  enterButton?: boolean
}

function SearchInput({
  placeholder = "Search...",
  defaultValue,
  onSearch,
  onValueChange,
  className,
  enterButton = true,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(defaultValue ?? "")

  return (
    <ButtonGroup className={cn("w-full", className)}>
      <InputGroup>
        <InputGroupAddon align={"inline-start"}>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupInput
          id="inline-end-input"
          placeholder={placeholder}
          inputMode="search"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            onValueChange?.(e.target.value)
            if (e.target.value === "") {
              onSearch?.("")
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch?.(searchValue)
            }
          }}
        />
        {searchValue && (
          <InputGroupAddon align="inline-end">
            <button
              className="mr-2 hover:text-foreground"
              onClick={() => {
                setSearchValue("")
                onSearch?.("")
                onValueChange?.("")
              }}
            >
              <XIcon className="size-3.5" />
            </button>
          </InputGroupAddon>
        )}
      </InputGroup>
      {enterButton && (
        <Button
          className="border-input"
          variant={"secondary"}
          onClick={() => {
            if (searchValue) {
              onSearch?.(searchValue)
            }
          }}
        >
          <ArrowRightIcon />
        </Button>
      )}
    </ButtonGroup>
  )
}

export { SearchInput }
