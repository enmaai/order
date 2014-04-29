/**
 * 排序类组件，用于常用宝贝列表类的排序，可自定义排序因子
 * @author 霸先<baxian@taobao.com>
 * @module order
 **/
KISSY.add(function (S, Node,Base) {
    var ASC = 'ks-order-ascending';
    var DESC = 'ks-order-descending';
    var ACTIVATED = 'ks-order-activated';
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
                var cellStr = S.substitute(_.get('itemCellTpl'),item);
                var itemStr = S.substitute(_.get('itemTpl'),{
                    index : index,
                    cell : cellStr
                });
                var itemNode = S.one(itemStr);
                if(item.activated){
                    itemNode.addClass(ACTIVATED);
                    _.curNode = itemNode;
                    _.curIndex = index;
                }
                if(typeof item.isTwoWay == 'undefined'){
                    itemNode.addClass(item.default === 'asc' ? ASC : DESC);
                }
                _.items.push(itemNode);
                _.wrapper.append(itemNode);
            });
            _.get('node').append(_.wrapper);
        },
        bind : function(){

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
            value : '<li class="ks-order-item" data-index="{index}">{cell}</li>',
            readonly : true
        },
        itemCellTpl : {
            value : '<a href="javascript:;">{displayName}</a>'
        }
    }});
    return Order;
}, {requires:['node', 'base']});



