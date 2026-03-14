import ShareClient from '@/components/content/ShareClient'
export default function SharePage({ params }: { params: Promise<{ token: string }> }) {
  return <ShareClient paramsPromise={params} />
}
