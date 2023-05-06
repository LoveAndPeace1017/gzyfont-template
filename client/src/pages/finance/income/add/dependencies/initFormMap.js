const formMap = {
    paymentDate: {
        TYPE: 'date',
        BACKEND_KEY: 'paymentDate'
    },
    incomeType: {
        TYPE: 'object',
        BACKEND_KEY: 'typeId',
        BACKEND_VALUE: 'typeName'
    },
    account: {
        TYPE: 'object',
        BACKEND_KEY: 'accountId',
        BACKEND_VALUE: 'accountName'
    },
    customerName: {
        TYPE: 'text',
        BACKEND_KEY: 'customerName'
    },
    bindBillType: {
        TYPE: 'text',
        BACKEND_KEY: 'bindBillType'
    },
    amount: {
        TYPE: 'text',
        BACKEND_KEY: 'amount'
    },
    remarks: {
        TYPE: 'text',
        BACKEND_KEY: 'remarks'
    },
    billNo: {
        TYPE: 'text',
        BACKEND_KEY: 'billNo'
    },
    currencyId: {
        TYPE: 'text',
        BACKEND_KEY: 'currencyId'
    },
    quotation: {
        TYPE: 'text',
        BACKEND_KEY: 'quotation'
    },
    currencyAmount: {
        TYPE: 'text',
        BACKEND_KEY: 'currencyAmount'
    },
    ourContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'ourContacterName'
    }
};

export default formMap;