export const handler = (_request, response) => {
    response.render("admin-licenceCategories", {
        headTitle: "Licence Categories"
    });
};
export default handler;
