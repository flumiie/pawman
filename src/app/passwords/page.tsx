import { BaseLayout } from "@/components/layouts/base-layout"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import List from "./components/list"

export default function Page() {
  const auth = useAuth()
  const data = [
    { id: 1, name: "A", username: "a@a.com" },
    { id: 2, name: "B", username: "b@b.com" },
    { id: 3, name: "A", username: "a@a.com" },
    { id: 4, name: "B", username: "b@b.com" },
    { id: 5, name: "A", username: "a@a.com" },
    { id: 6, name: "B", username: "b@b.com" },
    { id: 7, name: "A", username: "a@a.com" },
    { id: 8, name: "B", username: "b@b.com" },
    { id: 9, name: "A", username: "a@a.com" },
    { id: 10, name: "B", username: "b@b.com" },
    { id: 11, name: "A", username: "a@a.com" },
    { id: 12, name: "B", username: "b@b.com" },
    { id: 13, name: "A", username: "a@a.com" },
    { id: 14, name: "B", username: "b@b.com" },
    { id: 15, name: "A", username: "a@a.com" },
    { id: 16, name: "B", username: "b@b.com" },
  ]

  return (
    <BaseLayout title="All">
      <div className="@container/main flex flex-col gap-4">
        <div className="flex justify-end px-4 lg:px-6">
          <Button variant="outline" size="sm" onClick={() => auth?.logout()}>
            <LogOut className="size-3.5" />
            Log out
          </Button>
        </div>
        <List data={data} />
      </div>
    </BaseLayout>
  )
}
