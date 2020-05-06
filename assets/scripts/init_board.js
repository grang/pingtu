// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var ShapeComponent = require("base_shape");
var Pos = require("pos");

cc.Class({
    extends: cc.Component,

    properties: {
        tiled: cc.Prefab,
        shapes: new Array(), // 保存的未使用的形状
        board: new Array(), // 13 * 5的初始化盘子
        histories: new Array(), // 放入的形状历史
        pos_x: 0, // 放置的横向点
        pos_y: 0, // 放置的纵向点
        max_width: 5, // 棋盘最宽
        max_height: 13,  // 棋盘最高 
        pos_histories: new Array(), // 位置的历史信息
        tiles: new Array(),
        layer: cc.Integer, //  表示当前第几层
        // connect: new Array(), // 连接判读的棋牌
        timerId: null,
        layerNodes: new Array(),
        countLabel: cc.Label,
        count: 0, // 第几步
        leftTiles: new Array(),
        posLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    initBoard: function() {
        var start_x = -400;
        var start_y = 250;

        for(var i = 0; i < this.max_width; i++) {
            start_y = 250 - (i * 40);
            start_x = -400;

            var row = new Array();
            var til = new Array();

            for(var j = 0; j < this.max_height; j ++) {
                var pre = cc.instantiate(this.tiled);
                pre.parent = this.node;
                pre.setPosition(start_x + (j * 40), start_y);
                // pre.setPosition(start_x, start_y - (j * 40));

                til.push(pre);
                row.push(0);
            }

            this.board.push(row);
            this.tiles.push(til);
        }

        // cc.log('this tilers is');
        // cc.log(this.tiles);
    },

    initShapes: function() {
        var end = 14;
        // var end = 2;
        for(var i = 1; i < end; i ++){
            var shape = new ShapeComponent();
            shape.createShapes(i);
            this.shapes.push(shape);
        }
    },

    getRndInteger: function(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    },

    getRandomShape: function() {
        var index = this.getRndInteger(1, this.shapes.length)
        var index = 2;        
        cc.log("get the random index is " + index);

        var shape = this.shapes.splice(index, 1)[0];
        cc.log("shapes left is " + this.shapes.length);
        return shape;
    },

    setGlobalPos(x, y) {
        this.pos_x = x;
        this.pos_y = y;

        this.posLabel.string = "(" + this.pos_x + ", " + this.pos_y + ")";
    },

    canArchieve: function(x, y) {
        if(this.board[x + this.pos_x][y + this.pos_y] == 0 && this.connect[this.pos_x + x][this.pos_y + y] == 0) {
            return true;
        }
        return false;
    },

    // isConnect: function(shape, x, y) {
    //     cc.log("check connect shape id " + shape.id + ", x=" + x + ", y=" +y + ", board x =" + (x+this.pos_x) + ", y=" + (y + this.pos_y) + ", value=" + this.board[x+this.pos_x][this.pos_y + y]);
    //     this.connect[x + this.pos_x][y + this.pos_y] = 1;

    //     // 向左看
    //     if(y - 1 + this.pos_y >= 0) {
    //         if(this.canArchieve(x, y - 1)) {
    //             cc.log("look left");
    //             this.isConnect(shape, x, y - 1);
    //         }
    //     }
    //     // 向右看
    //     if(y + 1 + this.pos_y <= this.max_height - 1) {
    //         if(this.canArchieve(x, y + 1)) {
    //             cc.log("look right");
    //             this.isConnect(shape, x, y + 1);
    //         }
    //     }

    //     // 向上看
    //     if(x - 1 + this.pos_x >= 0) {
    //         if(this.canArchieve(x - 1, y)) {
    //             cc.log("look up");
    //             this.isConnect(shape, x-1, y);
    //         }
    //     }

    //     // 向下看
    //     if(x + 1 + this.pos_x <= this.max_width - 1) {
    //         if(this.canArchieve(x + 1, y)) {
    //             cc.log("look down");
    //             this.isConnect(shape, x + 1, y);
    //         }
    //     }

    //     if(this.pos_x + shape.height > x || this.pos_y + shape.width > y) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // },

    // 判断当前形状是否可以放入
    canPutShape: function(shape) {
        // 是否出界
        if(this.pos_x + shape.width > this.max_width || this.pos_y + shape.height > this.max_height) {
            // cc.log("shape " + shape.id + " is override width and height");
            return false;
        }

        for(var x = 0; x < shape.width; x ++) {
            for(var y = 0; y < shape.height; y ++) {
                if(shape.shapes[x][y] > 0 && this.board[x + this.pos_x][y + this.pos_y] > 0) {
                    return false;
                }
            }
        }

        return true;
    },

    // 从shapes中减少shape
    removeShape: function(shape) {
        var index = -1;
        for(var i = 0; i < this.shapes.length; i++) {
            var item = this.shapes[i];
            if(item.id == shape.id) {
                index = i;
            }
        }

        if(index > -1) {
            this.shapes.splice(index, 1);
        }
    },

    

    pushPosHistories: function() {
        var pos = new Pos();
        pos.x = this.pos_x;
        pos.y = this.pos_y;

        this.pos_histories.push(pos);
    },

    updatePos: function() {
        this.pushPosHistories();

        for(var y = 0; y < this.max_height; y++) {
            for(var x = 0; x < this.max_width; x ++) {        
                if(this.board[x][y] == 0) {
                    this.setGlobalPos(x, y);
                    return;
                }
            }
        }

    },

    /*
    * 放入棋盘
    */
    doPut: function(shape) {
        // 棋盘写入数据
        cc.log("want to put shape");
        cc.log(shape.info());
        cc.log(shape.shapes);
        // cc.log("to pos_x=" + this.pos_x + ", pos_y=" + this.pos_y);

        for(var x = 0; x < shape.width; x ++) {
            for(var y = 0; y < shape.height; y ++) {       
                if(shape.shapes[x][y] != 0) {       
                    this.board[x + this.pos_x][y + this.pos_y] = shape.shapes[x][y];
                    // cc.log("set x=" + (x + this.pos_x) + ", y=" + (y + this.pos_y) + ", value=" + this.board[x + this.pos_x][y + this.pos_y]);
                }
            }
        }

        shape.setPos(this.pos_x, this.pos_y);
        cc.log("board is");
        cc.log(this.board);

        // cc.log("put shape pos_x=" + shape.pos_x + ", shape pos_y=" + shape.pos_y);
        // cc.log(shape.shapes);

        // history 放入
        this.histories.push(shape);
        // shapes中减少
        this.removeShape(shape);

        this.layer += 1;
        shape.isVisited = true;

        this.count += 1;
        this.countLabel.string = "" + this.count;

        this.show();

        // 更新self.pos_x, self.pos_y
        if(this.shapes.length > 0) {
            this.updatePos();
        }
        cc.log("update pos_x=" + this.pos_x + ", y=" + this.pos_y);
    },

    canPut: function(shape) {
        // 循环4次是判断4个方向
        for(var i = 0; i < 4; i++) {
            var can = this.canPutShape(shape);
            if(can) {
                return true;
            } else {
                // 不能放入就旋转
                shape.rotate();
            }
        }
        return false;
    },

    // 将shape放回，而且回退1步
    backStep: function() {
        var shapes = this.layerNodes.pop();
        if(shapes) {
            for(var i = 0; i < shapes.length;i ++) {
                var shape = shapes[i];
                shape.isVisited = false;
            }
        }

        if(this.histories.length > 0) {
            var shape = this.histories.pop();

            // 回退位置
            var lastPos = this.pos_histories.pop();
            this.setGlobalPos(lastPos.x, lastPos.y);
            cc.log("back step update pos x=" + this.pos_x + ", y=" + this.pos_y);

            // 回退棋盘
            for(var x = 0; x < shape.width; x ++) {
                for(var y = 0; y < shape.height; y ++) {
                    if(this.board[x + this.pos_x][y + this.pos_y] == shape.shapes[x][y]) {
                        this.board[x + this.pos_x][y + this.pos_y] = 0;

                        shape.clearPos();

                        var tile = this.tiles[x + this.pos_x][y + this.pos_y];
                        tile.color = cc.Color(255, 255, 255);
                    }
                }
            }

            this.shapes.push(shape);
        }

        if(this.layer > 0) {
            this.layer -= 1;
        }

        this.showLeft();
    },

    getCandinates: function() {
        var candinates = new Array();

        for(var i = 0; i < this.shapes.length; i++) {
            var candiShape = this.shapes[i];

            // cc.log("check candi " + candiShape.id);
            if(this.canPut(candiShape)) {
                // cc.log("can candi " + candiShape.id);
                candinates.push(candiShape);
            }
        }
        return candinates;
    },

    initCandinates() {
        var node = new Array();

        for(var i = 0; i < this.shapes.length; i++) {
            var shape = this.shapes[i];

            if(this.canPut(shape) && !shape.isVisited) {    
                node.push(shape);
            }
        }

        return node;
    },

    step: function() {
        if(this.shapes.length == 0) {
            cc.log("find result");
            cc.log(this.board);
            return;
        }

        var node = this.layerNodes[this.layer];
        cc.log("current layer = " + this.layer + 
                ", layernodes length=" + this.layerNodes.length);

        if(node) {
            cc.log("layer node candinate length " + node.length);
            cc.log(node);
        }

        if(!node || this.layer == this.layerNodes.length) {
            var node = this.initCandinates();
            this.layerNodes.push(node);

            cc.log("init layer node on layer=" + this.layer + 
            ", and the candinate is " + node.length);
            cc.log(node);

            return;
        }

        if(node.length == 0) {
            this.backStep();
            return;
        } 

        // 走没走过的
        for(var i = 0; i < node.length; i++) {
            var shape = node[i];

            if(!shape.isVisited && this.canPut(shape)) {
                this.doPut(shape);
                // cc.log("total layer is " + this.layer);
                return;
            }
        }

        this.backStep();
        // cc.log("total layer is " + this.layer);
        return;
    },

    stopAuto() {
        clearInterval(this.timerId);
    },

    autoStep () {
        var self = this;
        this.timerId = setInterval(function(){
            self.step()
        }, 2);
    },

    clearLeft() {
        for(var i = 0; i < this.leftTiles.length; i++) {
            var tile = this.leftTiles[i];
            // tile.color = cc.Color(255, 255, 255);
            
            tile.removeFromParent();
            tile.destroy();
        }

        this.leftTiles = new Array();
    },

    showLeft() {
        this.clearLeft();

        var start_x = -400;

        var init_y = 0;
        var start_y = 0;

        for(var i = 0; i < this.shapes.length; i++) {
            var shape = this.shapes[i];
            start_y = init_y;
        
            for(var x = 0; x < shape.width; x++) {
                start_y = init_y - (x * 40);

                for(var y = 0; y < shape.height; y++) {
                    if(shape.shapes[x][y] > 0) {
                        var pre = cc.instantiate(this.tiled);
                        pre.parent = this.node;
                        pre.setPosition(start_x + (y * 40), start_y);
                        pre.color = cc.Color(shape.red, shape.green, shape.blue);

                        this.leftTiles.push(pre);
                    }
                }
            }

            start_x += shape.height * 40;
            if(start_x > 200) {
                init_y = -200;
                start_x = -400;
            }
        }
    },

    start () {
        // 初始化棋盘
        this.initBoard();
        cc.log("init board");

        // 初始化形状
        this.initShapes();

        this.layer = 0;
    },

    show: function() {
        // 画棋盘
        var shape = this.histories[this.histories.length - 1];
        for(var x = 0; x < shape.width; x++) {
            for(var y = 0; y < shape.height; y++) {
                // cc.log("x=" + shape.pos_x + ", y=" + shape.pos_y);
                if(this.board[shape.pos_x + x][shape.pos_y + y] == shape.id) {
                    var tile = this.tiles[shape.pos_x + x][shape.pos_y + y];
                    tile.color = cc.Color(shape.red, shape.green, shape.blue);

                    // tile.color = shape.color;
                }
            }
        }

        this.showLeft();
    },

    update (dt) {
    },
});
