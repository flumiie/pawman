import { BaseLayout } from "@/components/layouts/base-layout"
import List from "./components/list"
import { data } from "@/data/passwords"

export default function Page() {
  return (
    <BaseLayout title="All">
      <div className="@container/main flex flex-col gap-4">
        <List data={data} />
      </div>
    </BaseLayout>
  )
}
