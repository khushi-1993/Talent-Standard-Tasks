/* Experience section */
import React from 'react';
import _uniqueId from 'lodash/uniqueId';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Grid } from 'semantic-ui-react';
import moment from 'moment';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);

        const experience = props.experienceData ?
            Object.assign({}, props.experienceData)
            : {
                Id: "",
                Company: "",
                Position: "",
                Responsibilities: "",
                Start: "",
                End: ""
            }

        this.state = {
            showEditSection: false,
            newExperience: experience,
            company: '',
            position: '',
            start: '',
            end: '',
            responsibilities: '',
            deleteId: '',
            updateId: ''
        }
        this.renderAddNew = this.renderAddNew.bind(this);
        this.renderDisplay = this.renderDisplay.bind(this);
        this.openAddNew = this.openAddNew.bind(this);
        this.saveExperience = this.saveExperience.bind(this);
        this.closeAddNew = this.closeAddNew.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.updateExperience = this.updateExperience.bind(this);
    }


    componentDidMount() {
    }

    updateExperience(e) {
        e.preventDefault();
        const data = this.props.experienceData.map(e => e.id).indexOf(this.state.updateId);
        let updatedData = this.props.experienceData;
        updatedData[data].company = this.state.company;
        updatedData[data].position = this.state.position;
        updatedData[data].start = this.state.start;
        updatedData[data].end = this.state.end;
        updatedData[data].responsibilities = this.state.responsibilities;
        this.setState({ newExperience: updatedData });
        this.props.controlFunc(this.props.componentId, updatedData);
        this.cancelEdit();
    }


    cancelEdit() {
        this.setState({ updateId: '' })
    }

    handleUpdate(e, id) {
        e.preventDefault();
        this.setState({ updateId: id });
        this.closeAddNew();
        let data = this.props.experienceData;
        let updateData = data.filter(l => l.id == id);
        this.setState({
            company: updateData[0].company, position: updateData[0].position,
            start: updateData[0].start, end: updateData[0].end, responsibilities: updateData[0].responsibilities
        })
    }

    handleDelete(e, id) {
        e.preventDefault();
        const data = this.props.experienceData.filter(e => e.id != id);
        this.setState({ newExperience: data });
        this.props.controlFunc(this.props.componentId, data)
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    closeAddNew() {
        this.setState({ showEditSection: false })
    }

    saveExperience() {
        let id = _uniqueId();
        let company = this.state.company;
        let position = this.state.position;
        let start = this.state.start;
        let end = this.state.end;
        let responsibilities = this.state.responsibilities;
        const data = this.state.newExperience.push({ id, company, position, start, end, responsibilities });
        this.setState({ newExperience: data });
        this.props.controlFunc(this.props.componentId, this.state.newExperience)
        this.closeAddNew();
    }

    openAddNew(e) {
        e.preventDefault();
        this.cancelEdit();
        const experience = this.props.experienceData;
        this.setState({
            company: '',
            position: '',
            start: '',
            end: '',
            responsibilities: '',
            showEditSection: true,
            newExperience: experience
        });
    }

    render() {
        return this.renderDisplay()

    }

    renderAddNew() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="ui sixteen wide column">
                        <div className="fields">
                            <div className="eight wide field">
                                <ChildSingleInput
                                    inputType="text"
                                    label="Company:"
                                    name="company"
                                    value={this.state.company}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="Company"
                                    errorMessage="Please enter a valid company"
                                />
                            </div>
                            <div className="eight wide field">
                                <ChildSingleInput
                                    inputType="text"
                                    label="Position:"
                                    name="position"
                                    value={this.state.position}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="Position"
                                    errorMessage="Please enter a valid position"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="ui sixteen wide column">
                        <div className="fields">
                            <div className="eight wide field">
                                <ChildSingleInput
                                    inputType="date"
                                    label="Start Date:"
                                    name="start"
                                    //value={this.state.start}
                                    value={moment(this.state.start).format(moment.HTML5_FMT.DATE)}
                                    max={moment(this.state.end).format(moment.HTML5_FMT.DATE)}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="Start date"
                                    errorMessage="Please enter a valid start date"
                                />
                            </div>
                            <div className="eight wide field">
                                <ChildSingleInput
                                    inputType="date"
                                    label="End Date:"
                                    name="end"
                                    //  value={this.state.end}
                                    value={moment(this.state.end).format(moment.HTML5_FMT.DATE)}
                                    max={moment(this.state.end).format(moment.HTML5_FMT.DATE)}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="End date"
                                    errorMessage="Please enter a valid end date"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="ui sixteen wide column">
                        <div className="fields">
                            <div className="sixteen wide field">
                                <ChildSingleInput
                                    inputType="text"
                                    label="Responsibilities:"
                                    name="responsibilities"
                                    value={this.state.responsibilities}
                                    controlFunc={this.handleChange}
                                    maxLength={200}
                                    placeholder="Responsibilities"
                                    errorMessage="Please enter a valid responsibility"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button type="button" className="ui black button" onClick={this.saveExperience} >Add</button>
                <button type="button" className="ui button" onClick={this.closeAddNew} > Cancel</button>
            </React.Fragment>
        )
    }

    renderDisplay() {
        let list = this.props.experienceData;
        let tableData = null;
        if (list != '' && list != [] && list != null && list != undefined) {
            tableData = list.map((experience, index) => {
                if (this.state.updateId != experience.id) {
                    return (
                        <tr key={index}>
                            <td>{experience.company}</td>
                            <td>{experience.position}</td>
                            <td>{experience.responsibilities}</td>
                            <td>{moment(experience.start).format("Do MMM, YYYY")}</td>
                            <td>{moment(experience.end).format("Do MMM, YYYY")}</td>
                            <td className="four wide right aligned">
                                <i className="pencil icon" onClick={(e) => this.handleUpdate(e, experience.id)}></i>
                                <i className="remove icon" onClick={(e) => this.handleDelete(e, experience.id)}></i>
                            </td>
                        </tr>
                    )
                }
                else {
                    return (
                        <tr key={index}>
                            <td colSpan={8}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width="eight">
                                            <div className="field">
                                                <label>Company</label>
                                                <input type="text" name="company" placeholder="Add Company" value={this.state.company} onChange={this.handleChange} />
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width="eight">
                                            <div className="field">
                                                <label>Position</label>
                                                <input type="text" name="position" placeholder="Add Position" value={this.state.position} onChange={this.handleChange} />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width="eight">
                                            <div className="field">
                                                <label>Start</label>
                                                <input type="date" name="start" placeholder="Add Start Date" value={this.DateConverterForUpdate(this.state.start)} onChange={this.handleChange} />
                                            </div>
                                        </Grid.Column>
                                        <Grid.Column width="eight">
                                            <div className="field">
                                                <label>End</label>
                                                <input type="date" name="end" placeholder="Add End Date" value={this.DateConverterForUpdate(this.state.end)} onChange={this.handleChange} />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width="eight">
                                            <div className="field">
                                                <label>Responsibilities</label>
                                                <input type="text" name="responsibilities" placeholder="Responsibilities" value={this.state.responsibilities} onChange={this.handleChange} />
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column width="eight">
                                            <div className="field">
                                                <button className="ui black button" onClick={this.updateExperience}>Update</button>
                                                <button className="ui button" onClick={this.cancelEdit}>Cancel</button>
                                            </div>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </td>
                        </tr>
                    )
                }
            })
        }
        return (
            <React.Fragment>
                <div className="row">
                    <div className="ui sixteen wide column">
                        {this.state.showEditSection ? this.renderAddNew() : null}
                        <table className="ui table">
                            <thead>
                                <tr>
                                    <th className="three wide">Company</th>
                                    <th className="three wide">Position</th>
                                    <th className="three wide">Responsibilities</th>
                                    <th className="three wide">Start Date</th>
                                    <th className="three wide">End Date</th>
                                    <th>
                                        <button className="ui black button ui right floated" onClick={this.openAddNew}>+ Add New</button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData}
                            </tbody>
                        </table>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}