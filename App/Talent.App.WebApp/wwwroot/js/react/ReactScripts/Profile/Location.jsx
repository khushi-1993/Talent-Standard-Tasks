import React, { Fragment } from 'react'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export class Address extends React.Component {
    constructor(props) {
        super(props)

        const addressData = props.addressData ?
            Object.assign({}, props.addressData)
            : {
                number: "",
                street: "",
                suburb: "",
                postCode: "",
                location: {
                    city: "",
                    country: ""
                }

            }

        this.state = {
            showEditSection: false,
            newAddress: addressData
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveAddress = this.saveAddress.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.handledropdownChange = this.handledropdownChange.bind(this)
    }

    openEdit() {
        const addressData = Object.assign({}, this.props.addressData)
        this.setState({
            showEditSection: true,
            newAddress: addressData
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        event.preventDefault();
        const data = Object.assign({}, this.state.newAddress)
        data[event.target.name] = event.target.value
        this.setState({
            newAddress: data
        })
    }

    handledropdownChange(event) {
        event.preventDefault();
        const data = Object.assign({}, this.state.newAddress)
        data["location"][event.target.name] = event.target.value
        if (data["location"]["country"] === null || data["location"]["country"] === "") {
            data["location"]["city"] = ""
        }
        this.setState({
            newAddress: data
        })
    }

    saveAddress() {
        const data = Object.assign({}, this.state.newAddress)
        this.props.controlFunc(this.props.componentId, data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        let countriesOptions = [];
        let citiesOptions = [];

        countriesOptions = Object.keys(Countries).map((x) => <option key={x} value={x}>{x}</option>);
        if (this.state.newAddress.location.country != "" && this.state.newAddress.location.country != null) {

            citiesOptions = Countries[this.state.newAddress.location.country].map(x => <option key={x} value={x}> {x}</option>);
        }
        else {
            citiesOptions = <option value="">Select a city</option>
        }

        return (
            <Fragment>
                <div className='row'>
                    <div className="ui four wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            name="number"
                            value={this.state.newAddress.number}
                            controlFunc={this.handleChange}
                            maxLength={10}
                            placeholder="Enter your Number"
                            errorMessage="Please enter a valid Number"
                        />
                    </div>
                    <div className="ui eight wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            name="street"
                            value={this.state.newAddress.street}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your Street Name"
                            errorMessage="Please enter a valid street name"
                        />
                    </div>
                    <div className="ui four wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            name="suburb"
                            value={this.state.newAddress.suburb}
                            controlFunc={this.handleChange}
                            maxLength={80}
                            placeholder="Enter your suburb"
                            errorMessage="Please enter a valid suburb"
                        />
                    </div>
                </div>

                <div className='row'>
                    <div className="ui six wide column">
                        <div className="field margin-0px"><label>Country</label></div>
                        <select className="ui right labeled dropdown"
                            placeholder="Country"
                            value={this.state.newAddress.location.country}
                            onChange={this.handledropdownChange}
                            name="country">
                            <option value="">Select a country</option>
                            {countriesOptions}
                        </select>
                    </div>
                    <div className="ui six wide column">
                        <div className="field margin-0px"><label>City</label></div>
                        <select className="ui right labeled dropdown"
                            placeholder="City"
                            value={this.state.newAddress.location.city}
                            onChange={this.handledropdownChange}
                            name="city">
                            {citiesOptions}
                        </select>
                    </div>
                    <div className="ui four wide column">
                        <ChildSingleInput
                            inputType="text"
                            label="PostCode"
                            name="postCode"
                            value={this.state.newAddress.postCode}
                            controlFunc={this.handleChange}
                            maxLength={12}
                            placeholder="Enter a postcode"
                            errorMessage="Please enter a valid postcode"
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='ui sixteen wide column'>
                        <button type="button" className="ui teal button" onClick={this.saveAddress}>Save</button>
                        <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                    </div>
                </div>
            </Fragment>
        )
    }

    renderDisplay() {

        let address = this.props.addressData ? `${this.props.addressData.number},${this.props.addressData.street},${this.props.addressData.suburb},${this.props.addressData.postCode} ` : ""
        let city = this.props.addressData.location ? this.props.addressData.location.city : ""
        let country = this.props.addressData.location ? this.props.addressData.location.country : ""

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {address}</p>
                        <p>City: {city}</p>
                        <p>Country: {country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }

}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        this.handledropdownChange = this.handledropdownChange.bind(this)
    }

    handledropdownChange(event) {
        event.preventDefault();
        const data = {};
        data[event.target.name] = event.target.value;
        this.props.saveProfileData(data);
    }

    render() {
        let nationalityOptions = [];
        
        nationalityOptions = Object.keys(Countries).map((x) => <option key={x} value={x}>{x}</option>);

        return (
            <div className='row'>
                <div className="ui four wide column">
                    <select className="ui right labeled dropdown"
                        placeholder="Nationality"
                        value={this.props.nationalityData ? this.props.nationalityData : ""}
                        onChange={this.handledropdownChange}
                        name="nationality">
                        <option value="">Select your nationality</option>
                        {nationalityOptions}
                    </select>
                </div>
            </div>
        )
    }
}