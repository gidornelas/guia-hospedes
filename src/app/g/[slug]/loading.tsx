import { Skeleton } from '@/components/shared/skeleton'

export default function GuideLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header skeleton */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Welcome hero */}
        <div className="text-center space-y-3">
          <Skeleton className="h-6 w-32 mx-auto rounded-full" />
          <Skeleton className="h-8 w-56 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Quick actions */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Info card */}
        <Skeleton className="h-24 rounded-xl" />
      </div>

      {/* Bottom bar skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200">
        <div className="max-w-lg mx-auto px-4 py-3">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
