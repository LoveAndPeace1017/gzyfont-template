import React from 'react';
import Fold from 'components/business/fold';
import {AttributeBlock, AttributeInfo} from 'components/business/attributeBlock';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function ShowBasicInfo(props) {
    let {data} = props;
    return (
        <React.Fragment key={data.name}>
            <AttributeInfo data={{
                name: data.name,
                value: data.value,
                highlight: props.highlight
            }}/>
        </React.Fragment>
    );
}

function ShowBasicBlock(props) {
    let {title,data} = props;
    return (
        <Fold title={title}>
            {
                data&&data.map((item) => {
                    return <ShowBasicInfo key={item.name} highlight={item.highlight} data={item}/>
                })
            }
        </Fold>
    );
}

function ContactInfo(props){
    let {mainContacterInfo,type} = props;
    return (
        <div style={{overflow:"hidden"}}>
            <AttributeInfo data={{
                name: '联系人',
                value: mainContacterInfo.contacterName,
            }}/>
            <AttributeInfo data={{
                name: '联系电话',
                value: type?mainContacterInfo.telNo:mainContacterInfo.mobile,
            }}/>
            <AttributeInfo data={{
                name: '电子邮箱',
                value: mainContacterInfo.email,
            }}/>
            <AttributeInfo data={{
                name: '职务',
                value: mainContacterInfo.contacterTitle,
            }}/>
        </div>
     )
}

function ShowContacterInfo(props) {
    let {title,data,type} = props;
    let otherContactInfo = [];
    let mainContacterInfo;
    data.forEach((item)=>{
        if(item.isMain === 1){
            mainContacterInfo = item;
        }else{
            otherContactInfo.push(item)
        }
    });



    return (
        <Fold title={title}>
            {
                mainContacterInfo && <ContactInfo type={type} mainContacterInfo={mainContacterInfo}/>
            }
            <h2 className={cx("other-title")}>其他联系人</h2>
            {
                otherContactInfo && otherContactInfo.map((item,index) => {
                    return <ContactInfo type={type} key={index} mainContacterInfo={item}/>
                })
            }
        </Fold>
    );
}


export {ShowBasicInfo, ShowBasicBlock, ShowContacterInfo}
