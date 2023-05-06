import React, {Component} from 'react';
import {Popover} from "antd";
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);

export default class ProgressGraph extends Component {
    static propTypes = {
        /**  列表数据 */
        list: PropTypes.array,
        /** 是否展示底部标题内容 */
        showTitle: PropTypes.boolean
    };

    render() {
        const {list, showTitle=true} = this.props;

        return (
            <React.Fragment>
                <div className={cx('process-graph')}>
                    {
                        list && list.map((item, index) => {
                            let len = list.length;
                            let {content, hoverContent} = item.graph;
                            let className = '';
                            if (len === 1) {
                                className = 'item0';
                            } else if (index === 0) {
                                className = 'item1';
                            } else if (index === len - 1) {
                                className = 'item3';
                            } else {
                                className = 'item2';
                            }

                            const popContent = (
                                <div className={cx('process-pop-container')}>
                                    {
                                        hoverContent && hoverContent.map(pItem => {
                                            return (
                                                <p className={cx('pop-item')}>
                                                    {pItem.label}:{pItem.value}
                                                    {
                                                        pItem.tip && (
                                                            <span className={cx('tip')}>{pItem.tip}</span>
                                                        )
                                                    }
                                                </p>
                                            )
                                        })
                                    }
                                </div>
                            );


                            return (
                                <Popover content={popContent}>
                                    <div className={cx(className)} style={{...content.style}}>
                                        {content.text}
                                    </div>
                                </Popover>
                            )
                        })
                    }
                </div>
                {
                    showTitle && (
                        <div className={cx('title-content')}>
                            {
                                list && list.map((item) => {
                                    let {title} = item.graph;
                                    return (
                                        <p className={cx('process-title')} style={{...title.style}}>
                                            {title.text}
                                        </p>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </React.Fragment>
        )
    }
}