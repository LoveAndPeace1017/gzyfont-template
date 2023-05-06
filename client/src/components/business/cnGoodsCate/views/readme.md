
```js
import React from 'react';
class Demo extends React.Component{
    constructor(props){
        super(props);
        this.onCategoryChange = this.onCategoryChange.bind(this);
    }
    
    onCategoryChange(value){
        console.log('value.key:'+ value.key, 'value.label:'+value.label)
    }
    
    render(){
        return(
            <CnGoodsCate onChange={this.onCategoryChange}/>
        )
    }
}

;<Demo/>
```
