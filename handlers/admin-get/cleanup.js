export const handler = async (_request, response) => {
    response.render("admin-cleanup", {
        headTitle: "Database Cleanup"
    });
};
export default handler;
