import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx';
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 5,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: {},
            talents:[]
        }

        this.init = this.init.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadTalents = this.loadTalents.bind(this);

    };

    loadData()
    {
        var cookies = Cookies.get('talentAuthToken');

        $.ajax({
            url: 'http://localhost:60290/profile/profile/GetEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                this.updateWithoutSave(res.employer.companyContact)
            }.bind(this)
        })
    }

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
    }

    componentDidMount() {
        //window.addEventListener('scroll', this.handleScroll);
        this.init();
        this.loadData();
        this.loadTalents();
    };

   
    loadTalents() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getTalent',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: { position: this.state.loadPosition, number: this.state.loadNumber},
            success: function (res) {
                console.log(res)
                this.setState({ talents:res.data })
            }.bind(this)
        })
        // $.ajax({
        //     url: 'http://localhost:60290/profile/profile/getTalent',
        //     headers: {
        //         'Authorization': 'Bearer ' + cookies,
        //         'Content-Type': 'application/json'
        //     },
        //     type: "GET",
        //     data: { position: this.state.loadPosition, number: this.state.loadNumber},
        //     contentType: "application/json",
        //     dataType: "json",
        //     success: function (res) {
        //         let newFeedData = this.state.feedData;
        //         let newLoadPosition = this.state.loadPosition;

        //         if (res.data) {
        //             newFeedData = newFeedData.concat(res.data);
        //             newLoadPosition += this.state.loadNumber;
        //             console.log(newFeedData);
        //             console.log(newLoadPosition);
        //         }
        //         console.log(res);
        //         this.setState({
        //             feedData: newFeedData,
        //             loadPosition: newLoadPosition
        //         });
        //     }.bind(this),
        //     error: function (res) {
        //         console.log(res.status)
        //     }
        // })
    }

    updateWithoutSave(newValues) {
        let newProfile = Object.assign({}, this.state.companyDetails, newValues)
        this.setState({
            companyDetails: newProfile
        }, function () { console.log(this.state.companyDetails) })
    }

    render() {

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                 <div className="ui grid talent-feed container">
                    <div className="four wide column">
                        <CompanyProfile companyDetails={this.state.companyDetails} />
                        </div>
                    <div className="eight wide column">
                        <TalentCard talents={this.state.talents} />
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <FollowingSuggestion/>
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}