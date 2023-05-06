import React, { Component } from 'react';
import intl from 'react-intl-universal';
class IntlTranslation extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() {
        return (
            <React.Fragment>
               {intl.get(this.props.intlKey)}
            </React.Fragment>
        );
    }
}

export default IntlTranslation;