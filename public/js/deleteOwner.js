function deleteOwner(id){
    $.ajax({
        url: '/owners/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};