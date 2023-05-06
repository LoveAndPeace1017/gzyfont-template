import React, {Component} from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
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
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import styles from "../styles/index.scss";
import defaultOptions from 'utils/validateOptions';
import Icon from 'components/widgets/icon';
import GGEditor,{ Flow,RegisterNode,RegisterCommand,constants } from 'gg-editor';
import AddForm, {actions as addFormActions}  from 'components/layout/addForm';
import Crumb from 'components/business/crumb';
import Content from 'components/layout/content';
import {bindActionCreators} from "redux";
import {asyncFetchLevelApprovedList, asyncAddLevelApproved,asyncDetailLevelApproved,emptyDetailData} from "../actions";
import classNames from "classnames/bind";
import {asyncFetchEmployeeList} from "../../employee/actions";
import {asyncFetchSubAccountList} from "../../../account/index/actions";
import {getCookie} from 'utils/cookie';
import {Prompt} from "react-router";
const {Option} = Select;
const baseNodeData = {
    nodes: [
        {
            id: '0',
            label: '开始',
            x: 55,
            y: 55,
            canDelete: false,
            canAddBrother: false,
            canEdit: false,
            people:'',
            way:''
        },
        {
            id: '1',
            label: '提交',
            x: 355,
            y: 55,
            canDelete: false,
            canAddBrother: true,
            canEdit: false,
            people: 'presenter',
            way:'ANY'
        },
        {
            id: '2',
            label: '结束',
            x: 655,
            y: 55,
            canDelete: false,
            canAddBrother: false,
            canEdit: false,
            people:'',
            way:''
        }
    ],
    edges: [
        {
            label: "流程",
            source: "0",
            target: "1",
        },
        {
            label: "流程",
            source: "1",
            target: "2",
        }
    ]
};

const cx = classNames.bind(styles);


