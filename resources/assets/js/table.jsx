var React = require('./react-with-addons.js');
var moment = require('./moment.min.js');
var $ = require('./jquery.min.js');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var TableBox = React.createClass({
  newWorker: function(resp) {
    this.refs.table.callRefresh(resp);
  },

  render: function() {
    return (
      <div className="TableBox">
        <h1>Workers</h1>
        <CreateButton onNewWorker={this.newWorker} />
        <Table ref="table" />
      </div>
    );
  }
});

var CreateButton = React.createClass({
  createWorker: function() {
    $.ajax({
      url: '/worker',
      dataType: 'json',
      cache: false,
      method: 'POST',
      success: function(resp) {
        this.props.onNewWorker(resp);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/worker', status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    return (
      <button onClick={this.createWorker} className="btn btn-green pull-right"><i className="fa fa-plus"></i></button>
    );
  }
});

var Table = React.createClass({
  callRefresh: function(resp) {
    this.refs.tablelist.doRefresh(resp);
  },

  render: function() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th style={{width: '10%'}}>Status</th>
            <th style={{width: '20%'}}>Server Name</th>
            <th style={{width: '30%'}}>IP Address</th>
            <th style={{width: '30%'}}>Created</th>
            <th style={{width: '10%'}}></th>
          </tr>
        </thead>
        <TableList ref="tablelist" />
      </table>
    );
  }
});

var TableList = React.createClass({
  getInitialState: function() {
    return {data: []}
  },

  loadDataFromServer: function() {
    $.ajax({
      url: '/worker',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/worker', status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount: function() {
    // Fetch data from backend
    this.loadDataFromServer();
    setInterval(this.loadDataFromServer, 90000);
  },

  doRefresh: function(resp) {
    console.log(resp);
    var newData = this.state.data.slice(); //copy array
    newData.push({
      id: resp.id,
      status: resp.status,
      name: resp.name,
      created_at: resp.created_at
    }); //add element
    this.setState({data: newData}); //update state

    // Not working for some reason..
    //this.loadDataFromServer();
  },

  onDelete: function(i) {
    $.ajax({
      url: '/worker/'+this.state.data[i].id,
      dataType: 'json',
      cache: false,
      method: 'DELETE',
      success: function() {
        var newData = this.state.data.slice(); //copy array
        newData.splice(i, 1); //remove element
        this.setState({data: newData}); //update state
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/worker/'+this.state.data[i].id, status, err.toString());
      }.bind(this)
    });

  },

  render: function() {
    return (
      <ReactCSSTransitionGroup component="tbody" transitionName="example" transitionAppear={true}>
        {this.state.data.map(function(row, i) {
          return (
            <TableRow onDelete={this.onDelete.bind(this, i)} key={row.id} id={row.id} status={row.status} name={row.name} ip={row.ip} created_at={row.created_at}></TableRow>
          );
        }, this)}
      </ReactCSSTransitionGroup>
    );
  }
});

var TableRow = React.createClass({
  getComponent: function(index) {
    this.props.onDelete();
  },

  render: function() {
    var isDisabled,
        statusColor,
        icon,
        statusBg,
        created;

    if (this.props.status == 'new') {
      isDisabled = 'disabled';
      statusColor = '#56606E';
      icon = 'fa fa-circle-o-notch fa-spin';
      statusBg = 'info'
    } else {
      icon = 'fa fa-cloud';
      statusColor = '#91C46B'
    }

    // Set readable date
    created = moment(this.props.created_at).format("MMMM Do YYYY, HH:mm");
    //created = '';

    return (
      <tr id={this.props.id} className={statusBg}>
        <td><span className={icon} style={{color: statusColor}}></span></td>
        <td>{this.props.name}</td>
        <td>{this.props.ip}</td>
        <td>{created}</td>
        <td><button className="btn btn-orange btn-xs" disabled={isDisabled} onClick={this.getComponent.bind(this, this.props.id)}><i className="fa fa-trash-o"></i></button></td>
      </tr>
    );
  }
})

module.exports = TableBox;

/*React.render(
  <TableBox />,
  document.getElementById('content')
);*/
