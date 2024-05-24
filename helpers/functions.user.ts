import type { Request } from 'express'

export function userIsAdmin(request: Request): boolean {
  return request.session.user?.isAdmin ?? false
}

export function userCanUpdate(request: Request): boolean {
  return request.session.user?.canUpdate ?? false
}
