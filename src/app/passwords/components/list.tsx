import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item"

export default function List(props: {
  data: any
  // name: string
  // username: string
  // twofactorcode: number
}) {
  return props.data.map((d) => (
    <div
      className="pl-4 pr-4"
      onClick={() => {
        //
      }}
    >
      <Item variant="default">
        <ItemContent>
          <ItemTitle>{d.name ?? "-"}</ItemTitle>
          <ItemDescription>{d.username ?? "-"}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  ))
}
