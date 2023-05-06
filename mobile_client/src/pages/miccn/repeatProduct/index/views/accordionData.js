const data = {
    inquiryAccordionData: {
        confirmStatus: {
            title: '是否核实',
            subData: [
                { title: '全部', value: 0 },
                { title: '已核实', value: 3 }
            ]
        },
        purchaseOrder: {
            title: '报价截止日期',
            subData: [
                { title: '按降序排列', value: 4 },
                { title: '按升序排列', value: 3 }
            ]
        }
    },
    inquiryAccordionDefaultIndexGroup: {
        confirmStatus: 0,
        purchaseOrder: -1
    },
    recommendInquiryAccordionData: {
        orderByType: {
            title: '报价截止日期',
            subData: [
                { title: '按降序排列', value: 'desc' },
                { title: '按升序排列', value: 'asc' }
            ]
        }
    },
    recommendInquiryAccordionDefaultIndexGroup: {
        orderByType: 0
    },
    quotationAccordionData: {
        tag: {
            title: '报价状态',
            subData: [
                { title: '进行中', value: "1" },
                { title: '已截止', value: "2"},
            ]
        },
        orderByType: {
            title: '报价时间',
            subData: [
                { title: '按降序排列', value: 'desc' },
                { title: '按升序排列', value: 'asc' }
            ]
        }
    },
    quotationAccordionDefaultIndexGroup: {
        tag: 0,
        orderByType: 0
    },
    tabs: [
        { title: '全部询价', key: 'inquiry', name: 'inquiry' },
        { title: '推荐询价', key: 'recommendInquiry', name: 'recommendInquiry' },
        { title: '我的报价', key: 'quotation', name: 'quotation'},
    ],
    genData: function (pIndex = 0, array) {
        const dataBlob = {};
        for (let i = 0; i < array.length; i++) {
            const ii = (pIndex * array.length) + i;
            dataBlob[`${ii}`] = array[i];
        }
        return dataBlob;
    }
};

export default data;