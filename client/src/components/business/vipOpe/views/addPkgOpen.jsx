import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {message, Modal} from 'antd';
import IntlTranslation from 'utils/IntlTranslation';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
import {VIP_MODULE, getVipModule, checkVipModule} from './vipModule';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {asyncOpenVipAndSendRequestToOss} from "../actions";
import {actions as vipServiceHomeActions} from "pages/vipService/index";

const cx = classNames.bind(styles);

/***
 * source String  default warehouse 多仓库
 * 对应关系：
 *  warehouse： 多仓库
 *  fitting：  BOM 配件组合
 *  print:    自定义打印
 *  serial:   序列号
 *  discount:  整单优惠
 *  multiLanguage:  多语言
 *  multiApprove:  多审批
 */

// 增值包 试用弹层
const VALUE_ADDED_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <IntlTranslation intlKey="components.vipOpe.addPkgOpen.bomVipContent"/>
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};

// 增值包 失效弹层
const VALUE_ADDED_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p><IntlTranslation intlKey="components.vipOpe.addPkgOpen.bomVipExpireTip"/></p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

// BOM 试用弹层
const BOM_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            该服务属于增值服务，点击确定即可开通7天试用。
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};

// BOM 失效弹层
const BOM_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p>BOM服务已到期，欢迎续费继续使用。详询客服400 -6979-890（转1） 或 18402578025（微信同号）</p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

// 多语言 试用弹层
const MULTI_LANGUAGE_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <IntlTranslation intlKey="components.vipOpe.addPkgOpen.multiLanguageContent"/>
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};

// 多语言 失效弹层
const MULTI_LANGUAGE_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p><IntlTranslation intlKey="components.vipOpe.addPkgOpen.multiLanguageVipExpireTip"/></p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

// 多级审批 失效弹层
const MULTI_LEVEL_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p><IntlTranslation intlKey="components.vipOpe.addPkgOpen.multiLevelExpireTip"/></p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};


// 多级审批 试用弹层
const MULTI_LEVEL_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <IntlTranslation intlKey="components.vipOpe.addPkgOpen.multiLevelContent"/>
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};


// 批次保质期 失效弹层
const BATCH_SHELF_LIFE_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p><IntlTranslation intlKey="components.vipOpe.addPkgOpen.batchShelfLeftExpireTip"/></p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

// 批次保质期 试用弹层
const BATCH_SHELF_LIFE_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <IntlTranslation intlKey="components.vipOpe.addPkgOpen.batchShelfLeftContent"/>
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};

// 委外加工 失效弹层
const SUB_CONTRACT_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p><IntlTranslation intlKey="components.vipOpe.addPkgOpen.subContractExpireTip"/></p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

// 委外加工 试用弹层
const SUB_CONTRACT_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <IntlTranslation intlKey="components.vipOpe.addPkgOpen.subContractContent"/>
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};


// 生产管理 失效弹层
const PRODUCT_MANAGE_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p><IntlTranslation intlKey="components.vipOpe.addPkgOpen.productMangeExpireTip"/></p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

// 生产管理 试用弹层
const PRODUCT_MANAGE_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <IntlTranslation intlKey="components.vipOpe.addPkgOpen.productMangeContent"/>
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};

// 生产管理 开通服务 模块未开通
const PRODUCT_MANAGE_MODULE_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    contentMap: {
        1: (
            <div>
                <p>MRP运算服务未开通，欢迎开通使用。详询客服：400-6979-890（转1）或18402578025（微信同号）</p>
                <a style={{color: '#0066dd'}} target="_blank"
                   href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                    intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
            </div>
        ),
        2: (
            <div>
                <p>生产单服务未开通，欢迎开通使用。详询客服：400-6979-890（转1）或18402578025（微信同号）</p>
                <a style={{color: '#0066dd'}} target="_blank"
                   href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                    intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
            </div>
        ),
        4: (
            <div>
                <p>生产工单服务未开通，欢迎开通使用。详询客服：400-6979-890（转1）或18402578025（微信同号）</p>
                <a style={{color: '#0066dd'}} target="_blank"
                   href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                    intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
            </div>
        )
    },
    okCallback: ''
};


// 移动报工管理 失效弹层
const MOBILE_WORK_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p>移动报工服务已到期。详询客服：400-6979-890（转1）或18402578025（微信同号）</p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

const MOBILE_WORK_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            是否开通移动报工VIP服务，开通后可免费试用移动报工模块7天 详询客服：400-6979-890（转1）或18402578025（微信同号）
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};

