import { Card, CardContent } from '@/components/ui/card'
import { CardSkeleton, Skeleton, StatCardSkeleton } from '@/components/shared/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-[30rem] max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-col gap-3 lg:flex-row">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-full lg:w-[220px]" />
            <Skeleton className="h-10 w-full lg:w-[240px]" />
          </div>

          <CardSkeleton rows={4} />
        </CardContent>
      </Card>
    </div>
  )
}
