function Server(api_base) {
    this.api_base = api_base;
}

Server.prototype = {
    post_promise: function(url, data) {
        console.log('post_promise with data: '+data);
        var self = this;
        return new Promise(function(resolve, reject){
            if (typeof data=="object") data = JSON.stringify(data);
            jQuery.post(self.api_base+url, data)
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
    get_promise: function(url, data) {
        console.log('get_promise with data: ', data);
        var self = this;
        return new Promise(function(resolve, reject) {
            jQuery.get(self.api_base+url, data)
                .done(function(response_data) {
                    resolve(response_data);
                })
                .fail(function(jqXHR){
                    reject(Error(jqXHR.statusText));
                });
        });
    },
    set_status: function(id, status) {
        return this.post_promise('set-status', {id: id, status: status});
    },
    get_list: function(options) {
        return this.get_promise('list_json', options);
    },
    add_todo: function(form_data) {
        return this.post_promise('add_todo', form_data);
    },
    delete_task: function(id) {
        return this.post_promise('delete_task', {id: id});
    }

}

exports.srv = new Server('/todo/');

