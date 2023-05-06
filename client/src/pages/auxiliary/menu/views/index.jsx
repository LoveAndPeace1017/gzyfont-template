import React, {Component} from 'react';
import {message, Table, Switch} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { asyncFetchMenuList, asyncUpdateMenu } from "../actions";
const cx = classNames.bind(styles);
import classNames from "classnames/bind";
import styles from "../../styles/index.scss";
const {Column} = Table;

/**
 * @visibleName Menu（菜单配置）
 * @author jinb
 */
class Menu extends Component{
    static menuMap = {
        sale: { label: '销售' },
        purchase: { label: '采购' },
        store: { label: '出入库' },
        productControl: { label: '生产管理' },
        goods: { label: '物品库' },
        basic: { label: '往来单位' },
        finance: { label: '财务' },
        report: { label: '报表中心' },
        downloadCenter: { label: '下载中心' }
    };

    state = {
        menuList: [],
        isFetching: true
    };

    componentDidMount() {
        this.props.asyncFetchMenuList((res) => {
            this.setState({
                menuList: res.data,
                isFetching: false
            })
        });
    }

    handleCheckRadio = (index)=>{
        let { menuList } = this.state;
        let status = menuList[index].status;
        menuList[index].status = status === 0 ? 1 : 0;
        this.setState({ menuList });
        this.props.asyncUpdateMenu(menuList, (res)=> {
            if(res.retCode === '0'){
                message.success('操作成功!');
                this.props.asyncFetchMenuList();
            }
        })
    };

    render() {
        let {menuList, isFetching} = this.state;

        return (
            <React.Fragment>
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={menuList}
                        pagination={false}
                        loading={isFetching}
                        className={cx("tb-aux")}
                        scroll={{y: 518}}
                    >
                        <Column
                            title={'菜单'}
                            dataIndex="configValue"
                            width="85%"
                            render={(configValue) => (
                                <React.Fragment>
                                    {Menu.menuMap[configValue].label}
                                </React.Fragment>
                            )}
                        />
                        <Column
                            title={'操作'}
                            dataIndex="status"
                            width="15%"
                            align="center"
                            render={(status, record, index) => (
                                <React.Fragment>
                                    <Switch  onChange={() => this.handleCheckRadio(index)} checked={status===1} />
                                </React.Fragment>
                            )}
                        />
                    </Table>
                </div>
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchMenuList,
        asyncUpdateMenu
    }, dispatch)
};

export default connect(null, mapDispatchToProps)(Menu)

