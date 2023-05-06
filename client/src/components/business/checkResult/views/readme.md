CheckResult example:

勾选一条数据即可出现批量操作条，具体有哪些批量操作可以查看项目中各个列表页面

```js
import React from 'react';
import {Table} from 'antd';

class Demo extends React.Component{
    constructor(props){
        super(props);
        this.checkRemove = this.checkRemove.bind(this);
        this.state = {
            selectedRowKeys: [],
            checkResultVisible: false
        }
        
    }
    
    //清楚选中项
    checkRemove(){
        this.setState({
            selectedRowKeys: [],
            checkResultVisible: false
        })
    }
    
    render(){
        const dataSource = [
          {
            key: '1',
            name: '胡彦斌',
            age: 32,
            address: '西湖区湖底公园1号',
          },
          {
            key: '2',
            name: '胡彦祖',
            age: 42,
            address: '西湖区湖底公园1号',
          },
        ];
        
        const columns = [
          {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
          },
        ];
        
        const rowSelection = {
          selectedRowKeys: this.state.selectedRowKeys,
          onChange: (selectedRowKeys) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`);
            this.setState({
                selectedRowKeys,
                checkResultVisible: selectedRowKeys.length > 0
            })
          }
        };
        return (
            <React.Fragment>
              <div style={{position:'relative'}}>
                <CheckResult
                         module={"goods"}
                         visible={this.state.checkResultVisible}
                         onRemove={this.checkRemove}
                         selectedRowKeys={this.state.selectedRowKeys}
                />
              </div>
              <Table dataSource={dataSource} columns={columns} rowSelection={rowSelection}/>
            </React.Fragment>
        )
    }
};
        
<Demo/>;

```