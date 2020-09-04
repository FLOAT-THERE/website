import React, { Component } from 'react';
import queryString from 'query-string';

class Customer extends Component {

    state = {
        customerId: null
    }

    componentDidMount = () => {
        let url = this.props.location.search;
        let urlParams = queryString.parse(url);
        this.props.setCustomerId(urlParams.customerId);
    }

    render() {
        return (
            <div>
                <h1> {this.props.customerId}</h1>
            </div>
        )

    }
}

export default Customer