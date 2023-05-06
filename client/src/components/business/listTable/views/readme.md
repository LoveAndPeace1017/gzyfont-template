更多配置项，请查看`antd`的[Table](https://ant.design/components/table-cn/)

该组件是对`antd`的`Table`组件进行了二次封装，主要用于列表页的表格，为其添加统一的配置，同时添加了滚动置顶效果

```js
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
  }
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

<ListTable
      columns={columns}
      dataSource={dataSource}
  />
```

表头置顶效果直接去项目中看去吧