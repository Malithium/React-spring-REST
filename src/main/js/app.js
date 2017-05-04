// This file was based on the linked tutorial under the Creative Commons Licence
// https://spring.io/guides/tutorials/react-and-spring-data-rest/

'use strict';
var $authToken = "";
const React = require('react');
const ReactDOM = require('react-dom');
const Keycloak = require('keycloak-js');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

const root = '/api';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {employees: [], attributes: [], pageSize: 2, links: {}, shifts: [], sAttributes: [], sLinks: []};
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onCreateShift = this.onCreateShift.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onShiftDelete = this.onShiftDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    // tag::follow-2[]
    loadFromServer(pageSize) {
        follow(client, root, $authToken,[
            {rel: 'employees', params: {size: pageSize}}]
        ).then(employeeCollection => {
            return client({
                method: 'GET',
                path: employeeCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json', 'Authorization':'Bearer ' + $authToken}
            }).then(schema => {
                this.schema = schema.entity;
                this.links = employeeCollection.entity._links;
                return employeeCollection;
            });
        }).then(employeeCollection => {
            return employeeCollection.entity._embedded.employees.map(employee =>
                client({
                    method: 'GET',
                    path: employee._links.self.href,
                    headers: {'Authorization':'Bearer ' + $authToken}
                })
            );
        }).then(employeePromises => {
            return when.all(employeePromises);
        }).done(employees => {
            this.setState({
                employees: employees,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: this.links
            });
        });
    }

    // tag::follow-2[]
    loadFromServerShifts(pageSize) {
        follow(client, root, $authToken,[
            {rel: 'shifts', params: {size: pageSize}}]
        ).then(shiftsCollection => {
            return client({
                method: 'GET',
                path: shiftsCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json', 'Authorization':'Bearer ' + $authToken}
            }).then(schema => {
                this.shiftSchema = schema.entity;
                this.slinks = shiftsCollection.entity._links;
                return shiftsCollection;
            });
        }).then(shiftsCollection => {
            return shiftsCollection.entity._embedded.shifts.map(shift =>
                client({
                    method: 'GET',
                    path: shift._links.self.href,
                    headers: {'Authorization':'Bearer ' + $authToken}
                })
            );
        }).then(shiftPromises => {
            return when.all(shiftPromises);
        }).done(shifts => {
            this.setState({
                shifts: shifts,
                sAttributes: Object.keys(this.shiftSchema.properties),
                sLinks: this.slinks
            });
        });
    }

    // end::follow-2[]

    // tag::create[]
    onCreate(newEmployee) {
        var self = this;
        follow(client, root, $authToken,['employees']).then(response => {
            return client({
                method: 'POST',
                path: response.entity._links.self.href,
                entity: newEmployee,
                headers: {'Content-Type': 'application/json', 'Authorization':'Bearer ' + $authToken}
            })
        }).then(response => {
            return follow(client, root, $authToken,[{rel: 'employees', params: {'size': self.state.pageSize}}]);
        }).done(response => {
            if (typeof response.entity._links.last != "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }
    // end::create[]
    onCreateShift(newShift, shiftURL, employeeURL) {
        var self = this;
        follow(client, root, $authToken,['shifts']).then(response => {
            return client({
                method:'POST',
                path: response.entity._links.self.href,
                entity: newShift,
                headers: {'Content-Type': 'application/json', 'Authorization':'Bearer ' + $authToken}
            }).then(response=> {
                return follow(client, root, $authToken,[{rel: 'shifts', param: {'size': self.state.pageSize}}]);
            }).done(response => {

            })
        });
    }
    // tag::update[]
    onUpdate(employee, updatedEmployee) {
        client({
            method: 'PUT',
            path: employee.entity._links.self.href,
            entity: updatedEmployee,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': employee.headers.Etag,
                'Authorization':'Bearer ' + $authToken
            }
        }).done(response => {
            this.loadFromServer(this.state.pageSize);
        }, response => {
            if (response.status.code === 412) {
                alert('DENIED: Unable to update ' +
                    employee.entity._links.self.href + '. Your copy is stale.');
            }
        });
    }
    // end::update[]

    // tag::delete[]
    onDelete(employee) {
        client({method: 'DELETE',
            path: employee.entity._links.self.href,
            headers: {'Authorization':'Bearer ' + $authToken}}).done(response => {
            this.loadFromServer(this.state.pageSize);
        });
    }
    // end::delete[]

    // tag::delete[]
    onShiftDelete(shift) {
        client({method: 'DELETE',
            path: shift._links.self.href,
            headers: {'Authorization':'Bearer ' + $authToken}}).done(response => {
        });
    }
    // end::delete[]

    onGetShifts(employee) {

    }
    // tag::navigate[]
    onNavigate(navUri) {
        client({
            method: 'GET',
            path: navUri,
            headers: {'Authorization':'Bearer ' + $authToken}
        }).then(employeeCollection => {
            this.links = employeeCollection.entity._links;

            return employeeCollection.entity._embedded.employees.map(employee =>
                client({
                    method: 'GET',
                    path: employee._links.self.href,
                    headers: {'Authorization':'Bearer ' + $authToken}
                })
            );
        }).then(employeePromises => {
            return when.all(employeePromises);
        }).done(employees => {
            this.setState({
                employees: employees,
                attributes: Object.keys(this.schema.properties),
                pageSize: this.state.pageSize,
                links: this.links
            });
        });
    }
    // tag::update-page-size[]
    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }
    // end::update-page-size[]

    // tag::follow-1[]
    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
        this.loadFromServerShifts(this.state.pageSize);
    }
    // end::follow-1[]

    render() {
        return (
            <div>
                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
                <EmployeeList employees={this.state.employees}
                              links={this.state.links}
                              pageSize={this.state.pageSize}
                              attributes={this.state.attributes}
                              sAttributes={this.state.sAttributes}
                              onNavigate={this.onNavigate}
                              onUpdate={this.onUpdate}
                              onDelete={this.onDelete}
                              onShiftDelete={this.onShiftDelete}
                              updatePageSize={this.updatePageSize}
                              onCreateShift={this.onCreateShift}/>
            </div>
        )
    }
}

