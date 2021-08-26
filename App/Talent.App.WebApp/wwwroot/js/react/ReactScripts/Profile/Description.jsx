import React from 'react';
import Cookies from 'js-cookie';

export class Description extends React.Component {

    constructor(props) {
        super(props);

        const summary = props.summary !== null ? props.summary : "";
        const description = props.summary !== null ? props.summary : "";
           

        this.state = {
            summary : summary,
            description: description
        }
       

        this.handleChange = this.handleChange.bind(this);
        this.saveDescription = this.saveDescription.bind(this);
    };

    handleChange(event) {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    saveDescription()
    {
        this.props.controlFunc(this.props.summaryId, this.state.summary);
        this.props.controlFunc(this.props.descriptionId, thsi.state.description);
    }

    render() {
        const characterLimit = 600;
        const minCharacterLimit = 150;
        
        return (
            <React.Fragment>
                <div className="sixteen wide column">
                <div className="field" >
                        <input type="text" maxLength={minCharacterLimit} name="summary" placeholder="Please provide a sort summary about yourself" value={this.state.summary} onChange={this.handleChange} />
                    </div>
                    <p>Summary must be no more than 150 characters.</p>
                    <div className="field" >
                        <textarea  maxLength={characterLimit} name="description" placeholder="Please tell us about any hobbies, additional expertise, or anything else you’d like to add." value={this.state.description}  onChange={this.handleChange}></textarea>
                    </div>
                    <p>Description must be between 150-600 characters.</p>
                    <button type="button" className="ui right floated teal button" disabled onClick={this.saveDescription}>Save</button>
                </div>
            </React.Fragment>
        )
    }
}
