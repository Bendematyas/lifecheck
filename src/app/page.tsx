import { formatCurrency, formatShortDate } from '@/lib/utils'
import { getAccounts, getMonthlyTotals, getUpcomingRecurring } from '@/lib/queries'
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 60

export default async function Dashboard() {
  const [accounts, { income, expense }, upcoming] = await Promise.all([
    getAccounts(),
    getMonthlyTotals(),
    getUpcomingRecurring(4),
  ])

  const totalBalance = accounts.reduce((s: number, a: { balance: number }) => s + a.balance, 0)
  const monthNet = income - expense

  return (
    <main className="p-4 space-y-4">
      <div className="pt-4 pb-2">
        <p className="text-gray-400 text-sm">LifeCheck</p>
        <h1 className="text-2xl font-bold">Szia, Mátyás!</h1>
      </div>

      {/* Összesített egyenleg */}
      <div className="bg-indigo-600 rounded-2xl p-5">
        <p className="text-indigo-200 text-sm mb-1">Teljes egyenleg</p>
        <p className="text-4xl font-bold tracking-tight">{formatCurrency(totalBalance)}</p>
        <div className="flex gap-3 mt-2">
          {accounts.map((a: { id: string; name: string; balance: number }) => (
            <span key={a.id} className="text-indigo-300 text-xs">{a.name}: {formatCurrency(a.balance)}</span>
          ))}
        </div>
      </div>

      {/* Havi összesítő */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">Bevétel (hónap)</span>
          </div>
          <p className="text-xl font-bold text-green-400">{formatCurrency(income)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <TrendingDown size={16} />
            <span className="text-xs font-medium">Kiadás (hónap)</span>
          </div>
          <p className="text-xl font-bold text-red-400">{formatCurrency(expense)}</p>
        </div>
      </div>

      {/* Havi mérleg */}
      <div className={`rounded-xl p-4 ${monthNet >= 0 ? 'bg-green-950 border border-green-800' : 'bg-red-950 border border-red-800'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet size={16} className={monthNet >= 0 ? 'text-green-400' : 'text-red-400'} />
            <span className="text-sm text-gray-300">Havi mérleg</span>
          </div>
          <p className={`text-xl font-bold ${monthNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {monthNet >= 0 ? '+' : ''}{formatCurrency(monthNet)}
          </p>
        </div>
      </div>

      {/* Közelgő ismétlődő tételek */}
      <div className="bg-gray-900 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Közelgő kiadások</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-500">Nincs közelgő tétel.</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((item: { id: string; name: string; amount: number; next_due_date: string }) => (
              <div key={item.id} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{formatShortDate(item.next_due_date)}</p>
                </div>
                <p className="text-sm font-medium text-red-400">{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gyors bevitel gomb */}
      <Link
        href="/tranzakciok?new=1"
        className="fixed bottom-20 right-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-indigo-900/50 transition-colors"
      >
        <Plus size={24} />
      </Link>
    </main>
  )
}
