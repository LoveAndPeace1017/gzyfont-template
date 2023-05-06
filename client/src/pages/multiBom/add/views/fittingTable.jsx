import React, {Component} from 'react';
import _ from 'lodash';
import {getCookie} from 'utils/cookie';
import { Input, Table, Form } from 'antd';
import {PlusOutlined,MinusOutlined} from '@ant-design/icons';
import SelectGoodsOrFitting from 'components/business/goodsPop';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

/**
 * 配件表格
 * @visibleName fittingTable（配件table）
 * @author jinb
 */
export default class FittingTable extends Component {
    constructor(props) {
        super(props);
        this.dataPrefix = this.props.dataPrefix;
        this.state = {
            renderFlag: true,
            currentKey: 0,
            fittingList: [{key: 0}],
            goodsPopVisible: false,
            selectedRows: []
        };
    }

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    closeModal = (tag) => {
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };
    openModal = (tag) => {
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };

    // 找寻table中可以使用的空白行
    findEmptyPosition = (key) => {
        let outKeyGroup = [];
        let {fittingList} = this.state;
        let { getFieldValue } = this.props.formRef.current;
        let dataSource = getFieldValue([this.dataPrefix]);
        _.forEach(fittingList, (list) => {
            if(!dataSource || !dataSource[list.key] || !dataSource[list.key][key])
                outKeyGroup.push(list.key);
        });
        return outKeyGroup;
    };
    
    // 当插入的物品信息超过table的长度时，需要创建新的空白行
    buildNewRow = (len, callback) => {
        let outKeyGroup = [];
        let {fittingList, currentKey} = this.state;
        let newFittingList = _.cloneDeep(fittingList);
        while(len > 0){
            outKeyGroup.push(++currentKey);
            newFittingList.push({key: currentKey});
            len--;
        }
        this.setState({fittingList: newFittingList, currentKey}, () => {
            callback && callback(outKeyGroup);
        })
    };

    /**
     *
     * @param keyArray
     * @param valueArray
     * valueArray 为null或者不传 表示删除
     */
    setFormFields = (keyArray, valueArray) => {
        let idx = 0;
        let len = keyArray.length;
        while(idx < len){
            let key = keyArray[idx];
            let value = valueArray ? valueArray[idx] : null;
            this.setFormField(key, value);
            idx++;
        }
    };

    setFormField = (key, value) => {
        let { getFieldValue, setFieldsValue } = this.props.formRef.current;
        let preItem = getFieldValue([this.dataPrefix, key]);
        let newItem = value ? {...preItem, ...value} : null;
        setFieldsValue({[this.dataPrefix]: {[key]: newItem}});
    };

    // 将表单数据转换为数组
    formToArray = () => {
        let array = [];
        let { getFieldValue } = this.props.formRef.current;
        let dataSource = getFieldValue([this.dataPrefix]);
        _.forIn(dataSource, function(value, key) {
            if(!!value)
                array.push({...value, key});
        });
        return array;
    };

    // 删除多余行
    removeExtraRow = (surplusKeyArray) => {
        let {fittingList} = this.state;
        let newFittingList = _.cloneDeep(fittingList);
        newFittingList = _.filter(newFittingList, item => _.indexOf(surplusKeyArray, item.key)===-1);
        this.setState({fittingList: newFittingList});
    };

    findNewAndExistListByKey = (listArray, formArray, key) => {
        let addList = [], sameList = [];
        _.forEach(listArray, (list) => {
            let sLi = _.filter(formArray, (o) => o[key]===list[key]);
            if(sLi && sLi.length > 0){
                sameList.push({...sLi[0], ...list});
            } else {
                addList.push(list);
            }
        });
        return [addList, sameList];
    };

