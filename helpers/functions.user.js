export function userIsAdmin(request) {
    const user = request.session?.user;
    if (!user) {
        return false;
    }
    return user.userProperties.isAdmin;
}
export function userCanUpdate(request) {
    const user = request.session?.user;
    if (!user) {
        return false;
    }
    return user.userProperties.canUpdate;
}
