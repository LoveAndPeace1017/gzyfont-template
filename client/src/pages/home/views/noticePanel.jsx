import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Spin} from 'antd';
import Panel from 'components/business/panel';
import ScrollContainer from 'components/widgets/scrollContainer';
import {asyncFetchNotice} from '../actions';
import intl from 'react-intl-universal';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

class NoticePanel extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        this.props.asyncFetchNotice();
    }

    render() {
        const {notice} = this.props;
        let lstStr = null;
        if(!notice.get('isFetching')){
            if(notice.getIn(['data','retCode']) === '0' && notice.getIn(['data','data']).size>0){
                lstStr=(
                    <ul>
                        {
                            notice.getIn(['data','data']).map((item, index) =>
                                <li key={index}>
                                    <span className={cx("title")} title={item.get('adsContext')}>{item.get('adsContext')}</span>
                                </li>
                            )
                        }
                    </ul>
                )
            }else{
                lstStr=(
                    <div className="gb-nodata">
                        <span/><p>{intl.get("home.noticePanel.noContent")}</p>
                    </div>
                )
            }
        }else{
                lstStr = (
                    <Spin className="gb-data-loading"/>
                )
        }
        return (
            <Panel
                title={intl.get("home.noticePanel.title")}
            >
                <ScrollContainer className={cx(["panel-info-lst", "notice-info-lst"])}>
                    {lstStr}
                </ScrollContainer>
            </Panel>
        )
    }
}

const mapStateToProps = (state) => ({
   notice: state.getIn(['home','notice'])
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
      asyncFetchNotice
  }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(NoticePanel)

