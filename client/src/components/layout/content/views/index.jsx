import React from 'react';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);
import PropTypes from 'prop-types';


const ContentHd = (props) => {
    return (
        <div className="content-hd">
            {props.children}
        </div>
    )
};

ContentHd.propTypes = {
    /**
     * 内容头
     **/
    children: PropTypes.node.isRequired
};

const ContentBd = (props) => {
    return (
        <div className="content-bd">
            {props.children}
        </div>
    )
};

ContentBd.propTypes = {
    /**
     * 内容体
     **/
    children: PropTypes.node.isRequired
};

/**
 * 页面内容区布局，目前在新增页面使用的，这块还有待去统一。todo
 *
 * @visibleName Content（页面内容区布局）
 * @author guozhaodong
 *
 */
const Content = (props) => {
    return (
        <div className="content-container">
            {props.children}
        </div>
    )
};

Content.propTypes = {
    /**
     * 内容区域
     **/
  children: PropTypes.node.isRequired
};

Content.ContentHd = ContentHd;

Content.ContentBd = ContentBd;

export default Content;


