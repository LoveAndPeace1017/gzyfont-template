import React from 'react';
import IntlTranslation from 'utils/IntlTranslation'

export const numberReg = {


    numberOnlyTwo: {
        //整数不超过10位，小数不超过2位
        rules: /^(0|[1-9]\d{0,9})(\.\d{1,2})?$/,
        message: <IntlTranslation intlKey = "home.account.rule1"/>
    },

    numberOnlyThree: {
        //整数不超过10位，小数不超过3位
        rules: /^(0|[1-9]\d{0,9})(\.\d{1,3})?$/,
        message: <IntlTranslation intlKey = "home.account.rule2"/>
    },

    number :{
        rules: /^[1-9][0-9]*$/,
        message: <IntlTranslation intlKey = "home.account.rule3"/>
    }
};

export const emailReg = {
  email: {
      rules: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
      message: <IntlTranslation intlKey = "home.account.rule4"/>
  }
};



