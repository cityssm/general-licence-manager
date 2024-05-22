import type { Request } from 'express'

export function userIsAdmin(request: Request): boolean {
  const user = request.session?.user

  if (!user) {
    return false
  }

  return user.userProperties.isAdmin
}

export function userCanUpdate(request: Request): boolean {
  const user = request.session?.user

  if (!user) {
    return false
  }

  return user.userProperties.canUpdate
}
