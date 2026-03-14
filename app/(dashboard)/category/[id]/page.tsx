import CategoryClient from '@/components/content/CategoryClient'
export default function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  return <CategoryClient paramsPromise={params} />
}
