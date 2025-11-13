import { Skeleton } from '@/components/ui/skeleton';

export function ChatSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {/* AI Message */}
        <div className="flex items-start gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>
        </div>

        {/* User Message */}
        <div className="flex items-start justify-end gap-4">
          <div className="flex flex-1 flex-col items-end space-y-2">
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-10 w-3/4" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* AI Message */}
        <div className="flex items-start gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Chat Input Skeleton */}
      <div className="border-t p-4">
        <div className="relative">
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
