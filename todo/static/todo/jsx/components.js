const StorageMixin = require('./storage').StorageMixin;

function f2(i) {
    return (i<10?'0':'')+i.toString();
}
function fmt_date(arg) {
    var dt = (typeof arg=='string')?new Date(Date.parse(arg)):arg;
    return dt.getFullYear() +'-'+f2(dt.getMonth()+1) +'-'+f2(dt.getDate()) + ' ' + dt.getHours() +':'+f2(dt.getMinutes()) +':'+f2(dt.getSeconds());
}

var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Button = ReactBootstrap.Button;
var DropdownButton = ReactBootstrap.DropdownButton;
var SplitButton = ReactBootstrap.SplitButton;
var MenuItem = ReactBootstrap.MenuItem;
var Input = ReactBootstrap.Input;

function upFirst(s) {
    return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase();
}

function statusCaption(status) {
    return upFirst(status=='closed'?'done':status);
}

var TodoItem = React.createClass({
    mixins: [StorageMixin],
    handleDelete: function(event) {
        this.emit('delete_item', this.props.task.pk);
    },
    newStatusClick: function(event) {
        this.newStatusSelect(this.nextStatus());
    },
    newStatusSelect: function(status) {
        this.emit('update_item_status', {id: this.props.task.pk, new_status: status});
    },
    nextStatus: function() {
        return this.props.task.fields.status=='in process'?'closed':'in process';
    },
    render: function() {
        var otherStatuses = ['backlog','in process', 'hold', 'closed'].filter(status => status!=this.nextStatus() && status!=this.props.view_status);
        return (
            <div className="task">
            <ButtonToolbar>
                <SplitButton bsStyle="default" title={statusCaption(this.nextStatus())} onClick={this.newStatusClick} onSelect={this.newStatusSelect} >
                {otherStatuses.map(status => <MenuItem eventKey={status}>{statusCaption(status)}</MenuItem>)}
                </SplitButton>
                <Button bsStyle="default" onClick={this.handleDelete}>Delete</Button>
            </ButtonToolbar>
            <div className="description">{this.props.task.fields.description}</div>
            <div className="attrs">
                <span className="float_left">{ fmt_date(this.props.task.fields.date_updated) }</span>
                <span className="float_right">{this.props.task.fields.status }</span>
            </div>
            <div className="clear_both;"></div>
        </div>
        );
    }
});

var Toolbar = React.createClass({
    mixins: [StorageMixin],
    newSelect: function(status) {
        this.emit('view_status_changed', {status: status, search_value: this.refs.search_value.getValue()});
    },
    render: function() {
        var view_options = ['all', 'backlog', 'in process', 'hold', 'closed'];
        return (
            <div className="toolbox">
                <button className="btn btn-default" type="button" data-toggle="collapse" data-target="#addnew2">New</button>
                <DropdownButton title={statusCaption(this.props.view_status)} onSelect={this.newSelect}>
                    {view_options.map(status=>
                        <MenuItem eventKey={status}>{statusCaption(status)}</MenuItem>)}
                </DropdownButton>
                <Input type="text" ref="search_value" label="Search"/>
            </div>
        );
    }
});

var AppendForm = React.createClass({
    mixins: [StorageMixin],
    storageUpdated: function(){
        React.findDOMNode(this.refs.status).value = this.storage().state.status;
    },
    handleSubmit: function() {
        var data = {
            status: this.refs.status.getDOMNode().value,
            description: this.refs.description.getDOMNode().value
        };
        this.emit('item_append', data);
        React.findDOMNode(this.refs.description).value='';
    },
    render: function() {
        return (
            <div id="addnew2" className="collapse">
                <div>
                    <textarea ref="description" cols="60" rows="10"></textarea>
                </div>
                <div>
                    <select ref="status" defaultValue={this.props.view_status}>
                        <option value="in process">in process</option>
                        <option value="backlog">backlog</option>
                        <option value="hold">hold</option>
                        <option value="closed">closed</option>
                    </select>
                </div>
                <div>
                    <button className="btn btn-default" onClick={this.handleSubmit}>Submit</button>
                </div>
            </div>
        );
    }
});

const TodoList = React.createClass({
    render: function() {
        var items = this.props.todos.map(function(task) {
            return <TodoItem 
                        task={task}
                        view_status={this.props.view_status}
                        key={task.pk} />;
        }.bind(this));
        return (
            <div>
            {items}
            </div>
        );

    }
});

var TodoPage = React.createClass({
    mixins: [StorageMixin],
    getInitialState: function() {
        return {
            view_status: 'in process',
            todos: []
        };
    },
    componentDidMount: function() {
        this.emit('initial_load');
        //storage.on('update', this.storageUpdated);
    },
    storageUpdated: function() {
        s = this.storage().state;
        new_state = {
            view_status: s.status,
            todos: s.todos
        };
        this.setState(new_state);
    },
    render: function() {
        return (
            <div>
                <Toolbar view_status={this.state.view_status} />
                <AppendForm view_status={this.state.view_status} />
                <TodoList todos={this.state.todos} view_status={this.state.view_status} />
            </div>
        );
    }
});

exports.render_root = function() {
    React.render(<TodoPage />, document.getElementById('list'));
}