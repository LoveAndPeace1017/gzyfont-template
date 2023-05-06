const formMap = {
    allocDate: {
        TYPE: 'date',
        BACKEND_KEY: 'allocDate'
    },
    warehouseNameIn: {
        TYPE: 'text',
        BACKEND_KEY: 'warehouseNameIn'
    },
    warehouseNameOut: {
        TYPE: 'text',
        BACKEND_KEY: 'warehouseNameOut'
    },
    ourContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'ourContacterName'
    },
    remarks: {
        TYPE: 'text',
        BACKEND_KEY: 'remarks'
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
    dataTagList: {
        TYPE: 'tag',
        BACKEND_KEY: 'dataTagList'
    }
};

export default formMap;