class AddLevelApproved extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auxiliaryVisible: false,
            auxiliaryKey: '',
            deleteBtnFlag: false,
            canEdit: false,
            name: '',
            people: [],
            formHasChanged: false,
            auth1: false,
            auth2: false,
            auth4: false,
            data:{
                nodes: [
                    {
                        id: '0',
                        label: '开始',
                        x: 55,
                        y: 55,
                        canDelete: false,
                        canAddBrother: false,
                        canEdit: false,
                        people:'',
                        way:''
                    },
                    {
                        id: '1',
                        label: '提交',
                        x: 355,
                        y: 55,
                        canDelete: false,
                        canAddBrother: true,
                        canEdit: false,
                        people: 'presenter',
                        way:'ANY'
                    },
                    {
                        id: '2',
                        label: '结束',
                        x: 655,
                        y: 55,
                        canDelete: false,
                        canAddBrother: false,
                        canEdit: false,
                        people:'',
                        way:''
                    }
                ],
                edges: [
                    {
                        label: "流程",
                        source: "0",
                        target: "1",
                    },
                    {
                        label: "流程",
                        source: "1",
                        target: "2",
                    }
                ]
            }
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id != this.props.match.params.id){
            this.setState({deleteBtnFlag:false,canEdit:false});
            let id = nextProps.match.params.id;
            id && this.props.asyncDetailLevelApproved({id:id},(data)=>{
                if(data.data){
                    let getStr = decodeURIComponent(escape(atob(data.data.dBContent)));
                    this.parsingStr(getStr);
                }
                console.log(decodeURIComponent(escape(window.atob(data.data.dBContent))),'data');
            });
        }
    }

    componentDidMount() {
        this.props.asyncFetchSubAccountList();
        let id = this.props.match.params.id || this.props.match.params.copyId;
        id && this.props.asyncDetailLevelApproved({id:id},(data)=>{
            if(data.data){
                let getStr = decodeURIComponent(escape(atob(data.data.dBContent)));
                this.parsingStr(getStr);
            }
            console.log(decodeURIComponent(escape(window.atob(data.data.dBContent))),'data');
        });
    }

    //删除节点
    deleteNode = ()=>{
        let graph = this.graph;
        let preNode = this.targetNode;
        if(!preNode){
            message.error('请选择有效的目标节点进行删除');
            return false;
        }
        let canDelete = preNode.model.canDelete;
        let preId = preNode.id;
        if(!canDelete){
            message.error('开始和结束节点不能删除');
            return false;
        }
        let currentData = graph.save();
        let getNode = currentData.nodes;
        let deleteAfterNode = [];
        let flag = false;
        for(let i=0;i<getNode.length;i++){
            if(getNode[i].id == preId){
                flag = true;
                continue;
            }
            flag?getNode[i].id = (i-1)+'': null;
            flag?getNode[i].x = getNode[i].x-300: null;
            deleteAfterNode.push(getNode[i]);
        }

        let nextEdges = [];
        for(let j=0;j<deleteAfterNode.length-1;j++){
            let obj = {
                label: '流程',
                source: j+'',
                target: j+1+''
            }
            nextEdges.push(obj);
        }
        console.log(nextEdges,'nextEdges');
        console.log(deleteAfterNode,'deleteAfterNode');
        graph.clear();
        this.setState({deleteBtnFlag:false,canEdit:false});
        this.renderGraph({nodes:deleteAfterNode,edges:nextEdges});
        /*graph.changeData({nodes:deleteAfterNode,edges:nextEdges});*/
    }
    //添加节点
    addNode = ()=>{
        let graph = this.graph;
        let preNode = this.targetNode;
        if(!preNode){
            message.error('请选择有效的目标位置添加节点');
            return false;
        }
        let preData = graph.save();
        console.log(preData,'preData');
        let preNodeData = preData.nodes;
        let prrNodeId = preNode.id;
        let canAddBrother = preNode.model.canAddBrother;
        if(!canAddBrother){
            message.error('请勿在开始和结束节点后添加节点！');
            return false;
        }
        if(preNodeData.length>12){
            message.error('最多只能添加10个节点！');
            return false;
        }
        let nextNodeData = [];
        let hasChange = false;
        for(let i=0;i<preNodeData.length;i++){
            if(preNodeData[i].id == prrNodeId){
                hasChange = true;
                let obj  = {
                    id: i+'',
                    label: preNodeData[i].label,
                    x: preNodeData[i].x,
                    y: preNodeData[i].y,
                    canDelete: preNodeData[i].canDelete,
                    canAddBrother: preNodeData[i].canAddBrother,
                    canEdit: preNodeData[i].canEdit,
                    people: preNodeData[i].people,
                    way: preNodeData[i].way
                };
                let obj1 = {
                    id: i+1+'',
                    label: '审批',
                    x: preNodeData[i].x+300,
                    y: preNodeData[i].y,
                    canDelete: true,
                    canAddBrother: true,
                    canEdit: true,
                    people: '',
                    way: ''
                };
                nextNodeData.push(obj);
                nextNodeData.push(obj1);
            }else{
                let obj = {
                    id: hasChange?i+1+'':i+'',
                    label: preNodeData[i].label,
                    x: hasChange?preNodeData[i].x+300:preNodeData[i].x,
                    y: preNodeData[i].y,
                    canDelete: preNodeData[i].canDelete,
                    canAddBrother: preNodeData[i].canAddBrother,
                    canEdit: preNodeData[i].canEdit,
                    people: preNodeData[i].people,
                    way: preNodeData[i].way
                }
                nextNodeData.push(obj);
            }
        }

        //处理连线的规则(没有分支的情况)
        let nextEdges = [];
        for(let j=0;j<nextNodeData.length-1;j++){
            let obj = {
                label: '流程',
                source: j+'',
                target: j+1+''
            }
            nextEdges.push(obj);
        }
        graph.changeData({nodes:nextNodeData,edges:nextEdges});

    }

    //解析后端传过来的字符串
    //<process displayName="请假流程测试" name="leave"></process>为流程的最外层
    //<start displayName="start1" layout="24,124,-1,-1" name="start1"></start>开始的模块
    //<end displayName="end1" layout="570,124,-1,-1" name="end1"/> 结束的模块
    //块级的概念，相当于一个流程的node节点
    //<task assignee="apply.operator" displayName="请假申请" layout="117,122,-1,-1" name="apply" performType="ANY"></task>
    //线级的概念，相当于一个流程的node和node之间的连接线
    //<transition g="" name="transition3" offset="0,0" to="decision1"/>
    //分支的概念，相当于一个流程的分支（一期先不对分支有过多的处理）
    //<decision displayName="decision1" expr="#day &gt; 2 ? 'transition5' : 'transition4'" layout="426,124,-1,-1" name="decision1"></decision>
    parsingStr = (str) =>{
        let node = [];
        let edges = [];
        //先对标签进行处理截取
        let startNode = str.substring(str.indexOf('<start'),str.indexOf('>',str.indexOf('<start'))+1);
        let nodeObj = {
            id: this.getValueFromKeyByStr('name',startNode),
            label: this.getValueFromKeyByStr('displayName',startNode), //layout
            x: (this.getValueFromKeyByStr('layout',startNode).split(',')[0])/1,
            y: (this.getValueFromKeyByStr('layout',startNode).split(',')[1])/1,
            canDelete: false,
            canAddBrother: false,
            canEdit: false,
            people:'',
            way:''
        };
        node.push(nodeObj);
        //获取开始节点下面的连线
        let startLine = str.substring(str.indexOf('<transition',str.indexOf(startNode)),str.indexOf('/>',str.indexOf(startNode))+2);
        let lineObj = {
            label: this.getValueFromKeyByStr('name',startLine),
            source: this.getValueFromKeyByStr('name',startNode),
            target: this.getValueFromKeyByStr('to',startLine)
        };
        edges.push(lineObj);
        //对非开始和结束的node节点进行解析
        let _this = this;
        let getNodeFromData = str.match(/<task(?:(?!<\/task>).|\n)*?<\/task>/mg);
        if(getNodeFromData){
            for(let i=0;i<getNodeFromData.length;i++){
                let newNodeInfo = getNodeFromData[i];
                let newNode = newNodeInfo.substring(newNodeInfo.indexOf('<task'),newNodeInfo.indexOf('>',newNodeInfo.indexOf('<task'))+1);
                let newEdges = newNodeInfo.substring(newNodeInfo.indexOf('<transition'),newNodeInfo.indexOf('/>',newNodeInfo.indexOf('<transition'))+2);
                let nodeObj1 = {
                    id: _this.getValueFromKeyByStr('name',newNode),
                    label: _this.getValueFromKeyByStr('displayName',newNode), //layout
                    x: (_this.getValueFromKeyByStr('layout',newNode).split(',')[0])/1,
                    y: (_this.getValueFromKeyByStr('layout',newNode).split(',')[1])/1,
                    //id是1是个固定node，即提交模块，这块是写死。
                    canDelete: _this.getValueFromKeyByStr('name',newNode) != "1",
                    canAddBrother: true,
                    canEdit: _this.getValueFromKeyByStr('name',newNode) != "1",
                    people:  _this.getValueFromKeyByStr('assignee',newNode),
                    way:  _this.getValueFromKeyByStr('performType',newNode),
                    auth: _this.getValueFromKeyByStr('form',newNode)/1
                };
                node.push(nodeObj1);
                let lineObj = {
                    label: _this.getValueFromKeyByStr('name',newEdges),
                    source: _this.getValueFromKeyByStr('name',newNode),
                    target: _this.getValueFromKeyByStr('to',newEdges)
                };
                edges.push(lineObj);
            }
        }
        //添加结束的node
        let endNode = str.substring(str.indexOf('<end'),str.indexOf('/>',str.indexOf('<end'))+2);
        let endNodeObj = {
            id: this.getValueFromKeyByStr('name',endNode),
            label: this.getValueFromKeyByStr('displayName',endNode), //layout
            x: (this.getValueFromKeyByStr('layout',endNode).split(',')[0])/1,
            y: (this.getValueFromKeyByStr('layout',endNode).split(',')[1])/1,
            canDelete: false,
            canAddBrother: false,
            canEdit: false,
            people:'',
            way:''
        };
        node.push(endNodeObj);
        let fullData = {
            nodes:node,
            edges:edges
        };
        this.renderGraph(fullData);
    }
    //类型方法，根据attribute获取str里对应attribute里的值
    getValueFromKeyByStr = (key,str) =>{
        return str.substring(str.indexOf(key)+key.length+2,str.indexOf('"',str.indexOf(key)+key.length+2));
    }
    //节点点击事件
    clickEvent = (e)=>{
        console.log(e,'e');
        console.log(this.graph,'graph');
        e.item&&e.item._cfg.type=='node'?(this.targetNode = e.item._cfg):(this.targetNode = null);
        this.setState({deleteBtnFlag:e.item&&e.item._cfg.type=='node'&&e.item._cfg.model.canDelete,canEdit:e.item&&e.item._cfg.type=='node'&&e.item._cfg.model.canEdit});
        //点击节点，对各个节点的数据进行展示
        if(e.item&&e.item._cfg.type=='node'&&e.item._cfg.model.canEdit){
            let model = e.item._cfg.model;
            let name = model.label;
            let people = model.people?model.people.split(","):[];
            let auth = model.auth?model.auth:0;
            let authAry = [];
            for(let i=0;i<=2;i++){
                authAry[i] = auth&1;
                auth = auth>>1;
            }
            let way = model.way;
            this.setState({
                name,
                people,
                way,
                auth1:authAry[0],
                auth2:authAry[1],
                auth4:authAry[2]
            })
        }
    }

    renderGraph = (data) =>{
        console.log(data,'data');
        this.setState({
            data:data
        });
        this.moveCanvas();
    }

    closeModal = () => {
        this.props.onClose();
    };

    //提交处理
    handleSubmit = (e)=>{
        e.preventDefault();
        /** force: true 已经校验过的表单域，在 validateTrigger 再次被触发时是否再次校验 */
        this.props.form.validateFields({force: true}, (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let graph = this.graph;
                let saveData = graph.save();
                // '<transition g="" name="transition1" offset="0,0" to="apply"/>'
                let saveNodes = saveData.nodes;
                let saveEdges = saveData.edges;
                //最后一个节点是end标签
                let endNode = saveNodes[saveNodes.length-1];
                //最后后端需要的字符串
                let saveStr = '';
                if(saveEdges.length<1){
                    message.error("没有节点不能保存！");
                    return false;
                }
                //先处理所有的连接线
                for(let i=0;i<saveEdges.length;i++){
                    //开始第一个start，做特别的处理
                    if(i == 0){
                        saveStr = saveStr + `<start displayName="${saveNodes[i].label}" layout="${saveNodes[i].x},${saveNodes[i].y},0,0" name="${saveNodes[i].id}">`+
                            `<transition g="" name="${saveEdges[i].label}" offset="0,0" to="${saveEdges[i].target}"/>`+
                            `</start>`+
                            `<end displayName="${endNode.label}" layout="${endNode.x},${endNode.y},-1,-1" name="${endNode.id}"/>`;
                    }else{
                        //如果节点中有没有选择审批类型和审批人，不能保存
                        if(!saveNodes[i].people||!saveNodes[i].way){
                            message.error('您有节点没有选择审批类型或审批人！');
                            return false
                        }
                        saveStr = saveStr + `<task assignee="${saveNodes[i].people}" displayName="${saveNodes[i].label}" form="${saveNodes[i].auth}" layout="${saveNodes[i].x},${saveNodes[i].y},0,0" name="${saveNodes[i].id}" performType="${saveNodes[i].way}">`+
                            `<transition g="" name="${saveEdges[i].label}" offset="0,0" to="${saveEdges[i].target}"/>`+
                            `</task>`;
                    }

                }
                //最后拼装开始和结束的process标签
                saveStr = `<process displayName="${values.templateName}">`+saveStr+`</process>`;
                console.log(saveStr,'saveStr');
                this.setState({
                    formHasChanged: false
                });
                //根据id判断是新增还是修改
                let id = this.props.match.params.id;
                this.props.asyncAddLevelApproved({
                    id: id,
                    type: values.type,
                    xml: saveStr
                },(data)=>{
                    if(data.retCode == "0"){
                        message.success(id?"修改成功":"添加成功");
                        this.props.history.push(`/home`)
                    }else{
                        message.error((data.retMsg&&data.retMsg)||'发送未知异常');
                    }
                });
            }
        });
    }

    handleNameChange = (e)=>{
        this.setState({
            name:e.target.value,
            formHasChanged: true
        })
        console.log(e.target.value,'value');
    }

    handleEmployeeChange = (people)=>{
        if(people && people.length>10){
            message.error('最多可选10个审批人！');
            return false;
        }
        this.setState({people,formHasChanged:true});
        if(people.length==0){
            message.error('审批人为必填项');
        }
        let peopleStr = '';
        for(let i=0;i<people.length;i++){
            peopleStr = peopleStr + ','+ people[i]
        }
        peopleStr = peopleStr.substr(1,peopleStr.length-1);
        //获取名称，更新节点
        let target = this.targetNode;
        let graph = this.graph;
        const item = graph.findById(target.id);
        let model = target.model;
        model.people = peopleStr;
        graph.update(item, model);
    }

    handleWayChange = (way)=>{
        this.setState({way,formHasChanged:true});
        //获取名称，更新节点
        let target = this.targetNode;
        let graph = this.graph;
        const item = graph.findById(target.id);
        let model = target.model;
        model.way = way;
        graph.update(item, model);
    }

    handleNameBlur = ()=>{
        let name = this.state.name;
        if(!name){
            message.error('节点的名称为必填项');
            name = '审批';
            this.setState({
                name,
                formHasChanged:true
            })
        }
        //获取名称，更新节点
        let target = this.targetNode;
        let graph = this.graph;
        const item = graph.findById(target.id);
        let model = target.model;
        model.label = name;
        graph.update(item, model);
    }

    //恢复幕布
    moveCanvas = ()=>{
        let graph = this.graph;
        graph.zoomTo(1);
        graph.moveTo(50, 50);
        graph.refresh();
    }

    formHasChange = ()=>{
        this.setState({
            formHasChanged:true
        })
    }

    approveType = (e,t) => {
        const { form } = this.props;
        Modal.confirm({
            title:'提示信息',
            content:'切换单据类型则会清空当前审批流设置，是否切换？',
            okText:'确定',
            cancelText:'取消',
            onOk:()=>{
                let graph = this.graph;
                this.setState({deleteBtnFlag:false,canEdit:false});
                form.setFieldsValue({templateName:''});
                graph.changeData(baseNodeData);
                this.formHasChange();
            },
            onCancel() {
                form.setFieldsValue({type:t});
            },
        });
    }

    authChange = (e) =>{
        this.setState({
            ['auth'+e.target.value]:e.target.checked
        });
        //获取名称，更新节点
        let target = this.targetNode;
        let graph = this.graph;
        const item = graph.findById(target.id);
        let model = target.model;
        if(e.target.checked){
            model.auth = (model.auth||0) + e.target.value;
        }else{
            model.auth = (model.auth||0) - e.target.value;
        }
        graph.update(item, model);
    }

    componentWillUnmount() {
        this.props.emptyDetailData();
    }

    render() {
        const {form: {getFieldDecorator},addLevelApproved,subAccountList} = this.props;
        const approveData = addLevelApproved && addLevelApproved.getIn(['data','data']);
        const subAccountListData = subAccountList.getIn(['data', 'data']);

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            }
        };
        const typeName = this.props.form.getFieldValue('type');

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            title: '业务设置',
                            onClick: 'project'
                        },
                        {
                            title: '审批流管理',
                            onClick: 'approve',
                            tabKey: 'approveList'
                        },
                        {
                            title: this.props.match.params.id?'修改审批流':'新建审批流'
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <AddForm onSubmit={this.handleSubmit}
                             confirmButtonText={"确定"}
                             cancelButtonText={"取消"}>
                    <div className={cx("lst-top")}>
                      <Row>
                         <Col span={8}>
                                <Form.Item
                                    label="单据类型"
                                    {...formItemLayout}
                                >
                                    {
                                        getFieldDecorator("type", {

                                            initialValue: (approveData && approveData.type) || '10',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '单据类型为必填项！'
                                                }
                                            ]
                                        })(
                                            <Select onChange={(e)=>this.approveType(e,typeName)}  placeholder={"选择审批类型"}  style={{ width: 250 }}>
                                                <Option value="10" key="10">采购订单</Option>
                                                <Option value="11" key="11">销售订单</Option>
                                                <Option value="12" key="12">入库单</Option>
                                                <Option value="13" key="13">出库单</Option>
                                                <Option value="14" key="14">收入记录</Option>
                                                <Option value="15" key="15">支出记录</Option>
                                                <Option value="16" key="16">开票记录</Option>
                                                <Option value="17" key="17">到票记录</Option>
                                                <Option value="18" key="18">请购单</Option>
                                            </Select>
                                        )
                                    }
                                </Form.Item>
                        </Col>
                         <Col span={8}>
                              <Form.Item
                                  label="审批流名称"
                                  {...formItemLayout}
                              >
                                  {
                                      getFieldDecorator("templateName", {
                                          initialValue: this.props.match.params.copyId?'':(approveData && approveData.displayName),
                                          rules: [
                                              {
                                                  required: true,
                                                  message: '审批流名称为必填项！'
                                              }
                                          ]
                                      })(
                                          <Input onChange={this.formHasChange} style={{ width: 250 }} placeholder={"审批流名称"}  maxLength={200}/>
                                      )
                                  }
                              </Form.Item>
                         </Col>
                      </Row>
                    </div>
                    <div className={cx("lst-center")}>
                        <div className={cx("lst-center-btn")}>
                            <Button style={{marginRight:"10px"}} onClick={()=>this.addNode()} type="primary" icon={<PlusOutlined />}>添加节点</Button>
                            {
                                this.state.deleteBtnFlag?(<Button type="default" onClick={()=>this.deleteNode()}>删除节点</Button>):null
                            }
                            <div onClick={()=>this.moveCanvas()} className={cx("reservet-btn")}>
                                恢复<Icon type="icon-recover" style={{fontSize: '12px',marginLeft: "2px"}}/>
                            </div>
                        </div>
                        <div id="g6-dom" className={cx("g3-dom")}>
                            <GGEditor>
                                <Flow ref={component => {
                                    if (component) {
                                        this.graph = component.graph;
                                        setTimeout(()=>{
                                            let width = document.getElementById("g6-dom").offsetWidth - 2;
                                            this.graph.changeSize(width, 220);
                                        },500);
                                    }
                                }} onClick={(e)=>this.clickEvent(e)}  style={{ height: 220,position: "relative" }}  data={this.state.data}
                                      graphConfig={{ defaultNode: { type: 'customStartNode' } }}/>
                                <RegisterCommand name={"dustomCommand"} config={{
                                    // 快捷按键配置(禁用快捷操作按钮)
                                    shortcutCodes: [],
                                }} />
                                <RegisterNode
                                    name="customStartNode"
                                    config={{
                                        getCustomConfig(model) {
                                            return {
                                                size: [120, 80], //长宽
                                                wrapperStyle: {
                                                    fill: '#2DA66A',
                                                    stroke: '#e5e5e5'
                                                },
                                            };
                                        },
                                        getAnchorPoints() {  // 节点可选的连接点集合，该点有4个可选的连接点
                                            return [];
                                        },
                                    }}
                                    extend="bizFlowNode" // 要继承的节点类型
                                />
                            </GGEditor>
                        </div>
                        {
                            this.state.canEdit?(
                                <div className={cx("lst-node")}>
                                    <Row style={{margin:"15px 0",lineHeight:"2.2"}}>
                                        <Col style={{textAlign: "right"}} span={2}>
                                            <label className={cx("strong-label")}>节点名称：</label>
                                        </Col>
                                        <Col span={6}>
                                            <Input style={{width:'280px'}} type="text"
                                                   value={this.state.name}
                                                   placeholder={'请输入节点名称'}
                                                   className={cx('search-input')}
                                                   onChange={this.handleNameChange}
                                                   onBlur = {this.handleNameBlur}
                                                   maxLength={200}
                                                /* onChange={handleChange}
                                                 onKeyPress={handleEnter}*/
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            ):null
                        }
                    </div>
                    {
                        this.state.canEdit?(
                            <div className={cx("lst-bottom")}>
                                <Row style={{margin:"15px 0",lineHeight:"2.2"}}>
                                    <Col style={{textAlign: "right"}} span={2}>
                                        <label className={cx("strong-label")}>审批类型：</label>
                                    </Col>
                                    <Col span={6}>
                                        <Select value={this.state.way} onChange={this.handleWayChange} placeholder={'选择审批类型'} style={{ width: 250 }}>
                                            <Option key="EnterWarehouse_0" value="ANY">普通审批</Option>
                                            <Option key="EnterWarehouse_3" value="ALL">会签审批</Option>
                                        </Select>
                                    </Col>
                                    <Col style={{textAlign: "right"}} span={2}>
                                        <label className={cx("strong-label")}>审批人：</label>
                                    </Col>
                                    <Col span={6}>
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width: 250 }}
                                            placeholder="选择审批人"
                                            onChange={this.handleEmployeeChange}
                                            value={this.state.people}
                                            /*onBlur={this.handlePeopleBlur}
                                            defaultValue={['a10', 'c12']}*/
                                            /*onChange={handleChange}*/
                                        >
                                            {
                                                <Option key={getCookie('uid')}
                                                        value={getCookie('uid')}>
                                                    主账号
                                                </Option>
                                            }
                                            {
                                                subAccountListData && subAccountListData.map(employee =>
                                                    (
                                                        <Option key={employee.get('userIdEnc')}
                                                                value={employee.get('userIdEnc')}>
                                                            {employee.get('loginName')+'-'+employee.get('userName')}
                                                        </Option>
                                                    ))
                                            }

                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                        ):null
                    }
                    {
                        this.state.canEdit&&(typeName == '10'||typeName == '11')?(
                            <div style={{marginTop: "20px"}}>
                                <Row>
                                    <Col style={{textAlign: "right"}} span={2}>
                                        <label>可操作项：</label>
                                    </Col>
                                    <Col span={8}>
                                        <Checkbox onChange={this.authChange} checked={this.state.auth1} value={1}>{typeName == '10'?'入库':'出库'}</Checkbox>
                                        <Checkbox onChange={this.authChange} checked={this.state.auth2} value={2}>{typeName == '10'?'到票':'开票'}</Checkbox>
                                        <Checkbox onChange={this.authChange} checked={this.state.auth4} value={4}>{typeName == '10'?'付款':'收款'}</Checkbox>
                                    </Col>
                                </Row>
                            </div>
                        ):null
                    }
                    </AddForm>
                </Content.ContentBd>
                <Prompt message="页面还没有保存，确定离开?" when={this.state.formHasChanged} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        subAccountList: state.getIn(['accountIndex', 'subAccountList']),
        addLevelApproved: state.getIn(['auxiliaryLevelApproved', 'addLevelApproved'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddLevelApproved,
        asyncFetchLevelApprovedList,
        asyncFetchEmployeeList,
        asyncDetailLevelApproved,
        emptyDetailData,
        asyncFetchSubAccountList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddLevelApproved))
