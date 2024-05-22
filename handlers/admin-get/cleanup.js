export default function handler(_request, response) {
    response.render('admin-cleanup', {
        headTitle: 'Database Cleanup'
    });
}
