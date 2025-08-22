import Spinner from '../Spinner'

function HotCardSkeleton() {
  return (
    <div className="bg-card/60 relative flex h-[135px] w-full rounded-md lg:flex-row">
      {/* Image Skeleton */}
      <div className="flex h-full w-[100px] items-center justify-center rounded-l-md bg-gray-700/30">
        <Spinner />
      </div>

      {/* Triangle Ribbon Placeholder */}
      <div className="absolute top-0 right-0 h-0 w-0 border-t-[60px] border-l-[60px] border-t-gray-600 border-l-transparent" />

      {/* Placement Number Placeholder */}
      <div className="absolute right-3 bottom-2 h-6 w-10 rounded bg-gray-600/30" />

      {/* Content Skeleton */}
      <div className="flex-1 space-y-2 p-6">
        {/* Fake Name */}
        <div className="h-4 w-2/3 rounded bg-gray-600/30" />
        {/* Fake Votes */}
        <div className="h-4 w-1/2 rounded bg-gray-600/30" />
        {/* Fake Gains */}
        <div className="h-4 w-1/3 rounded bg-gray-600/30" />
      </div>
    </div>
  )
}

export default HotCardSkeleton
