import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import { Input, message, Spin,Form} from 'antd';
import {withRouter} from "react-router-dom";

import Crumb from 'components/business/crumb';
import Icon from 'components/widgets/icon';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
import AddForm, {actions as addFormActions}  from 'components/layout/addForm';
import NewAddForm from 'components/layout/addForm/views/newAddForm';
import Content from 'components/layout/content';
import {asyncFetchPreData, asyncAddScheduling, asyncFetchSchedulingById, emptyDetailData} from '../actions';

import BaseInfo from './baseInfo';
import ProdList from './prodList';
import OtherInfo from './otherInfo';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {fromJS} from "immutable";
import {Modal} from "antd/lib/index";

const cx = classNames.bind(styles);

class SchedulingAddForm extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state={
            copyFromOrderVisible: false,
            customerNo: '',
            deliveryAddrData: fromJS([]),
            tags: []
        };
    }

    closeModal = (tag)=>{
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };

    openModal = (tag)=>{
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };

    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };


    handleSubmit = (values) => {
        //处理自定义字段
        // this.clearUpCustomField(values);
        //处理物品信息
        const prodList = values.prod.filter(item=>{
            return item && Object.entries(item).some(v => {
                return (v[0] === 'prodName' && v[1] && v[1] !== ''); //物品名称必须要有值，否则这行物品数据会被过滤掉
            });
        });

        let fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);

        if(this.props.match.params.copyId){
            values.id = "";
        }
        this.props.asyncAddScheduling(values.id, {
            ...values,
            prodList,
            fileIds
        }, (res) => {
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success(intl.get("schedule.add.index.operateSuccessMessage"));
                this.props.emptyFieldChange();
                displayId && this.props.history.push(`/inventory/scheduling/show/${displayId}`);
            } else if (res.data.retCode == '2019'){
                Modal.info({
                    icon: <ExclamationCircleOutlined/>,
                    title: intl.get("schedule.add.index.warningTip"),
                    content: (
                        <div>
                            <p>{intl.get("schedule.add.index.vipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("schedule.add.index.treatyText")}</a>
                        </div>
                    )
                });
                return false;
            } else {
                Modal.error({
                    title: intl.get("schedule.add.index.warningTip"),
                    content: res.data.retMsg
                });
            }
        })
    };

    componentDidMount() {
        this.props.asyncFetchPreData((res)=>{
            console.log(res,'res');
            if(res.retCode === '0'){
                this.formRef.current.setFieldsValue({
                    warehouseNameOut: res.data.warehouseNameOut,
                    warehouseNameIn: res.data.warehouseNameIn
                })
            }
            this.props.setInitFinished();
        });
    }

    componentWillUnmount() {
        this.props.emptyDetailData();
    }

    render() {

        const {schedulingInfo, preData} = this.props;

        const schedulingInfoData = schedulingInfo && schedulingInfo.getIn(['data', 'data']);

        const baseInfo = schedulingInfoData;

        const goodsTableData = schedulingInfoData && schedulingInfoData.get('prodList');

        const data = {};

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/inventory/scheduling/',
                            title: intl.get("schedule.add.index.schedule")
                        },
                        {
                            title: intl.get("schedule.add.index.addScheduleOrder")
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || schedulingInfo.get("isFetching")}
                    >
                        <NewAddForm
                            {...this.props}
                            onSubmit={this.handleSubmit}
                            formRef={this.formRef}
                            loading={this.props.addScheduling.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <NewAddForm.BaseInfo>
                                            <BaseInfo {...this.props} initBaseInfo={baseInfo} />
                                        </NewAddForm.BaseInfo>
                                        <NewAddForm.ProdList>
                                            <ProdList
                                                {...this.props}
                                                formRef={this.formRef}
                                                closeCopyModal={this.closeModal}
                                                copyFromOrderVisible={this.state.copyFromOrderVisible}
                                                initGoodsTableData={goodsTableData}
                                            />
                                        </NewAddForm.ProdList>
                                        <NewAddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        initBaseInfo={baseInfo}
                                                        formRef={this.formRef}
                                                        getRef={this.getOtherInfoRef}
                                                        deliveryAddrData={this.state.deliveryAddrData}
                                            />
                                        </NewAddForm.OtherInfo>
                                        <div style={{display: "none"}}>
                                            <Form.Item name="id" initialValue={data.id}>
                                                <Input type="hidden"/>
                                            </Form.Item>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </NewAddForm>
                    </Spin>
                </Content.ContentBd>
            </React.Fragment>
        );
    }
}


const mapStateToProps = (state) => ({
    addScheduling: state.getIn(['schedulingAdd', 'addScheduling']),
    schedulingInfo: state.getIn(['schedulingAdd', 'schedulingInfo']),
    preData:  state.getIn(['schedulingAdd', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddScheduling,
        asyncFetchSchedulingById,
        emptyDetailData,
        setInitFinished: addFormActions.setInitFinished
        // asyncCustomerShow: customerShowActions.asyncCustomerShow
    }, dispatch)
};

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(
        NewAddForm.create(SchedulingAddForm)
    )
)

