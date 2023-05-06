import React from 'react';
import intl from 'react-intl-universal';
import {Table} from 'antd';
import { Resizable } from 'react-resizable';
import {offset} from 'utils/dom';
import * as constants from 'utils/constants';
import PropTypes from 'prop-types';
import '../styles/index.scss';
import {setTbOffsetTop} from '../actions'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {fromJS, is} from 'immutable'
import {formatCurrency} from 'utils/format';

const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            handle={<span className={`react-resizable-handle react-resizable-handle-se`} onClick={(e)=>e.stopPropagation()}/>}
            // onClick={(e)=>e.stopPropagation()}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

//默认表格单元格宽度（相当于其最小宽度）
const DEFAULT_TABLE_COL_WIDTH = 150;

const BOTTOM_FIXED = 64;
const BOTTOM_FIXED_NARROW = 48;

/**
 * 缓动函数
 * @param t 动画已消耗时间
 * @param b 原始值
 * @param c 目标值
 * @param d 持续时间
 */
function sineaseOut (t, b, c, d) {
    return c * ( ( t = t / d - 1) * t * t + 1 ) + b
}



/**
 * 列表页表格
 *
 * @visibleName ListTable（列表页表格）
 * @author guozhaodong
 */
class ListTable extends React.Component {

    static propTypes = {
        operationColumn: PropTypes.shape({
            title: PropTypes.string,
            key: PropTypes.string,
            dataIndex: PropTypes.string,
            fixed:  PropTypes.oneOf(['center', 'left', 'right']),
            className: PropTypes.string,
            width: PropTypes.number
        })
    };

    static defaultProps = {
        pagination: false
    };

    constructor(props) {
        super(props);
        this.state = {
            tableTop: 0,
            columns:[],
            displayColumnsLength:0,
            isChanged:false,
        }
    }

    prevScrollTop = 0;
    scrollDirect = '';

    exceptTableScrollHeight = constants.HEADER_HEIGHT  + 10;

    UNSAFE_componentWillMount() {
        //小屏高度重新计算
        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
        console.log(clientWidth);
        if(clientWidth < 1367){
            this.exceptTableScrollHeight = this.exceptTableScrollHeight + constants.TABLE_HEADER_HEIGHT_NARROW + BOTTOM_FIXED_NARROW;
        }else{
            this.exceptTableScrollHeight = this.exceptTableScrollHeight + constants.TABLE_HEADER_HEIGHT + BOTTOM_FIXED;
        }
    }

    adjustTableSize = ()=>{
        const _this = this;
        this.scrollFlag = false;
        _this.tbInnerTop = offset(_this.tbInner).top - 60;
        _this.props.setTbOffsetTop(_this.tbInnerTop);
        const contentWrap = document.getElementById('contentWrap');
        this.contentContainer = contentWrap.querySelector('.content-container');
        this.tableBody = document.querySelector('.tb-inner .ant-table-body');

        /*this.tableBody.addEventListener('scroll', function(){
            _this.scrollTb(this)
        }, false);*/

        this.contentContainer.addEventListener('transitionend', function(e){
            if(e.target === e.currentTarget) {
                if(_this.scrollFlag){
                    const tableBodyInners = document.querySelectorAll('.tb-inner .ant-table-body-inner');
                    _this.scrollFlag = false;
                    _this.tableBody.style.transition = '';
                    tableBodyInners[0] && (tableBodyInners[0].style.transition = '');
                    tableBodyInners[1] && (tableBodyInners[1].style.transition = '');
                    _this.contentContainer.style.transition = '';
                    console.log('transitionend')
                }

            }
        }, false);
    };

    scrollTb=(direct)=>{
        const _this = this;
        // const scrollTop = obj.scrollTop;
        if(!this.scrollFlag){
            //向下滚动
            if(/*scrollTop - _this.prevScrollTop > 0*/ direct === 'down' && this.scrollDirect !== 'down'){
                this.scrollFlag = true;
                this.scrollDirect = 'down';
                _this.tbInnerTop = offset(_this.tbInner).top - 60;
                const tH = `calc( 100vh - ${this.exceptTableScrollHeight}px)`;
                this.changeStyle(tH, -_this.tbInnerTop);
            }
            //向上滚动
            else if(/*_this.prevScrollTop - scrollTop > 0*/  direct === 'up' && this.scrollDirect !== 'up'){
                this.scrollFlag = true;
                this.scrollDirect = 'up';
                const tH = `calc( 100vh - ${this.exceptTableScrollHeight + _this.tbInnerTop}px)`;
                this.changeStyle(tH, 0);
            }
        }
        // _this.prevScrollTop = scrollTop;
    };

