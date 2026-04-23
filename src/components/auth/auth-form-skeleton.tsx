import { Skeleton } from '@/components/shared/skeleton'

export function AuthFormSkeleton() {
  return (
    <div className="space-y-5" aria-hidden="true">
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/70" />
          </div>
          <div className="relative flex justify-center">
            <Skeleton className="h-4 w-36 rounded-full bg-background" />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}
