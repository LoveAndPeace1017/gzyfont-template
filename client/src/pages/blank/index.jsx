import React,{Component} from "react";
import Content from 'components/layout/content';
import {Spin} from 'antd';

export default class Blank extends Component {
    render() {
        return (
            <React.Fragment>
                <Content.ContentBd>
                    <Spin
                        spinning={true}
                    >
                        <div style={{minHeight: 'calc(100vh - 99px)'}}>
                        </div>
                    </Spin>
                </Content.ContentBd>
            </React.Fragment>
        );
    }
}








