```js
<OpeBar data={{
   listData: [{
       name: 'edit',
       module: 'income',
       path: `/finance/income/edit/222`
   }, {
       name: 'delete',
       module: 'income',
       onClick: () => {
           console.log('删除啦啦')
       }
   }, {
       name: 'copy',
       module: 'income',
       path: `/finance/income/copy/333`
   }]
}}/>
```