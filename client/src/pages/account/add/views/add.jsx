import React, { Component } from 'react';
import Form from './form';

export default class AccountAdd extends Component {

	render() {
		return (
            <Form {...this.props} />
		);
	}
}

