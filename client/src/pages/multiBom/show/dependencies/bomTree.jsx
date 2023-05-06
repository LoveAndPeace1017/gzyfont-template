import React, {Component} from 'react';
import {Tree} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import PropTypes from  'prop-types';

class BomTree extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    //跳转
    turnRun = (id)=>{
        if(id){
            this.props.close();
            this.props.history.push('/multiBom/show/'+id);
        }
    }

    //初始化数据
    initTreeData = (data,resizeData,m) =>{
       for(let i=0;i<data.length;i++){
           let obj = {};
           let title = <div style={{width: 660-m*24+"px"}}>
                            <span className={cx("bom-span")} title={data[i].prodCustomNo}>{data[i].prodCustomNo}</span>
                            <span className={cx("bom-span")} title={data[i].prodName}>{data[i].prodName}</span>
                            <span className={cx("bom-span")} title={data[i].description}>{data[i].description}</span>
                            <span style={{color: "#0066DD"}} className={cx("bom-span")} title={data[i].bomCode} onClick={()=>this.turnRun(data[i].recId)}>{data[i].bomCode}</span>
                            {
                                data[i].subList && data[i].subList.length>0?(
                                    <span style={{color: "#0066DD"}} className={cx("bom-span")} title={data[i].bomVersion} onClick={()=>this.turnRun(data[i].recId)}>{data[i].bomVersion}</span>
                                ): null
                            }
                            <span className={cx("bom-span-q")}>x{data[i].quantity}</span>
                       </div>
           obj.title = title;
           obj.key = i+Math.random();
           if(data[i].subList){
               let k = m+1;
               obj.children = this.initTreeData(data[i].subList,[],k);
           }
           resizeData.push(obj);
       }
       return resizeData;
    }


    render() {
        const {data,bomTreeParentData} = this.props;
        let treeData = this.initTreeData(data,[],0);
        //需要在父级元素增加一层当前的BOM元素
        let includeParentData = [
            {
                key: 888,
                title: <div style={{width: "684px"}}>
                    <span className={cx("bom-span")} title={bomTreeParentData.prodCustomNo}>{bomTreeParentData.prodCustomNo}</span>
                    <span className={cx("bom-span")} title={bomTreeParentData.prodName}>{bomTreeParentData.prodName}</span>
                    <span className={cx("bom-span")} title={bomTreeParentData.description}>{bomTreeParentData.descItem}</span>
                    <span className={cx("bom-span")} title={bomTreeParentData.bomCode}>{bomTreeParentData.bomCode}</span>
                    <span className={cx("bom-span")} title={bomTreeParentData.bomVersion}>{bomTreeParentData.bomVersion}</span>
                </div>,
                children: treeData
            }
        ];
        return (
            <React.Fragment>
                <div className={cx("bom-wild")}>
                    <Tree treeData={includeParentData} height={600}/>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(BomTree)