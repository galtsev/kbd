
var EventEmitter = require('events').EventEmitter;
var assert = require('assert');
var util = require('./util');
var srv = require('./server').srv;

//dispatcher = new EventEmitter();

storage = new EventEmitter();

storage.state = {
    status: 'in process',
    todos: []
};

storage.on('initial_load', function() {
    srv.get_list({status: this.state.status, search_value:''}).then(function(data){
        this.state.todos = data;
        this.state.status = this.state.status;
        this.emit('update');
    }.bind(this));
});

storage.on('update_item_status', function(data) {
    var pred = function(todo){
        return this.state.status=='all' || data.new_status==this.state.status || todo.pk!=data.id;
    }.bind(this);
    srv.set_status(data.id, data.new_status).then(function() {
        this.state.todos = this.state.todos.filter(pred);
        this.emit('update');
    }.bind(this));
});

storage.on('view_status_changed', function(options){
    srv.get_list(options).then(function(data){
        this.state.todos = data;
        this.state.status = options.status;
        this.emit('update');
    }.bind(this));
});

storage.on('item_append',  function(data) {
    srv.add_todo(data).then(function(items){
        if (data.status==this.state.status || this.state.status=='all') {
            this.state.todos = items.concat(this.state.todos);
            this.emit('update');
        }
    }.bind(this));
});

storage.on('delete_item', function(id) {
    srv.delete_task(id).then(function() {
        this.state.todos = this.state.todos.filter(function(todo){return todo.pk!=id});
        this.emit('update');
    }.bind(this));
});

exports.StorageMixin = {
    storage: function() {
        return storage;
    },
    emit: function(event, options) {
        storage.emit(event, options);
    },
    componentWillMount: function() {
        if (this.storageUpdated) {
            storage.on('update', this.storageUpdated);
        }
    },
    componentWillUnmount: function() {
        if (this.storageUpdated) {
            storage.removeListener('update', this.storageUpdated);
        }
    }

}

