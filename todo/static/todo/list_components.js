
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
console.log(Input);

var Dropdown = React.createClass({
    render: function() {
        return (
            <div className="btn-group">
                <button className="btn btn-default dropdown-toggle" data-toggle="dropdown">{ this.props.caption } <span className="caret"></span></button>
                <ul className="dropdown-menu" onClick={this.props.onSelect} role="menu">
                {this.props.children}
                </ul>
            </div>
        );
    }
});

Dropdown.Item = React.createClass({
    render: function() {
        return (
            <li><a href="#" data-value={this.props.value}>{this.props.children}</a></li>
        );
    }
});

function upFirst(s) {
    return s.charAt(0).toUpperCase()+s.slice(1).toLowerCase();
}

function statusCaption(status) {
    return upFirst(status=='closed'?'done':status);
}

var TodoItem = React.createClass({
    handleStatusClick: function(event) {
        var self=this;
        var value = $(event.target).data('value');
        srv.set_status(this.props.id, value).then(function() {
            self.props.onItemStatusUpdated(self.props.id, value);
        });
    },
    handleDelete: function(event) {
        srv.delete_task(this.props.id).then(function() {
            this.props.onItemDeleted(this.props.id);
        }.bind(this));
    },
    newStatusClick: function(event) {
        this.newStatusSelect(this.nextStatus());
    },
    newStatusSelect: function(status) {
        srv.set_status(this.props.id, status).then(function() {
            this.props.onItemStatusUpdated(this.props.id, status);
        }.bind(this));
    },
    nextStatus: function() {
        return this.props.status=='in process'?'closed':'in process';
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
            <div className="description">{this.props.description}</div>
            <div className="attrs">
                <span className="float_left">{ fmt_date(this.props.date_created) }</span>
                <span className="float_right">{this.props.status }</span>
            </div>
            <div className="clear_both;"></div>
        </div>
        );
    }
});

var Toolbar = React.createClass({
    newSelect: function(status) {
        this.props.updateStatus({status: status, search_value: this.refs.search_value.getValue()});
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
    handleSubmit: function() {
        var data = {
            status: this.refs.status.getDOMNode().value,
            description: this.refs.description.getDOMNode().value
        };
        srv.add_todo(data).then(function(items) {
            this.refs.description.getDOMNode().value='';
            this.props.afterAppend(items[0]);
        }.bind(this));
    },
    render: function() {
        return (
            <div id="addnew2" className="collapse">
                <div>
                    <textarea ref="description" cols="60" rows="10"></textarea>
                </div>
                <div>
                    <select ref="status" defaultValue="in process">
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

var TodoList = React.createClass({
    getInitialState: function() {
        return {
            view_status: 'in process',
            todos: []
        };
    },
    componentDidMount: function() {
        var self=this;
        srv.get_list(this.state.view_status).then(function(data){
            self.setState({todos:data});
        });
    },
    itemStatusUpdated: function(id, new_status) {
        var self = this;
        var pred = function(todo){
            return self.state.view_status=='all' || new_status==self.state.view_status || todo.pk!=id;
        }
        this.setState({todos:this.state.todos.filter(pred)});
    },
    handleStatusUpdate: function(options){
        console.log("handleStatusUpdate called");
        var self=this;
        srv.get_list(options).then(function(data){
            self.setState({todos:data, view_status: options.status});
        });
    },
    handleTaskAppended: function(task) {
        console.log(task, typeof task);
        if (task.fields.status==this.state.view_status || this.state.view_status=='all')
            this.setState({todos: [task].concat(this.state.todos)});
    },
    handleTaskDeleted: function(id) {
        this.setState({todos: this.state.todos.filter(function(todo){return todo.pk!=id;})});
    },
    render: function() {
        var self = this;
        var items = this.state.todos.map(function(task) {
            return <TodoItem 
                        description={task.fields.description} 
                        date_created={task.fields.date_created} 
                        status={task.fields.status}
                        view_status={self.state.view_status}
                        onItemStatusUpdated={self.itemStatusUpdated}
                        onItemDeleted={self.handleTaskDeleted}
                        id={task.pk} 
                        key={task.pk} />;
        });
        return (
            <div>
                <Toolbar view_status={this.state.view_status} updateStatus={this.handleStatusUpdate} />
                <AppendForm afterAppend={this.handleTaskAppended} />
                { items }
            </div>
        );
    }
});