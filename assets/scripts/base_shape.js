// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var ShapeComponent = cc.Class({
    name: "ShapeComponent",
    extends: cc.Component,

    properties: {
        id: cc.Integer,
        width: cc.Integer,
        height: cc.Integer,
        shapes: new Array(),
        direct: cc.Integer,  // 0，1 是横向组，2, 3是纵向组
        pos_x: 0,
        pos_y: 0,
        red: 1,
        green: 1,
        blue: 1,
        // layer: 0, // 是否访问过
        // isRoot: false,
        isVisited: false,
    },

    ctor: function() {
        this.pox_x = 0;
        this.pos_y = 0;
    },

    setPos: function(x, y) {
        this.pos_x = x;
        this.pos_y = y;
    },

    clearPos: function() {
        this.pos_x = 0;
        this.pos_y = 0;

    },

    info: function() {
        return "shape id=" + this.id + ", width=" + this.width + ", height=" + this.height;
    },

    // 只是行不变
    switchRow: function() {
        var newShapes = new Array();

        for(var x = 0; x < this.width; x ++) {
            var newRow = new Array();
            for(var y = this.height - 1; y >= 0; y --) {
                newRow.push(this.shapes[x][y]);
            }

            newShapes.push(newRow);
        }
        return newShapes;
    },

    // 列做镜面处理
    switchCol: function() {
        var newShapes = new Array();

        for(var row = 0; row < this.width; row++) {
            var rowArray = new Array();
            for(var col = this.height - 1; col >= 0; col--) {
                rowArray.push(this.shapes[row][col]);
            }

            newShapes.push(rowArray);
        }
        return newShapes;
    },

    // 转置矩阵
    rotateShapes: function() {
        var reversedArr = [];
        for(var n = 0; n < this.shapes[0].length; n++) {
            reversedArr[n] = [];
            for(var j = 0; j < this.shapes.length; j++) {
                reversedArr[n][j] = this.shapes[j][n];
            }
        }
        return reversedArr;
    },

    rotateWidthHeight: function() {
        var height = this.height;
        this.height = this.width;
        this.width = height;
    },

    rotate: function() {
        // 旋转形状
        switch(this.direct) {
            case 0:
                // 横向互换, 只有大于1的才更换， 宽、高不变
                this.shapes = this.switchRow();
                break;
            case 1:
                // 转置
                this.shapes = this.rotateShapes();                
                // 改变宽 高
                this.rotateWidthHeight();
                break;
            case 2:
                // 纵向互换
                this.shapes = this.switchCol();
                break;
            case 3: 
                // 转置
                this.shapes = this.rotateShapes();                
                // 改变宽 高
                this.rotateWidthHeight();
                break;
            default:
                break;
        }

        this.direct = (this.direct + 1) % 4
    },

    createShapes: function(id) {
        this.id = id;
        this.direct = 0;
        switch(this.id) {
            case 1:
                // 竖长条
                this.shapes = [
                    [1],
                    [1],
                    [1],
                    [1],
                    [1] 
                ];
                this.width = 5;
                this.height = 1;

                this.red = 255;
                this.green = 192;
                this.blue = 203;
                break;
            case 2: 
                // 蓝色L型拐弯
                this.shapes = [
                    [2, 0, 0],
                    [2, 0, 0],
                    [2, 2, 2]
                ];
                this.width = 3;
                this.height = 3;

                this.red = 65;
                this.green = 105;
                this.blue = 255;
                break;
            case 3:
                // 绿色T
                this.shapes = [
                    [3, 3, 3],
                    [0, 3, 0],
                    [0, 3, 0]
                ];
                this.width = 3;
                this.height = 3;

                this.red = 0;
                this.green = 250;
                this.blue = 154;
                break;
            case 4:
                // 红色十字
                this.shapes = [
                    [0, 4, 0],
                    [4, 4, 4],
                    [0, 4, 0]
                ];
                this.width = 3;
                this.height = 3;

                this.red = 255;
                this.green = 0;
                this.blue = 0;
                break;
            case 5:
                // 橘色Z型拐
                this.shapes = [
                    [5, 5, 0],
                    [0, 5, 0],
                    [0, 5, 5]
                ];
                this.width = 3;
                this.height = 3;

                this.red = 255;
                this.green = 140;
                this.blue = 0;
                break;
            case 6:
                // 紫色闪电
                this.shapes = [
                    [6, 0],
                    [6, 0],
                    [6, 6],
                    [0, 6]
                ];
                this.width = 4;
                this.height = 2;

                this.red = 218;
                this.green = 112;
                this.blue = 214;
                break;
            case 7:
                // 浅绿色小L
                this.shapes = [
                    [7, 0],
                    [7, 0],
                    [7, 0],
                    [7, 7]
                ];
                this.width = 4;
                this.height = 2;

                this.red = 127;
                this.green = 255;
                this.blue = 0;
                break;
            case 8:
                // 灰色竖条
                this.shapes = [
                    [8],
                    [8],
                    [8],
                    [8],
                    [8]
                ];
                this.width = 5;
                this.height = 1;

                this.red = 169;
                this.green = 169;
                this.blue = 169;
                break;
            case 9:
                //  浅橘色门型
                this.shapes = [
                    [9, 9],
                    [9, 0],
                    [9, 9]
                ];
                this.width = 3;
                this.height = 2;

                this.red = 255;
                this.green = 165;
                this.blue = 0;
                break;
            case 10:
                // 黄色凸起
                this.shapes = [
                    [10, 10, 0],
                    [0, 10, 10],
                    [0, 10, 0]
                ];
                this.width = 3;
                this.height = 3;

                this.red = 	139;
                this.green = 69;
                this.blue = 19;
                break;
            case 11:
                // 棕色拐弯
                this.shapes = [
                    [11, 0],
                    [11, 0],
                    [11, 11],
                    [11, 0]
                ];
                this.width = 4;
                this.height = 2;

                this.red = 205;
                this.green = 133;
                this.blue = 63;
                break;
            case 12:
                // 蓝色刀
                this.shapes = [
                    [12, 12],
                    [12, 12],
                    [12, 0]
                ];

                this.width = 3;
                this.height = 2;

                this.red = 30;
                this.green = 144;
                this.blue = 255;
                break;
            case 13:
                // 粉色w
                this.shapes = [
                    [13, 0, 0],
                    [13, 13, 0],
                    [0, 13, 13]
                ];
                this.width = 3;
                this.height = 3;

                this.red = 255;
                this.green = 105;
                this.blue = 180;
                break;
            default:
                break;
        }
    }
});

module.exports = ShapeComponent