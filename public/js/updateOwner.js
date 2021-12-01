function updateOwner(id){
    $.ajax({
        url: '/owners/' + id,
        type: 'PUT',
        data: $('#update-owner').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};