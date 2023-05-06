const formMap = {
    billNo:{
        TYPE: 'text',
        BACKEND_KEY: 'billNo'
    },
    outType: {
        TYPE: 'text',
        BACKEND_KEY: 'outType'
    },
    outDate: {
        TYPE: 'date',
        BACKEND_KEY: 'outDate'
    },
    warehouseName: {
        TYPE: 'text',
        BACKEND_KEY: 'warehouseName'
    },
    useDepartment: {
        TYPE: 'text',
        BACKEND_KEY: 'useDepartment'
    },
    usePerson: {
        TYPE: 'text',
        BACKEND_KEY: 'usePerson'
    },
    logistics: {
        TYPE: 'text',
        BACKEND_KEY: 'logistics'
    },
    waybillNo: {
        TYPE: 'text',
        BACKEND_KEY: 'waybillNo'
    },
    projectName: {
        TYPE: 'text',
        BACKEND_KEY: 'projectName'
    },
    ourContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'ourContacterName'
    },
    supplier: {
        TYPE: 'object',
        BACKEND_KEY: 'fkSupplierNo',
        BACKEND_VALUE: 'supplierName'
    },
    supplierContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'supplierContacterName'
    },
    supplierTelNo: {
        TYPE: 'text',
        BACKEND_KEY: 'supplierTelNo'
    },
    customer: {
        TYPE: 'object',
        BACKEND_KEY: 'fkCustomerNo',
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
        BACKEND_PROVINCE_CODE: 'outProvinceCode',
        BACKEND_PROVINCE_TEXT: 'outProvinceText',
        BACKEND_CITY_CODE: 'outCityCode',
        BACKEND_CITY_TEXT: 'outCityText',
        BACKEND_ADDRESS: 'outAddress'
    },
    customerOrderNo: {
        TYPE: 'text',
        BACKEND_KEY: 'customerOrderNo'
    },
    dataTagList: {
        TYPE: 'tag',
        BACKEND_KEY: 'dataTagList'
    },
    remarks: {
        TYPE: 'text',
        BACKEND_KEY: 'remarks'
    }
};

export default formMap;