    changeStyle =(tH, tbInnerTop)=>{
        const tableBodyInners = document.querySelectorAll('.tb-inner .ant-table-body-inner');
        this.tableBody.style.transition = 'max-height 0.3s';
        this.tableBody.style.maxHeight = tH;
        tableBodyInners[0] && (tableBodyInners[0].style.transition = 'max-height 0.3s');
        tableBodyInners[0] && (tableBodyInners[0].style.maxHeight = tH);
        tableBodyInners[1] && (tableBodyInners[1].style.transition = 'max-height 0.3s');
        tableBodyInners[1] && (tableBodyInners[1].style.maxHeight = tH);
        this.contentContainer.style.transition = 'margin-top  0.3s';
        this.contentContainer.style.marginTop = tbInnerTop + 'px';
    };

    handleWheel=(e)=>{
        console.log('e.deltaY', e.deltaY);
        const direct = e.deltaY > 0?'down':'up';
        this.scrollTb(direct)
    };

    componentDidMount() {
        const _this = this;
        this.props.getRef && this.props.getRef(this);
        this.adjustTableSize();
        window.onload = function(){
            /*_this.setState({
                tableTop:  offset(_this.tbInner).top - 60
            });*/
            _this.props.setTbOffsetTop(offset(_this.tbInner).top - 60);
        };
    }

