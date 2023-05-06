const extend = require('extend');
const Constants = require('../../lib/constants');
const Decimal = require('./Decimal');


DataFilter = function(){

};

extend(DataFilter, {
    exportData(tableConfigList, list,reportType){
        let tableCol;
        if(reportType){
            tableCol = tableConfigList.filter((item)=>{
                return item.label;
            });
        }else{
            tableCol = tableConfigList.filter((item)=>{
                return item.visibleFlag&&item.label;
            });
        }
        tableCol.unshift({
            fieldName:'serial',
            label:'序号'
        });
        let tableData = [];
        let header = tableCol.map((item)=>{
            return item.label
        });
        tableData.push(header);
        list.forEach((item)=>{
            let temp = [];
            tableCol.forEach((col)=>{
                temp.push(item[col.fieldName]);
            });
            tableData.push(temp);
        });
        return tableData;
    },
    dealFooterTotalFieldForList(tableConfigList, totalMap, tableData, decimalMap){
        let {quantityDecimalNum, priceDecimalNum} = decimalMap || {};
        let footer = {serial: '合计'};
        totalMap = totalMap || {};
        tableConfigList.forEach(item => {
            if(item.totalFlag){
                let totalKey = `${item.fieldName}Total`;
                let totalValue = totalMap[totalKey];
                if(totalValue!==0 && !totalValue){
                    totalValue = totalMap[item.totalKey];
                }
                if(item.columnType === 'decimal-quantity') totalValue = Decimal.fixedDecimal(totalValue, quantityDecimalNum);
                if(item.columnType === 'decimal-money') totalValue = Decimal.fixedDecimal(totalValue, priceDecimalNum);
                footer[item.fieldName] = totalValue;
            }
        });
        tableData.push(footer);
        return tableData;
    },
    dealFooterTotalFieldForExport(tableConfigList, totalMap, tableData, decimalMap, reportType){
        let {quantityDecimalNum, priceDecimalNum} = decimalMap || {};

        let tableCol = []
        if(reportType){
            tableCol = tableConfigList.filter((item)=>item.label);
        }else{
            tableCol = tableConfigList.filter((item)=>item.visibleFlag&&item.label);
        }
        let footer = tableCol.map(item => {
            let totalValue = '';
            if(item.totalFlag && totalMap){
                let totalKey = `${item.fieldName}Total`;
                totalValue = totalMap[totalKey];
                if(totalValue!==0 && !totalValue){
                    totalValue = totalMap[item.totalKey];
                }
                if(item.columnType === 'decimal-quantity') totalValue = Decimal.fixedDecimal(totalValue, quantityDecimalNum);
                if(item.columnType === 'decimal-money') totalValue = Decimal.fixedDecimal(totalValue, priceDecimalNum);
            }
            return totalValue;
        });
        footer.unshift('合计');
        tableData.push(footer);
        return tableData;
    },
    dealCustomField(tags) {
        let obj = {};
        tags.forEach(function (item) {
            obj[item.mappingName] = {
                fieldName: item.mappingName,
                label: item.propName,
                value: item.mappingName,
                visibleFlag: item.visibleFlag,
                originVisibleFlag: item.visibleFlag
            };
            // 未添加的自定义项页面不显示
            if (item.propName == "") {
                obj[item.mappingName].displayFlag = false;
            }
        });
        return obj;
    },
    /**
    * 对单据物品表格可配置字段后端返回的数据做处理，添加label
    * @params {Array} list 后端的可配置字段
    * @params {Object} customMap 可配置字段(自定义字段)中文名映射
    * @params {Object} billProdDataTags 各单据配置字段(自定义字段)中文名映射
    **/
    dealGoodsTableConfig(list, customMap, billProdDataTags) {
        const resolvedList = list.map(function (item) {
            let label = Constants.GOODS_TABLE_FIELD_MAP[item.columnName] ||
                (customMap[item.columnName] && customMap[item.columnName].label) ||
                (billProdDataTags[item.columnName] && billProdDataTags[item.columnName].label);
            if (label) {
                return {
                    ...item,
                    label
                };
            }
            return item
        });

        return resolvedList.filter(item=> item.label);
    },
    /**
     *  @params {Array} prodList 物品列表
     *  对物品列表的各单据的自定义字段处理
     **/
    dealExtraCustomField(prodList){
        return prodList.map(item => {
            for(let key in item.propertyValues){
                let idx = key.split('property_value')[1];
                item["itemPropertyValue"+idx]=item.propertyValues[key];
            }
            return item;
        })
    }
});
module.exports = DataFilter;