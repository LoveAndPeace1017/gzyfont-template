const formMap = {
    orderDate: {
        TYPE: 'date',
        BACKEND_KEY: 'orderDate'
    },
    warehouseNameIn: {
        TYPE: 'text',
        BACKEND_KEY: 'warehouseNameIn'
    },
    warehouseNameOut: {
        TYPE: 'text',
        BACKEND_KEY: 'warehouseNameOut'
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
    projectName: {
        TYPE: 'text',
        BACKEND_KEY: 'projectName'
    },
    ourContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'ourContacterName'
    },
    remindDate: {
        TYPE: 'date',
        BACKEND_KEY: 'remindDate'
    },
    remark: {
        TYPE: 'text',
        BACKEND_KEY: 'remark'
    }
};

export default formMap;