// 多币种失效弹层
const CURRENCY_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p>多币种服务已到期。详询客服：400-6979-890（转1）或18402578025（微信同号）</p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

const CURRENCY_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            是否开通多币种VIP服务，开通后可免费试用多币种功能7天 详询客服：400-6979-890（转1）或18402578025（微信同号）
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};

// 订单追踪 失效弹层
const ORDER_TRACK_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p>订单追踪平台功能已到期。详询客服：400-6979-890（转1）或18402578025（微信同号）</p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

// 订单追踪 试用弹层
const ORDER_TRACK_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            是否开通订单追踪平台功能，开通后可免费试用订单追踪平台功能7天 详询客服：400-6979-890（转1）或18402578025（微信同号）
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};


// 短信提醒 失效弹层
const SMS_NOTIFY_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p>短信提醒功能已到期。详询客服：400-6979-890（转1）或18402578025（微信同号）</p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

// 短信提醒 试用弹层
const SMS_NOTIFY_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            开通短信提醒VIP服务，则可免费试用20条短信提醒，确认开通？
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess();
            } else {
                message.error(res.retMsg);
            }
        });
    }
};



// 物流查询 失效弹层
const LOGISTICS_QUERY_EXPIRED = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            <p>物流查询VIP已到期。详询客服：400-6979-890（转1）或18402578025（微信同号）</p>
            <a style={{color: '#0066dd'}} target="_blank"
               href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true"><IntlTranslation
                intlKey="components.vipOpe.addPkgOpen.treatyText"/></a>
        </div>
    ),
    okCallback: ''
};

// 物流查询 试用弹层
const LOGISTICS_QUERY_NOT_OPEN = {
    title: <IntlTranslation intlKey="components.vipOpe.addPkgOpen.warningTip"/>,
    icon: <ExclamationCircleOutlined/>,
    content: (
        <div>
            本查询将消耗1次物流查询次数，确认查询？
        </div>
    ),
    okCallback: (self) => {
        let source = self.props.source || 'warehouse';

        self.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
            if (res.retCode == 0) {
                self.props.openModal && self.props.openModal();
                self.props.openVipSuccess && self.props.openVipSuccess('try');
            } else {
                message.error(res.retMsg);
            }
        });
    }
};


/**
 *   MAIN_MAP
 *   backendKey  后端字段对应于前端的映射关系  such as warehouse 对应 VALUE_ADDED
 *   POP_MAP  前台提示弹框中的内容
 */
