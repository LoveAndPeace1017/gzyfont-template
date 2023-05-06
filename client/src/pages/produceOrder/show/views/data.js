import React, { Component } from 'react';
import {
    asyncFetchGainMaterialRecord,
    asyncFetchProduceOrderById,
    asyncFetchProductEnterRecord,
    asyncFetchQuitMaterialRecord, asyncFetchWorkSheetRecord
} from "../actions";

export const orderStatusMap = {
    0: '已完成',
    1: '未完成'
};


// 各个tab对应的后端请求
export const ASYNC_REQUEST_FOR_TAB  = {
    baseInfo: 'asyncFetchProduceOrderById',
    gainMaterialRecord: 'asyncFetchGainMaterialRecord',
    quitMaterialRecord: 'asyncFetchQuitMaterialRecord',
    productInboundRecord: 'asyncFetchProductEnterRecord',
    workSheetRecord: 'asyncFetchWorkSheetRecord'
};


export const ASYNC_LOAD_WARE = {
    gainMaterialRecord: 'asyncFetchProdAbstractForGainMaterial',
    quitMaterialRecord: 'asyncFetchProdAbstractForQuitMaterial',
    productInboundRecord: 'asyncFetchProdAbstractForProductInbound'
};