    componentWillUnmount() {
        const _this = this;
        const tableBody = document.querySelector('.tb-inner .ant-table-body');
        tableBody && tableBody.removeEventListener('scroll', function(){
            _this.scrollTb(this);
        });
        this.contentContainer.style.transition = '';
        this.contentContainer.style.marginTop = 0;
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps.columns, this.props.columns, 'columns;');
        if(!is(fromJS(nextProps.columns),fromJS(this.props.columns))){
            this.setState({
                columns:nextProps.columns
            });
        }
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };
    handleResize = index => (e, { size }) => {
        e.stopPropagation();
        let {columns} = this.state;
        if(columns&&columns[index]){
            columns[index].width = size.width;
            this.setState({
                columns,
                isChanged:true
            });
        }
    };

    transformDataFormat = ()=>{
        let {columns} = this.state;
        let map = {};
        columns.forEach((item)=>{
            map[item.dataIndex] = item.width;
        });
        return {
            map,
            isColumnsWidthChanged:this.state.isChanged
        };
    };


    render() {

        //rowSelection
        const rowSelection = this.props.rowSelection? {
            ...{
                fixed: 'left',
                columnWidth: constants.TABLE_COL_WIDTH.SELECTION,
            },
            ...this.props.rowSelection
        }: null;

        let len = this.state.columns.length;
        let columns = this.state.columns.map((col, index) => {
            let ret = {
                ...col
            };
            if(ret.dataIndex.indexOf("property_value") == -1 && ret.dataIndex.indexOf("propertyValue") == -1 && ret.dataIndex.indexOf("prodPropertyValue") == -1 && ret.dataIndex.indexOf("SupplierPropValue") == -1 && ret.dataIndex.indexOf("supplierPropertyValue") == -1 && ret.dataIndex.indexOf("salePropertyValue") == -1 && ret.dataIndex.indexOf("customerPropValue") == -1 && ret.dataIndex.indexOf("orderPropertyValue") == -1 && ret.dataIndex.indexOf("enterPropertyValue") == -1 && ret.dataIndex.indexOf("orderProdPropertyValue") == -1 && ret.dataIndex.indexOf("saleProdPropertyValue") == -1 && ret.dataIndex.indexOf("outPropertyValue") == -1 && ret.dataIndex.indexOf("inStorageProdPropertyValue") == -1 && ret.dataIndex.indexOf("outStorageProdPropertyValue") == -1 && ret.dataIndex.indexOf("purchasePropertyValue") == -1 && ret.dataIndex.indexOf("salePropertyValue") == -1  && ret.dataIndex.indexOf("item_property_value") == -1 && ret.dataIndex.indexOf("warehouse-") == -1){
                ret.title = intl.get(ret.title);
            }

            if(index==len-1) {
                delete ret.width;
            }else {
                ret.onHeaderCell = column => ({
                    width: index==len-1?null:column.width,
                    onResize: this.handleResize(index),
                });
            }
            return ret;
        });


        //序号列
        const serialColumn = [
            {
                title: intl.get("components.listTable.index.serial"),
                dataIndex: 'serial',
                key: 'serial',
                className: 'ant-table-selection-column',
                width: constants.TABLE_COL_WIDTH.SERIAL
            }
        ];

        //操作列
        const operationColumn = this.props.operationColumn?[{
            ...{
                title: intl.get("components.listTable.index.operation"),
                key: 'operation',
                dataIndex: 'operation',
                fixed: 'right',
                className: 'ant-table-selection-column',
                width: constants.TABLE_COL_WIDTH.OPERATION
            },
            ...this.props.operationColumn
        }]:[];

        if(columns.length>0){
            columns = serialColumn.concat(columns, operationColumn);
        }


        //涉及到金额、价格字段右对齐，
        //金额：居右 加粗，默认保留两位小数，加千分符显示
        //数量：居右，若非小数则不显示小数位，最多显示三位小数，加千分符显示
        const priceGroup = ['aggregateAmount', 'taxAllAmount', 'discountAmount', 'payAmount', 'invoiceAmount','orderPrice','salePrice','amount','unitPrice','damount'];
        columns.map(item => {
            if(item.columnType === 'decimal-money'){
                item.className = 'column-money';
                item.render=(content) => (<span className="txt-clip" title={content}><strong>{content}</strong></span>)
            } else if(item.columnType === 'decimal-quantity') {
                item.className = 'column-quantity';
                item.render=(content) => (<span className="txt-clip" title={content}>{content}</span>)
            }else if(item.columnType === 'money' || priceGroup.indexOf(item.dataIndex) !== -1){ //后面的这个priceGroup是一开始加的，没删除它
                item.className = 'column-money';
                if(item.dataIndex === 'orderPrice' || item.dataIndex === 'salePrice'){
                    item.render=(content) => (<span className="txt-clip" title={formatCurrency(content, 3)}><strong>{formatCurrency(content, 3)}</strong></span>)
                } else {
                    item.render=(content) => (<span className="txt-clip" title={formatCurrency(content)}><strong>{formatCurrency(content)}</strong></span>)
                }
            }else if(item.columnType === 'quantity'){
                item.className = 'column-quantity';
                item.render=(content) => (<span className="txt-clip" title={formatCurrency(content, 3, true)}>{formatCurrency(content, 3, true)}</span>)
            }
            return item;
        });

        const tableWidth = columns.reduce(function(width, item) {
            return width + (item.width ? item.width : DEFAULT_TABLE_COL_WIDTH) / 1;
        }, rowSelection? rowSelection.columnWidth : 0);
        
        console.log(columns, 'columns');
        
        return (
            <div className={this.props.className?this.props.className+" tb-inner":"tb-inner"} onWheel={this.handleWheel}  ref={(ref) => this.tbInner = ref}>
                <Table columns={columns.length>0?columns:[]}
                               dataSource={this.props.dataSource}
                               pagination={this.props.pagination}
                               size={"small"}
                               rowSelection={this.props.dataSource.length>0?rowSelection:null}
                               scroll={{x: tableWidth, y: `calc( 100vh - ${this.exceptTableScrollHeight + this.props.tbOffsetTop.get('offsetTop')}px)`}}
                               loading={this.props.loading}
                               locale={this.props.locale}
                               onChange={this.props.onChange}
                               components={this.components}
                />
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    tbOffsetTop: state.getIn(['listTable', 'tbOffsetTop'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        setTbOffsetTop
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(ListTable)