// tag::create-dialog[]
class CreateDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var newEmployee = {};
        this.props.attributes.forEach(attribute => {
            newEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreate(newEmployee);
        this.props.attributes.forEach(attribute => {
                ReactDOM.findDOMNode(this.refs[attribute]).value = ''; // clear out the dialog's inputs
        });
        window.location = "#";
    }

    render() {
        var inputs = this.props.attributes.map(attribute =>
            <p key={attribute}>
                <input type="text" placeholder={attribute} ref={attribute} className="field" />
            </p>
        );
        return (
            <div>
                <a href="#createEmployee">Create</a>

                <div id="createEmployee" className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>

                        <h2>Create new employee</h2>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Create</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
};
// end::create-dialog[]
class CreateShiftDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var newShift = {};
        this.props.attributes.forEach(attribute => {
            newShift[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onCreateShift(newShift, this.props.shifts);
        this.props.handleShifts();
    }

    render() {
        var inputs = [];
        for(var attr in this.props.attributes)
        {
            if(this.props.attributes[attr] == 'name') {
                inputs.push(<p key={this.props.attributes[attr]}>
                    <input type="text" placeholder={this.props.attributes[attr]} ref={this.props.attributes[attr]} className="field" />
                </p>)
            }
            if(this.props.attributes[attr] == 'employee')  {
                inputs.push(<p key={this.props.attributes[attr]}>
                    <input type="text" disabled="true" value={this.props.selfEmployee.href} ref={this.props.attributes[attr]} className="field" />
                </p>)
            }
            if(this.props.attributes[attr] == 'date') {
                inputs.push(<p key={this.props.attributes[attr]}>
                    <input type="date" placeholder={this.props.attributes[attr]} ref={this.props.attributes[attr]} className="field" />
                </p>)
            }
            if(this.props.attributes[attr] == 'time') {
                inputs.push(<p key={this.props.attributes[attr]}>
                    <select name={this.props.attributes[attr]} ref={this.props.attributes[attr]} className="field">
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                    </select>
                </p>)
            }

        }

        return (
            <div>
                <div>
                    <h2>Create new Shift</h2>
                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Create</button>
                        </form>
                    </div>
            </div>
        )
    }
};
// tag::update-dialog[]
class UpdateDialog extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var updatedEmployee = {};
        this.props.attributes.forEach(attribute => {
            updatedEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });
        this.props.onUpdate(this.props.employee, updatedEmployee);
        window.location = "#";
    }

    render() {
        var inputs = this.props.attributes.map(attribute =>
            <p key={this.props.employee.entity[attribute]}>
                <input type="text" placeholder={attribute}
                       defaultValue={this.props.employee.entity[attribute]}
                       ref={attribute} className="field" />
            </p>
        );

        var dialogId = "updateEmployee-" + this.props.employee.entity._links.self.href;

        return (
            <div key={this.props.employee.entity._links.self.href}>
                <a href={"#" + dialogId}>Update</a>
                <div id={dialogId} className="modalDialog">
                    <div>
                        <a href="#" title="Close" className="close">X</a>

                        <h2>Update an employee</h2>

                        <form>
                            {inputs}
                            <button onClick={this.handleSubmit}>Update</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
};
// end::update-dialog[]

class ShiftDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleShifts = this.handleShifts.bind(this);
        this.state = {getShifts: []};
    }

    handleShifts(){
        client({
            method: "GET",
            path: this.props.shifts,
            headers: {'Authorization':'Bearer ' + $authToken}
        }).then(shiftsCollection => {
            return shiftsCollection.entity._embedded.shifts;
        }).done(shifts =>{
            console.log(shifts);
            this.setState({
                getShifts: shifts
            });
        });
        console.log(this.state.getShifts);
        window.location.href = "#" + "showShift-" + this.props.selfEmployee.href;
    }

    render() {
        var shifts = [];
        if(this.state.getShifts.length > 0) {
            shifts = this.state.getShifts.map(shift =>
                <Shift key={shift._links.self.href}
                       shift={shift}
                       attributes={this.props.attributes}
                       onShiftDelete={this.props.onShiftDelete}
                       handleShifts={this.handleShifts}/>
            );
        }

        var dialogId = "ShowShift-" + this.props.selfEmployee.href;

        return (
        <div key={this.props.selfEmployee.href}>
            <a onClick={this.handleShifts} href={"#" + dialogId}>ShowShifts</a>
            <div id={dialogId} className="modalDialog">
                <div>
                    <a href="#" title="Close" className="close">X</a>

                    <h2>Employee Shifts</h2>
                    <CreateShiftDialog shifts={this.props.shifts}
                                       attributes={this.props.attributes}
                                       onCreateShift={this.props.onCreateShift}
                                       selfEmployee={this.props.selfEmployee}
                                       handleShifts={this.handleShifts}/>
                    <h2>View Employee Shifts</h2>
                    <table>
                        <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                        {shifts}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        )
    }
};

class EmployeeList extends React.Component {

    constructor(props) {
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    // tag::handle-page-size-updates[]
    handleInput(e) {
        e.preventDefault();
        var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.props.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
        }
    }
    // end::handle-page-size-updates[]

    // tag::handle-nav[]
    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }
    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }
    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }
    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }
    // end::handle-nav[]
    // tag::employee-list-render[]
    render() {
        var employees = this.props.employees.map(employee =>
            <Employee key={employee.entity._links.self.href}
                      employee={employee}
                      shifts={employee.entity._links.shifts}
                      attributes={this.props.attributes}
                      sAttributes={this.props.sAttributes}
                      onUpdate={this.props.onUpdate}
                      onDelete={this.props.onDelete}
                      onShiftDelete={this.props.onShiftDelete}
                      onCreateShift={this.props.onCreateShift}/>
        );

        var navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
        }

        return (
            <div>
                <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
                <table>
                    <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                    {employees}
                    </tbody>
                </table>
                <div>
                    {navLinks}
                </div>
            </div>
        )
    }
    // end::employee-list-render[]
}

