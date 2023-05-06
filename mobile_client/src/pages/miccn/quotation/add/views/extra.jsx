import React, { Component } from 'react';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export class ButtonGroup extends Component {
    constructor(props) {
        super(props);
    }

    onChange = (value) => {
        if(value !== this.props.defaultValue) {
            this.props.onChange(value)
        }
    };

    render() {
        let {dataSource, defaultValue, btnStyle} = this.props;
        return (
            <div className={cx('btn-group')}>
                {
                    dataSource && dataSource.map((item, index) => {
                        return (
                            <a key={index}
                               className={cx(['s-btn', {'active': item.value === defaultValue}])}
                               onClick={() => this.onChange(item.value)}
                               style={{...btnStyle}}
                            >
                                {item.name}
                            </a>
                        )
                    })
                }
            </div>
        )
    }
}