
```js
import React from 'react';
import {Button} from 'antd'
;
class Demo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open: false
        }
    }
    
    toggleBar(){
        this.setState((prevState)=>({
            open: !prevState.open
        }))
    }
    
    render(){
        return(
            <React.Fragment>
                        <Button onClick={()=>this.toggleBar()}>点击后看窗口底部</Button>
                        <div style={{display:this.state.open?'block':'none'}}><FooterFixedBar><Button type="primary">提交</Button></FooterFixedBar></div>
                    </React.Fragment>
        )
    }
}
;<Demo/>
```