import React, {Component} from 'react';
import {Breadcrumb} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";
//DetailCostShare
import DetailCostShare from 'components/business/detailCostShare';
import { Row, Col, Input, Layout, Table, Modal, Button } from 'antd';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
class CostShare extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: props.data
        }
    }

    handleOpen() {
        this.setState({
            modalVisible: true,
        })
    }

    handleClose() {
        this.setState({
            modalVisible: false
        })
    }

    render() {
        let filterData = this.state.data.filter((item,index)=>{
            let obj = item;
            obj.serial = index;
            return obj
        });
        return (
            <React.Fragment>
                <Button type="primary" size={"small"}  onClick={()=>this.handleOpen()}>
                    成本分摊
                </Button>
                <Modal
                    title={"成本分摊"}
                    visible={this.state.modalVisible}
                    onCancel={()=>this.handleClose()}
                    width={1200}
                    footer={null}
                    destroyOnClose={true}
                >
                    <DetailCostShare
                        onOk={(values) => {
                            this.handleClose();
                            // this.props.submit(values);
                        }}
                        handleOk={this.handleCreate} newData={JSON.parse(JSON.stringify(filterData))}/>
                </Modal>
            </React.Fragment>
        )
    }
}


export default withRouter(CostShare)