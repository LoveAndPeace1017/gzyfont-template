import React from 'react'
import Loadable from 'react-loadable';
import {Spin} from 'antd';

const Loading = () => {
    return(
        <Spin
            size="large"
            className="gb-data-loading"
        />
    )
};


const asyncComponent = (importComponent) => {
    return Loadable({
        loader: importComponent,
        loading: Loading
    })
};

export default asyncComponent;
