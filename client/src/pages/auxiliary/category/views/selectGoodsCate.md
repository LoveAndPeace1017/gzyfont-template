基本
```js
<SelectGoodsCate/>
```

隐藏cn类目
```js
<SelectGoodsCate hideCnGroup/>
```

隐藏下拉层中的管理入口
```js
<SelectGoodsCate hideManage/>
```


`value`可控
```js
class Demo extends React.Component{
constructor(props){
    super(props);
    this.state={
        value: undefined
    }
}
    onCategoryChange(value){
        console.log(value);
        this.setState({value});
    };

    render(){
        return <SelectGoodsCate hideManage value={this.state.value} onChange={this.onCategoryChange.bind(this)}/> 
    }   
}

;<Demo/>
```

