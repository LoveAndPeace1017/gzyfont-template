const formMap = {
    saleOrderDate: {
        TYPE: 'date',
        BACKEND_KEY: 'saleOrderDate'
    },
    expiredDate: {
        TYPE: 'date',
        BACKEND_KEY: 'expiredDate'
    },
    warehouseName: {
        TYPE: 'text',
        BACKEND_KEY: 'warehouseName'
    },
    customer: {
        TYPE: 'object',
        BACKEND_KEY: 'customerNo',
        BACKEND_VALUE: 'customerName'
    },
    customerContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'customerContacterName'
    },
    customerTelNo: {
        TYPE: 'text',
        BACKEND_KEY: 'customerTelNo'
    },
    deliveryAddress: {
        TYPE: 'address',
        BACKEND_PROVINCE_CODE: 'deliveryProvinceCode',
        BACKEND_PROVINCE_TEXT: 'deliveryProvinceText',
        BACKEND_CITY_CODE: 'deliveryCityCode',
        BACKEND_CITY_TEXT: 'deliveryCityText',
        BACKEND_ADDRESS: 'deliveryAddress'
    },
    projectName: {
        TYPE: 'text',
        BACKEND_KEY: 'projectName'
    },
    settlement: {
        TYPE: 'text',
        BACKEND_KEY: 'settlement'
    },
    customerOrderNo: {
        TYPE: 'text',
        BACKEND_KEY: 'customerOrderNo'
    },
    ourName: {
        TYPE: 'text',
        BACKEND_KEY: 'ourName'
    },
    ourContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'ourContacterName'
    },
    ourTelNo: {
        TYPE: 'text',
        BACKEND_KEY: 'ourTelNo'
    },
    remarks: {
        TYPE: 'text',
        BACKEND_KEY: 'remarks'
    },
    propertyValues: {
        TYPE: 'customTag',
        BACKEND_KEY: 'propertyValues'
    },
    id: {
        TYPE: 'text',
        BACKEND_KEY: 'id'
    },
    currencyId: {
        TYPE: 'text',
        BACKEND_KEY: 'currencyId'
    },
    quotation: {
        TYPE: 'text',
        BACKEND_KEY: 'quotation'
    }
};

export default formMap;