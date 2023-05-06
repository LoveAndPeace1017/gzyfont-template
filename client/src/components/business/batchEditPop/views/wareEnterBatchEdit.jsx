import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Input, DatePicker, Divider, Modal, message, Spin, Checkbox } from 'antd';
import {actions as orderActions} from 'pages/purchase/index';
import {checkWareArriveUpperLimit, dealCheckWareUpperLimitDataForQuickEnter, actions as wareUpperLimitActions} from 'components/business/checkWareArriveUpperLimit';
import {bindActionCreators} from "redux";
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import {numberReg} from 'utils/reg';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import PropTypes from "prop-types";
import intl from 'react-intl-universal';
import IntlTranslation from 'utils/IntlTranslation';
const cx = classNames.bind(styles);

class WareEnterBatchEdit extends React.Component {

    static propTypes = {
        /** modal是否可见 */
        visible: PropTypes.bool,
        /** 对话框标题 */
        popTitle: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]),
        /** 订单id列表 */
        billIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        /**确定取消 callback**/
        onOk: PropTypes.func,
        onCancel: PropTypes.func,

        /* 单据存在未绑定的物品时callback，参数为未绑定物品对应的单据billNo*/
        onHasUnbindProd: PropTypes.func
    };

    static defaultProps = {
        popTitle: <IntlTranslation intlKey = "components.batchEditPop.wareEnterBatchEdit.title1"/>
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            dataSource: [],
            open: false,
            rowSelection: [],
            limitOnlineTip: false
        };
    }

    componentDidMount() {
        this.props.asyncBatchEnterInfo(this.props.billIds, (resData) => {
            if (resData.retCode == 0) {
                if (resData.unBindBillNo && resData.unBindBillNo.length > 0) {
                    this.props.onHasUnbindProd && this.props.onHasUnbindProd(resData.unBindBillNo)
                } else {
                    resData.data.forEach((item) => {
                        item.enterDate = moment(new Date()).format('YYYY-MM-DD');
                        item.prodList.forEach((prod) => {
                            prod.unEntNum = Math.max(0, prod.quantity - prod.quantityDelivered);
                        });
                    });
                    this.setState({
                        dataSource: resData.data,
                        isLoading: false
                    })
                }
            } else {
                this.props.onCancel();
                message.info(resData.retMsg || '请求失败');
            }
        });
    }

    getPostData = (values) => {
        let postData = [];
        let dataList = this.state.dataSource;
        dataList.forEach((item, index) => {
            if (this.isCheckedAt(index)) {
                const postItem = Object.assign({}, item);
                postItem.prodList = [];
                item.prodList.forEach((item) => {
                    if ((this.state.rowSelection[index].selectedRowKeys || []).includes(item.key)) {
                        postItem.prodList.push(Object.assign({}, item));
                    }
                });
                postData.push(postItem);
            }
        });

        console.log('postData', postData);
        return postData
    };

    closeModals = () =>{
        this.setState({limitOnlineTip:false})
    };


    onOk = () => {
        this.props.form.validateFields({force: true}, (err, values) => {
            if (!err) {
                if (this.state.isLoading) {
                    return;
                }
                const postData = this.getPostData(values);
                if (!postData || postData.length === 0) {
                    message.info(intl.get("components.batchEditPop.wareEnterBatchEdit.rule1"));
                    return;
                }

                console.log('form data', values);
                console.log('post data', postData[0]);

                this.setState({
                    isLoading: true
                });
                let wareParams = dealCheckWareUpperLimitDataForQuickEnter(postData[0].prodList, values.warehouseName, 'inbound');
                this.props.asyncCheckWareArriveUpperLimit(wareParams, (res) => { // 校验是否达到上限
                    checkWareArriveUpperLimit(res, 'inbound', () => {
                        this.props.asyncBatchEnter({
                            warehouseName: values.warehouseName,
                            dataList: postData
                        }, (data) => {
                            this.setState({
                                isLoading: false
                            });
                            if (data.retCode == 0) {
                                message.info(intl.get("components.batchEditPop.wareEnterBatchEdit.success"));
                                this.props.onOk();
                            } else if(data.retCode == '2001' && data.retMsg === 'limitException') {
                                this.setState({limitOnlineTip:true})
                            } else {
                                message.error(data.retMsg || "操作失败")
                            }
                        });
                    }, () => {
                        this.setState({isLoading: false})
                    })
                });
            } else {
                console.log(err);
            }
        });
    };

    onDropdownVisibleChange = (open) => {
        if (open) {
            if (this.props.billListInfo.getIn(['data', 'warehouseVipInfo', 'expired'])) {
                Modal.confirm({
                    title: intl.get("components.batchEditPop.wareEnterBatchEdit.title2"),
                    content: intl.get("components.batchEditPop.wareEnterBatchEdit.content"),
                    okText: intl.get("components.batchEditPop.wareEnterBatchEdit.ok"),
                    onOk() {
                        window.open('https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true');
                    }
                });
                return
            }
        }
        this.setState({
            open
        })
    };

    rowSelection = (index) => {
        return {
            selectedRowKeys: (this.state.rowSelection[index] && this.state.rowSelection[index].selectedRowKeys) || [],
            onChange: (selectedRowKeys, selectedRows) => {
                const {rowSelection} = this.state;
                rowSelection[index] = {selectedRowKeys, selectedRows};

                this.setState({
                    rowSelection
                });

                console.log(`index: ${index}, selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            }
        }
    };

    isCheckedAt = (index) => {
        return this.state.rowSelection[index]
            && this.state.rowSelection[index].selectedRows
            && this.state.rowSelection[index].selectedRows.length > 0
    };

    isProductChecked = (orderIndex, prodIndex) => {
        if (this.isCheckedAt(orderIndex)) {
            return this.state.rowSelection[orderIndex].selectedRowKeys.includes(prodIndex)
        }
        return false;
    };

    onCheckChange = (index, e) => {
        let { rowSelection, dataSource } = this.state;
        if (e.target.checked) {
            rowSelection[index] = {
                selectedRowKeys: dataSource[index].prodList.map((item) => item.key),
                selectedRows: dataSource[index].prodList
            }
        } else {
            rowSelection[index] = {};
            this.props.form.validateFields({force: true}, (err, values) => {
                console.log(err);
            })
        }

        this.setState({rowSelection});

    };

    render() {
        let {popTitle} = this.props;
        const {dataSource} = this.state;
        const {form: {getFieldDecorator, getFieldValue}} = this.props;
        //数量精度
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        const formItemLayout = {
            labelCol: {
                xs: {span: 16},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 16},
                sm: {span: 16},
            }
        };

        const warehouses = this.props.billListInfo.getIn(['data', 'warehouses']);
        const defaultWarehouse = warehouses && warehouses.get(0) && warehouses.get(0).get('name');
        return (
            <React.Fragment>
                <Modal
                    {...this.props}
                    title={popTitle || intl.get("components.batchEditPop.wareEnterBatchEdit.title3")}
                    width={''}
                    maskClosable={false}
                    destroyOnClose={true}
                    onOk={this.onOk}
                    className={cx("batch-edit-pop") + " list-pop"}
                    okButtonProps={{
                        'ga-data':'batch-wareEnter-ok'
                    }}
                    cancelButtonProps={{
                        'ga-data':'batch-wareEnter-cancel'
                    }}
                >
                    <div className={cx('content-height')}>
                        <Spin
                            spinning={this.state.isLoading}
                        >
                            <div>
                                <Form.Item
                                    label={intl.get("components.batchEditPop.wareEnterBatchEdit.warehouseName")}
                                    required={true}
                                    style={{float: 'right', marginRight: '15px',marginBottom:'4px'}}
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator("warehouseName", {
                                            initialValue: defaultWarehouse,
                                            rules: [
                                                {
                                                    required: true,
                                                    message: intl.get("components.batchEditPop.wareEnterBatchEdit.rule2")
                                                }
                                            ]
                                        })(
                                            <SelectDeliveryAddress
                                                isWareHouses={true}
                                                open={this.state.open}
                                                onDropdownVisibleChange={this.onDropdownVisibleChange}
                                                style={{minWidth: '120px', width: '150px'}}/>
                                        )
                                    }
                                </Form.Item>
                            </div>
                            <Divider/>
                            {
                                dataSource.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <div style={{width: '100%'}}>
                                            <Checkbox
                                                checked={this.isCheckedAt(index)}
                                                onChange={this.onCheckChange.bind(this, index)}
                                            />
                                            <span className={cx('bill-attr')}>{intl.get("components.batchEditPop.wareEnterBatchEdit.displayBillNo")}: {item.order.displayBillNo}</span>
                                            <span className={cx('bill-attr')}>{intl.get("components.batchEditPop.wareEnterBatchEdit.supplierName")}:{item.order.supplierName}</span>
                                            <Form.Item style={{float: 'right'}}
                                                       label={intl.get("components.batchEditPop.wareEnterBatchEdit.enterDate")} {...formItemLayout}>
                                                {
                                                    getFieldDecorator(`enterDate.${index}`, {
                                                        initialValue: moment(new Date()),
                                                        rules: [
                                                            {
                                                                type: 'object',
                                                            },
                                                            {
                                                                validator: (rules, value, callback) => {
                                                                    if (!item.enterDate && this.isCheckedAt(index)) {
                                                                        callback(intl.get("components.batchEditPop.wareEnterBatchEdit.rule3"))
                                                                    } else {
                                                                        callback();
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    })(
                                                        <DatePicker onChange={(date, dateString) => {
                                                            item.enterDate = dateString
                                                        }}/>
                                                    )
                                                }
                                            </Form.Item>
                                        </div>
                                        <Table
                                            key={index}
                                            bordered
                                            dataSource={item.prodList}
                                            pagination={false}
                                            rowSelection={this.rowSelection(index)}
                                            columns={
                                                [
                                                    {
                                                        width: 50,
                                                        title: intl.get("components.batchEditPop.wareEnterBatchEdit.serial"),
                                                        key: 'serial',
                                                        dataIndex: 'serial',
                                                        align: 'center',
                                                    },
                                                    {
                                                        width: 150,
                                                        title: intl.get("components.batchEditPop.wareEnterBatchEdit.prodCustomNo"),
                                                        key: 'prodCustomNo',
                                                        dataIndex: 'prodCustomNo',
                                                        align: 'center',
                                                    },
                                                    {
                                                        width: 200,
                                                        title: intl.get("components.batchEditPop.wareEnterBatchEdit.prodName"),
                                                        key: 'prodName',
                                                        dataIndex: 'prodName',
                                                        align: 'left',
                                                        render: (text) => {
                                                            return <span className="txt-clip" title={text}>{text}</span>
                                                        }
                                                    },
                                                    {
                                                        width: 150,
                                                        title: intl.get("components.batchEditPop.wareEnterBatchEdit.descItem"),
                                                        key: 'descItem',
                                                        dataIndex: 'descItem',
                                                        align: 'left',
                                                        render: (text) => {
                                                            return <span className="txt-clip" title={text}>{text}</span>
                                                        }
                                                    },
                                                    {
                                                        width: 80,
                                                        title: intl.get("components.batchEditPop.wareEnterBatchEdit.unit"),
                                                        key: 'unit',
                                                        dataIndex: 'unit',
                                                        align: 'center',
                                                    },
                                                    {
                                                        width: 120,
                                                        title: intl.get("components.batchEditPop.wareEnterBatchEdit.quantity"),
                                                        key: 'quantity',
                                                        dataIndex: 'quantity',
                                                        align: 'center',
                                                        render:(text) =>{
                                                            let quantity = fixedDecimal(text,quantityDecimalNum);
                                                            return <span>{quantity}</span>
                                                        }
                                                    },
                                                    {
                                                        width: 120,
                                                        title: intl.get("components.batchEditPop.wareEnterBatchEdit.entNum"),
                                                        key: 'quantityDelivered',
                                                        dataIndex: 'quantityDelivered',
                                                        align: 'center',
                                                        render:(text) =>{
                                                            let quantity = fixedDecimal(text,quantityDecimalNum);
                                                            return <span>{quantity}</span>
                                                        }
                                                    },
                                                    {
                                                        width: 120,
                                                        title: ()=> <React.Fragment><span className="required">*</span>{intl.get("components.batchEditPop.wareEnterBatchEdit.title4")}</React.Fragment>,
                                                        key: 'unEntNum',
                                                        dataIndex: 'unEntNum',
                                                        editable: true,
                                                        align: 'center',
                                                        render: (text, record, prodIndex) => {
                                                            return (
                                                                <Form.Item style={{margin: 0}}>
                                                                    {getFieldDecorator(`${index}.prodList.${prodIndex}.unEntNum`, {
                                                                        rules: [{
                                                                            validator: (rules, value, callback) => {
                                                                                //const reg = numberReg.numberOnlyThree;
                                                                                let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                                                if (value && !reg.test(value)) {
                                                                                    callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                                                } else if (this.isProductChecked(index,prodIndex) && (!value || value === '0')) {
                                                                                    callback(intl.get("components.batchEditPop.wareEnterBatchEdit.rule4"))
                                                                                } else {
                                                                                    callback();
                                                                                }
                                                                            }
                                                                        }],
                                                                        initialValue: record.unEntNum,
                                                                    })(<Input style={{textAlign: 'center'}} onChange={(e) => record.unEntNum = e.target.value}/>)}
                                                                </Form.Item>
                                                            )
                                                        }
                                                    },
                                                    {
                                                        title: intl.get("components.batchEditPop.wareEnterBatchEdit.remarks"),
                                                        // width: 200,
                                                        key: 'remarks',
                                                        dataIndex: 'remarks',
                                                        align: 'center',
                                                        render: (text, record, prodIndex) => {
                                                            return (
                                                                <Form.Item style={{margin: 0}}>
                                                                    {getFieldDecorator(`${index}.prodList.${prodIndex}.remarks`, {
                                                                        initialValue: record.remarks,
                                                                    })(<Input maxLength={2000} onChange={(e) => record.remarks = e.target.value}/>)}
                                                                </Form.Item>
                                                            )
                                                        }
                                                    },
                                                ]
                                            }
                                        />
                                        {
                                            (index !== this.state.dataSource.length - 1) &&
                                            <Divider className={cx('divider')}/>
                                        }
                                    </React.Fragment>
                                ))
                            }
                        </Spin>
                    </div>
                </Modal>
                <LimitOnlineTip onClose={()=>this.closeModals()} show={this.state.limitOnlineTip} />
            </React.Fragment>


        );
    }

}

const mapStateToProps = (state) => ({
    billListInfo: state.getIn(['purchaseIndex', 'batchEnterPre'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncBatchEnterInfo: orderActions.asyncBatchEnterInfo,
        asyncBatchEnter: orderActions.asyncBatchEnter,
        asyncCheckWareArriveUpperLimit: wareUpperLimitActions.asyncCheckWareArriveUpperLimit,
    }, dispatch)
};


export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(WareEnterBatchEdit));

