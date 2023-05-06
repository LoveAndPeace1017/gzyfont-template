import React, { Component } from 'react';
import intl from 'react-intl-universal';
import {Table, Button, Radio, Divider, Modal,message } from "antd";
const confirm = Modal.confirm;
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

import {actions as warehouseActions} from '../index'
import WarehouseAdd from 'pages/warehouse/add';
import {reducer as warehouseIndex} from "../index";
import {Choose} from 'pages/account/index';
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable';
import {AddPkgOpen} from 'components/business/vipOpe';

class WarehouseContent extends Component {
    constructor(props){
        super(props);

        this.state = {
            createWarehouseVisible: false,
            assignWarehouseToSubAccountVisible:false
        };
        this.type = '';
    }
    openModal = (key)=>{
        this.setState({
            [key]: true
        });
    };
    hasAuth = ()=>{
        const {warehouseList} = this.props;
        let vipInfo = warehouseList.getIn(['data','info']);
        vipInfo = vipInfo? vipInfo.toJS():{};
        if(vipInfo.open){
            /*if(vipInfo.expired){
                Modal.confirm({
                    title: '提示信息',
                    content: '多仓库已到期，开通VIP服务继续使用。咨询电话：18402578025（微信同号）',
                    okText:'立即续约',
                    onOk() {
                        window.open('tencent://message/?uin=1611935859&Site=&Menu=yes');
                    }
                });
                return false;
            }*/
            return true;
        }else{
            /*Modal.confirm({
                title: '提示信息',
                content: '您尚未开通多仓库服务',
                okText:'立即开通',
                onOk() {
                    window.open('tencent://message/?uin=1611935859&Site=&Menu=yes');
                }
            });*/
            return true;
        }
    };

    openCreateWarehouse = ()=>{
        this.type = 'create';
        this.openModal('createWarehouseVisible');
    };
    openModifyWarehouse = (id)=>{
        if(this.hasAuth()){
            this.type = 'modify';
            this.props.getLocalWarehouseInfo(id);
            this.openModal('createWarehouseVisible');
        }
    };
    openAssignWarehouseToSubAccount = (id)=>{
        if(this.hasAuth()){
            this.props.getLocalWarehouseInfo(id);
            this.openModal('assignWarehouseToSubAccountVisible');
        }
    };
    closeWareHouse = (tag)=>{
        this.setState({
            [tag]:false
        })
    };
    showConfirm = (id)=>{
        let _this = this;
        confirm({
            title: intl.get("warehouse.index.index.warningTip"),
            content: intl.get("warehouse.index.index.deleteConfirmContent"),
            onOk() {
                _this.props.asyncDeleteWarehouseInfo(id, function(res) {
                    if (res.retCode == 0) {
                        message.success(intl.get("warehouse.index.index.operateSuccessMessage"));
                        _this.props.asyncFetchWarehouseList();
                    }
                    else {
                        alert(res.retMsg);
                    }
                });
            },
            onCancel() {
            },
        });
    };

