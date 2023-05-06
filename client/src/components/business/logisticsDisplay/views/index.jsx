import React, {Component} from 'react';
import {Breadcrumb,Modal,Timeline} from "antd";
import { SmileOutlined } from '@ant-design/icons';
import {withRouter, Link} from "react-router-dom";
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);


class LogisticsDisplay extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        const {visible,data} = this.props;
        return (
            <React.Fragment>
                <Modal
                    title={'物流信息'}
                    visible={visible}
                    onCancel={()=>this.props.closeModal('logisticsVisible')}
                    width={800}
                    footer={null}
                    destroyOnClose={true}
                >
                    <div style={{textAlign: "center"}}>
                        <div style={{display: "inline-block",width: "350px",textAlign: "left"}}>
                            <Timeline>
                                {
                                    data && data.map((item)=>{
                                        return <Timeline.Item color="green">
                                               <p>{item.status} {item.time}</p>
                                               <p>{item.context}</p>
                                        </Timeline.Item>
                                    })
                                }
                            </Timeline>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}

export default withRouter(LogisticsDisplay)