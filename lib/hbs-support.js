/**
 * @author xuw
 */
const hbs = require('hbs');
var extend = require('extend');

const specialArea = {
    "北京市": "北京",
    "上海市": "北京",
    "重庆市": "北京",
    "天津市": "北京",
    "香港特别行政区": "香港特别行政区",
    "澳门特别行政区": "澳门特别行政区"
}

exports.init = function(dirname) {
    var helpers = {
        'keys': function(obj, block) {
            var out = '';
            if (obj && typeof obj === 'object') {
                Object.keys(obj).map(function(prop) {
                    out += block.fn({key: prop, value: obj[prop]});
                });
            }
            return out;
        },
        'map': function(obj, key) {
            return obj[key]||"";
        },
        /**
         * 用来处理直辖市及港澳台地区地址显示
         * @param provinceValue
         * @param cityValue
         */
        "areaVlaue": function(provinceValue,cityValue){
            if(specialArea[provinceValue]){
                return specialArea[provinceValue];
            }else{
                return provinceValue+" "+cityValue;
            }
        },
        'foreach': function(arr, options) {
            if (options.inverse && (!arr || !arr.length)) {
                return options.inverse(this);
            }

            var ret = arr.map(function(item, index) {
                if (typeof item !== 'object') {
                    item = {
                        value: item
                    };
                }

                item.foreach = {
                    index: index,
                    count: index + 1,
                    hasNext: index < arr.length - 1,
                    first: index === 0,
                    last: index === arr.length - 1
                };

                return options.fn(item);
            }).join('');
            return ret;
        },
        'alt': function(primary, secondary, options) {
            return primary ? primary : secondary;
        },
        'addOne': function(index) {
            this._index = index + 1;
            return this._index;
        },
        'breaklines': function(text) {
            text = hbs.Utils.escapeExpression(text);
            text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
            return new hbs.SafeString(text);
        }
    };

    var extenders = [
        require('./helpers/block'),
        require('./helpers/compare')
    ];

    extenders.forEach(function(helper) {
        extend(helpers, helper);
    });

    Object.keys(helpers).forEach(function(key) {
        hbs.registerHelper(key, helpers[key]);
    });

    hbs.registerPartials('./views/partials');

    return hbs;
};
