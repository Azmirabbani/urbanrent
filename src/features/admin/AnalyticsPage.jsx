import { BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader.jsx'

export default function AnalyticsPage() {
  return (
    <div className="bg-page-dots">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <PageHeader
          eyebrow="Admin"
          icon={BarChart3}
          title="Analytics"
          description="Total user, listing aktif, booking, dan tren pertumbuhan."
        />
        <div className="content-stack mt-10 p-12 text-center text-sm text-stone-600">
          Grafik dan export data menyusul.
        </div>
      </div>
    </div>
  )
}
