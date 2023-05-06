import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchExpressList, asyncAddExpress} from "../actions";
import {ExpressAdd} from 'pages/auxiliary/express';

import Auxiliary from 'pages/auxiliary';

const {Option} = Select;
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

class SelectExpress extends Component {

    static getDerivedStateFromProps(nextProps) {
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                value: nextProps.value
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || undefined;

        this.state = {
            value,
            expressAddVisible: false,
        };
    }

    openModal = (type, auxiliaryKey, auxiliaryTabKey) => {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    };

    closeModal = (type) =>{
        this.setState({
            [type]: false
        })
    };

    handleChange = (value) => {

        if(!value){
            value = ''
        }

        if (!('value' in this.props)) {
            this.setState({
                value
            });
        }

        const onChange = this.props.onChange;
        if (onChange) {
            onChange(value);
        }
        // this.handleChange(projectName);
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchExpressList('express');
    }

    render() {
        const {expressList, showEdit} = this.props;
        const expressListData = expressList.getIn(['express','data','data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        allowClear
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{minWidth: '200px'}}
                        placeholder={this.props.placeholder||intl.get("auxiliary.express.placeholder")}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('expressAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'order','express')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            expressListData && expressListData.map(item => (
                                <Option key={item.get('id')}
                                        value={item.get('paramName')}>{item.get('paramName')}</Option>
                            ))
                        }
                    </Select>
                </div>

                <ExpressAdd onClose={this.closeModal.bind(this, 'expressAddVisible')} visible={this.state.expressAddVisible} callback={(express) => {
                    this.props.asyncFetchExpressList('express', () => {
                        this.handleChange(express);
                    });
                }}/>

                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    defaultTabKey={this.state.auxiliaryTabKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.closeModal.bind(this, 'auxiliaryVisible')}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        expressList: state.getIn(['auxiliaryExpress', 'expressList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchExpressList,
        asyncAddExpress,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectExpress)