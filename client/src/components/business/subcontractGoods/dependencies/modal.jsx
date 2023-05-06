import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        document.getElementById('contentWrap').appendChild(this.el);
    }

    componentWillUnmount() {
        document.getElementById('contentWrap').removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el
        );
    }
}