    fillList = (listArray, key) => {
        if(!listArray || listArray.length === 0) return;
        let formArray = this.formToArray();
        let [addList, sameList] = this.findNewAndExistListByKey(listArray, formArray, key);
        let removeList = _.differenceBy(formArray, sameList, key);
        // 当弹层中的列表数据已经在表格中存在时，只需要替换变化的数据即可
        this.setFormFields(_.map(sameList, o=>o.key), sameList);
        // 删除列表中原有的重复列
        this.setFormFields(_.map(removeList, o=>o.key), null);
        // 查找列表中的空白行
        let emptyKeyArray = this.findEmptyPosition(key);

        let addLen = addList.length,
            emptyLen = emptyKeyArray.length;
        // 如果新增的列表长度大于空白行的列表长度
        if(addLen > 0 && addLen > emptyLen){
            let len = addLen - emptyLen;
            // 如果新增的列表长度大于空白行的列表长度，需要重新创建空白行
            this.buildNewRow(len, (newKeyGroup) => {
                let keyGroup = emptyKeyArray.concat(newKeyGroup);
                // 新增完成后回填数据
                this.setFormFields(keyGroup, addList);
            })
        }
        // 如果新增的列表长度小于空白行的列表长度
        if(addLen > 0 && addLen <= emptyLen){
            this.setFormFields(emptyKeyArray, addList);
        }
        // 删除多余行
        if(!addLen || emptyLen > addLen){
            let surplusKeyArray = emptyKeyArray.slice((addLen || 0), emptyLen);
            this.removeExtraRow(surplusKeyArray);
        }
    };

    onOk = (selectedRows, visibleKey) => {
        console.log(selectedRows, 'selectedRows');
        this.closeModal(visibleKey);
        const prodList = selectedRows.map(item => {
            return {
                prodNo: item.code || item.productCode,
                displayCode: item.displayCode || item.prodCustomNo,
                prodName: item.name || item.prodName,
                unit: item.unit,
                brand: item.brand,
                descItem: item.description || item.descItem,
                proBarCode: item.proBarCode,
                produceModel: item.produceModel,
                quantity: item.quantity
            }
        });
        this.fillList(prodList, 'prodNo');
    };

    // 添加行
    addOneRow = (index) => {
        let {fittingList, currentKey} = this.state;
        let newFittingList = _.cloneDeep(fittingList);
        newFittingList.splice(index+1, 0, {key: ++currentKey});
        this.setState({currentKey, fittingList: newFittingList});
    };

    // 删除行
    removeOneRow = (key) => {
        let {fittingList} = this.state;
        let newFittingList  = fittingList.filter(item => item.key !== key);
        this.setState({fittingList: newFittingList}, () => {
            // 清楚当前行form中的数据
            this.setFormField(key, null);
        });
    };

    getExistRows = () => {
        let array = [];
        let { getFieldValue } = this.props.formRef.current;
        let dataSource = getFieldValue([this.dataPrefix]);
        _.forIn(dataSource, function(value) {
            if(!!value)
                array.push({
                    key: value.prodNo,
                    productCode: value.prodNo,
                    name: value.prodName,
                    displayCode: value.displayCode,
                    unit: value.unit,
                    brand: value.brand,
                    descItem: value.descItem,
                    produceModel: value.produceModel,
                    quantity: value.quantity
                });
        });
        return array;
    };

