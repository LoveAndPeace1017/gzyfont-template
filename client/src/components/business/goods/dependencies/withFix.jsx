import React, {Component} from 'react';
import FixDefault from '../images/fixDefault.png';
import FixChosen from '../images/fixChosen.png';
import Base from "./base";
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

/**
 *  固定当前列
 * @visibleName withFix(固定当前列)
 * @author jinb
 *
 */
export default function withFix(WrappedComponent){
    return class withFix extends Base {
        constructor(props) {
            super(props);
            this.state = {
                fixed: false // 是否固定头部
            }
        }

        renderFixIcon = (fixed) => {
            let fixSrc = fixed ? FixChosen : FixDefault;
            return (
                <img src={fixSrc}
                     className={cx('fix-icon')}
                     onClick={() => this.setState({fixed: !fixed})}/>
            );
        };

        render() {
            const {fixed = false} = this.state;

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        fixed={fixed}
                        renderFixIcon={()=> this.renderFixIcon(fixed)}
                    />
                </React.Fragment>
            );
        }
    }
}

