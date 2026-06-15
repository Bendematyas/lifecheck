export type TransactionType = 'income' | 'expense'
export type TransactionSource = 'manual' | 'bank_sync' | 'szamlazz'
export type Frequency = 'weekly' | 'monthly' | 'annual'
export type Priority = 'low' | 'medium' | 'high'

export interface Account {
  id: string
  name: string
  type: 'personal' | 'business' | 'savings'
  nordigen_id?: string
  balance: number
  last_synced_at?: string
}

export interface Category {
  id: string
  name: string
  type: TransactionType
  color: string
  icon?: string
  is_preset: boolean
}

export interface Transaction {
  id: string
  date: string
  amount: number
  type: TransactionType
  category_id?: string
  account_id?: string
  description?: string
  source: TransactionSource
  external_id?: string
  is_cash: boolean
  note?: string
  created_at: string
  categories?: Category
  accounts?: Account
}

export interface RecurringItem {
  id: string
  name: string
  amount: number
  type: TransactionType
  category_id?: string
  frequency: Frequency
  day_of_month?: number
  next_due_date: string
  active: boolean
}

export interface Session {
  id: string
  date: string
  type: string
  duration_minutes?: number
  income?: number
  notes?: string
  transaction_id?: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  due_date?: string
  completed_at?: string
  priority: Priority
  reminder_date?: string
}
