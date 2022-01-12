export const handler = (_request, response) => {
    return response.render("licence-view", {
        headTitle: "Licence View"
    });
};
export default handler;
