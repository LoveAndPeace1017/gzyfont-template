import React, {Component} from 'react';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

/**
 * 滚动条容器
 *
 * @visibleName ScrollContainer（滚动条容器）
 * @author guozhaodong
 */
export default class ScrollContainer extends Component {

    static propTypes = {
        /**
         * 属性值
         **/
        children: PropTypes.node.isRequired,
        /**
         * 添加class
         **/
        className: PropTypes.string
    };

    render() {
        return (
            <div className={cx(['scroll-container',this.props.className])}>
                {this.props.children}
            </div>
        )
    }
}