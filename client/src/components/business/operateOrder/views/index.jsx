import React, {Component} from 'react';
import intl from 'react-intl-universal';
import IntlTranslation from 'utils/IntlTranslation';
import { CaretDownOutlined } from '@ant-design/icons';
import { Input, message, Modal } from "antd";
import {Select} from "antd";
import {bindActionCreators} from "redux";
import {asyncAcceptOrder, asyncCancelOrder} from "../actions";
import {connect} from "react-redux";

const {TextArea} = Input;

class SaleOrderOperate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cancelReasonType: '',
            cancelReasonText: '',
            showFillCancelReasonTip: false
        }
    }

    static defaultProps = {
        reasonOptions : [
            {
                key: <IntlTranslation intlKey="components.operateOrder.index.wrongMsg1"/>,
                value: <IntlTranslation intlKey="components.operateOrder.index.wrongMsg1"/>,
            },
            {
                key: <IntlTranslation intlKey="components.operateOrder.index.wrongMsg2"/>,
                value: <IntlTranslation intlKey="components.operateOrder.index.wrongMsg2"/>,
            },
            {
                key: <IntlTranslation intlKey="components.operateOrder.index.wrongMsg3"/>,
                value: <IntlTranslation intlKey="components.operateOrder.index.wrongMsg3"/>,
            },
            {
                key: <IntlTranslation intlKey="components.operateOrder.index.other"/>,
                value: <IntlTranslation intlKey="components.operateOrder.index.other"/>,
            }
        ]
    };

    cancelOrder = () => {
        const cancelReason = this.state.cancelReasonType === intl.get("components.operateOrder.index.other")
            ? this.state.cancelReasonText
            : this.state.cancelReasonType;
        if (this.props.billNo) {
            const self = this;
            this.props.asyncCancelOrder(this.props.billNo, this.props.billType, {reason: cancelReason}, (res) => {
                this.props.closeModal(this.props.visibleFlag);
                let errorMsg = res.get('retCode') != 0 && res.get('retMsg');
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("components.operateOrder.index.warningTip"),
                        content: errorMsg
                    });
                    self.props.operateCallback(false);
                } else {
                    message.success(intl.get("components.operateOrder.index.operateSuccessMessage"));
                    self.props.operateCallback(true);
                }
            })
        }
    };

    acceptOrder = () => {
        const {billNo} = this.props;
        if (billNo) {
            const self = this;
            this.props.asyncAcceptOrder(billNo, (res) => {
                self.props.closeModal(this.props.visibleFlag);
                let errorMsg = res.get('retCode') != 0 && res.get('retMsg');
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("components.operateOrder.index.warningTip"),
                        content: errorMsg
                    });
                    self.props.operateCallback(false);
                } else {
                    self.props.operateCallback(true);
                    message.success(intl.get("components.operateOrder.index.operateSuccessMessage"));
                }
            })
        }
    };

    render() {
        const {popType} = this.props;
        if (popType === 'cancel') {
            return (
                <Modal
                    {...this.props}
                    title={intl.get("components.operateOrder.index.cancelOrder")}
                    confirmLoading={this.props.cancelOrder.get('isFetching')}
                    destroyOnClose={true}
                    onCancel={() => {
                        this.props.closeModal(this.props.visibleFlag);
                    }}
                    onOk={() => {
                        if (this.state.cancelReasonType === '') {
                            this.setState({
                                showFillCancelReasonTip: true
                            });
                        }
                        else {
                            this.cancelOrder();
                        }
                    }}
                >
                    <div>
                        <div align="center"
                             style={{marginBottom: 30, display: this.state.showFillCancelReasonTip ? 'block' : 'none'}}>
                            <span>{intl.get("components.operateOrder.index.chooseCancelCause")}</span></div>
                        <div style={{float: 'left', paddingRight: 15, paddingTop: 5}}>
                            <span style={{color: 'red'}}>*</span>
                            <span>{intl.get("components.operateOrder.index.chooseCause")}</span>
                        </div>
                        <div style={{display: 'inline-block'}}>
                            <Select style={{width: 300}}
                                    value={this.state.cancelReasonType}
                                    suffixIcon={<CaretDownOutlined />}
                                    onChange={(value) => {
                                        this.setState({
                                            cancelReasonType: value,
                                            showFillCancelReasonTip: false
                                        })
                                    }}>
                                {
                                    this.props.reasonOptions.map((item, index)=>{
                                        return <Select.Option key={index} value={item.key}>{item.value}</Select.Option>
                                    })
                                }
                            </Select>
                            <br/>
                            <div style={{
                                width: 300,
                                marginTop: 15,
                                display: this.state.cancelReasonType === intl.get("components.operateOrder.index.other") ? 'block' : 'none'
                            }}>
                            <TextArea
                                value={this.state.cancelReasonText}
                                placeholder={intl.get("components.operateOrder.index.writeDetailContent")}
                                autosize={{minRows: 3, maxRows: 6}}
                                onChange={(e) => {
                                    this.setState({cancelReasonText: e.target.value});
                                }}/>

                            </div>

                        </div>
                    </div>
                </Modal>
            );
        }
        else {
            return (
                <Modal
                    {...this.props}
                    title={intl.get("components.operateOrder.index.warningTip")}
                    confirmLoading={this.props.acceptOrder.get('isFetching')}
                    destroyOnClose={true}
                    onCancel={() => {
                        this.props.closeModal(this.props.visibleFlag);
                    }}
                    onOk={() => {
                        this.acceptOrder();
                    }}
                >
                    {`${intl.get("components.operateOrder.index.msg1")}${this.props.customerName}${intl.get("components.operateOrder.index.msg2")}`}
                </Modal>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    cancelOrder: state.getIn(['operateOrder', 'cancelOrder']),
    acceptOrder: state.getIn(['operateOrder', 'acceptOrder'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncCancelOrder,
        asyncAcceptOrder
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SaleOrderOperate);