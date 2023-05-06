import React, {Component} from 'react';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';

const cx = classNames.bind(styles);
import PropTypes from 'prop-types';

/**
 * 首页面板
 *
 * @visibleName Panel（首页面板）
 * @author guozhaodong
 */
export default class Panel extends Component {

    static propTypes = {
        /**
         * 面板头部标题
         **/
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]),
        /**
         * 面板头部额外信息
         **/
        extra: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]),
        /**
         * 添加class
         **/
        className: PropTypes.string,
        /**
         * 面板内容区域
         **/
        children: PropTypes.node
    };

    render() {
        let titleStr = null,
            extraStr = null;
        if(this.props.title){
            titleStr = (
                <div className={cx("panel-title")}>
                    {this.props.title}
                </div>
            )
        }
        if(this.props.extra){
            extraStr = (
                <div className={cx("panel-extra")}>
                    {this.props.extra}
                </div>
            )
        }
        return (
            <div className={cx(['panel',this.props.className])}>
                {
                    titleStr&&titleStr?(<div className={cx("panel-hd")}>
                        {titleStr}
                        {extraStr}
                    </div>):null
                }
                <div className={cx("panel-bd")}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}