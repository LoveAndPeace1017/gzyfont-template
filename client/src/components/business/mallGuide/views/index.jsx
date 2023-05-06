import React, {Component} from 'react';
import intl from 'react-intl-universal';
import classNames from 'classnames/bind';
import styles from '../styles/index.scss';
import PropTypes from 'prop-types';
import Icon from 'components/widgets/icon';
import {Link} from "react-router-dom";
import {Button} from "antd";

const cx = classNames.bind(styles);

/**
 * 商城引导
 *
 * @visibleName MallGuide（商城引导）
 * @author guozhaodong
 */
export default class MallGuide extends Component {

    render() {

        return (
            <div style={{'display':this.props.visible?'block':'none'}}>
                <div className={cx("guide-mask")}/>
                <div className={cx(['mall-guide'])}>
                    <div className={cx(["icon-wrap", {"anim": this.props.visible}])}>
                        <span><i/></span>
                    </div>
                    <p>{intl.get("components.mallGuide.index.tip")}</p>
                    <Button className={cx(["btn"])} type="primary">
                        <Link to={'/mall/preview'}>{intl.get("components.mallGuide.index.preview")}</Link>
                    </Button>
                </div>
            </div>
        )
    }
}