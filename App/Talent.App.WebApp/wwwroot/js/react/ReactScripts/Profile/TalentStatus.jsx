import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';

const talentType = [
    { key: '0', value: 'active', title: 'Actively looking for a job' },
    { key: '1', value: 'inactive', title: 'Not looking for a job at the moment' },
    { key: '2', value: 'open', title: 'Currently employed but open to offers' },
    { key: '3', value: 'availableLater', title: 'Will be available on a later date' }
];

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            jobSeekingStatus: {
                status: "",
                availableDate: null
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.saveStatus = this.saveStatus.bind(this);
    }

    render() {
        var talentOptions = talentType.map(x =>
            <Form.Field key={x.key}>
                <Checkbox
                    radio
                    label={x.title}
                    name='checkboxRadioGroup'
                    value={x.value}
                    checked={(this.state.jobSeekingStatus.status ? this.state.jobSeekingStatus.status  : (this.props.status ? this.props.status.status :"") )=== x.value}
                    onChange={this.handleChange}
                />
            </Form.Field>
        );

        return (
            <div className='ui row'>
                <div className="ui sixteen wide column">
                    <Form.Field>
                        <b>Current Status</b>
                    </Form.Field>
                    {talentOptions}
                </div>
            </div>
        );
    }

    handleChange(e, { value }) {
        const newJobSeekingStatus = Object.assign({}, this.state.jobSeekingStatus);
        newJobSeekingStatus.status = value;
        this.setState({ jobSeekingStatus: newJobSeekingStatus }, this.saveStatus);
    }

    saveStatus() {
        this.props.saveProfileData(this.state);
    }
}