import React from 'react';
import { Icon } from 'semantic-ui-react';

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {        
        let city, country;
        const { phone, name, email, location } = this.props.companyDetails;
        if (location) {
            city = location.city;
            country = location.country;
        }
        return (
            <div className="ui card">
                <div className="content">
                    <div className="center aligned author">
                        <img className="ui mini circular image" src="https://semantic-ui.com/images/wireframe/square-image.png" style={{ marginBottom: '15px' }} />
                    </div>
                    <div className="center aligned header">{name}</div>
                    <div className="center aligned"><Icon name="map pin"></Icon>{city}{", "}{country}</div>
                    <div className="center aligned description">
                        <p>We currently do not have specific skills that we desire.</p>
                    </div>
                </div>
                <div className="extra content">
                <div className="row">
                        <i aria-hidden="true" className="phone icon"></i>
                        : {phone}
                        </div>
                    <div className="row">
                        <i aria-hidden="true" className="mail icon"></i>
                        : {email}
                        </div>
                </div>
            </div>
        );
    }
}