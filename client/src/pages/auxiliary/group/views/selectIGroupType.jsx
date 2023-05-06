import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchGroupList} from '../actions';
import Add from './add';
import Auxiliary from 'pages/auxiliary';
import classNames from "classnames/bind";
import styles from "../../project/styles/index.scss";
const cx = classNames.bind(styles);
const {Option} = Select;

class SelectGroupType extends Component {

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
            incomeAddVisible: false
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
        console.log(value,'fvalue')
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
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchGroupList(this.props.type);
    }


    render() {
        const {incomeList, type, showEdit ,style} = this.props;
        const incomeListData = incomeList.getIn([type, 'data', 'data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !style}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select allowClear
                            placeholder={this.props.placeholder || ''}
                            style={{minWidth: '200px'}}
                            value={this.state.value}
                            onChange={this.handleChange}
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                    {
                                        !!showEdit && (
                                            <div className={cx('dropdown-action') + " cf"}>
                                                <a href="#!" className="fl" onClick={()=>this.openModal('incomeAddVisible')}>{intl.get('common.confirm.new')}</a>
                                                <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'income', type)}>{intl.get('common.confirm.manage')}</a>
                                            </div>
                                        )
                                    }
                                </div>
                            )}
                    >
                        {
                            incomeListData && incomeListData.map(item => (
                                <Option key={item.get('id')}
                                        value={item.get('id')+''}>{item.get('groupName')}</Option>
                            ))
                        }
                    </Select>
                </div>
                <Add onClose={this.closeModal.bind(this, 'incomeAddVisible')} type={type} visible={this.state.incomeAddVisible}/>
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
        incomeList: state.getIn(['auxiliaryGroup', 'groupList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGroupList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectGroupType)
