'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Category { id: string; name: string; type: string; color: string }
interface Account { id: string; name: string }

export function TransactionForm({
  open: initialOpen,
  categories,
  accounts,
}: {
  open: boolean
  categories: Category[]
  accounts: Account[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(initialOpen)
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [isCash, setIsCash] = useState(false)
  const [saving, setSaving] = useState(false)

  const filteredCategories = categories.filter(c => c.type === type)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || !categoryId) return
    setSaving(true)

    await supabase.from('transactions').insert({
      date,
      amount: parseFloat(amount),
      type,
      category_id: categoryId,
      account_id: accountId || null,
      description: description || null,
      is_cash: isCash,
      source: 'manual',
    })

    // Frissítjük az account balance-t
    if (accountId) {
      const { data: acc } = await supabase.from('accounts').select('balance').eq('id', accountId).single()
      if (acc) {
        const delta = type === 'income' ? parseFloat(amount) : -parseFloat(amount)
        await supabase.from('accounts').update({ balance: acc.balance + delta }).eq('id', accountId)
      }
    }

    setSaving(false)
    setOpen(false)
    setAmount('')
    setDescription('')
    setCategoryId('')
    setIsCash(false)
    router.refresh()
  }

  return (
    <>
      {/* Lebegő + gomb */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-indigo-900/50 transition-colors z-40"
      >
        <Plus size={24} />
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end" onClick={() => setOpen(false)}>
          <div
            className="bg-gray-900 rounded-t-2xl w-full max-w-2xl mx-auto p-5 pb-8 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Új tétel</h2>
              <button onClick={() => setOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bevétel / Kiadás váltó */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setType('income'); setCategoryId('') }}
                  className={cn('py-2 rounded-lg text-sm font-medium transition-colors', type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400')}
                >
                  Bevétel
                </button>
                <button
                  type="button"
                  onClick={() => { setType('expense'); setCategoryId('') }}
                  className={cn('py-2 rounded-lg text-sm font-medium transition-colors', type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400')}
                >
                  Kiadás
                </button>
              </div>

              {/* Összeg */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Összeg (Ft)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="pl. 50000"
                  required
                  className="w-full bg-gray-800 rounded-lg px-4 py-3 text-xl font-bold text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Kategória */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Kategória</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {filteredCategories.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      className={cn(
                        'text-left px-3 py-2 rounded-lg text-sm transition-colors border',
                        categoryId === c.id
                          ? 'border-indigo-500 bg-indigo-950 text-white'
                          : 'border-gray-700 bg-gray-800 text-gray-300'
                      )}
                    >
                      <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dátum és zseb */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Dátum</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Zseb</label>
                  <select
                    value={accountId}
                    onChange={e => setAccountId(e.target.value)}
                    className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Leírás */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Megjegyzés (opcionális)</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="pl. júniusi workshop"
                  className="w-full bg-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Készpénz */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCash}
                  onChange={e => setIsCash(e.target.checked)}
                  className="w-4 h-4 accent-indigo-500"
                />
                <span className="text-sm text-gray-300">Készpénzes tranzakció</span>
              </label>

              {/* Mentés */}
              <button
                type="submit"
                disabled={saving || !amount || !categoryId}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                {saving ? 'Mentés...' : 'Mentés'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
