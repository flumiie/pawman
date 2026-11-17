import { BaseLayout } from "@/components/layouts/base-layout"

import List from "./components/list"

export default function Page() {
  const data = [
    { id: 1, name: "A", username: "a@a.com" },
    { id: 2, name: "B", username: "b@b.com" },
  ]

  return (
    <BaseLayout title="All">
      <div className="@container/main">
        <List data={data} />
      </div>
    </BaseLayout>
  )
}
