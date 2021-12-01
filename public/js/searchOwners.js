function searchOwnersByLastName() {
    //get the first name 
    var last_name_search_string  = document.getElementById('last_name_search_string').value
    //construct the URL and redirect to it
    window.location = '/owners/search/' + encodeURI(last_name_search_string)
}