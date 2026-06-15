import { NextRequest, NextResponse } from 'next/server'
import { getAccounts, getTransactions } from '@/lib/saltedge'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { connection_id } = await req.json()
    if (!connection_id) return NextResponse.json({ error: 'connection_id hiányzik' }, { status: 400 })

    // Számlák szinkronizálása
    const accountsRes = await getAccounts(connection_id)
    const saltAccounts = accountsRes?.data ?? []

    for (const sa of saltAccounts) {
      const name = sa.name ?? sa.nature ?? 'Erste számla'
      const balance = sa.balance ?? 0

      // Meglévő account frissítése vagy új létrehozása
      const { data: existing } = await supabase
        .from('accounts')
        .select('id')
        .eq('nordigen_id', sa.id)
        .single()

      if (existing) {
        await supabase.from('accounts').update({
          balance,
          last_synced_at: new Date().toISOString(),
        }).eq('id', existing.id)
      } else {
        await supabase.from('accounts').insert({
          name,
          type: 'personal',
          nordigen_id: sa.id,
          balance,
          last_synced_at: new Date().toISOString(),
        })
      }
    }

    // Tranzakciók szinkronizálása (utolsó 90 nap)
    const fromDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const txRes = await getTransactions(connection_id, fromDate)
    const saltTx = txRes?.data ?? []

    let imported = 0
    for (const tx of saltTx) {
      // Duplikáció elkerülése external_id alapján
      const { data: exists } = await supabase
        .from('transactions')
        .select('id')
        .eq('external_id', tx.id)
        .single()

      if (exists) continue

      const amount = Math.abs(tx.amount)
      const type = tx.amount >= 0 ? 'income' : 'expense'

      await supabase.from('transactions').insert({
        date: tx.made_on,
        amount,
        type,
        description: tx.description,
        source: 'bank_sync',
        external_id: String(tx.id),
        is_cash: false,
      })
      imported++
    }

    return NextResponse.json({ success: true, imported, accounts: saltAccounts.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
