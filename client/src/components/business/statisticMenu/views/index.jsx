import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { BarChartOutlined } from '@ant-design/icons';
import { Drawer, Card, Statistic } from 'antd';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

class StatisticMenu extends Component{
    constructor(props){
        super(props);
        this.state = {
            drawVisible:false
        }
    }
    showDrawer = ()=>{
        this.setState({
            drawVisible:true
        });
    };
    closeDrawer = ()=>{
        this.setState({
            drawVisible:false
        });
    };
    getSimpleContent = (statistic,moduleName)=>{
        return <React.Fragment>
            <Card title={intl.get("components.statisticMenu.index.accumulateCount")}>
                <Statistic
                    title={moduleName+"总数"}
                    value={statistic.count}
                    valueStyle={{ color: '#3f8600' }}
                />
            </Card>
            <Card title={intl.get("components.statisticMenu.index.today")}>
                <Statistic
                title={intl.get("components.statisticMenu.index.add")+moduleName+intl.get("components.statisticMenu.index.num")}
                value={statistic.countToday}
                valueStyle={{ color: '#3f8600' }}
                />
            </Card>
            <Card title={intl.get("components.statisticMenu.index.month")}>
                <Statistic
                    title={intl.get("components.statisticMenu.index.add")+moduleName+intl.get("components.statisticMenu.index.num")}
                    value={statistic.countMonth}
                    valueStyle={{ color: '#3f8600' }}
                />
            </Card>
        </React.Fragment>
};
    getComplicateContent = (statistic,moduleName)=> {
        return <React.Fragment>
            <Card title={intl.get("components.statisticMenu.index.accumulateCount")}>
                <Statistic
                    title={moduleName + intl.get("components.statisticMenu.index.count")}
                    value={statistic.count}
                    valueStyle={{color: '#3f8600'}}
                />
                <Statistic
                    title={moduleName + intl.get("components.statisticMenu.index.totalAmount")}
                    value={statistic.count}
                    valueStyle={{color: '#3f8600'}}
                />
            </Card>
            <Card title={intl.get("components.statisticMenu.index.today")}>
                <Statistic
                    title={moduleName + intl.get("components.statisticMenu.index.num")}
                    value={statistic.countToday}
                    valueStyle={{color: '#3f8600'}}
                />
                <Statistic
                    title={moduleName + intl.get("components.statisticMenu.index.amount")}
                    value={statistic.countToday}
                    valueStyle={{color: '#3f8600'}}
                />
            </Card>
            <Card title={intl.get("components.statisticMenu.index.month")}>
                <Statistic
                    title={moduleName + intl.get("components.statisticMenu.index.num")}
                    value={statistic.countMonth}
                    valueStyle={{color: '#3f8600'}}
                />
                <Statistic
                    title={moduleName + intl.get("components.statisticMenu.index.amount")}
                    value={statistic.countMonth}
                    valueStyle={{color: '#3f8600'}}
                />
            </Card>
        </React.Fragment>
    };
    render(){
        const {linkList,statistic,moduleName,type} = this.props;
        let linkListStr = linkList&&linkList.map((item,index)=>
            <p key={index}><a href={item.url}>{item.text}</a></p>
        );
        const content = type==="price"
            ?this.getComplicateContent(statistic,moduleName)
            :this.getSimpleContent(statistic,moduleName);
        return (
            <React.Fragment>
                <span className={cx("right-menu")} onClick={this.showDrawer}><BarChartOutlined style={{fontSize:'20px'}} />{intl.get("components.statisticMenu.index.statistics")}</span>
                <Drawer
                    title={<span className={cx("right-menu")} ><BarChartOutlined />{intl.get("components.statisticMenu.index.statistics")}</span>}
                    placement="right"
                    closable={true}
                    onClose={this.closeDrawer}
                    visible={this.state.drawVisible}
                >
                    {content}
                    {linkListStr}
                </Drawer>
            </React.Fragment>
        );
    }
}

export default StatisticMenu;