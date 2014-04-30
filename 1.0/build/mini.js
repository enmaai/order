/*
combined files : 

gallery/order/1.0/index
gallery/order/1.0/mini

*/
/**
 * 排序类组件，用于常用宝贝列表类的排序，可自定义排序因子
 * @author 霸先<baxian@taobao.com>
 * @module order
 **/
//25 60 67 80 90 100 130 160 180 198 215
KISSY.add('gallery/order/1.0/index',function (S, Node,Base) {
    var ASC = 'ks-order-ascending';
    var DESC = 'ks-order-descending';
    var ASCORDER = 'asc';
    var DESCORDER = 'desc';
    var ACTIVATEDASC = 'ks-order-activated-ascending';
    var ACTIVATEDDESC = 'ks-order-activated-descending';
    var ACTIVATED = 'ks-order-activated';
    var TRIGGER = 'ks-order-trigger';
    var DOT = '.';
    var SPACE = ' ';
    /**
     * 
     * @class Order
     * @constructor
     * @extends Base
     */
    function Order(comConfig) {
        var self = this;
        //调用父类构造函数
        Order.superclass.constructor.call(self, comConfig);
    }
    S.extend(Order, Base, /** @lends Order.prototype*/{
        initializer : function(){
            var _ = this;
            if((!_.get('node') && !_.get('srcNode')) || !_.get('data')){
                S.log('order::initialize failed!');
            }
            _.render();
            _.bind();
        },
        destructor : function(){

        },
        render : function(){
            var _ = this;
            var data = _.get('data');
            _.items = [];
            _.wrapper = S.one(_.get('tpl'));
            S.each(data,function(item,index){
                if(typeof item.isTwoWay === 'undefined'){
                    item.isTwoWay = true;
                }
                var cellStr = S.substitute(item.itemCellTpl || _.get('itemCellTpl'),item);
                var itemStr = S.substitute(item.itemTpl || _.get('itemTpl'),{
                    index : index
                });
                var cellNode = S.one(cellStr);
                var itemNode = S.one(itemStr);
                itemNode.append(cellNode);
                if(item.activated){
                    itemNode.addClass(ACTIVATED);
                    _.curNode = itemNode;
                    _.curIndex = index;
                }
                if(item.isTwoWay){
                    cellNode.append('<i class="icon">&nbsp;</i>');
                    if(item.activated){
                        itemNode.addClass(item.default === 'asc' ? ACTIVATEDASC : ACTIVATEDDESC);
                    }else{
                        itemNode.addClass(item.default === 'asc' ? ASC : DESC);
                    }
                }
                _.items.push(itemNode);
                _.wrapper.append(itemNode);
            });
            _.get('node').append(_.wrapper);
        },
        bind : function(){
            var _ = this;
            var data = _.get('data');
            _.wrapper.delegate('click',DOT+TRIGGER,function(e){
                e.preventDefault();
                var tar = S.one(e.currentTarget),
                    parent = tar.parent('li'),
                    index = parent.attr('data-index'),
                    oldOrder = 'none',
                    newOrder = 'none';
                if(parent.hasClass(ACTIVATED)){
                    if(data[index].isTwoWay){
                        if(parent.hasClass(ACTIVATEDASC)){
                            oldOrder = ASCORDER;
                            newOrder = DESCORDER;
                            parent.replaceClass(ACTIVATEDASC,ACTIVATEDDESC);
                        }else{
                            oldOrder = DESCORDER;
                            newOrder = ASCORDER;
                            parent.replaceClass(ACTIVATEDDESC,ACTIVATEDASC);
                        }
                    }
                }else{
                    _.curNode.removeClass(ACTIVATED + SPACE + ACTIVATEDDESC + SPACE + ACTIVATEDASC);
                    _.curNode.addClass(data[_.curIndex].default === ASCORDER ? ASC : DESC);

                    if(parent.hasClass(ASC)){
                        oldOrder = ASCORDER;
                        newOrder = DESCORDER;
                        parent.replaceClass(ASC,ACTIVATEDASC);
                    }else if(parent.hasClass(DESC)){
                        oldOrder = DESCORDER;
                        newOrder = ASCORDER;
                        parent.replaceClass(DESC,ACTIVATEDDESC);
                    }
                    parent.addClass(ACTIVATED);
                }
                _.fire('orderChange',{
                    oldEl : _.curNode,
                    oldData : data[_.curIndex],
                    newEl : parent,
                    newData : data[index],
                    oldOrder : oldOrder,
                    newOrder : newOrder
                });
                _.curNode = parent;
                _.curIndex = index;
            });
        },
        getCurrentNode : function(){
            return this.curNode;
        },
        getCurrentData : function(){
            return this.get('data')[this.curIndex];
        },
        getCurrentOrder : function(){
            return this.curOrder;
        }
    }, {ATTRS : /** @lends Order*/{
        node : {
            setter : function(val){
                return S.one(val);
            },
            validator : function(val){
                return !!S.one(val);
            }
        },
        srcNode : {
            setter : function(val){
                return S.one(val);
            },
            validator : function(val){
                return !!S.one(val);
            }
        },
        data : {
            validator : function(val){
                return val && S.isArray(val);
            }
        },
        tpl : {
            value : '<ul class="ks-order-wrapper"></ul>',
            readonly : true
        },
        itemTpl : {
            value : '<li class="ks-order-item" data-index="{index}"></li>',
            readonly : true
        },
        itemCellTpl : {
            value : '<a href="javascript:;" class="ks-order-trigger">{displayName}</a>'
        }
    }});
    return Order;
}, {requires:['node', 'base']});




/**
 * @fileoverview 
 * @author 霸先<baxian@taobao.com>
 * @module order
 **/
KISSY.add('gallery/order/1.0/mini',function(S, Component) {

  return Component;

}, {
  requires: ["./index"]
});
