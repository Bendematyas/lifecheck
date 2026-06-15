import { supabase } from './supabase'
import { getCurrentMonthRange } from './utils'

export async function getAccounts() {
  const { data } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at')
  return data ?? []
}

export async function getMonthlyTotals() {
  const { start, end } = getCurrentMonthRange()
  const { data } = await supabase
    .from('transactions')
    .select('type, amount')
    .gte('date', start)
    .lte('date', end)

  const income = (data ?? []).filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = (data ?? []).filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return { income, expense }
}

export async function getUpcomingRecurring(limit = 5) {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('recurring_items')
    .select('*')
    .eq('active', true)
    .gte('next_due_date', today)
    .order('next_due_date')
    .limit(limit)
  return data ?? []
}

export async function getRecentTransactions(limit = 10) {
  const { data } = await supabase
    .from('transactions')
    .select('*, categories(name, color), accounts(name)')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  return data ?? []
}
