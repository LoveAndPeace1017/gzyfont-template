import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import '../iconfont';

const Icon = ({prefix = 'icon', ...props}) => {
    const IconFont = createFromIconfontCN({
    });
    return <i><IconFont {...props}/></i>
};

export default Icon;