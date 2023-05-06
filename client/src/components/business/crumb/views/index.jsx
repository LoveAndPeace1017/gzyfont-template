import React, {Component} from 'react';
import {Breadcrumb} from "antd";
import Icon from 'components/widgets/icon';
import {withRouter, Link} from "react-router-dom";
import intl from 'react-intl-universal';
import Auxiliary from 'pages/auxiliary';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
const cx = classNames.bind(styles);
import PropTypes from  'prop-types';

/**
 * 面包屑
 *
 * @visibleName Crumb（面包屑）
 * @author guozhaodong
 */
class Crumb extends Component {

    static propTypes = {
        /**
         * 传入一个对象数组，title为面包屑文案，url为面包屑链接
         **/
        data: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            url: PropTypes.string
        }))
    };

    constructor(props) {
        super(props);
        this.state = {
            auxiliaryVisible: false,
            auxiliaryKey: '',
            auxiliaryTabKey: ''
        }
    }

    handleOpen(type, auxiliaryKey,auxiliaryTabKey) {
        this.setState({
            [type]: true,
            auxiliaryKey,
            auxiliaryTabKey
        })
    }

    handleClose(type) {
        this.setState({
            [type]: false
        })
    }

    render() {
        const {data, history} = this.props;
        return (
            <React.Fragment>
            <div className={cx("crumb-wrap")}>
                <span ga-data={'global-crumb-go-back'} className={cx("go-back")} onClick={history.goBack}><Icon type="icon-back"/>{intl.get("components.crumb.index.back")}</span>
                <span className={cx("v-sep")}>|</span>

                <Breadcrumb className={cx("crumb")}>
                    <Breadcrumb.Item>
                        <Link to="/home">{intl.get("components.crumb.index.home")}</Link>
                    </Breadcrumb.Item>
                    {
                        data && data.map((item, index) =>{
                            const className = index === data.length - 1?'highlight':'';
                            return <Breadcrumb.Item key={index} className={cx(className)}>
                                    {item.url?(
                                        <Link to={item.url}>{item.title}</Link>
                                    ):(
                                        item.onClick?(
                                            <React.Fragment>
                                                <span className={cx("click-title")} onClick={()=>this.handleOpen('auxiliaryVisible',item.onClick,item.tabKey && item.tabKey)}>{item.title}</span>
                                            </React.Fragment>
                                        ):(<React.Fragment>
                                            {item.title}
                                        </React.Fragment>)

                                    )}

                            </Breadcrumb.Item>
                        } )
                    }
                </Breadcrumb>
            </div>
            <Auxiliary
                defaultKey={this.state.auxiliaryKey}
                defaultTabKey={this.state.auxiliaryTabKey}
                visible={this.state.auxiliaryVisible}
                onClose={this.handleClose.bind(this, 'auxiliaryVisible')}
            />
            </React.Fragment>
        )
    }
}

export default withRouter(Crumb)