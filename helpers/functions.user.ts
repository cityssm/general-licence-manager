import type { Request } from "express";


export const userIsAdmin = (request: Request): boolean => {

  const user = request.session?.user;

  if (!user) {
    return false;
  }

  return user.userProperties.isAdmin;
};


export const userCanUpdate = (request: Request): boolean => {

  const user = request.session?.user;

  if (!user) {
    return false;
  }

  return user.userProperties.canUpdate;
};
