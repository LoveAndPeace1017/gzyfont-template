import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import {Table} from "antd";
import {ResizeableTable} from 'components/business/resizeableTitle';
import {offset, closest} from 'utils/dom';
import * as constants from 'utils/constants';
const cx = classNames.bind(styles);

export default class ListModalTable extends Component {

    static defaultProps = {
        footerOpe: true,
        pagination: {
            size: "small"
        },
        paginationComponent: false,
        tableScrollHeight: 0
    };

    state = {
        tableTop: 0
    };

    prevScrollTop = 0;
    scrollDirect = '';

    //表格内容区的高度
    TABLE_SCROLL_HEIGHT = constants.MODAL_HEADER_HEIGHT + constants.MODAL_BODY_PADDING_BOTTOM + constants.MODAL_BODY_PADDING_TOP;

    /*tableScroll = () => {
        // ReactDOM.findDOMNode(this.tbInner);
        // const tbInner = ReactDOM.findDOMNode(this.tbInner);
        const modalWrapArr = document.querySelectorAll('.ant-modal-body');
        const modalWrap = modalWrapArr[modalWrapArr.length-1];
        const tableTop = offset(this.tbInner).top - offset(modalWrap).top;
        console.log('tableTop:'+tableTop);
        modalWrap.scrollTo(0, tableTop);
    };*/

    UNSAFE_componentWillMount() {
        const clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
        console.log(clientWidth);
        if(clientWidth < 1367){
            this.TABLE_SCROLL_HEIGHT = this.TABLE_SCROLL_HEIGHT + constants.MODAL_MARGIN_NARROW + constants.TABLE_HEADER_HEIGHT_NARROW;
        }else{
            this.TABLE_SCROLL_HEIGHT = this.TABLE_SCROLL_HEIGHT + constants.MODAL_MARGIN + constants.TABLE_HEADER_HEIGHT;
        }
        if(this.props.pagination || this.props.paginationComponent){
            this.TABLE_SCROLL_HEIGHT = this.TABLE_SCROLL_HEIGHT + constants.MODAL_PAGINATION_HEIGHT
        }
        if(this.props.footerOpe){
            this.TABLE_SCROLL_HEIGHT = this.TABLE_SCROLL_HEIGHT + constants.MODAL_FOOTER_HEIGHT
        }
        // if(this.props.tableScrollHeight){
        //     this.TABLE_SCROLL_HEIGHT = this.TABLE_SCROLL_HEIGHT - this.props.tableScrollHeight;
        // }
    }


    adjustTableSize = ()=>{
        const _this = this;
        this.scrollFlag = false;
        this.tbInnerDom = ReactDOM.findDOMNode(this.tbInner);
        this.contentWrap = closest(this.tbInnerDom, '.ant-modal-body').querySelector('div');
        this.tbInnerTop = offset(this.tbInner).top - offset(this.contentWrap).top;
        this.tableBody = this.tbInnerDom.querySelector('.ant-table-body');
        this.setState({
            tableTop: this.tbInnerTop
        });
        /*this.tableBody.addEventListener('scroll', function(){
            _this.scrollTb(this)
        }, false);*/

        this.contentWrap.addEventListener('transitionend', function(e){
            if(e.target === e.currentTarget) {
                if(_this.scrollFlag){
                    const tableBodyInners = _this.tbInnerDom.querySelectorAll('.ant-table-body-inner');
                    _this.scrollFlag = false;
                    _this.tableBody.style.transition = '';
                    tableBodyInners[0] && (tableBodyInners[0].style.transition = '');
                    tableBodyInners[1] && (tableBodyInners[1].style.transition = '');
                    _this.tbInnerDom.style.transition = '';
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
                _this.tbInnerTop = offset(_this.tbInner).top - offset(this.contentWrap).top;
                console.log(_this.tbInner,'_this.tbInner');
                console.log(offset(_this.tbInner).top,'offset(_this.tbInner).top');
                console.log(offset(this.contentWrap).top,'offset(this.contentWrap).top');
                const tH = `calc( 100vh - ${this.TABLE_SCROLL_HEIGHT}px)`;
                this.changeStyle(tH, -_this.tbInnerTop);
            }
            //向上滚动
            else if(/*_this.prevScrollTop - scrollTop > 0*/  direct === 'up' && this.scrollDirect !== 'up'){
                this.scrollFlag = true;
                this.scrollDirect = 'up';
                const tH = `calc( 100vh - ${this.TABLE_SCROLL_HEIGHT + _this.tbInnerTop}px)`;
                this.changeStyle(tH, 0);
            }
        }
        // _this.prevScrollTop = scrollTop;
    };

    changeStyle =(tH, tbInnerTop)=>{
        const tableBodyInners = this.tbInnerDom.querySelectorAll('.ant-table-body-inner');
        this.tableBody.style.transition = 'max-height 0.3s';
        this.tableBody.style.maxHeight = tH;
        tableBodyInners[0] && (tableBodyInners[0].style.transition = 'max-height 0.3s');
        tableBodyInners[0] && (tableBodyInners[0].style.maxHeight = tH);
        tableBodyInners[1] && (tableBodyInners[1].style.transition = 'max-height 0.3s');
        tableBodyInners[1] && (tableBodyInners[1].style.maxHeight = tH);
        this.contentWrap.style.transition = 'margin-top  0.3s';
        console.log(tbInnerTop,'tbInnerTop');
        //暂时为了解决页面同时调用了2个当前组件而引发的this.tbInner指向不定的问题。
        if(tbInnerTop>=-100 && tbInnerTop<=100){
            this.contentWrap.style.marginTop = tbInnerTop + 'px';
        }
    };

    handleWheel=(e)=>{
        console.log('e.deltaY', e.deltaY);
        const direct = e.deltaY > 0?'down':'up';
        this.scrollTb(direct)
    };

    componentDidMount() {
        const _this = this;
        this.adjustTableSize();
        window.onload = function(){
            _this.setState({
                tableTop:  offset(_this.tbInner).top - offset(this.contentWrap).top
            });
        };
    }

    componentWillUnmount() {
        const _this = this;
        const tableBody = this.tbInnerDom.querySelector('.ant-table-body');
        tableBody.removeEventListener('scroll', function(){
            _this.scrollTb(this);
        });
        this.contentWrap.style.marginTop = 0;
    }

    render() {

        return (
            <div className="tb-inner" ref={(ref) => this.tbInner = ref} onWheel={this.handleWheel}>
                {
                    !!this.props.isNeedDrag ? (
                        <ResizeableTable
                            {...this.props}
                            scroll={{y: `calc(100vh - ${this.TABLE_SCROLL_HEIGHT + this.state.tableTop}px)`}}
                        />
                    ) : (
                        <Table {...this.props}
                               scroll={{y: `calc(100vh - ${this.TABLE_SCROLL_HEIGHT + this.state.tableTop}px)`}}
                        >{this.props.children}</Table>
                    )
                }
            </div>
        )
    }
}