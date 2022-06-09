export const handler = async (_request, response) => {
    response.render("admin-yearEnd", {
        headTitle: "Year-End Process"
    });
};
export default handler;
