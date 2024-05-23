export function userIsAdmin(request) {
    const user = request.session?.user;
    if (user === undefined) {
        return false;
    }
    return user.isAdmin;
}
export function userCanUpdate(request) {
    const user = request.session?.user;
    if (user === undefined) {
        return false;
    }
    return user.canUpdate;
}
