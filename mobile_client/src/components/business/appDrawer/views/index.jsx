import React, {Component} from 'react';
import { Drawer, Accordion } from 'antd-mobile';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export default class AppDrawer extends  Component {
    constructor(props) {
        super(props);
        this.state = {
            accordionIndexGroup: {...props.accordionIndexGroup}
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.accordionIndexGroup){
            let keys = Object.keys(nextProps.accordionIndexGroup);
            for(var i=0;i<keys.length;i++){
                let key = keys[i];
                if(this.state.accordionIndexGroup[key] !== nextProps.accordionIndexGroup[key]){
                    this.setState({accordionIndexGroup: nextProps.accordionIndexGroup});
                    break;
                }
            }
        }
    }

    handleChange = (name, idx) => {
        let {accordionIndexGroup} = this.state;
        accordionIndexGroup[name] = idx;
        this.setState({accordionIndexGroup});
    };

    confirm = () => {
        const {accordionIndexGroup} = this.state;
        const {visibleFlag} = this.props;
        this.props.confirm(visibleFlag, accordionIndexGroup);
    };

    render() {
        const {accordionIndexGroup} = this.state;
        const {accordionData, title, open, visibleFlag} = this.props;

        const sidebar = (
            <div className={cx('sidebar')}>
                <div className={cx('sidebar-title')}>{title}</div>
                <div className={cx('sidebar-lst')}>
                    {
                        (accordionData && Object.keys(accordionData).length > 0) && (
                            Object.keys(accordionData).map((key) => {
                                return (
                                    <div style={{ marginTop: '9px'}} key={key}>
                                        <Accordion defaultActiveKey="0" className="my-accordion">
                                            <Accordion.Panel header={accordionData[key].title} className="pad">
                                                <div className={cx('accordion-content')}>
                                                    {
                                                        (accordionData[key].subData && accordionData[key].subData.length > 0) && (
                                                            accordionData[key].subData.map((data, idx) => {
                                                                    return (
                                                                        <a key={idx} className={cx(["default-btn", {"active": idx === accordionIndexGroup[key]}])}
                                                                           onClick={() =>this.handleChange(key, idx)}
                                                                        >
                                                                        {data.title}</a>
                                                                    )
                                                            })
                                                        )
                                                    }

                                                </div>
                                            </Accordion.Panel>
                                        </Accordion>
                                    </div>
                                )
                            })
                        )
                    }

                </div>
                <div className={cx('sidebar-btn')}>
                    <a href="#!" onClick={() => this.props.reset(visibleFlag)}>清空</a>
                    <a href="#!" className={cx('confirm')} onClick={() => this.confirm()}>确定</a>
                </div>
            </div>
        );

        return (
            <React.Fragment>
                <Drawer
                    className="my-drawer"
                    style={{'display': open ? 'block' : 'none', position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9999}}
                    enableDragHandle
                    contentStyle={{ color: '#2DA66A', textAlign: 'center'}}
                    sidebar={sidebar}
                    open={open}
                    onOpenChange={() => {this.props.changeStatus(visibleFlag, false)}}
                    position={'right'}
                >
                    <span style={{'display': 'none'}}>drawer</span>
                </Drawer>
            </React.Fragment>
        )
    }
}

