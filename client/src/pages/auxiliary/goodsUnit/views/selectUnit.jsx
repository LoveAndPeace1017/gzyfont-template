import React, {Component} from 'react';
import {Select} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import intl from 'react-intl-universal';
import {asyncFetchGoodsUnitList, emptyGoodsUnitListCache} from '../actions'

import {UnitAdd} from 'pages/auxiliary/goodsUnit';
import Auxiliary from 'pages/auxiliary';

import classNames from "classnames/bind";
import styles from "../../project/styles/index.scss";
const cx = classNames.bind(styles);
import PropTypes from 'prop-types';

const {Option} = Select;

/**
 * 物品单位下拉选择框
 *
 * @visibleName SelectUnit（单位选择框）
 * @author guozhaodong
 */
class SelectUnit extends Component {

    static propTypes = {
        /**
         * 指定当前选中的条目
         */
        value: PropTypes.string,
        /**
         * 选中option的回调函数
         * @param {string} value 选择的值
         */
        onChange: PropTypes.func,
        /**
         * 最小宽度
         * */
        minWidth: PropTypes.string,
        /**
         * 是否带入默认值（列表中的第一个值）
         * */
        carryDefaultValue: PropTypes.bool,
        /**
         * 是否禁用
         * */
        disabled: PropTypes.bool,
        /**
         * 是否显示新建、管理操作
         * */
        showEdit: PropTypes.bool
    };

    static defaultProps = {
        minWidth: '120px',
        carryDefaultValue: false,
        showEdit: false,
        disabled: false
    };

    setDefaultFlag = false;

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

        const value = props.value || '';

        this.state = {
            value,
            unitAddVisible: false
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
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchGoodsUnitList(true, (unitList)=>{
            if(this.props.carryDefaultValue){
                const unitListData = unitList.get('data');
                this.handleChange(unitListData.getIn([0, 'paramName']))
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.carryDefaultValue) {
            const {goodsUnitList} = this.props;
            const goodsUnitListData = goodsUnitList && goodsUnitList.getIn(['data', 'data']);

            //设置缓存数据默认值
            if (goodsUnitListData && !this.setDefaultFlag) {
                this.setDefaultFlag = true;
                this.handleChange(goodsUnitListData.getIn([0, 'paramName']))
            }
        }
    }

    componentWillUnmount() {
        //当组件销毁时，把请求的数据缓存清除
        this.props.emptyGoodsUnitListCache();
    }


    render() {
        const { goodsUnitList, showEdit, id, onKeyDown } = this.props;
        const goodsUnitListData = goodsUnitList && goodsUnitList.getIn(['data', 'data']);

        return (
            <div className={cx(['modal-container', {'modal-size': !!showEdit}])}>
                <div onMouseDown={(e) => { e.preventDefault(); return false; }}>
                    <Select
                        id={id}
                        onKeyDown
                        allowClear
                        value={this.state.value}
                        onChange={this.handleChange}
                        style={{minWidth: this.props.minWidth}}
                        disabled={this.props.disabled}
                        dropdownRender={menu => (
                            <div>
                                {menu}
                                {
                                    !!showEdit && (
                                        <div className={cx('dropdown-action') + " cf"}>
                                            <a href="#!" className="fl" onClick={()=>this.openModal('unitAddVisible')}>{intl.get('common.confirm.new')}</a>
                                            <a href="#!" className="fr" onClick={()=>this.openModal('auxiliaryVisible', 'order', 'goodsUnit')}>{intl.get('common.confirm.manage')}</a>
                                        </div>
                                    )
                                }
                            </div>
                        )}
                    >
                        {
                            goodsUnitListData && goodsUnitListData.map(item => (
                                <Option key={item.get('recId')}
                                        value={item.get('paramName')}>{item.get('paramName')}</Option>
                            ))
                        }
                    </Select>
                </div>

                <UnitAdd onClose={this.closeModal.bind(this, 'unitAddVisible')} visible={this.state.unitAddVisible} callback={(unit) => {
                    this.props.asyncFetchGoodsUnitList('', () => {
                        this.handleChange(unit);
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
        goodsUnitList: state.getIn(['auxiliaryGoodsUnit', 'goodsUnitList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGoodsUnitList,
        emptyGoodsUnitListCache
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectUnit)
