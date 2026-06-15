import { supabase } from '@/lib/supabase'
import { formatCurrency, formatShortDate } from '@/lib/utils'
import { TransactionForm } from './TransactionForm'
import { TrendingUp, TrendingDown } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Tranzakciok({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>
}) {
  const params = await searchParams
  const showForm = params.new === '1'

  const [{ data: transactions }, { data: categories }, { data: accounts }] = await Promise.all([
    supabase
      .from('transactions')
      .select('*, categories(name, color)')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('categories').select('*').order('name'),
    supabase.from('accounts').select('*').order('created_at'),
  ])

  return (
    <main className="p-4 space-y-4">
      <div className="pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-xl font-bold">Tranzakciók</h1>
      </div>

      <TransactionForm
        open={showForm}
        categories={categories ?? []}
        accounts={accounts ?? []}
      />

      <div className="space-y-2">
        {(transactions ?? []).length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-6 text-center">
            <p className="text-gray-400 text-sm">Még nincs tranzakció.</p>
            <p className="text-gray-500 text-xs mt-1">Nyomd a + gombot az első rögzítéséhez.</p>
          </div>
        ) : (
          (transactions ?? []).map((t: {
            id: string
            date: string
            description?: string
            amount: number
            type: string
            is_cash: boolean
            categories?: { name: string; color: string }
          }) => (
            <div key={t.id} className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: t.categories?.color ?? '#94a3b8' }}
                >
                  {t.type === 'income'
                    ? <TrendingUp size={14} className="text-white" />
                    : <TrendingDown size={14} className="text-white" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium">{t.description ?? t.categories?.name ?? '–'}</p>
                  <p className="text-xs text-gray-500">
                    {t.categories?.name} · {formatShortDate(t.date)}
                    {t.is_cash && ' · készpénz'}
                  </p>
                </div>
              </div>
              <p className={`text-sm font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
