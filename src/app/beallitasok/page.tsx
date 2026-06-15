import { supabase } from '@/lib/supabase'
import { BankConnectButton } from './BankConnectButton'
import { CheckCircle, Building2, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Beallitasok({
  searchParams,
}: {
  searchParams: Promise<{ saltedge?: string }>
}) {
  const params = await searchParams
  const justConnected = params.saltedge === 'connected'

  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .not('nordigen_id', 'is', null)

  const connected = (accounts ?? []).length > 0

  return (
    <main className="p-4 space-y-4">
      <div className="pt-4 pb-2">
        <h1 className="text-xl font-bold">Beállítások</h1>
      </div>

      {justConnected && (
        <div className="bg-green-950 border border-green-700 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={20} className="text-green-400" />
          <p className="text-sm text-green-300">Erste Bank sikeresen csatlakoztatva!</p>
        </div>
      )}

      {/* Bank csatlakoztatás */}
      <div className="bg-gray-900 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={18} className="text-indigo-400" />
          <h2 className="font-semibold">Erste Bank</h2>
        </div>

        {connected ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle size={14} />
              <span>Csatlakoztatva</span>
            </div>
            {(accounts ?? []).map((a: { id: string; name: string; balance: number; last_synced_at?: string }) => (
              <div key={a.id} className="flex justify-between text-sm py-1 border-t border-gray-800">
                <span className="text-gray-300">{a.name}</span>
                <span className="font-medium">{a.balance.toLocaleString('hu-HU')} Ft</span>
              </div>
            ))}
            <BankConnectButton connected={true} />
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">Csatlakoztasd az Erste bankod hogy automatikusan szinkronizálódjanak a tranzakciók.</p>
            <BankConnectButton connected={false} />
          </div>
        )}
      </div>

      {/* Ismétlődő tételek info */}
      <div className="bg-gray-900 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock size={18} className="text-indigo-400" />
          <h2 className="font-semibold">Automatikus szinkron</h2>
        </div>
        <p className="text-sm text-gray-400">A bank tranzakciók 4 óránként frissülnek automatikusan.</p>
      </div>
    </main>
  )
}
