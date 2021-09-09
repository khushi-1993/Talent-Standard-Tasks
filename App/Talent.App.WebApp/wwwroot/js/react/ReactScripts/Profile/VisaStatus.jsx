import React, { Fragment } from 'react';
import { Select } from '../Form/Select.jsx';
import { SingleInput } from '../Form/SingleInput.jsx';
import moment from 'moment';

const residencyTypes = ["Citizen", "Permanent Resident"];

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)

        const visaStatus = props.visaStatus ? props.visaStatus :"";
        const visaExpiryDate = props.visaExpiryDate ? props.visaExpiryDate : "";

        const visaOption = [
            {
                value: 'Citizen', title: 'Citizen'
            },
            {
                value: 'Permanent Resident', title: 'Permanent Resident'
            },
            {
                value: 'Work Visa', title: 'Work Visa'
            },
            {
                value: 'Student Visa', title: 'Student Visa'
            },
        ]
        
        this.state = {
            visaStatus: visaStatus,
            visaExpiryDate: visaExpiryDate,
            visaOption:visaOption
        }

        this.handleChange = this.handleChange.bind(this);
        this.saveVisaStatus = this.saveVisaStatus.bind(this);
        this.isResidentStatus =this.isResidentStatus.bind(this);
    }

    saveVisaStatus() {
        const visaStatus = this.state.visaStatus;
        const visaExpiryDate = this.state.visaExpiryDate;
        const newVisaDetails = { visaStatus, visaExpiryDate };
        this.props.saveProfileData(newVisaDetails);
    }

    handleChange(event) {
       this.setState({ [event.target.name]: event.target.value });
    }

    componentDidUpdate() {
        if (this.props.visaStatus !== this.state.visaStatus) {
            if (this.isResidentStatus(this.state.visaStatus)) {
                this.saveVisaStatus();
            }
        }
    }

    isResidentStatus(visa) {
        return residencyTypes.includes(visa);
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <div className="ui sixteen wide column">
                        <div className="fields">
                            <div className="six wide field">
                                <label>Visa Type</label>
                                <Select
                                    name='visaStatus'
                                    options={this.state.visaOption != null ? this.state.visaOption : ""}
                                    controlFunc={this.handleChange}
                                    placeholder="Enter Your Visa Status"
                                    errorMessage="Please enter a valid Visa Status"
                                    selectedOption={this.state.visaStatus ? this.state.visaStatus : this.props.visaStatus}
                                />
                            </div>
                            {this.isResidentStatus(this.state.visaStatus ? this.state.visaStatus : this.props.visaStatus) ? null :
                             <Fragment>
                                 <div className="six wide field">
                                     <label>Visa Expiry Date</label>
                                     <SingleInput
                                     inputType="date"
                                     name="visaExpiryDate"
                                     content={this.state.visaExpiryDate ? this.state.visaExpiryDate : moment(this.props.visaExpiryDate).format(moment.HTML5_FMT.DATE)}
                                     controlFunc={this.handleChange}
                                     maxLength={80}
                                     placeholder="Please Add Visa Expiry Date"
                                     errorMessage="Please enter valid Visa Expiry Date"
                                     isError={false}
                                     />
                                 </div>
                                 <div className="two wide field">
                                     <button style={{ marginTop: '23px' }} type="button" className="ui black button" onClick={this.saveVisaStatus}>Save</button>
                                 </div>
                             </Fragment>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}