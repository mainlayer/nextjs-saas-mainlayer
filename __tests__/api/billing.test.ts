/**
 * Tests for billing endpoints
 *
 * These tests verify that:
 * - Subscription endpoints require authentication
 * - Plan data is returned correctly
 * - Webhook signatures are verified
 * - Billing status checks work
 */

import { POST as subscribeHandler } from '@/app/api/billing/subscribe/route'
import { GET as statusHandler } from '@/app/api/billing/status/route'
import { POST as webhookHandler } from '@/app/api/webhooks/mainlayer/route'
import { NextResponse } from 'next/server'

// Mock auth
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}))

// Mock Mainlayer client
jest.mock('@/lib/mainlayer', () => ({
  checkSubscription: jest.fn(),
  createSubscription: jest.fn(),
}))

import { auth } from '@/lib/auth'
import { checkSubscription, createSubscription } from '@/lib/mainlayer'

describe('Billing API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/billing/subscribe', () => {
    it('returns 401 if user is not authenticated', async () => {
      ;(auth as jest.Mock).mockResolvedValueOnce(null)

      const req = new Request('http://localhost:3000/api/billing/subscribe', {
        method: 'POST',
        body: JSON.stringify({ planId: 'pro' }),
      })

      const response = await subscribeHandler(req)
      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Unauthorized')
    })

    it('creates a subscription for an authenticated user', async () => {
      const mockSession = {
        user: { email: 'user@example.com', id: '123' },
      }
      ;(auth as jest.Mock).mockResolvedValueOnce(mockSession)
      ;(createSubscription as jest.Mock).mockResolvedValueOnce({
        payment_url: 'https://checkout.mainlayer.fr/...',
        payment_id: 'pay_123',
      })

      const req = new Request('http://localhost:3000/api/billing/subscribe', {
        method: 'POST',
        body: JSON.stringify({ planId: 'pro' }),
      })

      const response = await subscribeHandler(req)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.payment_url).toContain('mainlayer.fr')
      expect(createSubscription).toHaveBeenCalledWith('user@example.com', 'pro')
    })

    it('returns 400 for invalid JSON', async () => {
      ;(auth as jest.Mock).mockResolvedValueOnce({
        user: { email: 'user@example.com' },
      })

      const req = new Request('http://localhost:3000/api/billing/subscribe', {
        method: 'POST',
        body: 'invalid json {',
      })

      const response = await subscribeHandler(req)
      expect(response.status).toBe(400)
    })

    it('handles Mainlayer API errors gracefully', async () => {
      ;(auth as jest.Mock).mockResolvedValueOnce({
        user: { email: 'user@example.com' },
      })
      ;(createSubscription as jest.Mock).mockRejectedValueOnce(
        new Error('Mainlayer API error'),
      )

      const req = new Request('http://localhost:3000/api/billing/subscribe', {
        method: 'POST',
        body: JSON.stringify({ planId: 'pro' }),
      })

      const response = await subscribeHandler(req)
      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.error).toContain('Failed to create payment session')
    })
  })

  describe('GET /api/billing/status', () => {
    it('returns 401 if user is not authenticated', async () => {
      ;(auth as jest.Mock).mockResolvedValueOnce(null)

      const req = new Request('http://localhost:3000/api/billing/status', {
        method: 'GET',
      })

      const response = await statusHandler(req)
      expect(response.status).toBe(401)
    })

    it('checks subscription status for authenticated user', async () => {
      const mockSession = {
        user: { email: 'user@example.com', id: '123' },
      }
      ;(auth as jest.Mock).mockResolvedValueOnce(mockSession)
      ;(checkSubscription as jest.Mock).mockResolvedValueOnce(true)

      const req = new Request('http://localhost:3000/api/billing/status', {
        method: 'GET',
      })

      const response = await statusHandler(req)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.has_access).toBe(true)
      expect(checkSubscription).toHaveBeenCalledWith('user@example.com')
    })

    it('returns false when user has no active subscription', async () => {
      ;(auth as jest.Mock).mockResolvedValueOnce({
        user: { email: 'user@example.com' },
      })
      ;(checkSubscription as jest.Mock).mockResolvedValueOnce(false)

      const req = new Request('http://localhost:3000/api/billing/status', {
        method: 'GET',
      })

      const response = await statusHandler(req)
      const data = await response.json()
      expect(data.has_access).toBe(false)
    })
  })

  describe('POST /api/webhooks/mainlayer', () => {
    it('rejects webhook with invalid signature', async () => {
      const payload = JSON.stringify({
        event: 'payment.completed',
        data: { payer_wallet: 'user@example.com', plan: 'pro' },
      })

      const req = new Request('http://localhost:3000/api/webhooks/mainlayer', {
        method: 'POST',
        body: payload,
        headers: {
          'x-mainlayer-signature': 'sha256=invalid_signature',
        },
      })

      // Set the webhook secret
      process.env.MAINLAYER_WEBHOOK_SECRET = 'test_secret'

      const response = await webhookHandler(req)
      expect(response.status).toBe(401)
    })

    it('processes valid webhook payload', async () => {
      const payload = JSON.stringify({
        event: 'payment.completed',
        data: {
          payer_wallet: 'user@example.com',
          plan: 'pro',
          payment_id: 'pay_123',
        },
      })

      const req = new Request('http://localhost:3000/api/webhooks/mainlayer', {
        method: 'POST',
        body: payload,
      })

      // Don't require signature verification for this test
      process.env.MAINLAYER_WEBHOOK_SECRET = ''

      const response = await webhookHandler(req)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.received).toBe(true)
    })

    it('returns 400 for invalid JSON', async () => {
      const req = new Request('http://localhost:3000/api/webhooks/mainlayer', {
        method: 'POST',
        body: 'invalid json {',
      })

      const response = await webhookHandler(req)
      expect(response.status).toBe(400)
    })

    it('ignores unknown event types', async () => {
      const payload = JSON.stringify({
        event: 'unknown.event',
        data: {},
      })

      const req = new Request('http://localhost:3000/api/webhooks/mainlayer', {
        method: 'POST',
        body: payload,
      })

      const response = await webhookHandler(req)
      expect(response.status).toBe(200)
    })
  })
})
