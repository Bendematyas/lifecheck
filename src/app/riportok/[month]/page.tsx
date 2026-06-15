import { getCashFlowForecast } from '@/lib/cashflow'
import { formatCurrency, formatShortDate } from '@/lib/utils'
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function MonthDetail({
  params,
}: {
  params: Promise<{ month: string }>
}) {
  const { month } = await params
  const allMonths = await getCashFlowForecast(6)
  const data = allMonths.find(m => m.month === month)

  if (!data) notFound()

  const incomeItems = data.items.filter(i => i.type === 'income')
  const expenseItems = data.items.filter(i => i.type === 'expense')

  return (
    <main className="p-4 space-y-4">
      <div className="pt-4 pb-2 flex items-center gap-3">
        <Link href="/riportok" className="text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">{data.label}</h1>
      </div>

      {/* Összesítő */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-900 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Nyitó</p>
          <p className="text-sm font-bold">{formatCurrency(data.openingBalance)}</p>
        </div>
        <div className="bg-green-950 rounded-xl p-3 text-center">
          <p className="text-xs text-green-400 mb-1">Bevétel</p>
          <p className="text-sm font-bold text-green-400">{formatCurrency(data.income)}</p>
        </div>
        <div className="bg-red-950 rounded-xl p-3 text-center">
          <p className="text-xs text-red-400 mb-1">Kiadás</p>
          <p className="text-sm font-bold text-red-400">{formatCurrency(data.expense)}</p>
        </div>
      </div>

      {/* Záró egyenleg */}
      <div className={`rounded-xl p-4 flex justify-between items-center ${data.closingBalance < 0 ? 'bg-red-950 border border-red-800' : data.closingBalance < 200000 ? 'bg-yellow-950 border border-yellow-800' : 'bg-indigo-950 border border-indigo-800'}`}>
        <span className="text-sm text-gray-300">Záró egyenleg</span>
        <span className={`text-xl font-bold ${data.closingBalance < 0 ? 'text-red-400' : data.closingBalance < 200000 ? 'text-yellow-400' : 'text-indigo-300'}`}>
          {formatCurrency(data.closingBalance)}
        </span>
      </div>

      {/* Bevételek */}
      {incomeItems.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-green-400" />
            <h2 className="text-sm font-semibold text-green-400">Bevételek</h2>
          </div>
          <div className="space-y-2">
            {incomeItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-2">
                  {item.source === 'recurring' && <RefreshCw size={12} className="text-gray-500 flex-shrink-0" />}
                  <span className="text-sm">{item.name}</span>
                  {item.source === 'recurring' && <span className="text-xs text-gray-500">tervezett</span>}
                </div>
                <span className="text-sm font-medium text-green-400">+{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kiadások */}
      {expenseItems.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-red-400" />
            <h2 className="text-sm font-semibold text-red-400">Kiadások</h2>
          </div>
          <div className="space-y-2">
            {expenseItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-2">
                  {item.source === 'recurring' && <RefreshCw size={12} className="text-gray-500 flex-shrink-0" />}
                  <span className="text-sm">{item.name}</span>
                  {item.source === 'recurring' && <span className="text-xs text-gray-500">tervezett</span>}
                </div>
                <span className="text-sm font-medium text-red-400">-{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {incomeItems.length === 0 && expenseItems.length === 0 && (
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <p className="text-gray-400 text-sm">Nincs adat ehhez a hónaphoz.</p>
        </div>
      )}
    </main>
  )
}
