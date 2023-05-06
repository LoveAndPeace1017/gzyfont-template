import React, {Component} from 'react';
import {__OPERATORS__, __ERROR_MSG__} from './data';

function calculate(expr) {
    return eval(expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/--/g, '- -'));
};

export default class Calculator extends Component {
    access = (key, cb) => {
        if (this.isNumber(key)) {
            this.handleNumber(key);
        } else if (this.isOperator(key)) {
            this.handleOperator(key);
        } else if (key === '.') {
            this.handlePoint(key);
        } else {
            // 其他操作可能存在与外界交互
            this.handleOther(key, cb);
        }
    };

    handleNumber = (key, currentNumber) => {
        if (currentNumber === '0') {
            this.backSpace();
        }
        this.append(key);
    };

    append = (s) => {
        let {result, calculated, maxlength} = this.state;
        result = (result === '0' || calculated) && !this.isOperator(s) && s !== '.' ? s : result + s;
        this.setState({result});
        while (result.length > maxlength) {
            this.backSpace();
        }
        if (calculated) {
            this.setState({calculated: false});
        }
    };

    backSpace = () => {
        let {result, key, lastKey} = this.state;
        result = result.slice(0, -1) || '0';
        this.setState({result});
        let char = result.slice(-1);
        if (this.isOperator(char) && this.isOperator(lastKey)) {
            this.setState({
                currentOperator: char,
                key: char
            });
            lastKey = char;
        } else {
            lastKey = key;
        }
        this.setState({lastKey});
        if (result === '0') {
            this.setState({currentOperator: ''});
        }
    };

    getCurrentNumber = () => {
        let {result, currentOperator} = this.state;
        let index = currentOperator ? result.lastIndexOf(currentOperator) : -1;
        // 避免识别到负号
        if (currentOperator === '-' && result.charAt(index - 1) === '-') {
            index--;
        }
        return result.slice(index + 1);
    };


    isOperator = (key) => {
        return !!key && __OPERATORS__.indexOf(key) > -1;
    };

    isNumber = (x) => {
        return !isNaN(parseInt(x));
    };

    handleOperator = (key) => {
        let {result, lastKey} = this.state;
        if (result === __ERROR_MSG__) {
            return;
        }
        if (this.isOperator(lastKey)) {
            this.backSpace();
        }
        this.setState({currentOperator: key});
        this.append(key);
    };

    handlePoint = (key) => {
        let {currentNumber} = this.state;
        if (this.hasPoint(key) || currentNumber === __ERROR_MSG__) {
            return;
        } else if (currentNumber === '') {
            currentNumber = '0';
            this.append(currentNumber);
            this.setState({currentNumber});
        }
        this.append(key);
    };

    handleOther = (key, cb) => {
        const fn = {
            '%': 'percent',
            '←': 'backSpace',
            'C': 'allClear',
            '=': 'calculate'
        }[key];
        if (fn) {
            this[fn](cb);
        }
    };

    allClear = () => {
        this.setState({
            currentNumber: '0',
            lastKey: '',
            currentOperator: '',
            result: '0'
        })
    };

    hasPoint = () => {
        return this.getCurrentNumber().indexOf('.') > -1;
    };

    percent = () => {
        let {result, currentNumber} = this.state;
        if (result === __ERROR_MSG__) {
            return;
        }
        currentNumber = this.getCurrentNumber();
        result = result.slice(0, - currentNumber.length || result.length) + currentNumber / 100;
        this.setState({
            currentNumber,
            result
        })
    };

    calculate = (cb) => {
        let {result, lastKey} = this.state;
        if (result === '' || result === __ERROR_MSG__) {
            return;
        }
        if (this.isOperator(lastKey)) {
            let base;
            if (lastKey && '+-'.indexOf(lastKey) > -1) {
                base = '0'
            } else {
                base = '1';
            }
            result += this.getCurrentNumber() || base;
        }
        result = calculate(result).toString().replace(/^-?Infinity|NaN$/, __ERROR_MSG__);
        this.setState({
            result,
            currentOperator: '',
            calculated: true
        });

        if(cb){
            cb(result);
        }
    };
}