import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DecisionReportSkeleton() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* The Verdict */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/5" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/6" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Priorities */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </CardContent>
        </Card>

        {/* Options Analysis */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Option 1 */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
            {/* Option 2 */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
