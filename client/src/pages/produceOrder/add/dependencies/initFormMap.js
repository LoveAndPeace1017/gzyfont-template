const formMap = {
    orderDate: {
        TYPE: 'date',
        BACKEND_KEY: 'orderDate'
    },
    deliveryDeadlineDate:{
        TYPE: 'date',
        BACKEND_KEY: 'deliveryDeadlineDate'
    },
    departmentName: {
        TYPE: 'text',
        BACKEND_KEY: 'departmentName'
    },
    departmentId: {
        TYPE: 'text',
        BACKEND_KEY: 'departmentId'
    },
    employeeName: {
        TYPE: 'text',
        BACKEND_KEY: 'employeeName'
    },
    employeeId: {
        TYPE: 'text',
        BACKEND_KEY: 'employeeId'
    },
    officerId: {
        TYPE: 'text',
        BACKEND_KEY: 'officerId'
    },
    dataTagList: {
        TYPE: 'tag',
        BACKEND_KEY: 'dataTagList'
    },
    fkMrpBillNo: {
        TYPE: 'text',
        BACKEND_KEY: 'fkMrpBillNo'
    },
    supplier: {
        TYPE: 'object',
        BACKEND_KEY: 'supplierNo',
        BACKEND_VALUE: 'supplierName'
    },
    produceType: {
        TYPE: 'text',
        BACKEND_KEY: 'produceType'
    },
    contacterName: {
        TYPE: 'text',
        BACKEND_KEY: 'contacterName'
    },
    contacterTelNo: {
        TYPE: 'text',
        BACKEND_KEY: 'contacterTelNo'
    },
    projectCode: {
        TYPE: 'text',
        BACKEND_KEY: 'projectCode',
    }
};

export default formMap;