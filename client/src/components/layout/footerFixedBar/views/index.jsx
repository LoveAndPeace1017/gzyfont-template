import React, {Component} from 'react';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {connect} from "react-redux";

const cx = classNames.bind(styles);

/**
 * 底部固定条
 *
 * @visibleName FooterFixedBar（底部固定条）
 * @author guozhaodong
 */
const FooterFixedBar = (props) => {
    return (
        <div className={cx(["footer-fixed-bar", {"footer-fixed-bar-collapsed": props.collapsed }, props.className])}>
            {props.children}
        </div>
    )
};

const mapStateToProps = state => ({
    collapsed: state.getIn(['sider', 'collapsed'])
});

export default connect(mapStateToProps)(FooterFixedBar);

