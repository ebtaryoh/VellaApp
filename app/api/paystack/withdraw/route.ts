import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { amount, account_number, bank_code, name } = await request.json()
    const secretKey = process.env.PAYSTACK_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json({ error: 'Paystack Secret Key is not configured' }, { status: 500 })
    }

    // 1. Create a Transfer Recipient
    const recipientRes = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'nuban',
        name: name || 'Vella Driver',
        account_number,
        bank_code,
        currency: 'NGN'
      }),
    })

    const recipientData = await recipientRes.json()

    if (!recipientData.status) {
      return NextResponse.json({ error: recipientData.message }, { status: 400 })
    }

    const recipientCode = recipientData.data.recipient_code

    // 2. Initiate Transfer
    // Note: In a real app, amount is specified in kobo (multiply by 100).
    const amountInKobo = Math.round(amount * 100)

    const transferRes = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: amountInKobo,
        recipient: recipientCode,
        reason: 'Vella Cashout'
      }),
    })

    const transferData = await transferRes.json()

    if (!transferData.status) {
      return NextResponse.json({ error: transferData.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, transfer: transferData.data })
  } catch (error: any) {
    console.error('Withdrawal error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
