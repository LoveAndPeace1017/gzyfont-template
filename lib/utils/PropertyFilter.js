const moment = require('moment');
const extend = require('extend');
const concat = require('lodash/concat');
const Constants = require('../../lib/constants');

PropertyFilter = function(){

};

extend(PropertyFilter, {
    searchFilter(tags,searchFields,filterConfigList) {
        let searchFieldsObj = {};
        searchFields.forEach((item)=>{
            searchFieldsObj[item.columnName] = item;
        });
        tags.forEach((item)=>{
            if(item.propName){
                let obj={};
                let mappingName = item.mappingName;
                let type = item.type;
                obj.fieldName = mappingName;
                obj.label = item.propName;
                obj.visibleFlag = searchFieldsObj[mappingName].visibleFlag;
                obj.originVisibleFlag = searchFieldsObj[mappingName].visibleFlag;
                obj.recId = searchFieldsObj[mappingName].recId;
                obj.displayFlag = false;
                switch(type){
                    case 'text':
                        obj.type='input';
                        break;
                    case 'number':
                        obj.type='numberPicker';
                        obj.fieldStartKey = 'start';
                        obj.fieldEndKey = 'end';
                        break;
                    case 'select':
                        obj.type='select';
                        let extra = item.extra;
                        let options = extra.options.map((item)=>{
                            return {label: item.value,value: item.key+""}
                        });
                        obj.options = options;
                        break;
                    case 'date':
                        obj.type='datePicker';

                }
                filterConfigList.push(obj);
            }
        });
        return filterConfigList;
    },
    /**
     *  @params {Array} tags自定义标签列表
     *  过滤自定义列表中的老数据(为空的数据)
     **/
    filterEmptyCustomTags(tags){
        return tags.filter(item => item.propName);
    },
    /**
     *  @params {Array} tags自定义标签列表
     *  @params {String} prefix 前缀
     *  初始化自定义标签
     **/
    initCustomTags(tags, prefix){
        tags = PropertyFilter.filterEmptyCustomTags(tags);
        return tags.map(tag => {
            if(tag.extra) {
                tag.extra = JSON.parse(tag.extra);
            }
            if(prefix){
                tag.mappingName = prefix + tag.mappingName;
            }
            return tag;
        });
    },
    /**
     *  @params {Array} tags自定义标签列表
     *  将自定义字段的array类型转map
     **/
    invertDataTagsFromArrayToMap(tags){
        let out = {};
        tags.forEach(item=>{
            out[item.mappingName] = item;
        });
        return out;
    },
    /**
     *  @params {Array} tags自定义标签列表
     *  @params {Object} properties 自定义数据
     *  处理单个自定义字段的值
     **/
    initCustomProperty(tag, property){
        if (!property) return;
        if (tag.type === 'date') {
            property = moment(property).format('YYYY-MM-DD');
        } else if (tag.type === 'select') {
            let extra = tag.extra;
            let options = extra.options;
            let selectOptions = options.filter(item => item.key == property);
            if(selectOptions && selectOptions.length > 0){
                property = selectOptions[0].value;
            }
        }
        return property;
    },
    /**
     *  @params {Array} tags自定义标签列表
     *  @params {Object} properties 自定义数据
     *  @params {String} prefix 前缀
     *  处理自定义字段的值
     **/
    initCustomProperties(tags, properties, prefix){
        let obj = {};
        if(!properties) return obj;
        let tagsMap = PropertyFilter.invertDataTagsFromArrayToMap(tags);
        for(let prop in properties){
            let propKey = prop ;
            if(prefix) propKey = prefix + prop;
            if(!properties[prop] || !tagsMap[propKey]) continue;  // 处理空值 或 脏数据
            obj[propKey] = PropertyFilter.initCustomProperty(tagsMap[propKey], properties[prop]);
        }
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
     *  将字段字段合并成map输出
     **/
    dealCustomField(tags, ...extraTags) {
        let obj = {};
        let tagsGroup = concat(tags, ...extraTags) || [];
        tagsGroup.forEach(function (item) {
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
     *  @params {Array} prodList 物品列表
     *  对物品列表的各单据的自定义字段处理
     **/
    dealBillProdCustomField(prodList, prefix){
        return prodList.map(item => {
            for(let key in item.propertyValues){
                let propKey = key;
                if(prefix) propKey = prefix + propKey;
                item[propKey] = item.propertyValues[key];
            }
            return item;
        })
    },
    /**
     *  @params {Array} prodList 物品列表
     *  对单据物品的自定义字段处理
     **/
    dealProdCustomField({list, propertyKey='propertyValues', prefix}){
        return list.map(item => {
            for(let key in item[propertyKey]){
                let propKey = key;
                if(prefix) propKey = prefix + propKey;
                item[propKey] = item[propertyKey][key];
            }
            return item;
        })
    },
    /**
     * @param properties
     * @param prefix
     * 给自定义字段添加前缀
     */
    addPrefixToCustomProperties(properties={}, prefix){
        if(!prefix) return properties;
        let obj = {};
        for(let prop in properties){
            obj[prefix+prop] = properties[prop];
        }
        return obj
    }
});

module.exports = PropertyFilter;