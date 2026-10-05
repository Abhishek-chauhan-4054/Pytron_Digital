import { Skeleton, TableSkeleton } from "@/components/admin/ui/Feedback";

export default function Loading() {
  return (
    <div>
      <Skeleton className="mb-2 h-7 w-40" />
      <Skeleton className="mb-6 h-4 w-72" />
      <Skeleton className="mb-4 h-10 w-full" />
      <TableSkeleton />
    </div>
  );
}
