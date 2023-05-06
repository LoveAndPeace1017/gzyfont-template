import React, {Component} from 'react';
import {Modal, Progress} from 'antd';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
const cx = classNames.bind(styles);
import Icon from 'components/widgets/icon';
import {Link} from 'react-router-dom';


const guideItemsMap = {
    'PRODUCT_MANAGE': 'goods',
    'CUSTOMER_MANAGE': 'customer'
};

export class Index extends Component {
    render(){

        const {preData} = this.props;


        const guide = preData.getIn(['data', 'data', 'guide']);

        //引导是否都完成
        const completed = guide && guide.get('completed');

        const steps = guide && guide.get('steps');

        const completedArr = steps?steps.filter(item => item.get('completed')).toJS():[];
        const stepsCount = steps?steps.size:0;
        console.log('completedArr:'+completedArr);
        const completedCount = completedArr.length;

        return(
            <React.Fragment>
                <Modal
                    title={"探索我的商城"}
                    visible={this.props.visible}
                    footer={null}
                    onCancel={this.props.onClose}
                    width={800}
                    destroyOnClose={true}
                >
                    <div className={cx("process-wrap")+ " clearfix"}>
                        <div className={cx("process-info")}>
                            <h3>探索我的商城</h3>
                            <div className={cx("progress")}>
                                <Progress percent={completedCount/stepsCount*100} showInfo={false} strokeWidth={12} strokeColor="#40be7f"/>
                            </div>
                            <p className={cx("info")}>
                                已完成 <span className={cx("finished")}>{completedCount}</span>
                                个任务 ，共 <span className={cx("total")}>{stepsCount}</span>
                                个任务
                            </p>
                        </div>
                        <div className={cx("process-lst")}>
                            <ul>
                                {
                                    steps && steps.map(step=>{
                                        const itemName = guideItemsMap[step.get('stepCode')];
                                        const guideItem = (
                                            <React.Fragment>
                                                <Icon className={cx("icon")} type={`icon-${itemName}-manage`}/>
                                                <span className={cx("title")}>{step.get('stepName')}</span>
                                                <Icon className={cx("status")} type="icon-check-circle-fill"/>
                                            </React.Fragment>
                                        );
                                        return (
                                            <li key={step.get('stepCode')} className={cx({"finished": step.get('completed')})}>
                                                {
                                                    step.get('completed') ? (
                                                        <div className={cx("item-inner")}>
                                                            {guideItem}
                                                        </div>
                                                    ):(
                                                        <Link to={{pathname: `/mall/${itemName}/`, state: {fromExplore: true}}} className={cx("item-inner")}>
                                                            {guideItem}
                                                        </Link>
                                                    )
                                                }
                                            </li>
                                        )
                                    })
                                }

                            </ul>
                        </div>
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    preData: state.getIn(['mallHome', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({

    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)