var blocks = {};

/**
 * 布局模块
 */
module.exports = {
    'block': function(name) {
        var val = (blocks[name] || []).join('\n');
        // clear the block
        delete blocks[name];
        return val;
    },
    'extend': function(name, context) {
        var block = blocks[name];
        if (!block) {
            block = blocks[name] = [];
        }
        block.push(context.fn(this));
    }
};
