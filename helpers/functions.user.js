export const userIsAdmin = (request) => {
    const user = request.session?.user;
    if (!user) {
        return false;
    }
    return user.userProperties.isAdmin;
};
export const userCanUpdate = (request) => {
    const user = request.session?.user;
    if (!user) {
        return false;
    }
    return user.userProperties.canUpdate;
};