export const MAIN_MAP = {
    'warehouse': {  // 多仓库
        'backendKey': 'VALUE_ADDED',
        'NOT_OPEN': {...VALUE_ADDED_NOT_OPEN},
        'EXPIRED': {...VALUE_ADDED_EXPIRED}
    },
    'fitting': {  // BOM 配件组合
        'backendKey': 'BOM',
        'NOT_OPEN': {...BOM_NOT_OPEN},
        'EXPIRED': {...BOM_EXPIRED}
    },
    'print': {  // 自定义打印
        'backendKey': 'VALUE_ADDED',
        'NOT_OPEN': {...VALUE_ADDED_NOT_OPEN},
        'EXPIRED': {...VALUE_ADDED_EXPIRED}
    },
    'serial': {   // 序列号
        'backendKey': 'VALUE_ADDED',
        'NOT_OPEN': {...VALUE_ADDED_NOT_OPEN},
        'EXPIRED': {...VALUE_ADDED_EXPIRED}
    },
    'discount': {   //  整单优惠
        'backendKey': 'VALUE_ADDED',
        'NOT_OPEN': {...VALUE_ADDED_NOT_OPEN},
        'EXPIRED': {...VALUE_ADDED_EXPIRED}
    },
    'multiLanguage': {  // 多语言
        'backendKey': 'MULTI_LANGUAGE',
        'NOT_OPEN': {...MULTI_LANGUAGE_NOT_OPEN},
        'EXPIRED': {...MULTI_LANGUAGE_EXPIRED,}
    },
    'multiApprove': {   // 多级审批
        'backendKey': 'MULTI_LEVEL_APPROVE',
        'NOT_OPEN': {...MULTI_LEVEL_NOT_OPEN},
        'EXPIRED': {...MULTI_LEVEL_EXPIRED},
    },
    'batchShelfLeft': {   // 批次保质期
        'backendKey': 'BATCH_SHELF_LIFE',
        'NOT_OPEN': {...BATCH_SHELF_LIFE_NOT_OPEN},
        'EXPIRED': {...BATCH_SHELF_LIFE_EXPIRED},
    },
    'subContract': {   // 委外加工
        'backendKey': 'SUB_CONTRACT',
        'NOT_OPEN': {...SUB_CONTRACT_NOT_OPEN},
        'EXPIRED': {...SUB_CONTRACT_EXPIRED},
    },
    'productManage': { //生产管理
        'backendKey': 'PRODUCT_MANAGE',
        'NOT_OPEN': {...PRODUCT_MANAGE_NOT_OPEN},
        'EXPIRED': {...PRODUCT_MANAGE_EXPIRED},
        'OPENED': {...PRODUCT_MANAGE_MODULE_NOT_OPEN},
        'TRY': {...PRODUCT_MANAGE_MODULE_NOT_OPEN}
    },
    'mobileWork': { //移动报工
        'backendKey': 'MOBILE_WORK',
        'NOT_OPEN': {...MOBILE_WORK_NOT_OPEN},
        'EXPIRED': {...MOBILE_WORK_EXPIRED},
    },
    'currency': { //多币种
        'backendKey': 'CURRENCY',
        'NOT_OPEN': {...CURRENCY_NOT_OPEN},
        'EXPIRED': {...CURRENCY_EXPIRED},
    },
    'orderTrack': { // 订单追踪
        'backendKey': 'ORDER_TRACK',
        'NOT_OPEN': {...ORDER_TRACK_NOT_OPEN},
        'EXPIRED': {...ORDER_TRACK_EXPIRED},
    },
    'smsNotify': { // 短信提醒
        'backendKey': 'SMS_NOTIFY',
        'NOT_OPEN': {...SMS_NOTIFY_NOT_OPEN},
        'EXPIRED': {...SMS_NOTIFY_EXPIRED},
    },
    'logisticsQuery': { // 短信提醒
        'backendKey': 'LOGISTICS_QUERY',
        'NOT_OPEN': {...LOGISTICS_QUERY_NOT_OPEN},
        'EXPIRED': {...LOGISTICS_QUERY_EXPIRED},
    }
};


/**
 *  VIP 相关的所有操作
 * @visibleName AddPkgOpen（开通商城操作）
 * @author jinbo
 */

class AddPkgOpen extends Component {
    popModal = ({title, content, icon, theme, okCallback, cancelCallback}) => {
        const _this = this;
        Modal.confirm({
            icon,
            title: title,
            content: content,
            onOk() {
                okCallback && okCallback.call(null, _this);
            },
            onCancel() {
                cancelCallback && cancelCallback.call(null, _this);
            },
        })
    };

    vipTipPop = () => {
        const {source, module, vipInfo, onTryOrOpenCallback, cancelCallback} = this.props;
        let vipState = vipInfo ? vipInfo.vipState : '';
        if (!vipState) {
            this.getVipInfo((vipInfo) => {
                this.popCallback(source, module, vipInfo, onTryOrOpenCallback, cancelCallback);
            }, source);
        } else {
            this.popCallback(source, module, vipInfo, onTryOrOpenCallback, cancelCallback);
        }
    };

    popCallback = (source, module, vipInfo, onTryOrOpenCallback, cancelCallback) => {
        let vipState = vipInfo ? vipInfo.vipState : '';
        let vipTypeSub = vipInfo ? vipInfo.vipTypeSub : '';
        /**
         * vipState
         * NOT_OPEN 未开通
         * EXPIRED 已到期
         * TRY 试用中
         * OPENED 服务中
         */
        if (MAIN_MAP[source] && MAIN_MAP[source][vipState]) {
            if (vipState !== 'OPENED' && vipState !== 'TRY') {
                let {title, content, icon, okCallback} = MAIN_MAP[source][vipState];
                this.popModal({title, content, icon, okCallback, cancelCallback});
                return;
            }
            if ((vipState === 'OPENED' || vipState === 'TRY') && module) {
                let moduleCheckFlag = checkVipModule(source, vipTypeSub, module);
                if (!moduleCheckFlag) {
                    let {title, contentMap, icon, okCallback} = MAIN_MAP[source][vipState];
                    let content = contentMap[module];
                    this.popModal({title, content, icon, okCallback, cancelCallback});
                } else {
                    onTryOrOpenCallback && onTryOrOpenCallback(); // 已经开通或正在试用的回调操作
                }
            } else {
                onTryOrOpenCallback && onTryOrOpenCallback(); // 已经开通或正在试用的回调操作
            }
        } else {
            onTryOrOpenCallback && onTryOrOpenCallback(); // 已经开通或正在试用的回调操作
        }
    };