// tag::employee[]
class Employee extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete() {
        this.props.onDelete(this.props.employee);
    }

    render() {
        return (
            <tr>
                <td>{this.props.employee.entity.name}</td>
                <td>{this.props.employee.entity.description}</td>
                <td>
                    <UpdateDialog employee={this.props.employee}
                                  attributes={this.props.attributes}
                                  onUpdate={this.props.onUpdate}/>
                </td>
                <td>
                    <button onClick={this.handleDelete}>Delete</button>
                </td>
                <td>
                    <ShiftDialog shifts={this.props.shifts.href}
                                 attributes={this.props.sAttributes}
                                 onCreateShift={this.props.onCreateShift}
                                 selfEmployee={this.props.employee.entity._links.self}
                                 onShiftDelete={this.props.onShiftDelete}
                    />
                </td>
            </tr>
        )
    }
}
// end::employee[]
// tag::shift[]
class Shift extends React.Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount(){
        this.props.handleShifts();
    }

    handleDelete() {
        this.props.onShiftDelete(this.props.shift);
        this.props.handleShifts();
    }

    render() {
        return (
            <tr>
                <td>{this.props.shift.name}</td>
                <td>{this.props.shift.date}</td>
                <td>{this.props.shift.time}</td>
                <td>
                    <button onClick={this.handleDelete}>Delete</button>
                </td>
            </tr>
        )
    }
}
// end::shift[]
const kc = Keycloak('/keycloak.json');
kc.init({onLoad: 'check-sso'}).success(authenticated =>{
    if(authenticated){
        setInterval(() => {
            kc.updateToken(10).error(() => kc.logout());
        }, 10000);

        $authToken = kc.token;
        ReactDOM.render(
            <App />,
            document.getElementById('react')
        )
    } else {
        kc.login();
    }
});
