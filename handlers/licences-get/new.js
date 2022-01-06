export const handler = (_request, response) => {
    response.render("licence-edit", {
        headTitle: "Licence Create",
        isCreate: true
    });
};
export default handler;
