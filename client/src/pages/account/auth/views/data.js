import {AUTH_ADD, AUTH_DELETE, AUTH_MODIFY, AUTH_READ,AUTH_APPROVE,AUTH_APPENDIX} from '../actionsTypes'
import React from 'react';
import IntlTranslation from 'utils/IntlTranslation'

const commonAuthList = [
    {
        key: AUTH_ADD,
        name: <IntlTranslation intlKey = "account.auth.add"/>
    },
    {
        key: AUTH_DELETE,
        name: <IntlTranslation intlKey = "account.auth.delete"/>
    },
    {
        key: AUTH_MODIFY,
        name: <IntlTranslation intlKey = "account.auth.editor"/>
    },
    {
        key: AUTH_READ,
        name: <IntlTranslation intlKey = "account.auth.read"/>
    }
];

const approveAuthList = commonAuthList/*.concat({
    key: AUTH_APPROVE,
    name: <IntlTranslation intlKey = "account.auth.approve"/>
})*/;

const appendixAuthList = commonAuthList.concat({
    key: AUTH_APPENDIX,
    name: "附件"
});

const groupList = [
    {
        groupId: '01',
        groupName: <IntlTranslation intlKey = "account.auth.price"/>,
        moduleList: [
            {
                moduleId: '13',
                moduleName: <IntlTranslation intlKey = "account.auth.purchasePrice"/>,
                key: 'purchasePrice',
                authList: [
                    {
                        key: AUTH_READ,
                        name: <IntlTranslation intlKey = "account.auth.read"/>
                    }
                ]
            },
            {
                moduleId: '12',
                key: 'salePrice',
                moduleName: <IntlTranslation intlKey = "account.auth.salePrice"/>,
                authList: [
                    {
                        key: AUTH_READ,
                        name: <IntlTranslation intlKey = "account.auth.read"/>
                    }
                ]
            }
        ]
    },
    {
        groupId: '02',
        groupName: <IntlTranslation intlKey = "account.auth.basic"/>,
        moduleList: [
            {
                moduleId: '01',
                key: 'goods',
                moduleName: <IntlTranslation intlKey = "account.auth.goods"/>,
                dataRangeList: [
                    {
                        value: 2,
                        name: "全部物品"
                    },
                    {
                        value: 0,
                        name: "仅分配物品"
                    }
                ],
                authList: commonAuthList
            },
            {
                moduleId: '20',
                key: 'bom',
                moduleName: <IntlTranslation intlKey = "account.auth.bom"/>,
                dataRangeList: [
                    {
                        value: 2,
                        name: <IntlTranslation intlKey = "account.auth.bomOption1"/>
                    },
                    {
                        value: 0,
                        name: <IntlTranslation intlKey = "account.auth.bomOption2"/>
                    }
                ],
                authList: commonAuthList
            },
            {
                moduleId: '02',
                key: 'supplier',
                moduleName: <IntlTranslation intlKey = "account.auth.supplier"/>,
                dataRangeList: [
                    {
                        value: 2,
                        name: <IntlTranslation intlKey = "account.auth.option1"/>
                    },
                    {
                        value: 0,
                        name: <IntlTranslation intlKey = "account.auth.option2"/>
                    }
                ],
                authList: commonAuthList
            },
            {
                moduleId: '03',
                key: 'customer',
                moduleName: <IntlTranslation intlKey = "account.auth.customer"/>,
                dataRangeList: [
                    {
                        value: 2,
                        name: <IntlTranslation intlKey = "account.auth.option3"/>
                    },
                    {
                        value: 1,
                        name: <IntlTranslation intlKey = "account.auth.option5"/>
                    },
                    {
                        value: 0,
                        name: <IntlTranslation intlKey = "account.auth.option4"/>
                    }
                ],
                authList: commonAuthList
            }
        ]
    },
    {
        groupId: '03',
        groupName: <IntlTranslation intlKey = "account.auth.business"/>,
        moduleList: [
            {
                moduleId: '24',
                key: 'requisition',
                moduleName: <IntlTranslation intlKey = "account.auth.requisition"/>,
                authList: approveAuthList
            },
            {
                moduleId: '04',
                key: 'inquiry',
                moduleName: <IntlTranslation intlKey = "account.auth.inquiry"/>,
                authList: [
                    {
                        key: AUTH_ADD,
                        name: <IntlTranslation intlKey = "account.auth.add"/>
                    },
                    {
                        key: AUTH_DELETE,
                        name: <IntlTranslation intlKey = "account.auth.delete"/>
                    },
                    /*{
                        key: AUTH_MODIFY,
                        name: '修改'
                    },*/
                    {
                        key: AUTH_READ,
                        name: <IntlTranslation intlKey = "account.auth.read"/>
                    }
                ]
            },
            {
                moduleId: '05',
                key: 'purchase',
                moduleName: <IntlTranslation intlKey = "account.auth.purchase"/>,
                authList: appendixAuthList
            },
            {
                moduleId: '25',
                key: 'quotation',
                moduleName: "报价单",
                authList: commonAuthList
            },
            {
                moduleId: '06',
                key: 'sale',
                moduleName: <IntlTranslation intlKey = "account.auth.sale"/>,
                authList: appendixAuthList
            },
            {
                moduleId: '07',
                key: 'inbound',
                moduleName: <IntlTranslation intlKey = "account.auth.inbound"/>,
                authList: approveAuthList
            },
            {
                moduleId: '08',
                key: 'outbound',
                moduleName: <IntlTranslation intlKey = "account.auth.outbound"/>,
                authList: approveAuthList
            },
            {
                moduleId: '09',
                key: 'stocktaking',
                moduleName: <IntlTranslation intlKey = "account.auth.stocktaking"/>,
                authList: commonAuthList
            },
            {
                moduleId: '14',
                key: 'scheduling',
                moduleName: <IntlTranslation intlKey = "account.auth.scheduling"/>,
                authList: commonAuthList
            },
            {
                moduleId: '18',
                key: 'income',
                moduleName: <IntlTranslation intlKey = "account.auth.income"/>,
                authList: commonAuthList
            },
            {
                moduleId: '16',
                key: 'expend',
                moduleName: <IntlTranslation intlKey = "account.auth.expend"/>,
                authList: commonAuthList
            },
            {
                moduleId: '19',
                key: 'saleInvoice',
                moduleName: <IntlTranslation intlKey = "account.auth.saleInvoice"/>,
                authList: commonAuthList
            },
            {
                moduleId: '17',
                key: 'invoice',
                moduleName: <IntlTranslation intlKey = "account.auth.invoice"/>,
                authList: commonAuthList
            },
            {
                moduleId: '22',
                key: 'productManage',
                moduleName: "工单",
                authList: commonAuthList
            },
            {
                moduleId: '23',
                key: 'productOrder',
                moduleName: "生产单",
                authList: commonAuthList
            }

        ]
    },
    {
        groupId: '04',
        groupName: <IntlTranslation intlKey = "account.auth.report"/>,
        moduleList: [
            {
                moduleId: '10',
                key: 'report',
                moduleName: <IntlTranslation intlKey = "account.auth.reportCenter"/>,
                authList: [
                    {
                        key: AUTH_READ,
                        name: <IntlTranslation intlKey = "account.auth.read"/>
                    }
                ]
            }
        ]
    }
];

export default groupList;
