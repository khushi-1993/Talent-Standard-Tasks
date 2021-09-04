/* Language section */
import React, { Fragment } from 'react';
import { SingleInput } from '../Form/SingleInput.jsx';
import { Select } from '../Form/Select.jsx';
import _uniqueId from 'lodash/uniqueId';

export default class Language extends React.Component {
    constructor(props) {
        super(props);

        const languages = props.languageData ?
            Object.assign({}, props.languageData)
            : {
                name: "",
                level: "",
                id: "",
                currentUserId: ""
            }

        this.state = {
            showAddSection: false,
            newLanguages: languages,
            languageLevels: [],
            language: '',
            languageLevel: '',
            deleteId: '',
            updateId: ''
        }

        this.renderDisplay = this.renderDisplay.bind(this);
        this.renderAddNew = this.renderAddNew.bind(this);
        this.openAddNew = this.openAddNew.bind(this);
        this.saveLanguages = this.saveLanguages.bind(this);
        this.closeAddNew = this.closeAddNew.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.cancelUpdate = this.cancelUpdate.bind(this);
        this.updateLanguage = this.updateLanguage.bind(this);

    }

    componentDidMount() {
        const levels = [{ value: 'Basic', title: 'Basic' },
        { value: 'Conversational', title: 'Conversational' },
        { value: 'Fluent', title: 'Fluent' },
        { value: 'Native/Bilingual', title: 'Native/Bilingual' }
        ];
        this.setState({ languageLevels: levels });
    }

    renderAddNew() {
        return (
            <Fragment>
                <div className="row">
                    <div className="ui sixteen wide column">
                        <div className="fields">
                            <div className="five wide field">
                                <SingleInput
                                    inputType="text"
                                    name="language"
                                    content={this.state.language}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="Add Language"
                                    errorMessage="Please enter a valid language"
                                    isError={false}
                                />
                            </div>
                            <div className="five wide field">
                                <Select
                                    placeholder="Language Level"
                                    controlFunc={this.handleChange}
                                    name="languageLevel"
                                    options={this.state.languageLevels}
                                />
                            </div>
                            <div className="six wide field">
                                <button type="button" className="ui black button" onClick={this.saveLanguages} >Add</button>
                                <button type="button" className="ui button" onClick={this.closeAddNew} > Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }

    openAddNew(e) {
        e.preventDefault();
        const languages = this.props.languageData;
        this.cancelUpdate();
        this.setState({
            language: '',
            showAddSection: true,
            newLanguages: languages
        })
    }

    saveLanguages() {
        let name = this.state.language;
        let level = this.state.languageLevel;
        let id = _uniqueId();
        const data = this.state.newLanguages.push({ id, name, level });
        this.setState({ newLanguages: data });
        this.props.controlFunc(this.props.componentId, this.state.newLanguages)
        this.closeAddNew();
    }

    closeAddNew() {
        this.setState({ showAddSection: false });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleDelete(e, id) {
        e.preventDefault();
        const data = this.props.languageData.filter(e => e.id != id);
        this.setState({ newLanguages: data });
        this.props.controlFunc(this.props.componentId, data)
    }

    handleUpdate(e, id) {
        e.preventDefault();
        this.closeAddNew();
        this.setState({ updateId: id });
        let data = this.props.languageData;
        let updateData = data.filter(l => l.id == id);
        this.setState({ language: updateData[0].name, languageLevel: updateData[0].level })
    }

    cancelUpdate() {
        this.setState({ updateId: '' })
    }

    updateLanguage(e) {
        e.preventDefault();
        const data = this.props.languageData.map(e => e.id).indexOf(this.state.updateId);
        let updatedData = this.props.languageData;
        updatedData[data].name = this.state.language;
        updatedData[data].level = this.state.languageLevel;
        this.setState({ newLanguages: updatedData });
        this.props.controlFunc(this.props.componentId, updatedData);
        this.cancelUpdate();
    }

    renderDisplay() {
        let languageList = this.props.languageData;
        let languageTable = null;

        if (languageList != '' && languageList != [] && languageList != null && languageList != undefined) {
            languageTable = languageList.map((language, index) => {
                if (this.state.updateId == language.id) {
                    return (
                        <tr key={index}>
                            <td>
                                <SingleInput
                                    inputType="text"
                                    name="language"
                                    content={this.state.language}
                                    controlFunc={this.handleChange}
                                    maxLength={80}
                                    placeholder="Add Language"
                                    errorMessage="Please enter a valid language"
                                    isError={false}
                                />
                            </td>
                            <td>
                                <Select
                                    placeholder="Language Level"
                                    controlFunc={this.handleChange}
                                    name="languageLevel"
                                    options={this.state.languageLevels}
                                    selectedOption={this.state.languageLevel}
                                />
                            </td>
                            <td>
                                <button className="ui blue basic button" onClick={this.updateLanguage}>Update</button>
                                <button className="ui red basic button" onClick={this.cancelUpdate}>Cancel</button>
                            </td>
                        </tr>
                    )
                }
                else {
                    return (
                        <tr key={index}>
                            <td>{language.name}</td>
                            <td>{language.level}</td>
                            <td className="four wide right aligned">
                                <i className="pencil icon" onClick={(e) => this.handleUpdate(e, language.id == undefined ? index : language.id)}></i>
                                <i className="remove icon" onClick={(e) => this.handleDelete(e, language.id == undefined ? index : language.id)}></i>
                            </td>
                        </tr>
                    )
                }
            })
        }
        return (
            <Fragment>
                <div className="row">
                    <div className="ui sixteen wide column">
                        {this.state.showAddSection ? this.renderAddNew() : null}
                        <table className="ui table">
                            <thead>
                                <tr>
                                    <th className="five wide">Language</th>
                                    <th className="five wide">Level</th>
                                    <th>
                                        <button className="ui black button right floated" onClick={this.openAddNew}>+  Add New</button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {languageTable}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Fragment>
        )
    }

    render() {
        return (
            this.renderDisplay()
        )

    }
}