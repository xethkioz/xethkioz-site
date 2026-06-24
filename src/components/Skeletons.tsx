export function ArticleSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' | 'hero' | 'horizontal' }) {
  const base = 'skeleton rounded-xl overflow-hidden'
  if (variant === 'hero') {
    return (
      <div className={`${base} aspect-[2/1]`}>
        <div className="h-4/5 skeleton-shimmer" />
        <div className="p-4 space-y-2">
          <div className="h-3 w-16 rounded skeleton-shimmer" />
          <div className="h-5 w-3/4 rounded skeleton-shimmer" />
          <div className="h-3 w-1/2 rounded skeleton-shimmer" />
        </div>
      </div>
    )
  }
  if (variant === 'featured') {
    return (
      <div className={`${base} aspect-[16/9]`}>
        <div className="h-3/4 skeleton-shimmer" />
        <div className="p-4 space-y-2">
          <div className="h-3 w-20 rounded skeleton-shimmer" />
          <div className="h-5 w-2/3 rounded skeleton-shimmer" />
          <div className="h-3 w-full rounded skeleton-shimmer" />
          <div className="h-3 w-1/3 rounded skeleton-shimmer" />
        </div>
      </div>
    )
  }
  if (variant === 'compact') {
    return (
      <div className={`${base} flex gap-4 p-4`}>
        <div className="w-20 h-20 rounded-lg skeleton-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 rounded skeleton-shimmer" />
          <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          <div className="h-3 w-1/2 rounded skeleton-shimmer" />
        </div>
      </div>
    )
  }
  if (variant === 'horizontal') {
    return (
      <div className={`${base} flex gap-4 p-4`}>
        <div className="w-32 h-24 rounded-lg skeleton-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded skeleton-shimmer" />
          <div className="h-5 w-2/3 rounded skeleton-shimmer" />
          <div className="h-3 w-full rounded skeleton-shimmer" />
          <div className="h-3 w-1/4 rounded skeleton-shimmer" />
        </div>
      </div>
    )
  }
  return (
    <div className={`${base} aspect-[3/4]`}>
      <div className="h-2/3 skeleton-shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 rounded skeleton-shimmer" />
        <div className="h-5 w-2/3 rounded skeleton-shimmer" />
        <div className="h-3 w-full rounded skeleton-shimmer" />
        <div className="h-3 w-1/3 rounded skeleton-shimmer" />
      </div>
    </div>
  )
}

export function StreamSkeleton() {
  return (
    <div className="skeleton rounded-xl overflow-hidden">
      <div className="aspect-video skeleton-shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-2/3 rounded skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded skeleton-shimmer" />
      </div>
    </div>
  )
}

export function MediaSkeleton() {
  return (
    <div className="skeleton rounded-xl overflow-hidden">
      <div className="aspect-[4/3] skeleton-shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-2/3 rounded skeleton-shimmer" />
        <div className="h-3 w-full rounded skeleton-shimmer" />
      </div>
    </div>
  )
}

export function AuthorSkeleton() {
  return (
    <div className="skeleton rounded-2xl p-6 text-center">
      <div className="w-24 h-24 rounded-full skeleton-shimmer mx-auto mb-4" />
      <div className="h-5 w-1/2 mx-auto rounded skeleton-shimmer mb-2" />
      <div className="h-3 w-1/3 mx-auto rounded skeleton-shimmer mb-3" />
      <div className="h-3 w-2/3 mx-auto rounded skeleton-shimmer" />
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="skeleton h-10 w-24 rounded-full skeleton-shimmer" />
  )
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <ArticleSkeleton key={i} />
      ))}
    </div>
  )
}

export function StreamGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <StreamSkeleton key={i} />
      ))}
    </div>
  )
}

export function MediaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <MediaSkeleton key={i} />
      ))}
    </div>
  )
}

export function AuthorGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <AuthorSkeleton key={i} />
      ))}
    </div>
  )
}

export function ErrorDisplay({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-4xl mb-4">⚠️</div>
      <p className="text-gray-400 mb-4">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Retry
        </button>
      )}
    </div>
  )
}
