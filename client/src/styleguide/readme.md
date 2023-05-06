## 说明

### 关于组件的书写

项目整体架构以组件为粒度进行开发。一个组件为一个文件夹，文件夹名称即为组件的名称，文件夹中包含以下几个文件夹和文件：

```markdown
<componentName> ------- dependencies（不希望暴露到外面的组件，一般为该组件的依赖组件或文件就放在这个文件夹中）
                ------- styles（组件的样式文件夹）
                ------- images（组件的图片文件夹）
                ------- views（希望暴露给外界的组件就放在这个文件夹中，ps：只有在这个文件夹里的组件才会生成组件文档）
                ------- actions.js （redux的action文件）
                ------- actionsTypes.js（redux的actionsType常量）
                ------- reducer.js (redux的reducer文件)
                ------- index.js （把希望暴露出去的组件通过这个文件去export，一般外部import组件的时候就是这个文件）
```

正常情况`views`文件夹和`index.js`必须要有，其它可选。

`views`文件夹中的组件命名需要遵循一定的规范

- 如果组件只对外暴露一个组件，那么文件直接用`index.jsx`，可以参考[crumb](/#crumb)组件

-  如果有多个组件对外暴露，可以存在一个`index.jsx`文件，其它组件则再新建`.jsx`文件，如果还要暴露`2`个组件那么还要新建`2`个`.jsx`文件。
也可以都为单独组件名称命名的`.jsx`文件

可以参考 [deliveryAddress](/#deliveryAddress)组件和[amount](/#amount)组件


### 关于组件文档及`demo`的编写

组件的文档根据组件的`propTypes`和`defaultProps`自动生成，其中包含`prop-name`（属性名称）、`type`（类型）、`default`（默认值）、`description`（属性描述）


如果你希望为组件添加`demo`，你可以在`views`文件夹下新建一个`readme.md`文件，如果有多个组件可以为`componentA.md`、`componentB.md`...
了解更多可以参考[react-styleguide](https://react-styleguidist.js.org/docs/documenting.html#usage-examples-and-readme-files)