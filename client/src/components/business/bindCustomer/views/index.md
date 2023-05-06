bindCustomer example:
``` js
import React from 'react';
import {Button} from 'antd';

class Demo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            saveCustomerVisible: false
        }
    }
    
    openModal(tag){
        this.setState({
            [tag]:true
        })
    };

    closeModal(tag){
        this.setState({
            [tag]:false
        })
    };
    bindCustomerCallback(){
      alert('绑定成功');
    }
    
    render(){
        return(
            <React.Fragment>
                  <Button onClick={()=>this.openModal('saveCustomerVisible')}>绑定客户</Button>
                  <BindCustomer
                      visible={this.state.saveCustomerVisible}
                      tip={<div><p>如果您想接收该订单，请先处理订单客户</p><p>该客户不是您的本地客户 您可以选择是否保存到已有客户？</p></div>}
                      onCancel={()=>this.closeModal('saveCustomerVisible')}
                      customerInfo={{customerUserId:'123'}}
                      okCallback={()=>this.bindCustomerCallback()}
                  />
            </React.Fragment>
        )
    }
}
;<Demo/>


```