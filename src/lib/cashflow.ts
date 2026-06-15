import { supabase } from './supabase'

export interface MonthData {
  month: string        // "2026-06"
  label: string        // "Június"
  openingBalance: number
  income: number
  expense: number
  closingBalance: number
  items: { name: string; amount: number; type: 'income' | 'expense'; source: 'recurring' | 'actual' }[]
}

const HU_MONTHS = ['Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December']

export async function getCashFlowForecast(months = 6): Promise<MonthData[]> {
  const now = new Date()

  const [{ data: accounts }, { data: recurring }, { data: transactions }] = await Promise.all([
    supabase.from('accounts').select('balance'),
    supabase.from('recurring_items').select('*').eq('active', true),
    supabase.from('transactions').select('date, amount, type, description, categories(name)').order('date'),
  ])

  const currentBalance = (accounts ?? []).reduce((s: number, a: { balance: number }) => s + a.balance, 0)
  const result: MonthData[] = []
  let runningBalance = currentBalance

  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const year = d.getFullYear()
    const month = d.getMonth()
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
    const label = `${HU_MONTHS[month]} ${year}`

    const items: MonthData['items'] = []

    // Tényleges tranzakciók ebben a hónapban
    const actual = (transactions ?? []).filter((t: { date: string }) => t.date.startsWith(monthStr))
    for (const t of actual as { date: string; amount: number; type: string; description?: string; categories?: { name: string } | { name: string }[] }[]) {
      items.push({
        name: t.description ?? (Array.isArray(t.categories) ? t.categories[0]?.name : t.categories?.name) ?? '–',
        amount: t.amount,
        type: t.type as 'income' | 'expense',
        source: 'actual',
      })
    }

    // Ismétlődő tételek ebben a hónapban (ha nincs tényleges adat róla)
    for (const r of (recurring ?? []) as {
      name: string; amount: number; type: string;
      frequency: string; next_due_date?: string
    }[]) {
      if (r.frequency === 'weekly') {
        items.push({ name: r.name, amount: r.amount * 4, type: r.type as 'income' | 'expense', source: 'recurring' })
      } else if (r.frequency === 'monthly') {
        items.push({ name: r.name, amount: r.amount, type: r.type as 'income' | 'expense', source: 'recurring' })
      } else if (r.frequency === 'annual' && r.next_due_date) {
        const due = new Date(r.next_due_date)
        if (due.getFullYear() === year && due.getMonth() === month) {
          items.push({ name: r.name, amount: r.amount, type: r.type as 'income' | 'expense', source: 'recurring' })
        }
      }
    }

    // Az aktuális hónapnál: a tényleges tranzakciók már benne vannak az egyenlegben,
    // tehát csak az ismétlődő tételeket adjuk hozzá a jövőbeli projekcióhoz
    let income = 0
    let expense = 0

    if (i === 0) {
      // Jelenlegi hónap: csak a tényleges tranzakciókat mutatjuk
      income = actual.filter((t: { type: string }) => t.type === 'income').reduce((s: number, t: { amount: number }) => s + t.amount, 0)
      expense = actual.filter((t: { type: string }) => t.type === 'expense').reduce((s: number, t: { amount: number }) => s + t.amount, 0)
    } else {
      income = items.filter(i => i.type === 'income').reduce((s, i) => s + i.amount, 0)
      expense = items.filter(i => i.type === 'expense').reduce((s, i) => s + i.amount, 0)
    }

    const opening = i === 0 ? runningBalance : runningBalance
    const closing = opening + income - expense

    result.push({ month: monthStr, label, openingBalance: opening, income, expense, closingBalance: closing, items })
    runningBalance = closing
  }

  return result
}
