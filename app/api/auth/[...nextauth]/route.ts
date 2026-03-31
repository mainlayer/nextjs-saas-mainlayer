/**
 * NextAuth v5 catch-all route handler.
 * Handles all /api/auth/* requests (signin, signout, callbacks, etc.)
 */
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
