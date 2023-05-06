import React, {Component} from 'react';
import moment from "moment/moment";

export default class ListPage extends Component {

    onSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows,
            checkResultVisible: selectedRowKeys.length > 0,
        });
    };

    checkRemove = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
            checkResultVisible: false
        })
    };

    //选中项批量删除
    batchDelete = () => {
        let _this = this;
        this.deleteConfirm(this.state.selectedRowKeys, function() {
            _this.checkRemove();
        });
    };

    // 是否显示筛选条件
    filterListData = (callback) => {
        this.setState({
            filterToolBarVisible: !this.state.filterToolBarVisible
        }, ()=>{
            callback && callback();
        });
    };

    //处理自定义字段
    dealCustomField = (params,tags)=>{
        if(params && tags){
            let tagsObj = {};
            tags.forEach((item)=>{
                tagsObj[item.mappingName] = item;
            });
            let propertyAry = [];
            for(let i in params){
                if(tagsObj[i]){
                    let type = tagsObj[i].type;
                    switch(type){
                        case 'text':
                            propertyAry.push({
                                propName: i,
                                propValue: params[i],
                                searchType: "text"
                            });
                            break;
                        case 'number':
                            params[i] !== '*'?
                            propertyAry.push({
                                propName: i,
                                propValue: params[i],
                                searchType: "number"
                            }):null;
                            break;
                        case 'select':
                            propertyAry.push({
                                propName: i,
                                propValue: params[i],
                                searchType: "select"
                            });
                            break;
                        case 'date':
                            let dateStr = `${params[i+'Start']||''}*${params[i+'End']||''}`;
                            dateStr !== '*'?
                            propertyAry.push({
                                propName: i,
                                propValue: dateStr,
                                searchType: "date"
                            }):null;
                    }
                    console.log(propertyAry,'propertyAry');
                }
            }
            params.billPropBo =  JSON.stringify(propertyAry);
        }
        return params;
    }

    doFilter = (condition, resetFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            let key = params.key;
            params = condition;
            if (key && (typeof params.key === "undefined")) {
                params.key = key;
            }
        }
        else {
            params = {
                ...params,
                ...condition
            }
        }
        this.setState({
            condition: params
        });

        for (const key in params) {
            if (!params[key]) {
                delete params[key];
            }
        }

        this.batchUpdateConfig(() => {
            this.fetchListData(params);
        });
    };

    onSearch = (value) => {
        this.doFilter({key: value}, true);
        this.filterToolBarHanler.reset();
    };
    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage});
    };
    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };

    refresh = () => {
        this.fetchListData(this.state.condition)
    };

    closeModal = (key) => {
        this.setState({
            [key]: false
        });
    };
    openModal = (key) => {
        this.setState({
            [key]: true
        });
    };

    onFilterConfigChange = (fieldName, value, index) => {
        this.props.asyncUpdateConfig('filterConfigList', fieldName, 'visibleFlag', index, value);
    };
    onTableConfigChange = (fieldName, value, index) => {
        this.props.asyncUpdateConfig('tableConfigList', fieldName, 'visibleFlag', index, value);
    };

    filterConfigListToUpdate = (isColumnsWidthChanged, filterConfigList, needUpdateFlag, moduleType, arr,cannotEditColumnsMap)=>{
        filterConfigList.forEach((item) => {
            if(cannotEditColumnsMap[item.fieldName]){
                return;
            }
            if (!isColumnsWidthChanged && item.originVisibleFlag != item.visibleFlag) {
                needUpdateFlag = true;
            }
            arr.push({
                recId: item.recId,
                moduleType: moduleType,
                columnName: item.fieldName,
                visibleFlag: item.visibleFlag ? 1 : 0
            });
        });
        return {
            arr,
            needUpdateFlag
        }
    };
    tableConfigListToUpdate = (isColumnsWidthChanged,tableConfigList, needUpdateFlag, moduleType, arr, map)=>{
        tableConfigList.forEach((item) => {
            if (!isColumnsWidthChanged && item.originVisibleFlag != item.visibleFlag) {
                needUpdateFlag = true;
            }
            arr.push({
                moduleType: moduleType,
                recId: item.recId,
                columnName: item.fieldName,
                columnWidth:map[item.fieldName]?map[item.fieldName]:item.width,
                cannotEdit:item.cannotEdit?1:null,
                visibleFlag: item.visibleFlag ? 1 : 0
            });
        });
        return {
            arr,
            needUpdateFlag
        }
    };

    // 指向table，用于宽度调整
    getRef = (tableRef) => {
        this.tableRef = tableRef
    };

    batchUpdateConfigSuper = (filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback,submitFlag) => {
        let {isColumnsWidthChanged,map} = this.tableRef.transformDataFormat();
        let arr = [];
        let needUpdateFlag = isColumnsWidthChanged;
        if(filterConfigList){
            ({arr, needUpdateFlag} = this.filterConfigListToUpdate(isColumnsWidthChanged,filterConfigList, needUpdateFlag, moduleType.search, arr, cannotEditFilterColumnsMap));
        }
        ({arr, needUpdateFlag} = this.tableConfigListToUpdate(isColumnsWidthChanged,tableConfigList, needUpdateFlag, moduleType.table, arr, map));
        //对于不需要记录字段显隐的列表，写死不会变化
        submitFlag?needUpdateFlag = false:null;
        if (needUpdateFlag) {
            this.props.asyncBatchUpdateConfig(arr, callback);
        }
        else {
            callback && callback()
        }
    };

    doInitParams = (initListCondition, initParams, DEFAULT_TITLE) => {
        initListCondition = initListCondition && initListCondition.toJS();
        let initData = initListCondition.data;
        let TITLE = initData ? initData.TITLE : '';
        if(TITLE && TITLE === DEFAULT_TITLE){
            initParams = this.initListConditionResult(initData, initParams);
        }
        return initParams;
    };

    initListConditionResult = (initData, initParams) => {
        let params = {};
        for(let key in initParams){
            if(typeof initData[key] === "boolean" || !!initData[key]){
                params[key] = initData[key];
            } else {
                params[key] = initParams[key];
            }
        }

        return params;
    };

    // 过滤对象的无效属性
    filterEmptyObjValue = (obj) => {
        if(obj.constructor !== Object) return false;
        let newObj = {};
        Object.keys(obj).forEach(function(key){
            if(obj[key]!==undefined && obj[key]!==''&& key!==undefined) {
                newObj[key] = obj[key];
            }
        });
        return newObj;
    };

    initFetchListCallback = (filterConfigList, condition) => {
        condition = this.filterEmptyObjValue(condition);
        filterConfigList = filterConfigList.map(item => {
            if(!!condition[item.fieldName]){
                item.defaultValue = condition[item.fieldName];
            } else if(item.type === 'datePicker') {
                if(!!condition[item.fieldName + 'Start']){
                    if(!item.defaultValue) item.defaultValue = [];
                    item.defaultValue[0] = moment(condition[item.fieldName + 'Start']);
                }
                if(!!condition[item.fieldName + 'End']){
                    if(!item.defaultValue) item.defaultValue = [];
                    item.defaultValue[1] = moment(condition[item.fieldName + 'End']);
                }
            } else if(item.type === 'custom') {
                if(!!condition['propValue']) item.propValue = condition['propValue'];
                if(!!condition['propMappingName']) item.defaultValue = condition['propMappingName'];
            } else if(item.type === 'interval') {
                if(!!condition[item.fieldName + 'Lower']){
                    if(!item.defaultValue) item.defaultValue = {};
                    item.defaultValue[item.fieldName + 'Lower'] = condition[item.fieldName + 'Lower'];
                }
                if(!!condition[item.fieldName + 'Upper']){
                    if(!item.defaultValue) item.defaultValue = {};
                    item.defaultValue[item.fieldName + 'Upper'] = condition[item.fieldName + 'Upper'];
                }
            }

            return item;
        });
        return filterConfigList;
    };

    componentWillUnmount() {
        if(this.batchUpdateConfig){
            this.batchUpdateConfig();
        }
    }

}
