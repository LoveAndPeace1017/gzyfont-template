import React from 'react';

function CheckBoxBtn1() {
    return (
        <label className="ant-checkbox-wrapper">
                <span className="ant-checkbox">
                    <input type="checkbox" className="ant-checkbox-input" value=""/>
                    <span className="ant-checkbox-inner"/>
                </span>
        </label>
    )
}

function  CheckBoxBtn2() {
    return (
        <label className="ant-checkbox-wrapper ant-checkbox-wrapper-checked">
                <span className="ant-checkbox ant-checkbox-checked">
                    <input type="checkbox" className="ant-checkbox-input" value=""/>
                    <span className="ant-checkbox-inner"/>
                </span>
        </label>
    )
}

function  CheckBoxBtn3() {
    return (
        <label className="ant-checkbox-wrapper">
                <span className="ant-checkbox ant-checkbox-indeterminate">
                    <input type="checkbox" className="ant-checkbox-input" value=""/>
                    <span className="ant-checkbox-inner"/>
                </span>
        </label>
    )
}

export {CheckBoxBtn1, CheckBoxBtn2, CheckBoxBtn3}