import { Button } from "@/components/ui/button"
import { useSortable } from "@dnd-kit/sortable"
import { GripVertical } from "lucide-react"

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent cursor-move"
    >
      <GripVertical
        className="text-muted-foreground"
        data-icon="inline-start"
      />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

export default DragHandle
