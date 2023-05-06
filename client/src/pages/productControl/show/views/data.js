import React, { Component } from 'react';

/**
 *   sheetStatus  工单状态：0下达，1上线，2完成，3关闭
 */
const orderGroupMap= {
    0: { onlineFlag: true, finishFlag: false, closeFlag: true, restartFlag: false },
    1: { onlineFlag: false, finishFlag: true, closeFlag: true, restartFlag: false },
    2: { onlineFlag: false, finishFlag: false, closeFlag: false, restartFlag: true },
    3: { onlineFlag: false, finishFlag: false, closeFlag: false, restartFlag: true }
};

/**
 *   processStatus  工序状态：0下达，1开工，2完成，3关闭
 */
const processGroupMap = {
    0: { startWorkFlag: true, bookWorkFlag: false, closeFlag: true, restartFlag: false },
    1: { startWorkFlag: false, bookWorkFlag: true, closeFlag: true, restartFlag: false },
    2: { startWorkFlag: false, bookWorkFlag: false, closeFlag: false, restartFlag: true },
    3: { startWorkFlag: false, bookWorkFlag: false, closeFlag: false, restartFlag: true }
};


export const orderTitleMap = {
    0: '下达',
    1: '上线',
    2: '完成',
    3: '关闭'
};

export const processTitleMap = {
    0: '下达',
    1: '开工',
    2: '完成',
    3: '关闭'
};

/**
 * @param  sheetStatus  工单状态
 * @param type 按钮类型
 * @constructor
 * @return boolean 当前按钮的显示或隐藏
 */
export const backOrderBtnStatus = (sheetStatus, type) => {
    return type ? orderGroupMap[sheetStatus][type] : orderGroupMap[sheetStatus];
};

/**
 * @param  processStatus  工序状态
 * @param type 按钮类型
 * @constructor
 * @return boolean 当前按钮的显示或隐藏
 */
export const backProcessBtnStatus = (processStatus, type) => {
    return type ? processGroupMap[processStatus][type] : processGroupMap[processStatus];
};

