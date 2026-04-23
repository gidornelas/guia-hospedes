import { Card, CardContent } from '@/components/ui/card'
import { CardSkeleton, Skeleton, StatCardSkeleton } from '@/components/shared/skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-8 w-96 max-w-full" />
        <Skeleton className="h-4 w-[38rem] max-w-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      <Card className="shadow-card">
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <CardSkeleton rows={4} />
        <CardSkeleton rows={4} />
        <CardSkeleton rows={4} />
      </div>
    </div>
  )
}
