const extend = require('extend');
const Constants = require('../../lib/constants');

MatchTools = function(){

};

extend(MatchTools, {
    matchSome(url, list) {
        let match = false;
        list.some(function (regex) {
            return match = regex.test(url);
        });
        return match;
    }
});
module.exports = MatchTools;