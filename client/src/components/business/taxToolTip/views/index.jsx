import React, {Component} from 'react'

import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);


export default class TaxToolTip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tipShow: '1' // 1显示 2不显示
        };
    }

    componentDidMount() {
        const storage = window.localStorage;
        const {cookieSave} = this.props;
        if(storage.getItem(cookieSave)){
            this.setState({tipShow: storage.getItem(cookieSave)});
        }
    }

    cancelTaxTip = () => {
        const {cookieSave} = this.props;
        const storage = window.localStorage;
        storage.setItem(cookieSave, '2');
        this.setState({tipShow: '2'})
    };

    render() {
        const {tipShow} = this.state;
        return (
            <React.Fragment>
                {
                    tipShow === '1' && (
                        <div className={cx('tax-tip')}>
                            <div className={cx('tax-del-btn')} onClick={this.cancelTaxTip}>x</div>
                            <div className="ant-tooltip ant-tooltip-info ant-tooltip-placement-left">
                                <div className="ant-tooltip-content">
                                    <div className="ant-tooltip-arrow" />
                                    <div className="ant-tooltip-inner" role="tooltip">
                                        {this.props.tip}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </React.Fragment>
        );
    }
}
