GoodsTable example:
``` js
import React from 'react';
import AddForm from 'components/layout/addForm';

class GoodsTableDemo extends React.Component{
  render(){
    return (
      <AddForm footerBar={null}>
        <GoodsTable form={this.props.form} />
      </AddForm>
    ) 
  }
}

const FormGoodsTableDemo = AddForm.create(GoodsTableDemo);

;<FormGoodsTableDemo />

```