import React from 'react';
import classNames from "classnames/bind";
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import PropTypes from 'prop-types';

/**
 * 该组件为为滚动条添加鼠标移入显示移出消失的效果
 *
 * @visibleName ScrollContainer（滚动条）
 * @author guozhaodong
 */
export default class ScrollContainer extends React.Component{
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object
    };

    render(){
        return(
            <div className={cx('scroll-container') + ' ' + this.props.className} style={this.props.style}>
                <div className={cx("scroll-container-inner")}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}