import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item"
import { Button } from "@base-ui/react"
import { ChevronRightIcon } from "lucide-react"

export default function List(props: {
  data: any
  // name: string
  // username: string
  // twofactorcode: number
}) {
  return props.data.map((d) => (
    <div className="pl-4 pr-4">
      <Item variant="default">
        <ItemContent>
          <ItemTitle>{d.name ?? "-"}</ItemTitle>
          <ItemDescription>{d.username ?? "-"}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            <ChevronRightIcon className="size-5" aria-hidden="true" />
          </Button>
        </ItemActions>
      </Item>
    </div>
  ))
}