    getVipInfo = (callback, source = 'warehouse') => {
        this.props.asyncFetchVipService((data) => { // 当父组件没有提供vipInfo时自己请求获取
            if (data.retCode === "0") {
                let backendKey = MAIN_MAP[source].backendKey;
                let vipInfo = data.data[backendKey];
                callback && callback(vipInfo);
            } else {
                message.error(data.retMsg);
            }
        })
    };

    render() {
        let {style} = this.props;
        return (
            <div style={style} onClick={() => this.vipTipPop()}>
                {this.props.render(this)}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPkgOpen)


@connect(mapStateToProps, mapDispatchToProps)
export function withVipWrap(WrapComponent) {
    return class AddPkgOpen extends Component {
        popModal = ({title, content, icon, theme, okCallback, cancelCallback}) => {
            const _this = this;
            Modal.confirm({
                icon,
                title: title,
                content: content,
                onOk() {
                    okCallback && okCallback.call(null, _this);
                },
                onCancel() {
                    cancelCallback && cancelCallback.call(null, _this);
                },
            })
        };

        vipTipPop = ({source, module, vipInfo, onTryOrOpenCallback, expireCallback}) => {
            let vipState = vipInfo ? vipInfo.vipState : '';
            if (!vipState) {
                this.getVipInfo((vipInfo) => {
                    this.popCallback(source, module, vipInfo, onTryOrOpenCallback, expireCallback);
                }, source);
            } else {
                this.popCallback(source, module, vipInfo, onTryOrOpenCallback, expireCallback);
            }
        };

        popCallback = (source, module, vipInfo, onTryOrOpenCallback, expireCallback) => {
            let vipState = vipInfo ? vipInfo.vipState : '';
            let vipTypeSub = vipInfo ? vipInfo.vipTypeSub : '';
            /**
             * vipState
             * NOT_OPEN 未开通
             * EXPIRED 已到期
             * TRY 试用中
             * OPENED 服务中
             */
            if (MAIN_MAP[source] && MAIN_MAP[source][vipState]) {
                if (vipState !== 'OPENED' && vipState !== 'TRY') {
                    let {title, content, icon, okCallback} = MAIN_MAP[source][vipState];
                    if (vipState === 'EXPIRED') okCallback = expireCallback;
                    if (vipState === 'NOT_OPEN') okCallback = () => this.tryCallback(source, onTryOrOpenCallback);
                    this.popModal({title, content, icon, okCallback});
                    return;
                }
                if ((vipState === 'OPENED' || vipState === 'TRY') && module) {
                    let moduleCheckFlag = checkVipModule(source, vipTypeSub, module);
                    if (!moduleCheckFlag) {
                        let {title, contentMap, icon, okCallback} = MAIN_MAP[source][vipState];
                        let content = contentMap[module];
                        this.popModal({title, content, icon, okCallback});
                    } else {
                        onTryOrOpenCallback && onTryOrOpenCallback(); // 已经开通或正在试用的回调操作
                    }
                } else {
                    onTryOrOpenCallback && onTryOrOpenCallback(); // 已经开通或正在试用的回调操作
                }
            } else {
                onTryOrOpenCallback && onTryOrOpenCallback(); // 已经开通或正在试用的回调操作
            }
        };

        // 试用回调
        tryCallback = (source = 'warehouse', callback) => {
            this.props.asyncOpenVipAndSendRequestToOss({source}, (res) => {
                if (res.retCode == 0) {
                    callback && callback();
                } else {
                    message.error(res.retMsg);
                }
            });
        };


        getVipInfo = (callback, source = 'warehouse') => {
            this.props.asyncFetchVipService((data) => { // 当父组件没有提供vipInfo时自己请求获取
                if (data.retCode === "0") {
                    let backendKey = MAIN_MAP[source].backendKey;
                    let vipInfo = data.data[backendKey];
                    callback && callback(vipInfo);
                } else {
                    message.error(data.retMsg);
                }
            })
        };

        render() {
            return (
                <React.Fragment>
                    <WrapComponent
                        {...this.props}
                        vipTipPop={this.vipTipPop}
                    />
                </React.Fragment>
            )
        }
    }
}