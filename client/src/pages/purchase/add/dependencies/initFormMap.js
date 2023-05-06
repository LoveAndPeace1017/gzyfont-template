const formMap = {
    purchaseOrderDate: {
        TYPE: 'date',
        BACKEND_KEY: 'purchaseOrderDate'
    },
    warehouseName: {
        TYPE: 'text',
        BACKEND_KEY: 'warehouseName'
    },
    supplier: {
        TYPE: 'object',
        BACKEND_KEY: 'supplierCode',
        BACKEND_VALUE: 'supplierName'
    },
    supplierContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'supplierContacterName'
    },
    supplierMobile: {
        TYPE: 'text',
        BACKEND_KEY: 'supplierMobile'
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
    contractTerms:{
        TYPE: 'text',
        BACKEND_KEY: 'contractTerms'
    },
    fkMrpBillNo:{
        TYPE: 'text',
        BACKEND_KEY: 'fkMrpBillNo'
    },
    dataTagList: {
        TYPE: 'tag',
        BACKEND_KEY: 'dataTagList'
    }
};

export default formMap;