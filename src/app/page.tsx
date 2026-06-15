import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const totalBalance = 803331
  const monthIncome = 616000
  const monthExpense = 289655
  const monthNet = monthIncome - monthExpense

  return (
    <main className="p-4 space-y-4">
      <div className="pt-4 pb-2">
        <p className="text-gray-400 text-sm">LifeCheck</p>
        <h1 className="text-2xl font-bold">Szia, Mátyás!</h1>
      </div>

      <div className="bg-indigo-600 rounded-2xl p-5">
        <p className="text-indigo-200 text-sm mb-1">Teljes egyenleg</p>
        <p className="text-4xl font-bold tracking-tight">{formatCurrency(totalBalance)}</p>
        <p className="text-indigo-300 text-xs mt-2">Erste – mind a 3 zseb összesen</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">Bevétel (hónap)</span>
          </div>
          <p className="text-xl font-bold text-green-400">{formatCurrency(monthIncome)}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <TrendingDown size={16} />
            <span className="text-xs font-medium">Kiadás (hónap)</span>
          </div>
          <p className="text-xl font-bold text-red-400">{formatCurrency(monthExpense)}</p>
        </div>
      </div>

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

      <div className="bg-gray-900 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Közelgő kiadások</h2>
        <div className="space-y-2">
          {[
            { name: 'Élet / megélhetés', amount: 112500, due: 'Hétfő' },
            { name: 'Adó', amount: 101682, due: 'Júl. 1.' },
            { name: 'Pszicho franchise', amount: 37973, due: 'Júl. 5.' },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.due}</p>
              </div>
              <p className="text-sm font-medium text-red-400">{formatCurrency(item.amount)}</p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/tranzakciok?new=1"
        className="fixed bottom-20 right-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-indigo-900/50 transition-colors"
      >
        <Plus size={24} />
      </Link>
    </main>
  )
}
