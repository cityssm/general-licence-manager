import type { Request } from 'express'

export function userIsAdmin(request: Request): boolean {
  const user = request.session?.user

  if (user === undefined) {
    return false
  }

  return user.isAdmin
}

export function userCanUpdate(request: Request): boolean {
  const user = request.session?.user

  if (user === undefined) {
    return false
  }

  return user.canUpdate
}
