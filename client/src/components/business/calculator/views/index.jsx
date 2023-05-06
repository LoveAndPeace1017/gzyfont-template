import React, {Component} from 'react';
import CalculatorFn from './calculatorFn';
import {CalculatorOne} from './page';

/**
 *  简单版计算器
 *
 * @visibleName Calculator（计算器）
 * @author jinb
 */
function Calculator(WrappedComponent) {
    return class extends CalculatorFn {
        constructor(props) {
            super(props);
            this.state = {
                result: '',
                currentNumber: '0',
                lastKey: '',
                currentOperator: '',
                calculated: false,
                maxlength: 100
            };
        }

        calcuClick = (key) => {
            if(key === '='){
                // this.props.calculate 为父组件执行提交的回调
                this.access(key, this.props.calculate);
            } else {
                this.access(key);
            }
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    result={this.state.result}
                    calcuClick={this.calcuClick}
                />
            )
        }
    }
}

export default Calculator(CalculatorOne);