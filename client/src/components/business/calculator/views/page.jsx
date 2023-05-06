import React, {Component} from 'react';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

// const ButtonTextArray = ["AC", "←", "%", "÷", "7", "8", "9", "×", "4", "5", "6" , "-", "1", "2", "3", "+", "0", "." ];

const ButtonTextArray = [
    {label: '←', classNames: 'fn-btn'},
    {label: 'C', classNames: 'fn-btn'},
    {label: '%', classNames: 'fn-btn'},
    {label: '÷', classNames: 'fn-btn'},
    {label: '7', classNames: ''},
    {label: '8', classNames: ''},
    {label: '9', classNames: ''},
    {label: '×', classNames: 'fn-btn'},
    {label: '4', classNames: ''},
    {label: '5', classNames: ''},
    {label: '6', classNames: ''},
    {label: '-', classNames: 'fn-btn'},
    {label: '1', classNames: ''},
    {label: '2', classNames: ''},
    {label: '3', classNames: ''},
    {label: '+', classNames: 'fn-btn'},
    {label: '0', classNames: 'zero'},
    {label: '.', classNames: ''},
    {label: '=', classNames: 'equals'},
];

export class CalculatorOne extends Component {
    render(){
        return(
            <div className="calculator-wrap">
                <div className={cx('calculator')} style={{...this.props.style}}>
                    <div className={cx('calc-screen')}>
                        <div className={cx('calc-result')}>
                            <span className={cx('data')}>{this.props.result}</span>
                        </div>
                    </div>
                    <div className={cx('calc-buttons')}>
                        {  ButtonTextArray && ButtonTextArray.map((item, idx) => {
                            return (
                                <span className={cx(['buttons', item.classNames])}
                                      key={idx}
                                      onClick={() => this.props.calcuClick(item.label)}
                                >{item.label}</span>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}
