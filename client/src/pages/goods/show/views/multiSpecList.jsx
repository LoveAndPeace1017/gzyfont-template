import React, {Component} from 'react';
import '@ant-design/compatible/assets/index.css';
import { Button } from 'antd';
import {formatCurrency, removeCurrency} from 'utils/format';
import {withRouter} from "react-router-dom";
import {AuthInput} from 'components/business/authMenu';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class MultiSpecList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentProdType: ''
        }
    }

    componentDidMount() {
        let {specProds,id} = this.props;
        let currentProdType = "";
        for(let prods in specProds){
            if(specProds[prods] == id){
                currentProdType = prods;
            }
        }
        this.setState({
            currentProdType
        });
    }

    turnRun = (btn)=>{
        if(btn.code){
            this.props.history.push(`/goods/show/${btn.code}`);
        }

        let currentProdType = btn.uio;
        this.setState({
            currentProdType
        });

    }

    // 给对象排序
    sortObject = (obj) => {
        let out = {};
        let array = Object.keys(obj).sort();
        array.forEach(item => {
            out[item] = obj[item];
        });
        return out
    };

    render() {
      //specDefine-所有规格型
      //specProds--所有规格型号的物品
      //当前物品的id
      let {specDefine,specProds,id} = this.props;
      let {currentProdType} = this.state;
      //对所有的多规格物品的键进行处理
      let newSpecProds = {};
      for(let multi in specProds){
          newSpecProds[JSON.stringify(JSON.parse(multi))] = specProds[multi];
      };
      let lastData = [];
      if(specDefine && currentProdType){
          //处理规格（让其自然排序）
          let specDefineObj = {};
          for(let i = 0;i<specDefine.length;i++){
              specDefineObj[specDefine[i].specName] = specDefine[i].specValues
          }
          //处理最后的数据结构
          for(let multi in specDefineObj){
              let obj = {
                  name:multi
              };
              let typeBtn = specDefineObj[multi];
              let typeAry = JSON.parse(typeBtn);
              let btnsAry = [];
              for(let j=0;j<typeAry.length;j++){
                  let newObj = JSON.parse(currentProdType);
                  newObj[multi] = typeAry[j];
                  let code = specProds[JSON.stringify(newObj)] || newSpecProds[JSON.stringify(newObj)];
                  let btnObj = {};
                  btnObj.name = typeAry[j];
                  btnObj.uio = JSON.stringify(newObj);
                  code?(btnObj.code = code):(btnObj.code = '');
                  //type 1：当前类型 2：存在类型 3：暂无类型
                  if(code){
                      let currentsObj = JSON.parse(currentProdType);
                      if(currentsObj[multi] == typeAry[j]){
                          btnObj.type = 1;
                      }else{
                          btnObj.type = 2;
                      }
                  }else{
                      let currentsObj = JSON.parse(currentProdType);
                      if(currentsObj[multi] == typeAry[j]){
                          btnObj.type = 4;
                      }else{
                          btnObj.type = 3;
                      }
                  }
                 /* code?(code == id?(btnObj.type = 1):(btnObj.type = 2)):(btnObj.type = 3);*/
                  btnsAry.push(btnObj);
              }
              obj.btns = btnsAry;
              lastData.push(obj);
          }
          console.log(lastData,'lastData');
      }

      //获取排序后的顺序
      return(
          <React.Fragment>
              {
                  specDefine && currentProdType &&
                  <div className={cx("multi-container")}>
                      {
                          lastData.map((item,index)=>{
                              return (
                                  <li className={cx("multi-li")} key={index}>
                                      <span className={cx("multi-label")}>
                                          {item.name}：
                                      </span>
                                      {
                                          item.btns.map((btn)=>{
                                               return (
                                                   <Button key={Math.random()+index} onClick={() => {this.turnRun(btn)}} type={btn.type == 1?"primary":(btn.type == 3?"dashed":null)} className={cx(`multi-btn-${btn.type}`)}>{btn.name}</Button>
                                               )
                                          })
                                      }
                                  </li>
                               )
                          })
                      }
                  </div>
              }
          </React.Fragment>
      )
    }
}
export default withRouter(MultiSpecList);