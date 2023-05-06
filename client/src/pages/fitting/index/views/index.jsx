import React, { Component } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import {Table, Button, Input, Divider, Modal, message, } from "antd";
const confirm = Modal.confirm;
import SuggestSearch from 'components/business/suggestSearch';
import Pagination from 'components/widgets/pagination';
import ExportButton from 'components/business/exportModal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Icon from 'components/widgets/icon';
import intl from 'react-intl-universal';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import {actions as fittingActions} from '../index'
import {reducer as fittingIndex} from "../index";
import FittingAdd from 'pages/fitting/add';
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable';
import {AddPkgOpen} from 'components/business/vipOpe';

class Index extends Component {
    constructor(props){
        super(props);
        this.state = {
            fittingPopVisible: false,
            option:'modify',
            key: ''
        }
    }

    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchFittingList();
    }

    openFittingPop = (type,id)=>{
        this.setState({
            fittingPopVisible: true,
            option:type,
            prodNo:id
        })
    };

    closeFittingPop = () => {
        this.formRef.props.form.resetFields();
        this.setState({fittingPopVisible:false});
    };

    //获取弹层中的form
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    onSearch = (value)=>{
        this.setState({
            key:value
        },()=>{
            this.props.asyncFetchFittingList({key:value});
        })
    };

    doFilter = (params)=>{
        let key = this.state.key;
        key && (params.key = key);
        this.props.asyncFetchFittingList(params);
    }

    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage});
    };
    /*onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };*/

    showConfirm = (id)=>{
        let _this = this;
        confirm({
            title: intl.get("common.confirm.title"),
            content: intl.get("fitting.index.content1"),
            onOk() {
                _this.props.asyncDeleteFittingInfo(id,function(res){
                    if (res.retCode == 0) {
                        message.success(intl.get("common.confirm.success"));
                        _this.props.asyncFetchFittingList();
                    }else {
                        alert(res.retMsg);
                    }
                });
            },
            onCancel() {},
        });
    };

    //新增修改简易BOM提交操作
    handleCreate = (type) => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            let flag = true;
            values.subProdList.forEach((item)=>{
               if(!item.quantity) {
                   flag = false;
                   return;
               }
            });
            if(!flag){
                Modal.error({
                    title:intl.get("common.confirm.title"),
                    content:intl.get("fitting.index.rule1")
                });
            }else{
                let subProdList = values.subProdList.map((item)=>{
                    return {
                        ...item,
                        prodNoMain:values.finishedProduct[0].prodNo,
                        quantity:item.quantity||1
                    }
                });
                let params = {
                    prodNo:values.finishedProduct[0].prodNo,
                    prodCustomNo:values.finishedProduct[0].prodCustomNo,
                    prodName:values.finishedProduct[0].prodName,
                    descItem:values.finishedProduct[0].descItem,
                    description:values.finishedProduct[0].description,
                    unit:values.finishedProduct[0].unit,
                    prodList:subProdList,
                    remarks:values.remarks,
                    mainProdNo: this.state.prodNo
                };
                if(!values.finishedProduct[0].prodNo||subProdList.length==0){
                    Modal.warning({
                        title: intl.get("common.confirm.title"),
                        content: intl.get("fitting.index.content2")
                    });
                } else{
                    let method = (type === 'add'||type==='copy')?'asyncInsertFittingInfo':'asyncModifyFittingInfo';
                    this.props[method](params,(res)=>{
                        if (res.retCode === '0') {
                            message.success(intl.get("common.confirm.success"));
                            this.setState({fittingPopVisible: false});
                            form.resetFields();
                            this.props.asyncFetchFittingList();
                        } else if (res.retCode == '2019'){
                            Modal.info({
                                icon: <Icon type={'exclamation-circle'} theme={'filled' } />,
                                title: intl.get("common.confirm.title"),
                                content: (
                                    <div>
                                        <p>{intl.get("fitting.index.tip1")}</p>
                                        <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("fitting.index.yes")}</a>
                                    </div>
                                )
                            });
                            return false;
                        }else {
                            alert(res.retMsg);
                        }
                    });
                }
            }
        });
    };

    render() {
        const titleMap = {
            add: intl.get("fitting.index.add"),
            modify: intl.get("fitting.index.editor"),
            copy: intl.get("fitting.index.copy"),
        };
        const {fittingList} = this.props;

        let dataSource = fittingList.getIn(['data','list']);
        dataSource = dataSource? dataSource.toJS():[];
        let vipInfo = fittingList.getIn(['data','vipInfo']);
        vipInfo = vipInfo?vipInfo.toJS():{};

        let paginationInfo = fittingList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
        /**
         * vipState
         * NOT_OPEN 未开通
         * EXPIRED 已到期
         * TRY 试用中
         * OPENED 服务中
         */
        const columns = [
            {title: intl.get("fitting.index.serial"),dataIndex: 'serial',key: 'serial', width: constants.TABLE_COL_WIDTH.SERIAL},
            {title: intl.get("fitting.index.prodNameKey"),dataIndex: 'prodNameKey',render: (k,data)=>(
                    <React.Fragment>
                        <a onClick={()=>this.openFittingPop('modify',data.prodNo)}>{data.prodName}</a>
                    </React.Fragment>
                )},
            {title: intl.get("fitting.index.displayCode"),dataIndex: 'displayCode'},
            {title: intl.get("fitting.index.description"),dataIndex: 'description'},
            {title: intl.get("fitting.index.brand"),dataIndex: 'brand'},
            {title: intl.get("fitting.index.produceModel"),dataIndex: 'produceModel'},
            {title: intl.get("fitting.index.subNum"),dataIndex: 'subNum',key: 'subNum', width: 120},
            {title: intl.get("fitting.index.ope"),dataIndex: 'ope',
                width: 200,
                render: (ope,data, idx) => (
                    <React.Fragment>
                        <a  onClick={()=>this.openFittingPop('modify',data.prodNo)}>{intl.get("common.confirm.editor")}</a>
                        <Divider type="vertical" />
                        <a  onClick={()=>this.openFittingPop('copy',data.prodNo)}>{intl.get("common.confirm.copy")}</a>
                        <Divider type="vertical" />
                        <a  onClick={()=>this.showConfirm(data.prodNo)}>{intl.get("common.confirm.delete")}</a>
                        <Divider type="vertical" />
                        {/*<ExportButton*/}
                            {/*type="bom"*/}
                            {/*uri={``}*/}
                            {/*exportId={`bom${idx}`}*/}
                            {/*isCommon*/}
                        {/*/>*/}
                        <a onClick={() => {location.href=`/api/fitting/download?url=/prod-combinations/excel/export/${data.prodNo}`}}>导出</a>
                    </React.Fragment>
                ),}
        ];

        return (
            <React.Fragment>
                <div className={cx("mul-account")}>
                    <div className={cx("account-notice")+ " cf"}>
                        <p className={cx("an-txt-l")}>
                            {
                                vipInfo && (
                                    vipInfo.vipState === 'TRY' ||vipInfo.vipState=== 'OPENED'? <p className={cx("an-txt-l")}>
                                     {intl.get("fitting.index.tip2")}：{moment(vipInfo.startTime).format('YYYY-MM-DD')} {intl.get("fitting.index.tip4")} {moment(vipInfo.endTime).format('YYYY-MM-DD')}
                                    </p> : <p className={cx(["an-txt-l", "white"])}>
                                        {intl.get("fitting.index.tip3")}
                                    </p>
                                )
                            }
                        </p>
                        <p className={cx("an-txt-r")}>
                             &nbsp;{intl.get("fitting.index.tip5")}<a style={{color:'#0066dd'}} href="http://www.abiz.com/info/problem/63017.htm" target="_blank">{intl.get("fitting.index.detail")}</a>
                            <span className={cx("an-txt-r")} style={{float:'right'}}>
                                <Icon type="message" className={'blue'} theme="filled" />  <a style={{color:'#0066dd'}} target="_blank"  href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("fitting.index.online")}</a>
                            </span>
                        </p>
                    </div>
                    <div className={cx("account-ope")+ " cf"} >
                        <div className={"fl list-search"}>
                            <SuggestSearch
                                placeholder={intl.get("fitting.index.placeHolder")}
                                onSearch={this.onSearch}
                                url={ '/prod-combinations/search/tips'}
                            />
                        </div>

                        <AddPkgOpen onTryOrOpenCallback={()=>this.openFittingPop('add')}
                                  openVipSuccess={() => this.props.asyncFetchFittingList()}
                                  source={'fitting'}
                                  vipInfo={vipInfo}
                                  render={() => (
                                      <Button htmlType={'button'} type="primary" className="fr"
                                              icon={<LegacyIcon type={'plus'} />} disabled={dataSource.length>=vipInfo.vipBomQuantity}>{intl.get("common.confirm.new")}</Button>
                                  )}
                        />

                    </div>
                    <ListModalTable dataSource={dataSource}
                           className={cx("tb-account")}
                           columns={columns}
                           pagination={false}
                           loading={fittingList.get('isFetching')}
                            footerOpe={false}
                    />

                    <div className="cf">
                        <Pagination {...paginationInfo}
                                    size="small"
                                    onChange={this.onPageInputChange}
                                   /* onShowSizeChange={this.onShowSizeChange}*//* onShowSizeChange={this.onShowSizeChange}*/
                        />
                    </div>

                </div>

                <Modal
                    title={titleMap[this.state.option]}
                    width={''}
                    className={cx("modal-mul-account") + " list-pop"}
                    visible={this.state.fittingPopVisible}
                    onCancel={()=>this.closeFittingPop('fittingPopVisible')}
                    onOk={this.handleCreate.bind(this, this.state.option)}
                    confirmLoading={fittingList.get('confirmFetching')}
                    destroyOnClose={true}
                >
                    <FittingAdd
                        {...this.props}
                        prodNo={this.state.prodNo}
                        wrappedComponentRef={this.saveFormRef}
                        option={this.state.option}
                    />
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    fittingList: state.getIn(['fittingIndex', 'fittingList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchFittingList:fittingActions.asyncFetchFittingList,
        asyncModifyFittingInfo:fittingActions.asyncModifyFittingInfo,
        asyncInsertFittingInfo:fittingActions.asyncInsertFittingInfo,
        asyncDeleteFittingInfo:fittingActions.asyncDeleteFittingInfo,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)