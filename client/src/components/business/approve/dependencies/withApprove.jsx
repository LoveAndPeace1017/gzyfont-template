import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, message
} from 'antd';

import {ExclamationCircleOutlined} from '@ant-design/icons';
import {MAIN_MAP} from "components/business/vipOpe";
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

export default function withApprove(WrappedComponent) {
    return class withApprove extends Component{
        /**
         *   弹框类型
         */
        _popModal = ({title, content, icon, theme, modalType, okCallback, cancelCallback}) => {
            const _this = this;
            modalType = modalType || 'confirm';
            Modal[modalType]({
                icon,
                title: title,
                content: content,
                onOk() {
                    okCallback && okCallback.call(null, _this);
                },
                onCancel() {
                    cancelCallback && cancelCallback.call(null, _this);
                }
            })
        };

        /**
         *  请求获取当前所需的Vip信息
         *  callback 执行回调
         *  source  当前的VIP 类型
         */
        getVipInfo = (callback, source='multiApprove') => {
            this.props.asyncFetchVipService((data) => { // 当父组件没有提供vipInfo时自己请求获取
                if(data.retCode === "0"){
                    let backendKey = MAIN_MAP[source].backendKey;
                    let vipInfo  = data.data[backendKey];
                    callback && callback(vipInfo.vipState);
                } else {
                    message.error(data.retMsg);
                }
            })
        };

        /**
         *  VIP 操作相关
         *  approveModuleFlag 是否开启审批权限 0 无 1 有
         *  approveStatus  审批状态 0 未通过  1 通过  2 反驳  3 审批中
         */
        vipTipPop = (cancelApproveOperate, openSelectApprove) => {
            let source = 'multiApprove';
            this.getVipInfo((vState) => {
                /**
                 * vipState
                 * NOT_OPEN 未开通
                 * EXPIRED 已到期
                 * TRY 试用中
                 * OPENED 服务中
                 */
                if(vState==='EXPIRED' && MAIN_MAP[source] && MAIN_MAP[source][vState]) { // 会出现使用到期弹框提示
                    let {title, content,icon} = MAIN_MAP[source][vState];
                    this._popModal({title, content, icon,
                        okCallback: ()=>{
                            cancelApproveOperate && cancelApproveOperate();
                        },
                        cancelCallback: () => {
                            cancelApproveOperate && cancelApproveOperate();
                        }
                    });
                }  else {
                    openSelectApprove && openSelectApprove(); // 否则，则可选择审批流
                }
            }, source);
        };


        /**
         *   即将废弃
         *   获取当前模块该用户的审批权限
         *   @type 当前的模块类型 如 sale 表示销售新建或修改页面
         *   @source 表示 VIP 类型 如 warehouse表示 多仓库
         *   @cancelApproveOperate 点击取消按钮执行的操作
         *   @openSelectApprove 执行选择审批流操作
         *   @values 表单提交的数据
         */
        checkApproveStatus = (type,source,billNo,types,callback) => {
            this.props.asyncGetApproveStatus({types}, (res) => {
                console.log(res, 'res');
                if(res.data.retCode == "0"){
                    if(res.data.data == "1"){
                        let title =  intl.get("components.approve.selectApproveItem.tipTitle");
                        let content =  intl.get("components.approve.selectApproveItem.tipContent");
                        let icon =  <ExclamationCircleOutlined />;
                        this._popModal({title, content, icon,
                                cancelCallback: () => {
                                    this.cancelApproveOperate();
                                },
                                okCallback: () =>{
                                    this.confirmApproveOperate(source,billNo&&billNo,types&&types,callback&&callback)
                                }
                            }
                        );
                    }else{
                        this.cancelApproveOperate(true);
                    }

                }
            });
        };

        /**
         *   具有审批权限，进行审批判断
         *   @cancelApproveOperate  点击取消按钮执行的操作
         *   @openSelectApprove 执行选择审批流操作
         */
        submitApproveProcess = (cancelApproveOperate, openSelectApprove) =>{
            let title =  intl.get("components.approve.selectApproveItem.tipTitle");
            let content =  intl.get("components.approve.selectApproveItem.tipContent");
            let icon = <ExclamationCircleOutlined />;
            this._popModal({title, content, icon,
                    cancelCallback: () => {
                        cancelApproveOperate && cancelApproveOperate();
                    },
                    okCallback: () =>{
                        this.confirmApproveOperate(cancelApproveOperate, openSelectApprove);
                    }
                }
            );
        };

        // 提交单据开始审批 确认操作
        confirmApproveOperate = (cancelApproveOperate, openSelectApprove) => {
            // 校验Vip信息
            this.vipTipPop(cancelApproveOperate, openSelectApprove);
        };


        render() {
          return (
              <React.Fragment>
                  <WrappedComponent
                      {...this.props}
                      checkApproveStatus={this.checkApproveStatus}
                      submitApproveProcess={this.submitApproveProcess}
                  />
              </React.Fragment>
          )
        }
    }
}