    closeModel = (type) => {
        this.closeWareHouse(type);
    };

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchWarehouseList();
    }
    render() {
        const {warehouseList} = this.props;

        let dataSource = warehouseList.getIn(['data','list']);
        let vipInfo = warehouseList.getIn(['data','info']);
        /**
         * vipState
         * NOT_OPEN 未开通
         * EXPIRED 已到期
         * TRY 试用中
         * OPENED 服务中
         */

        dataSource = dataSource? dataSource.toJS():[];
        vipInfo = vipInfo? vipInfo.toJS():{};

        let warehouseNames = dataSource.map(function(item){
            return {
                id:item.id,
                name:item.name};
        });

        let curWarehouseInfo = warehouseList.getIn(['data','warehouse']);
        curWarehouseInfo = curWarehouseInfo? curWarehouseInfo.toJS():{};
        const columns = [{
            title: intl.get("warehouse.index.index.serial"),
            dataIndex: 'serial',
            key: 'serial',
            width: constants.TABLE_COL_WIDTH.SERIAL
        }, {
            title: intl.get("warehouse.index.index.isCommon"),
            dataIndex: 'isCommon',
            key: 'isCommon',
            width:80,
            render: (isCommon,data) =>{
                return (
                    <Radio value={1} checked={isCommon==1} onClick={()=>this.props.asyncSetDefaultWarehouse(data.id)} ></Radio>
                );
            }
        }, {
            title: intl.get("warehouse.index.index.warehouseName"),
            dataIndex: 'name',
            key: 'name'
        }, {
            title: intl.get("warehouse.index.index.address"),
            dataIndex: 'address',
            key: 'address',
            render:(address,data)=>(data.provinceText&&data.cityText&&address?data.provinceText + data.cityText +address:null)
        }, {
            title: intl.get("warehouse.index.index.ope"),
            key: 'ope',
            dataIndex: 'ope',
            width: 300,
            render: (ope,data) => (
                <React.Fragment>
                    <a href="#!" onClick={()=>this.openModifyWarehouse(data.id)}>{intl.get("warehouse.index.index.modify")}</a>
                    <Divider type="vertical" />
                    <a href="#!" onClick={()=>this.showConfirm(data.id)}>{intl.get("warehouse.index.index.delete")}</a>
                    <Divider type="vertical" />
                    <a href="#!" onClick={()=>this.openAssignWarehouseToSubAccount(data.id)}>{intl.get("warehouse.index.index.assignSubAccount")}</a>
                </React.Fragment>
            ),
        }];
        return (
            <React.Fragment>
                <div className={cx("mul-account")}>
                    <div className={cx("account-notice")+ " cf"}>
                        {

                            vipInfo && (
                                vipInfo.vipState === 'TRY' ||vipInfo.vipState=== 'OPENED' ? <p className={cx("an-txt-l")}>
                                    {intl.get("warehouse.index.index.serviceTime")}：{moment(vipInfo.startTime).format('YYYY-MM-DD')} {intl.get("warehouse.index.index.to")} {moment(vipInfo.endTime).format('YYYY-MM-DD')}
                                </p>:<p className={cx(["an-txt-l", "white"])}>
                                    {intl.get("warehouse.index.index.serviceTime")}：{intl.get("warehouse.index.index.expire")}
                                </p>
                            )
                        }

                        <p className={cx("an-txt-r")}>
                            &nbsp;{intl.get("warehouse.index.index.msg1")}<a style={{color:'#0066dd'}} href="http://www.abiz.com/info/assistant-sfaq/63000.htm" target="_blank">{intl.get("warehouse.index.index.watchDetail")}</a>
                            <span className={cx("an-txt-r")} style={{float:'right'}}>
                                <Icon type="message" className={'blue'} theme="filled" /> <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("warehouse.index.index.onlineService")}</a>
                            </span>
                        </p>
                    </div>
                    <div className={cx('account-ope')+ " cf"}>
                        <AddPkgOpen onTryOrOpenCallback={()=>this.openCreateWarehouse()}
                                  openVipSuccess={() => this.props.asyncFetchWarehouseList()}
                                  vipInfo={vipInfo}
                                  render={() => (
                                    <Button type="primary"  className="fr">{intl.get("warehouse.index.index.addWarehouse")}</Button>
                                  )}
                        />
                    </div>
                    <ListModalTable dataSource={dataSource}
                           className={cx("tb-account")}
                           columns={columns}
                           pagination={false}
                           loading={warehouseList.get('isFetching')}
                            footerOpe={false}
                    />
                </div>

                <WarehouseAdd
                    visible={this.state.createWarehouseVisible}
                    data={this.type === 'modify'?curWarehouseInfo:{}}
                    warehouseNames={warehouseNames}
                    onClose={this.closeModel.bind(this, 'createWarehouseVisible')}
                />

                {/*分配子账号*/}
                <Choose
                    visible={this.state.assignWarehouseToSubAccountVisible}
                    getUrl={`/warehouse/subAccounts/${curWarehouseInfo.id}`}
                    postUrl={`/warehouse/allocSubAccounts/${curWarehouseInfo.id}`}
                    onClose={this.closeWareHouse.bind(this, 'assignWarehouseToSubAccountVisible')}
                />
            </React.Fragment>
        );
    }
}

class WarehouseIndex extends Component{
    render(){
        return (
            <Modal
                title={intl.get("warehouse.index.index.warehouseManagement")}
                width={''}
                className={cx("modal-mul-account") + " list-pop list-pop-no-footer"}
                visible={this.props.visible}
                footer = {null}
                onCancel={this.props.onClose}
                destroyOnClose={true}
            >
                <WarehouseContent {...this.props}/>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    warehouseList: state.getIn(['warehouseIndex', 'warehouseList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchWarehouseList:warehouseActions.asyncFetchWarehouseList,
        asyncSetDefaultWarehouse:warehouseActions.asyncSetDefaultWarehouse,
        getLocalWarehouseInfo:warehouseActions.getLocalWarehouseInfo,
        asyncModifyWarehouseInfo:warehouseActions.asyncModifyWarehouseInfo,
        asyncInsertWarehouseInfo:warehouseActions.asyncInsertWarehouseInfo,
        asyncDeleteWarehouseInfo:warehouseActions.asyncDeleteWarehouseInfo,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(WarehouseIndex)
