export const handler = (_request, response) => {
    return response.render("licence-edit", {
        headTitle: "Licence Update",
        isCreate: false
    });
};
export default handler;
