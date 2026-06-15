'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import { MonthData } from '@/lib/cashflow'
import { formatCurrency } from '@/lib/utils'

function shortLabel(label: string) {
  return label.split(' ')[0].slice(0, 3) + '.'
}

export function CashFlowChart({ data }: { data: MonthData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <XAxis dataKey="label" tickFormatter={shortLabel} tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip
          formatter={(v: unknown) => formatCurrency(Number(v))}
          contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#e5e7eb', fontWeight: 600 }}
        />
        <ReferenceLine y={0} stroke="#374151" />
        <Bar dataKey="closingBalance" radius={[6, 6, 0, 0]} name="Záró egyenleg">
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.closingBalance >= 0 ? '#6366f1' : '#ef4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
