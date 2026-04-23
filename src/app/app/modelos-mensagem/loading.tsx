import { Card, CardContent } from '@/components/ui/card'
import { CardSkeleton, Skeleton, StatCardSkeleton } from '@/components/shared/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-[34rem] max-w-full" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="space-y-4 p-6">
          <div className="flex justify-end">
            <Skeleton className="h-10 w-full sm:w-[280px]" />
          </div>
          <CardSkeleton rows={4} />
        </CardContent>
      </Card>
    </div>
  )
}
