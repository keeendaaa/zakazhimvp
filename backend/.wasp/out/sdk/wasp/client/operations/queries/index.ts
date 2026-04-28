import { type QueryFor, createQuery } from './core'
import { GetPaginatedUsers_ext } from 'wasp/server/operations/queries'

// PUBLIC API
export const getPaginatedUsers: QueryFor<GetPaginatedUsers_ext> = createQuery<GetPaginatedUsers_ext>(
  'operations/get-paginated-users',
  ['User'],
)

// PRIVATE API (used in SDK)
export { buildAndRegisterQuery } from './core'
