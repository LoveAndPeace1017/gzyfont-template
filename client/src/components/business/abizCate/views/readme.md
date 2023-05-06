AbizAllCate example:
``` jsx
import React from 'react';

class AbizCateDemo extends React.Component{
    constructor(props){
      super(props);
    }

    handleSelectAllCate (selectedKeys, selectedCatePath, key){
        console.log('prodList selectedKeys' + selectedKeys, selectedCatePath);
    };

  render(){
    return (
      <AbizCate initOptions={{'02744070000': ["家具摆设","桌类家具","咖啡桌和茶几"],'12744070000': ["家具摆设","桌类家具","咖啡桌和茶几"]}}
               onSelectAllCate={(selectedKeys, selectedCatePath)=>this.handleSelectAllCate(selectedKeys, selectedCatePath)}
      />
    )
  }
}


;<AbizCateDemo />
```