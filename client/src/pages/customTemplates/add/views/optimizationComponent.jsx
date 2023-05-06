import React, {Component} from 'react';
import {tablekeyToCnName} from "./templateDictionaries";
import {
    Col,
    Row,
    message,
    Select,
    Radio,
    Table,
    Checkbox,
    Input,
    Button,
    Modal,
    InputNumber,
} from 'antd';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { MenuOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import arrayMove from 'array-move';
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

export default class OptimizationComponent extends Component {

    //拖拽需要的方法
    onSortEnd = ({ oldIndex, newIndex }) => {
        const { dataSource } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(dataSource), oldIndex, newIndex).filter(el => !!el);
            //在排序结束后,需要处理模板里的排序方式
            //优先处理tableObj对象，改变tableObj的顺序
            let tableObj = this.state.tableObj;
            let tabObjAry = [];
            for(let key in tableObj){
                tabObjAry.push(key);
            }
            let moveStr = tabObjAry[oldIndex];
            tabObjAry.splice(oldIndex,1);
            tabObjAry.splice(newIndex,0,moveStr);
            let newtableObj = {};
            for(let i=0;i<tabObjAry.length;i++){
                newtableObj[tabObjAry[i]] = tableObj[tabObjAry[i]]
            }
            //获取富文本document对象，对dom顺序进行处理
            let newDocument = this.prodDescRef.tinyMceEditor.contentDocument;
            let tableDom = newDocument.getElementById('template-tables');
            //获取到第一列的th集合
            let row1 = tableDom.rows[0].cells;
            let row2 = tableDom.rows[1].cells;
            let th1Obj = {};
            let th2Obj = {};
            for(let j=0;j<row1.length;j++){
                let key = row1[j].id.split('-')[1];
                th1Obj[key] = row1[j].outerHTML;
                th2Obj[key] = row2[j].outerHTML;
            }
            //遍历处理排序后的html
            let sortTabHtmlStr = '';
            let sortTabHtmlStr1 = '';
            for(let n=0;n<tabObjAry.length;n++){
                if(th1Obj[tabObjAry[n]]){
                    sortTabHtmlStr = sortTabHtmlStr + th1Obj[tabObjAry[n]];
                    sortTabHtmlStr1 = sortTabHtmlStr1 + th2Obj[tabObjAry[n]];
                }
            }
            let fullHtml = `<tbody><tr>${sortTabHtmlStr}</tr><tr>${sortTabHtmlStr1}</tr></tbody>`;
            tableDom.innerHTML = fullHtml;
            this.prodDescRef.state.content = this.prodDescRef.tinyMceEditor.getContent();
            this.setState({ dataSource: newData,tableObj:newtableObj});
        }
    };

    //拖拽需要的方法1
    onSortEnd1 = ({ oldIndex, newIndex }) => {
        const { dataSource1 } = this.state;
        if (oldIndex !== newIndex) {
            const newData = arrayMove([].concat(dataSource1), oldIndex, newIndex).filter(el => !!el);
            //在排序结束后,需要处理模板里的排序方式
            //优先处理tableObj对象，改变tableObj的顺序
            let tableObj = this.state.tableObj1;
            let tabObjAry = [];
            for(let key in tableObj){
                tabObjAry.push(key);
            }
            let moveStr = tabObjAry[oldIndex];
            tabObjAry.splice(oldIndex,1);
            tabObjAry.splice(newIndex,0,moveStr);
            let newtableObj = {};
            for(let i=0;i<tabObjAry.length;i++){
                newtableObj[tabObjAry[i]] = tableObj[tabObjAry[i]]
            }
            //获取富文本document对象，对dom顺序进行处理
            let newDocument = this.prodDescRef.tinyMceEditor.contentDocument;
            let tableDom = newDocument.getElementById('template-tables1');
            //获取到第一列的th集合
            let row1 = tableDom.rows[0].cells;
            let row2 = tableDom.rows[1].cells;
            let th1Obj = {};
            let th2Obj = {};
            for(let j=0;j<row1.length;j++){
                let key = row1[j].id.split('-')[1];
                th1Obj[key] = row1[j].outerHTML;
                th2Obj[key] = row2[j].outerHTML;
            }
            //遍历处理排序后的html
            let sortTabHtmlStr = '';
            let sortTabHtmlStr1 = '';
            for(let n=0;n<tabObjAry.length;n++){
                if(th1Obj[tabObjAry[n]]){
                    sortTabHtmlStr = sortTabHtmlStr + th1Obj[tabObjAry[n]];
                    sortTabHtmlStr1 = sortTabHtmlStr1 + th2Obj[tabObjAry[n]];
                }
            }
            let fullHtml = `<tbody><tr>${sortTabHtmlStr}</tr><tr>${sortTabHtmlStr1}</tr></tbody>`;
            tableDom.innerHTML = fullHtml;
            this.prodDescRef.state.content = this.prodDescRef.tinyMceEditor.getContent();
            this.setState({ dataSource1: newData,tableObj1:newtableObj});
        }
    };

    DraggableContainer = props => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={this.onSortEnd}
            {...props}
        />
    );

    DraggableContainer1 = props => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={this.onSortEnd1}
            {...props}
        />
    );

    DraggableBodyRow = ({ className, style, ...restProps }) => {
        const { dataSource } = this.state;
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = dataSource.findIndex(x => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    DraggableBodyRow1 = ({ className, style, ...restProps }) => {
        const { dataSource1 } = this.state;
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = dataSource1.findIndex(x => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };


    //处理tab的显示和隐藏
    changeTab = (e)=>{
        let key = e.target.value;
        let flag = e.target.checked;
        let tableObj = this.state.tableObj;
        tableObj[key] = flag;
        this.setState({tableObj:tableObj,formHasChanged:true});
        if(key == 'allAmount'||key == 'allPrice'){
            return false;
        }
        //处理dom
        let newDocument = this.prodDescRef.tinyMceEditor.contentDocument;//document.getElementById('tincyEditor_ifr').contentWindow.document;
        let dom1 = newDocument.getElementById(`ts1-${key}`);
        let dom2 = newDocument.getElementById(`ts2-${key}`);

        let deleteTabFlag = this.prodDescRef.tinyMceEditor.getContent().indexOf('id="template-tables"') !== -1;
        if(deleteTabFlag){
            if(dom1 && dom2){
                if(flag){
                    dom1.style.display = '';
                    dom1.style.width = '3%';
                    dom2.style.display = '';
                    dom2.style.width = '3%';
                    //更改富文本特有属性，优化页面特性
                    dom1.setAttribute('data-mce-style','text-align: center;font-weight: normal;width: 3%;display:""');
                    dom2.setAttribute('data-mce-style','text-align: center;font-weight: normal;width: 3%;display:""');
                }else{
                    dom1.style.display = 'none';
                    dom2.style.display = 'none';
                    dom1.setAttribute('data-mce-style','text-align: center;font-weight: normal;display: none;');
                    dom2.setAttribute('data-mce-style','text-align: center;font-weight: normal;display: none;');
                }
                this.prodDescRef.state.content = this.prodDescRef.tinyMceEditor.getContent();
            }else{
                //需要自定义手动拼装table数据
                let getHasShowTab = [];
                for(let key in tableObj){
                    if(tableObj[key]){
                        getHasShowTab.push(key)
                    }
                }
                //获取目标添加元素位置
                let upIndexKey = getHasShowTab.indexOf(key);
                //如果目标元素后面存在元素，使用insertBefore方法，否则使用appendChild
                let useInsert = !!getHasShowTab[upIndexKey+1];
                //needAppendKey用于获取当前元素发父级元素
                let needAppendKey = useInsert?getHasShowTab[upIndexKey+1]:getHasShowTab[upIndexKey-1];
                //用于获取自定义字段中文名称
                let DictionariesTable = (this.state.templateType === 'ProduceOrder'||this.state.templateType === 'Subcontract')?this.getDictionaries().productTable:this.getDictionaries().table;
                let dictionariesKeyToName = {};
                DictionariesTable.map((item)=>{
                    dictionariesKeyToName[item.key] = item.name;
                });

                //第一个th
                let addDom1 = newDocument.getElementById(`ts1-${needAppendKey}`);
                let addDom1Paraent = addDom1.parentNode;
                let createTh = newDocument.createElement("th");//新建标签元素
                createTh.id = `ts1-${key}`;
                createTh.innerText = tablekeyToCnName[key]||dictionariesKeyToName[key] ||'自定义字段';
                //设置样式
                createTh.setAttribute('style','text-align: center;font-weight: normal;width: 3%;display:""');
                useInsert?addDom1Paraent.insertBefore(createTh,addDom1):addDom1Paraent.appendChild(createTh);
                //第二个th
                let addDom2 = newDocument.getElementById(`ts2-${needAppendKey}`);
                let addDom2Paraent = addDom2.parentNode;
                let createTh2 = newDocument.createElement("th");//新建标签元素
                createTh2.id = `ts2-${key}`;
                createTh2.innerText = `{${tablekeyToCnName[key]||dictionariesKeyToName[key] ||'自定义字段'}}`;
                createTh2.setAttribute('style','text-align: center;font-weight: normal;width: 3%;display:""');
                useInsert?addDom2Paraent.insertBefore(createTh2,addDom2):addDom2Paraent.appendChild(createTh2);

                this.prodDescRef.state.content = this.prodDescRef.tinyMceEditor.getContent();

            }
        }else{
            message.error('表格已被删除，显示字段并不会在打印页面显示！');
        }

    }

    //处理第二个Tab的显示隐藏
    changeTab1 = (e)=>{
        let key = e.target.value;
        let flag = e.target.checked;
        let tableObj1 = this.state.tableObj1;
        tableObj1[key] = flag;
        this.setState({tableObj1,formHasChanged:true});
        if(key == 'allAmount'||key == 'allPrice'){
            return false;
        }
        //处理dom
        let newDocument = this.prodDescRef.tinyMceEditor.contentDocument;//document.getElementById('tincyEditor_ifr').contentWindow.document;
        let dom1 = newDocument.getElementById(`ts11-${key}`);
        let dom2 = newDocument.getElementById(`ts22-${key}`);

        let deleteTabFlag = this.prodDescRef.tinyMceEditor.getContent().indexOf('id="template-tables1"')!==-1;
        if(deleteTabFlag){
            if(dom1 && dom2){
                if(flag){
                    dom1.style.display = '';
                    dom1.style.width = '3%';
                    dom2.style.display = '';
                    dom2.style.width = '3%';
                    //更改富文本特有属性，优化页面特性
                    dom1.setAttribute('data-mce-style','text-align: center;font-weight: normal;width: 3%;display:""');
                    dom2.setAttribute('data-mce-style','text-align: center;font-weight: normal;width: 3%;display:""');
                }else{
                    dom1.style.display = 'none';
                    dom2.style.display = 'none';
                    dom1.setAttribute('data-mce-style','text-align: center;font-weight: normal;display: none;');
                    dom2.setAttribute('data-mce-style','text-align: center;font-weight: normal;display: none;');
                }
                this.prodDescRef.state.content = this.prodDescRef.tinyMceEditor.getContent();
            }else{
                //需要自定义手动拼装table数据
                let getHasShowTab = [];
                for(let key in tableObj1){
                    if(tableObj1[key]){
                        getHasShowTab.push(key)
                    }
                }

                //获取目标添加元素位置
                let upIndexKey = getHasShowTab.indexOf(key);
                //如果目标元素后面存在元素，使用insertBefore方法，否则使用appendChild
                let useInsert = !!getHasShowTab[upIndexKey+1];
                //needAppendKey用于获取当前元素发父级元素
                let needAppendKey = useInsert?getHasShowTab[upIndexKey+1]:getHasShowTab[upIndexKey-1];
                //用于获取自定义字段中文名称
                let DictionariesTable = this.getDictionaries().materialTable;
                let dictionariesKeyToName = {};
                DictionariesTable.map((item)=>{
                    dictionariesKeyToName[item.key] = item.name;
                });

                //第一个th
                let addDom1 = newDocument.getElementById(`ts11-${needAppendKey}`);
                let addDom1Paraent = addDom1.parentNode;
                let createTh = newDocument.createElement("th");//新建标签元素
                createTh.id = `ts11-${key}`;
                createTh.innerText = tablekeyToCnName[key]||dictionariesKeyToName[key]||'自定义字段';
                createTh.setAttribute('style','text-align: center;font-weight: normal;width: 3%;display:""');
                useInsert?addDom1Paraent.insertBefore(createTh,addDom1):addDom1Paraent.appendChild(createTh);
                //第二个th
                let addDom2 = newDocument.getElementById(`ts22-${needAppendKey}`);
                let addDom2Paraent = addDom2.parentNode;
                let createTh2 = newDocument.createElement("th");//新建标签元素
                createTh2.id = `ts22-${key}`;
                createTh2.innerText = `{${tablekeyToCnName[key]||dictionariesKeyToName[key]||'自定义字段'}}`;
                createTh2.setAttribute('style','text-align: center;font-weight: normal;width: 3%;display:""');
                useInsert?addDom2Paraent.insertBefore(createTh2,addDom2):addDom2Paraent.appendChild(createTh2);
                this.prodDescRef.state.content = this.prodDescRef.tinyMceEditor.getContent();
            }
        }else{
            message.error('表格已被删除，显示字段并不会在打印页面显示！');
        }

    }

    //处理左边表格内容
    dealTable = ()=>{
        let Dictionaries = this.state.Dictionaries;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                key: 'index',
                align: 'center',
                width: 60
            },
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
                width: 60,
                render: (e)=>{
                    return <a onClick={()=>this.copykey(e)}>复制</a>;
                }
            }
        ];
        const dataSources = [];
        let templateType = this.state.templateType;
        //处理表格数据
        Dictionaries.other && Dictionaries.other.map((item,index)=>{
            var obj = {
                key: index,
                index: index+1,
                name:`【${item.name}】`,
                action: `【${item.name}】`
            };
            let displayAry = item.display;
            if(displayAry.indexOf(templateType) !== -1){
                dataSources.push(obj)
            }
        });
        return <Table dataSource={dataSources} columns={columns} scroll={{ y: 280 }} bordered pagination={false}/>
    }

    //处理左下表格数据
    dealTable1 = ()=>{
        //拖拽排序
        const { dataSource } = this.state;
        const DragHandle = sortableHandle(() => (
            <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
        ));

        const columns = [
            {
                title: '排序',
                dataIndex: 'sort',
                width: 50,
                key: 'sort',
                align: 'center',
                render: () => <DragHandle />,
            },
            {
                title: '字段名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '显示',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
                width: 60,
                render: (e)=>{
                    return <Checkbox checked={this.state.tableObj[e[1]]} value={e[1]} onChange={this.changeTab}/>;
                }
            }
        ];

        return <Table dataSource={dataSource}
                      rowKey="index"
                      components={{
                          body: {
                              wrapper: this.DraggableContainer,
                              row: this.DraggableBodyRow,
                          },
                      }} columns={columns} scroll={{ y: 280 }} bordered pagination={false}/>
    };

    //类型为生产订单，左下添加一个Table选择区域
    dealTable2 = ()=>{
        //拖拽排序
        const { dataSource1 } = this.state;
        const DragHandle = sortableHandle(() => (
            <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
        ));

        const columns = [
            {
                title: '排序',
                dataIndex: 'sort',
                width: 50,
                key: 'sort',
                align: 'center',
                render: () => <DragHandle />,
            },
            {
                title: '字段名称',
                dataIndex: 'name',
                key: 'name',
                align: 'center'
            },
            {
                title: '显示',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
                width: 60,
                render: (e)=>{
                    return <Checkbox checked={this.state.tableObj1[e[1]]} value={e[1]} onChange={this.changeTab1}/>;
                }
            }
        ];

        return <Table dataSource={dataSource1}
                      rowKey="index"
                      components={{
                          body: {
                              wrapper: this.DraggableContainer1,
                              row: this.DraggableBodyRow1,
                          },
                      }} columns={columns} scroll={{ y: 280 }} bordered pagination={false}/>
    };

    handleDateTypeChange =(e)=>{
        this.setState({dateFormat:e});
    }

    //改变input框
    changeText = () =>{
        this.setState({formHasChanged:true});
    }

    //复制内容
    copykey = (e) =>{
        var aux = document.createElement("input");
        aux.setAttribute("value", e);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        message.success('复制成功！');
    }

    //后退
    cancle = () =>{
        if(this.prodDescRef.state.hasMoved){
            this.setState({formHasChanged:true})
        }
        this.props.history.goBack();
    }


}