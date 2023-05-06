const formMap = {
    enterType: {
        TYPE: 'text',
        BACKEND_KEY: 'enterType'
    },
    enterDate: {
        TYPE: 'date',
        BACKEND_KEY: 'enterDate'
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
    customer: {
        TYPE: 'object',
        BACKEND_KEY: 'customerCode',
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
    otherEnterWarehouseName: {
        TYPE: 'text',
        BACKEND_KEY: 'otherEnterWarehouseName'
    },
    otherEnterWarehouseContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'otherEnterWarehouseContacterName'
    },
    projectName: {
        TYPE: 'text',
        BACKEND_KEY: 'projectName'
    },
    ourContacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'ourContacterName'
    },
    remarks: {
        TYPE: 'text',
        BACKEND_KEY: 'remarks'
    },
    dataTagList: {
        TYPE: 'tag',
        BACKEND_KEY: 'dataTagList'
    },
    fkProduceNo: {
        TYPE: 'text',
        BACKEND_KEY: 'fkProduceNo'
    },
    fkPurchaseOrderBillNo: {
        TYPE: 'text',
        BACKEND_KEY: 'fkPurchaseOrderBillNo'
    },
    fkSaleOrderBillNo: {
        TYPE: 'text',
        BACKEND_KEY: 'fkSaleOrderBillNo'
    },
};

export default formMap;