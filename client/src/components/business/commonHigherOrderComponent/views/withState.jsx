import React, {Component} from 'react';
import { Button, message, Modal } from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {asyncFinishState, asyncRevertState} from '../actions';
import Fold from 'components/business/fold';
import {ResizeableTable} from 'components/business/resizeableTitle';
import moment from "moment-timezone/index";


/**
 * 处理订单状态
 * @visibleName withState
 * purchase(采购) 手动设置入库、到票、付款状态。
 * sale(销售) 手动设置出库、开票、收款状态
 * @author jinb
 */
const mapStateToProps = (state) => ({
    inboundRecord: state.getIn(['inboundOrderIndex', 'inboundRecord']),
    expendRecord: state.getIn(['financeExpendIndex', 'expendRecord']),
    invoiceRecord: state.getIn(['invoiceIndex', 'invoiceRecord']),
    outboundRecord: state.getIn(['outboundOrderIndex', 'outboundRecord']),
    incomeRecord: state.getIn(['financeIncomeIndex', 'incomeRecord']),
    saleInvoiceRecord: state.getIn(['saleInvoiceIndex', 'saleInvoiceRecord'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFinishState,
        asyncRevertState
    }, dispatch)
};

@connect(mapStateToProps, mapDispatchToProps)
export default function withState(WrappedComponent){
    return class withFix extends Component {
        constructor(props) {
            super(props);
            this.state = {
            }
        }

        static SOURCE_MAP = {
            purchase: {
                inbound: {
                    bit: 1,
                    btnFinishText: '已完成入库',
                    finishModalContent: '确定手动设置完成入库吗？',
                    revertModalContent: '确定要撤回手动设置完成入库的操作吗？',
                    recordDataName: 'inboundRecord'
                },
                expend: {
                    bit: 2,
                    btnFinishText: '已完成付款',
                    finishModalContent: '确定手动设置完成付款吗？',
                    revertModalContent: '确定要撤回手动设置完成付款的操作吗？',
                    recordDataName: 'expendRecord'
                },
                invoice: {
                    bit: 4,
                    btnFinishText: '已完成到票',
                    finishModalContent: '确定手动设置完成到票吗？',
                    revertModalContent: '确定要撤回手动设置完成到票的操作吗？',
                    recordDataName: 'invoiceRecord'
                }
            },
            sale: {
                outbound: {
                    bit: 1,
                    btnFinishText: '已完成出库',
                    finishModalContent: '确定手动设置完成出库吗？',
                    revertModalContent: '确定要撤回手动设置完成出库的操作吗？',
                    recordDataName: 'outboundRecord'
                },
                income: {
                    bit: 2,
                    btnFinishText: '已完成收款',
                    finishModalContent: '确定手动设置完成收款吗？',
                    revertModalContent: '确定要撤回手动设置完成收款的操作吗？',
                    recordDataName: 'incomeRecord'
                },
                saleInvoice: {
                    bit: 4,
                    btnFinishText: '已完成开票',
                    finishModalContent: '确定手动设置完成开票吗？',
                    revertModalContent: '确定要撤回手动设置完成开票的操作吗？',
                    recordDataName: 'saleInvoiceRecord'
                },
            }
        };

        // 已完成操作
        handleFinish = ({content, params, callback}) => {
            let _this = this;
            Modal.confirm({
                title: "提示信息",
                content: content,
                onOk() {
                    _this.props.asyncFinishState(params, (res) => {
                        if (res.retCode === '0') {
                            message.success('操作成功!');
                            callback && callback()
                        }
                        else {
                            message.error(res.retMsg);
                        }
                    });
                }
            });
        };

        // 撤销操作
        handleRevert = ({content, params, callback}) => {
            let _this = this;
            Modal.confirm({
                title: "提示信息",
                content: content,
                onOk() {
                    _this.props.asyncRevertState(params, (res) => {
                        if (res.retCode === '0') {
                            message.success('操作成功!');
                            callback && callback()
                        }
                        else {
                            message.error(res.retMsg);
                        }
                    });
                }
            });
        };

        // 加载已完成按钮
        renderFinishButton = ({source, module, billNo, callback, style={}}) => {
            let SOURCE_MAP = withFix.SOURCE_MAP;
            let map = null;
            if(SOURCE_MAP[source] && SOURCE_MAP[source][module]){
                map = SOURCE_MAP[source][module];
            }
            if(!map) return;
            let { btnFinishText, finishModalContent, bit } = map;
            let params = { source, billNo, forceStatus: bit };
            return (
                <Button type={"primary"}
                        style={{float: 'right', marginBottom: '5px', ...style}}
                        onClick={() => this.handleFinish({content: finishModalContent, params, callback})}>
                    {btnFinishText}
                </Button>
            );
        };

        // 加载手动操作记录
        renderHandOperateRecord = ({source, module, billNo, callback}) => {
            let SOURCE_MAP = withFix.SOURCE_MAP;
            let map = null;
            if(SOURCE_MAP[source] && SOURCE_MAP[source][module]){
                map = SOURCE_MAP[source][module];
            }
            if(!map) return;
            let { revertModalContent, recordDataName, bit } = map;
            let params = { source, billNo, forceStatus: bit };
            // 操作记录内容
            let logOrder = this.props[recordDataName]
                && this.props[recordDataName].getIn(['data', 'logOrder']);
            // 对特殊情况处理，原来的代码不统一，只能这么处理 😣
            if(module === 'inbound' || module === 'outbound'){
                logOrder = logOrder ? logOrder.toJS() : null;
            }
            let columns = [
                {
                    title: "操作人",
                    dataIndex: 'operatedLoginName',
                    align: 'center',
                    width: 200,
                },
                {
                    title: "操作时间",
                    dataIndex: 'operatedTime',
                    align: 'center',
                    width: 200,
                    render: (operatedTime)=>{
                        return (<span>{operatedTime ? moment(operatedTime).format('YYYY-MM-DD') : ''}</span>)
                    }
                },
                {
                    title: "操作内容",
                    dataIndex: 'operation',
                    align: 'center',
                    width: 300,
                },
                {
                    title: "操作",
                    dataIndex: 'operate',
                    align: 'operate',
                    render: () => {
                        return (
                            <a href="#!" onClick={() => this.handleRevert({content: revertModalContent, params, callback})}>撤回</a>
                        )
                    }
                }
            ];
            return (
                <>
                    {
                        logOrder && (
                            <Fold title={"手动操作记录"}>
                                <ResizeableTable
                                    bordered
                                    columns={columns}
                                    dataSource={[logOrder]}
                                    pagination={false}
                                />
                            </Fold>
                        )
                    }
                </>
            );
        };

        render() {
            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        renderFinishButton={this.renderFinishButton}
                        renderHandOperateRecord={this.renderHandOperateRecord}
                    />
                </React.Fragment>
            );
        }
    }
}

