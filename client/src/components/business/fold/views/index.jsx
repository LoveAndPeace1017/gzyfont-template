import React, {Component} from 'react';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

/**
 * 文件夹
 *
 * @visibleName Fold（文件夹）
 * @author guozhaodong
 */
export default class Fold extends Component {

    static propTypes = {
        /**
         * 面板头部标题
         **/
        title: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]),
        /**
         * 面板头部子标题
         **/
        subTitle: PropTypes.oneOfType([
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
        children: PropTypes.node,
        /**
         *  标题右侧内容
         **/
        rightContent: PropTypes.func
    };

    render() {
        let titleStr = null,
            subTitleStr = null,
            rightContent = null;
        if(this.props.title){
            titleStr = (
                <div className={cx("fold-title")}>
                    {this.props.title}
                </div>
            )
        }
        if(this.props.subTitle){
            subTitleStr = (
                <div className={cx("fold-sub-tit")}>
                    {this.props.subTitle}
                </div>
            )
        }
        if(this.props.rightContent){
            rightContent  = (
                <div className={cx("fold-right-content")}>
                    {this.props.rightContent()}
                </div>
            )
        }
        return (
            <div className={cx(['fold',this.props.className])}>
                {
                    titleStr&&titleStr?(<div className={cx("fold-hd")}>
                        {titleStr}
                        {subTitleStr}
                        {rightContent}
                    </div>):null
                }
                <div className={cx("fold-bd") + ' clearfix'}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}