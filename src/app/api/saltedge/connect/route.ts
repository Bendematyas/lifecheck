import { NextResponse } from 'next/server'
import { createCustomer, createConnectSession } from '@/lib/saltedge'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Egy fix customer ID a személyes apphoz
    const customerId = 'bende_matyas_lifecheck'

    // Customer létrehozása (ha már létezik, az API visszaadja)
    const customerRes = await createCustomer(customerId)
    const id = customerRes?.data?.id ?? customerId

    // Mentjük a customer ID-t az accounts táblába meta mezőként
    const returnTo = `${process.env.NEXT_PUBLIC_APP_URL}/beallitasok?saltedge=connected`

    const sessionRes = await createConnectSession(String(id), returnTo)

    if (sessionRes?.data?.connect_url) {
      return NextResponse.redirect(sessionRes.data.connect_url)
    }

    return NextResponse.json({ error: 'Nem sikerült a kapcsolat létrehozása', detail: sessionRes }, { status: 500 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
