const BASE_URL = 'https://www.saltedge.com/api/v6'

const headers = {
  'App-id': process.env.SALTEDGE_APP_ID!,
  'Secret': process.env.SALTEDGE_SECRET!,
  'Content-Type': 'application/json',
}

export async function saltedgeGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, { headers })
  return res.json()
}

export async function saltedgePost(path: string, body: object) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function createCustomer(identifier: string) {
  return saltedgePost('/customers', { data: { identifier } })
}

export async function createConnectSession(customerId: string, returnTo: string) {
  return saltedgePost('/connect_sessions/create', {
    data: {
      customer_id: customerId,
      consent: {
        scopes: ['account_details', 'transactions_details'],
        from_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      attempt: {
        return_to: returnTo,
      },
      country_code: 'HU',
      provider_code: 'erste_hu',
    },
  })
}

export async function getAccounts(connectionId: string) {
  return saltedgeGet(`/accounts?connection_id=${connectionId}`)
}

export async function getTransactions(connectionId: string, fromDate?: string) {
  const date = fromDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  return saltedgeGet(`/transactions?connection_id=${connectionId}&from_date=${date}`)
}
