function Server(api_base) {
    this.api_base = api_base;
}

Server.prototype = {
    post_promise: function(url, data) {
        console.log('post_promise with data: '+data);
        var self = this;
        return new Promise(function(resolve, reject){
            if (typeof data=="object") data = JSON.stringify(data);
            $.post(self.api_base+'set-status', data)
                .done(function(response_data, textStatus, jqXHR){
                    if (jqXHR.status==200) {
                        resolve(response_data);
                    } else {
                        reject(Error(textStatus));
                    }
                })
                .fail(function(jqXHR){
                    reject(Error(jqXHR.statusText));
                });

        });
    },
    set_status: function(id, status) {
        return this.post_promise('set-status', {id: id, status: status});
    }
}

var srv = new Server('/todo/');

function set_status(e) {
    var id = $(e.target).parents('div.task').data('id');
    var status = $(e.target).data('status');
    srv.set_status(id, status).then(function(){
        var task_selector = "#task-"+id;
        if (status==view_status || view_status=='all') {
            $(task_selector).find('span.task_status').text(status);
        } else {
            $(task_selector).remove();
        }
    }).catch(function(error){
        var dialog = $("#msg");
        dialog.find(".modal-body").text(error.message);
        dialog.modal('show');
    });
}

$(function () {
    $("div.task li a").click(set_status);
});
