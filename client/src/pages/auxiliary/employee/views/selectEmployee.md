与`SelectDept`组件组合使用
```js
import React from 'react';
import {SelectDept} from 'pages/auxiliary/dept';

class Demo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            deptId: ''
        }   
    }

  //部门选择
  handleDeptChange(depId){
      //选择部门后人员下拉选项变动
      this.setState({depId});
  };

  render(){
    return(
        <React.Fragment>
            <SelectDept
                handleDeptChange={this.handleDeptChange.bind(this)}
                showEdit={true}
                placeholder="请选择部门"
            />
            <SelectEmployee
                depId={this.state.depId}
                showEdit={true}
                placeholder="请先选择部门再选择员工"
            />
        </React.Fragment>
    )
  }
}

;<Demo/>

```