CompleteComInfo example:
``` js
import React from 'react';
import {Button} from 'antd';

class Demo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            visibleFlag: false
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
                  <Button onClick={()=>this.openModal('visibleFlag')}>完善公司信息</Button>
                  <CompleteComInfo
                      visible={this.state.visibleFlag}
                      onCancel={()=>this.closeModal('visibleFlag')}
                      okCallback={this.completeComInfoCallback}
                  />
            </React.Fragment>
        )
    }
}
;<Demo/>


```