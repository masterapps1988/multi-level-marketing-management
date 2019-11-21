// Get paginator and create to an template object
var Paginator = function(response) {
    return {
        current_page: response._meta.current_page,
        last_page: response._meta.last_page
    };
};