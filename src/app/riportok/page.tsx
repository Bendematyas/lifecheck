import { getCashFlowForecast } from '@/lib/cashflow'
import { formatCurrency } from '@/lib/utils'
import { CashFlowChart } from './CashFlowChart'
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Riportok() {
  const months = await getCashFlowForecast(6)

  return (
    <main className="p-4 space-y-4">
      <div className="pt-4 pb-2">
        <h1 className="text-xl font-bold">Cash flow előrejelzés</h1>
        <p className="text-gray-400 text-xs mt-1">6 hónapos likviditási terv</p>
      </div>

      {/* Grafikon */}
      <div className="bg-gray-900 rounded-xl p-4">
        <p className="text-xs text-gray-400 mb-3">Havi záró egyenleg (Ft)</p>
        <CashFlowChart data={months} />
      </div>

      {/* Hónapok táblázata */}
      <div className="space-y-3">
        {months.map((m) => {
          const isLow = m.closingBalance < 200000
          const isNegative = m.closingBalance < 0
          return (
            <div
              key={m.month}
              className={`rounded-xl p-4 ${isNegative ? 'bg-red-950 border border-red-800' : isLow ? 'bg-yellow-950 border border-yellow-800' : 'bg-gray-900'}`}
            >
              {/* Fejléc */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{m.label}</h2>
                  {(isNegative || isLow) && (
                    <AlertTriangle size={14} className={isNegative ? 'text-red-400' : 'text-yellow-400'} />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Záró egyenleg</p>
                  <p className={`font-bold ${isNegative ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-white'}`}>
                    {formatCurrency(m.closingBalance)}
                  </p>
                </div>
              </div>

              {/* Bevétel / Kiadás sor */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-green-400 mb-1">
                    <TrendingUp size={12} />
                    <span className="text-xs">Bevétel</span>
                  </div>
                  <p className="text-sm font-semibold text-green-400">{formatCurrency(m.income)}</p>
                </div>
                <div className="bg-black/20 rounded-lg p-2">
                  <div className="flex items-center gap-1 text-red-400 mb-1">
                    <TrendingDown size={12} />
                    <span className="text-xs">Kiadás</span>
                  </div>
                  <p className="text-sm font-semibold text-red-400">{formatCurrency(m.expense)}</p>
                </div>
              </div>

              {/* Tételek listája */}
              <div className="space-y-1">
                {m.items.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className={`${item.source === 'recurring' ? 'text-gray-400' : 'text-gray-300'}`}>
                      {item.source === 'recurring' ? '↻ ' : ''}{item.name}
                    </span>
                    <span className={item.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                      {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                {m.items.length > 5 && (
                  <p className="text-xs text-gray-500">+ {m.items.length - 5} további tétel</p>
                )}
              </div>

              {/* Nyitó egyenleg */}
              <div className="mt-2 pt-2 border-t border-gray-700/50 flex justify-between text-xs text-gray-500">
                <span>Nyitó egyenleg</span>
                <span>{formatCurrency(m.openingBalance)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
