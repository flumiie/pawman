"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Shield, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { data } from "@/data/passwords"

interface SearchItem {
  title: string
  description: string
  url: string
  group: string
  icon?: LucideIcon
}

interface CommandSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandSearch({ open, onOpenChange }: CommandSearchProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")

  const allItems: SearchItem[] = data.map((p) => ({
    title: p.name,
    description: p.username,
    url: "/main/passwords",
    group: "Passwords",
    icon: Shield,
  }))

  const groupedItems = allItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = []
      acc[item.group].push(item)
      return acc
    },
    {} as Record<string, SearchItem[]>
  )

  const handleSelect = (url: string) => {
    navigate(url)
    onOpenChange(false)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Command Search"
      description="Search secrets"
      className="sm:max-w-[640px]"
    >
      <Command>
        <CommandInput
          placeholder="Type secrets here..."
          autoFocus
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[400px]">
          {query ? (
            <CommandEmpty>No results found :(</CommandEmpty>
          ) : (
            <CommandEmpty>Input is empty :(</CommandEmpty>
          )}
          {query &&
            Object.entries(groupedItems).map(([group, items]) => (
              <CommandGroup key={group} heading={group}>
                {items.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <CommandItem
                      key={`${item.url}-${i}`}
                      value={`${item.title} ${item.description ?? ""}`}
                      onSelect={() => handleSelect(item.url)}
                    >
                      {Icon && <Icon />}
                      <div className="flex flex-col">
                        <span>{item.title}</span>
                        {item.description && (
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="relative w-full justify-start font-normal text-muted-foreground sm:pr-12 md:w-36 lg:w-56"
    >
      <Search data-icon="inline-start" />
      Search...
      <Kbd className="absolute top-1/2 right-1.5 hidden -translate-y-1/2 sm:inline-flex">
        ⌘K
      </Kbd>
    </Button>
  )
}