    render() {
        let {tags} = this.props;
        let {fittingList} = this.state;
        let selectedRows = this.getExistRows() || [];
        let selectedRowKeys = _.map(selectedRows, item => item.key);
        let quantityDecimalNum = getCookie("quantityDecimalNum");

        let columns = [
            {
                title: '',
                key: 'ope',
                dataIndex: 'ope',
                width: 60,
                render: (value, record, index) => {
                    return (
                        <React.Fragment>
                            <a href="#!" className={cx('add-item')} onClick={() => this.addOneRow(index)}>
                                <PlusOutlined style={{fontSize: "16px"}}/>
                            </a>
                            {
                                fittingList.length > 1 ? (
                                    <a href="#!" className={cx('delete-item')} onClick={() => this.removeOneRow(record.key)}>
                                        <MinusOutlined style={{fontSize: "16px"}}/>
                                    </a>
                                ) : null
                            }
                            <div style={{display:"none"}}>
                                <Form.Item name={[this.dataPrefix, record.key, 'prodNo']}>
                                    <Input type="hidden"/>
                                </Form.Item>
                                <Form.Item
                                    name={[this.dataPrefix, record.key, 'recId']}
                                >
                                    <Input type="hidden"/>
                                </Form.Item>
                            </div>
                        </React.Fragment>
                    )
                }
            }, {
                title: '序号',
                dataIndex: 'serial',
                key: 'serial',
                width: 50,
                align: 'center',
                render: (text, record, index) => index + 1
            }, {
                title: '物品编号',
                dataIndex: 'displayCode',
                key: 'displayCode',
                width: 150,
                readOnly: true
            }, {
                title: '物品名称',
                dataIndex: 'prodName',
                key: 'prodName',
                width: 250,
                readOnly: true
            }, {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                width: 100,
                readOnly: true
            }, {
                title: '品牌',
                dataIndex: 'brand',
                key: 'brand',
                width: 250,
                readOnly: true
            },{
                title: '规格型号',
                dataIndex: 'descItem',
                key: 'descItem',
                width: 250,
                readOnly: true
            },{
                title: '制造商型号',
                dataIndex: 'produceModel',
                key: 'produceModel',
                width: 250,
                readOnly: true
            }, {
                title: "配件数量",
                dataIndex: 'quantity',
                key: 'quantity',
                width: 250,
                required: true,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'quantity']}
                            rules={[
                                { required: true,message: "该项为必填项"},
                                {
                                    validator: (rules, value, callback) => {
                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                        if (value && (Number.isNaN(value) || !reg.test(value))) {
                                            callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input maxLength={14}/>
                        </Form.Item>
                    )
                }
            }, {
                title: "损耗率",
                dataIndex: 'lossRate',
                key: 'lossRate',
                width: 150,
                render: (text, record, index)=> {
                    return (
                        <Form.Item
                            name={[this.dataPrefix, record.key, 'lossRate']}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        const reg = /^(1|(0\d{0,9})(\.\d{1,4})?)$/;
                                        if (value && (Number.isNaN(value) || !reg.test(value))) {
                                            callback("必须为0~1之间的四位小数");
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input maxLength={6}/>
                        </Form.Item>
                    )
                }
            }
        ];

        // 自定义字段
        columns = columns.concat(_.map(tags, tag => {
            return {
                title: tag.propName,
                dataIndex: tag.propValue,
                key: tag.propValue,
                width: 200,
                maxLength: 1000
            }
        }));

        columns = columns.concat([
            {
                title: '',
                key: 'footer',
                dataIndex: 'footer',
                fixed: 'right',
                width: 110,
                render: () => {
                    return (
                        <React.Fragment>
                            <a href="#!" className={cx('add-item')} style={{'marginLeft': '20px'}}
                               onClick={() => this.openModal('goodsPopVisible')} >选择物品</a>
                        </React.Fragment>
                    )
                }
            }
        ]);

        columns = columns.map(item => {
            return {
                ...item,
                title: () => {
                    return (
                        <React.Fragment>
                            {
                                item.required ? (<span className="required">*</span>) : null
                            }
                            {item.title}
                        </React.Fragment>
                    )
                },
                align: item.align || 'left',
                render: (text, record, index) => {
                    let componentStr, inputProps = {};
                    if (item.render) {
                        componentStr = item.render(text, record, index);
                    } else {
                        if (item.readOnly) {
                            inputProps = {
                                className: cx("readOnly"),
                                readOnly: true,
                                title: text,
                                style: {"textAlign": item.align}
                            }
                        }
                        inputProps.maxLength = item.maxLength || 1000;
                        if(item.hidden){
                            componentStr = <Input {...inputProps} stype={{"display": "none"}}/>
                        } else {
                            componentStr = <Input {...inputProps}/>
                        }
                    }
                    return (
                        <React.Fragment>
                            <Form.Item name={[this.dataPrefix, record.key, item.key]}>
                                {componentStr}
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            };
        });

        const tableWidth = columns.reduce(function(width, item) {
            return width + (item.width !== undefined ? item.width : 200) / 1;
        }, 0);

        return (
            <React.Fragment>
                <Table
                    bordered
                    dataSource={fittingList}
                    pagination={false}
                    columns={columns}
                    className={cx(["goods-table", "fitting-table"])}
                    scroll={{x: tableWidth}}
                />

                <SelectGoodsOrFitting
                    visible={this.state.goodsPopVisible}
                    visibleFlag={'goodsPopVisible'}
                    onOk={this.onOk}
                    onCancel={() => this.closeModal('goodsPopVisible')}
                    selectType={"checkbox"}
                    popType={'goods'}
                    condition={{disableFlag: 0}}
                    editFields={[{
                        dataIndex:'quantity',
                        editable:true,
                        title: '配件数量',
                        width: 110
                    }]}
                    selectedRowKeys={selectedRowKeys}
                    selectedRows={selectedRows}
                />
            </React.Fragment>
        )
    }
}
