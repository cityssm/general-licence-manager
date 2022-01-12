export const handler = (_request, response) => {
    response.render("licence-edit", {
        headTitle: "Licence Update",
        isCreate: false
    });
};
export default handler;
