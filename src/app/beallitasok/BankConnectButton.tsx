'use client'

import { useState } from 'react'
import { RefreshCw, Link } from 'lucide-react'

export function BankConnectButton({ connected }: { connected: boolean }) {
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleSync() {
    setSyncing(true)
    setResult(null)
    const connId = localStorage.getItem('saltedge_connection_id')
    if (!connId) {
      setResult('Nincs mentett kapcsolat azonosító.')
      setSyncing(false)
      return
    }
    const res = await fetch('/api/saltedge/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connection_id: connId }),
    })
    const data = await res.json()
    if (data.success) {
      setResult(`${data.imported} új tranzakció importálva.`)
    } else {
      setResult(`Hiba: ${data.error}`)
    }
    setSyncing(false)
  }

  if (connected) {
    return (
      <div className="space-y-2">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Szinkronizálás...' : 'Szinkronizálás most'}
        </button>
        {result && <p className="text-xs text-gray-400 text-center">{result}</p>}
        <a
          href="/api/saltedge/connect"
          className="block text-center text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Újracsatlakoztatás
        </a>
      </div>
    )
  }

  return (
    <a
      href="/api/saltedge/connect"
      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
    >
      <Link size={16} />
      Erste Bank csatlakoztatása
    </a>
  )
}
