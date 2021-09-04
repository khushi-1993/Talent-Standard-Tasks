import React from 'react';
import Cookies from 'js-cookie';
import { Label, TextArea } from 'semantic-ui-react';

export class Description extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            disabled: true,
            error: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
    };


    handleChange(event) {
        event.preventDefault();
        this.props.updateProfileData(
            {
                [event.target.name]: event.target.value
            }
        )
        this.setState({
             disabled: false
        })
        if(event.target.name === 'description')
        {
            if (this.props.data.description && this.props.data.description.length > 150) {
                this.setState({
                    error: false
                })
            }
        }
    }

    saveDescription() {
        if ((this.props.data.description && this.props.data.description.length > 150)) {
            this.setState({
                error: false
            })
            this.props.saveProfileData(this.props.data);
        }
        else  if (this.props.data.description && this.props.data.description.length > 0){
            this.setState({
                error: true
            })
        }
        else{
            this.props.saveProfileData(this.props.data);
        }

    }

    render() {
        const characterLimit = 600;
        const minCharacterLimit = 150;

        return (
            <React.Fragment>
                <div className="sixteen wide column">
                    <div className="field" >
                        <input type="text" id="summary" maxLength={minCharacterLimit} name="summary" placeholder="Please provide a sort summary about yourself" defaultValue={this.props.data.summary !== null ? this.props.data.summary : ""} onChange={this.handleChange} />
                    </div>
                    <p>Summary must be no more than 150 characters.</p>
                    <div className="field" >
                        {
                            this.state.error == true ?
                                <React.Fragment>
                                    <label className="text-danger">Description must be between 150-600 characters</label>
                                </React.Fragment>
                                : ""
                        }
                        <textarea type="text" id="description" maxLength={characterLimit} name="description" placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add." value={this.props.data.description != null ? this.props.data.description : ""} onChange={this.handleChange}></textarea>
                    </div>
                    <p>Description must be between 150-600 characters.</p>
                    <button type="button" className="ui right floated teal button" disabled={this.state.disabled} onClick={this.saveDescription}>Save</button>
                </div>
            </React.Fragment>
        )
    }
}
