// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var Pos = cc.Class({
    name: "Pos",
    extends: cc.Component,

    properties: {
        x: 0,
        y: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    ctor: function() {},

    // update (dt) {},
});

module.exports = Pos