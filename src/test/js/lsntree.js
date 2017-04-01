/**封装树节点的操作
 * @author 刘胜楠
 * @createTime 2017年03月31日
 *
 * */
var lsnTree;
lsnTree = function () {
    var _builder = {};//建树的控制对象
    _builder.defaultNodeConfig;//缺省的节点配置
    _builder.rootSize = 0;//有几棵树
    _builder.size = 0;//树的节点数
    _builder.leafSize = 0;//叶子节点数
    _builder.maxDepth = 0;//深度
    _builder.allNodes = [];//全部节点，使用线性表存放节点，减少递归查找
    _builder.rootNodes = [];//根节点
    /**生成一个节点控制对象
     * @param nodeConfig 用于绑定控制属性的节点对象，一般传入新建对象就好，比如{}
     * @param idAttrName 表示主键的属性名，如果为空则使用'id'
     * @param parentIdAttrName 表示父节点主键的属性名，如果为空则使用'parentId'
     * @param sortAttrName 表示排序的属性名，如果为空则使用 'order'
     * @return _config 返回控制对象（内部对象）
     * */
    var genernateNodeConfiguration = function (nodeConfig, idAttrName, parentIdAttrName, sortAttrName) {
        nodeConfig.IdAttrName = 'id'; //描述主键的属性名，使用方法：_node.customAttrs['id']
        nodeConfig.ParentIdAttrName = 'parentId';//描述父的属性名，使用方法：_node.customAttrs['parentId']
        nodeConfig.SortAttrName = 'order';//描述顺序的属性名，使用方法：_node.customAttrs['order']

        /**改变用于描述主键的属性字段
         * @param idAttrName 新的主键属性名
         * */
        var setIdAttrName = function (idAttrName) {
            if (idAttrName == undefined || idAttrName == null || idAttrName.trim().length < 1) {
                try {
                    nodeConfig.IdAttrName = _builder.defaultNodeConfig.IdAttrName;
                } catch (e) {
                    nodeConfig.IdAttrName = "id";
                }
            } else {
                nodeConfig.IdAttrName = idAttrName;
            }
        };
        /**改变用于描述父节点主键的属性字段
         * @param parentIdAttrName 新的父节点主键属性名
         * */
        var setParentIdAttrName = function (parentIdAttrName) {
            if (parentIdAttrName == undefined || parentIdAttrName == null || parentIdAttrName.trim().length < 1) {
                try {
                    nodeConfig.ParentIdAttrName = _builder.defaultNodeConfig.ParentIdAttrName;
                } catch (e) {
                    nodeConfig.ParentIdAttrName = "parentId";
                }
            } else {
                nodeConfig.ParentIdAttrName = parentIdAttrName;
            }
        };
        /**改变用于排序的属性字段
         * @param sortAttrName 新的排序属性名
         * */
        var setSortAttrName = function (sortAttrName) {
            if (sortAttrName == undefined || sortAttrName.trim().length < 1) {
                try {
                    nodeConfig.SortAttrName = _builder.defaultNodeConfig.SortAttrName;
                } catch (e) {
                    nodeConfig.SortAttrName = "order";
                }
            } else {
                nodeConfig.SortAttrName = sortAttrName;
            }
        };
        setIdAttrName(idAttrName);
        setParentIdAttrName(parentIdAttrName);
        setSortAttrName(sortAttrName);
    };

    /**查找一个节点
     * @param id 节点主键值
     * @return _treeNode 返回找到的节点（内部对象）
     * */
    _builder.findNodeById = function (id) {
        var _nodes = _builder.allNodes;
        if (_nodes != undefined && _nodes.length > 0) {
            for (var i = 0; i < _nodes.length; i++) {
                var _one = _nodes[i];//_one是_treeNode中定义的对象
                if (_one.id != undefined && _one.id == id) {
                    return _one;
                }
            }
        }
        return null;
    };

    /**删除某个子节点
     * @param _node 节点对象（内部对象）
     * @return _treeNode（内部对象），返回被删除的对象
     * */
    _builder.removeNode = function (_node) {
        var _removedNode = null;
        if (_builder.allNodes != undefined && _builder.allNodes.length > 0) {
            var _index = -1;
            for (var i = 0; (i < _builder.allNodes.length && _index < 0); i++) {
                var _oneNode = _builder.allNodes[i];
                if (_oneNode.id != undefined && id == _oneNode.id) {
                    _index = i;
                    _removedNode = _oneNode;
                }
            }
            if (_index >= 0) {
                _builder.allNodes.splice(_index, 1);
                //如果他是某个节点的子节点，那么也要清除掉
                if (undefined != _removedNode.parentNode && null != _removedNode.parentNode) {
                    _removedNode = _removedNode.parentNode.removeANodeFromChildren(_node.id);
                }
                return _removedNode;
            }
        }
        return _removedNode;
    };
    /**创建一个空树*/
    _builder.genernateAEmptyNode = function () {
        var _treeNode = {};
        _treeNode.id = undefined;//主键
        _treeNode.parentId = undefined;//父节点主键，如果是根节点，则为空''
        _treeNode.parentNode = undefined;//父节点
        _treeNode.rootNode = undefined;//根节点
        _treeNode._nodeConfig = {};//节点控制对象
        _treeNode.index = -1;//节点在同一层级中的序号
        _treeNode.curDepth = 1;//节点深度
        _treeNode.customAttrs = {};//自定义属性，是一个{}
        _treeNode.children = [];//子节点，是一个[]
        /**根据父节点Id判断该节点是否是根节点*/
        _treeNode.isRoot = function () {
            return undefined == _treeNode.parentId || null == _treeNode.parentId || _treeNode.parentId.length < 1;
        };
        /**根据子节点判断该节点是否是叶子*/
        _treeNode.isLeaf = function () {
            return undefined == _treeNode.children || null == _treeNode.children || _treeNode.children.length < 1;
        };
        /**从全局节点数组中找到该节点的子节点
         * 前提条件是所有节点的id和parentId都设置好了
         * */
        _treeNode.setChildren = function () {
            _treeNode.children = [];
            var _nodes = _builder.allNodes;
            if (_nodes != undefined && _nodes.length > 0) {
                for (var i = 0; i < _nodes.length; i++) {
                    var _one = _nodes[i];//_one是_treeNode中定义的对象
                    if (_one.parentId != undefined && _one.parentId == _treeNode.id) {
                        _one.parentNode = _treeNode;//同时设置子节点的父节点指针
                        _treeNode.children.push(_one);
                    }
                }
            }
            return _treeNode;
        };

        /**将所有节点平面化*/
        _treeNode.flattenNodes = function () {
            var _nodes = [];
            _nodes.push(this);
            if (this.children != undefined && this.children.length > 0) {
                this.children.forEach(function (_subNode) {
                    _nodes = _nodes.concat(_subNode.flattenNodes());
                });
            }
            return _nodes;
        };
        /**计算该节点的深度
         * 前提是所有节点的parentNode都设置好了
         * */
        _treeNode.figureOutCurDepth = function () {
            var _pNode = this.parentNode;
            var _depth = 1;
            while (undefined != _pNode && undefined != _pNode.id) {
                _depth++;
                if (_pNode.isRoot()) {
                    this.rootNode = _pNode;//设置根节点
                }
                _pNode = _pNode.parentNode;
            }
            this.curDepth = _depth;
            return this.curDepth;
        };
        /**从向下寻找主键为id的节点
         * 前提是所有子节点的children都设置好了
         * @param id 节点主键值
         * @return  返回找到的节点（内部对象）
         * */
        _treeNode.findNodeById = function (id) {
            var _targetOne = null;
            if (_treeNode.id != undefined && _treeNode.id == id) {
                _targetOne = _treeNode;
            } else if (_treeNode.children != undefined && _treeNode.children.length > 0) {
                for (var i = 0; i < _treeNode.children.length; i++) {
                    var _oneNode = _treeNode.children[i];
                    _targetOne = _oneNode.findNodeById(id);
                    if (_targetOne != null && _targetOne != undefined) {
                        return _targetOne;
                    }
                }
            }
            return _targetOne;
        };

        /**删除某个子节点
         * @param id 子节点主键值
         * @return _removedNode（内部对象），返回被删除的对象
         * */
        _treeNode.removeANodeFromChildren = function (id) {
            var _children = _treeNode.children;
            var _removedNode = null;
            if (_children != undefined && _children.length > 0) {
                var _index = -1;
                for (var i = 0; (i < _children.length && _index < 0); i++) {
                    var _oneNode = _children[i];
                    if (_oneNode.id != undefined && id == _oneNode.id) {
                        _index = i;
                        _removedNode = _oneNode;
                    }
                }
                if (_index >= 0) {
                    _treeNode.children.splice(_index, 1);
                    return _removedNode;
                }
            }
            return _removedNode;
        };
        return _treeNode;
    };
    //////////////////创建一棵空树结束////////////////////////////////

    /**计算该节点的子节点在同一层级中的序号
     * 前提是所有节点的parentNode、children都设置好了
     * */
    var setSubNodeIndex = function (nodeArray) {
        if (nodeArray != undefined && nodeArray.length > 0) {
            nodeArray.forEach(function (_subNode, _index) {
                _subNode.index = _index;
            });
        }
    };
    /**缺省的内部排序函数
     * @param _node1 用于比较的节点1（内部对象）
     * @param _node2 用于比较的节点2（内部对象）
     * */
    var defaultSortFun = function (_node1, _node2) {
        var _param1 = _node1.customAttrs[_node1._nodeConfig.SortAttrName];
        var _param2 = _node2.customAttrs[_node2._nodeConfig.SortAttrName];
        if (_param1 == undefined && _param2 == undefined) {
            return 0;
        }
        if (_param1 == undefined) {
            return -1;
        }
        if (_param2 == undefined) {
            return 1;
        }
        if (_param1 == _param2) {
            return 0;
        }
        //如果是数字就按数字排序
        if (!isNaN(_param1) && !isNaN(_param2)) {
            return Number(_param1) - Number(_param2);
        }
        //不是数字按字符串比较来排序
        return _param1 - _param2;
    };
    /**解析节点对象
     * @param nodeAttrs 节点属性对象
     * @param idAttrName 属性对象中表示主键的属性名，如果为空则使用tree的默认属性名
     * @param parentIdAttrName 属性对象中表示父节点主键的属性名，如果为空则使用tree的默认属性名
     * @param sortAttrName 属性对象中表示排序的属性名，如果为空则使用tree的默认属性名
     * */
    var parseNodeAttr_ = function (nodeAttrs, idAttrName, parentIdAttrName, sortAttrName) {
        if (nodeAttrs == undefined) {
            //属性不能为空
            return null;
        }
        var _node = _builder.genernateAEmptyNode();//创建一棵空树
        _node._nodeConfig = {};
        //生成一个节点控制对象
        genernateNodeConfiguration(_node._nodeConfig, idAttrName, parentIdAttrName, sortAttrName);
        var _id = nodeAttrs[_node._nodeConfig.IdAttrName];
        if (_id == undefined || _id.length < 1) {
            //id不能为空
            return null;
        }
        var _pid = nodeAttrs[_node._nodeConfig.ParentIdAttrName];
        //设置好关键的id和parentId
        _node.id = _id;
        _node.parentId = _pid;
        _node.customAttrs = nodeAttrs;//附加自定义属性
        return _node;
    };
    /**一次添加若干子节点
     * @param customNodeArray 自定义的节点数组
     * @param idAttrName 属性对象中表示主键的属性名，如果为空则使用tree的默认属性名
     * @param parentIdAttrName 属性对象中表示父节点主键的属性名，如果为空则使用tree的默认属性名
     * @param sortAttrName 属性对象中表示排序的属性名，如果为空则使用tree的默认属性名
     * */
    _builder.appendNodes = function (customNodeArray, idAttrName, parentIdAttrName, sortAttrName) {
        if (customNodeArray != undefined && customNodeArray != null && customNodeArray.length > 0) {
            customNodeArray.forEach(function (aCustomNode) {
                _builder.appendNode(aCustomNode, idAttrName, parentIdAttrName, sortAttrName);
            });
        }
        return _builder;
    };
    /**添加一个子节点
     * @param aCustomNode 一个自定义节点对象
     * @param idAttrName 属性对象中表示主键的属性名，如果为空则使用tree的默认属性名
     * @param parentIdAttrName 属性对象中表示父节点主键的属性名，如果为空则使用tree的默认属性名
     * @param sortAttrName 属性对象中表示排序的属性名，如果为空则使用tree的默认属性名
     * */
    _builder.appendNode = function (aCustomNode, idAttrName, parentIdAttrName, sortAttrName) {
        if (_builder.defaultNodeConfig == undefined || _builder.defaultNodeConfig == null) {
            _builder.defaultNodeConfig = {};
            //添加缺省的节点控制对象
            genernateNodeConfiguration(_builder.defaultNodeConfig, idAttrName, parentIdAttrName, sortAttrName);
        }
        //解析一个自定义对象
        var _node = parseNodeAttr_(aCustomNode, idAttrName, parentIdAttrName, sortAttrName);
        var _existsNode = _builder.findNodeById(_node.id);
        if (_existsNode != null && _existsNode != undefined) {
            //说明已经存在了，拒绝加入
            return _builder;
        }
        if (_builder.allNodes == undefined || _builder.allNodes == null) {
            _builder.allNodes = [];
        }
        _builder.allNodes.push(_node);
        return _builder;
    };
    /**渲染所有节点，1、设置所有节点的子节点和父节点；2、计算总体的节点数、根节点、叶子节点数、最大深度；3、排序
     * @param sortFun 外部排序函数，如果不是有效函数，则调用内部排序函数
     * */
    _builder.renderNodes = function (sortFun) {
        if (_builder.allNodes == undefined || _builder.allNodes == null) {
            _builder.allNodes = [];
        }
        _builder.rootSize = 0;
        _builder.size = _builder.allNodes.length;
        _builder.leafSize = 0;
        _builder.maxDepth = 0;
        _builder.rootNodes = [];
        _builder.allNodes.forEach(function (_oneNode) {
            _oneNode.setChildren();
        });
        _builder.allNodes.forEach(function (_oneNode) {
            if (true == _oneNode.isLeaf()) {
                _builder.leafSize++
            }
            if (true == _oneNode.isRoot()) {
                _builder.rootNodes.push(_oneNode);
                _builder.rootSize++
            }
            var _nodeDepth = _oneNode.figureOutCurDepth();
            if (_builder.maxDepth < _nodeDepth) {
                _builder.maxDepth = _nodeDepth;
            }
            if (sortFun != undefined) {
                _oneNode.children = _oneNode.children.sort(sortFun);
            } else {
                _oneNode.children = _oneNode.children.sort(defaultSortFun);
            }
            setSubNodeIndex(_oneNode.children);//设置子节点的序号
        });
        //根节点排序和设置序号
        if (sortFun != undefined) {
            _builder.rootNodes = _builder.rootNodes.sort(sortFun);
        } else {
            _builder.rootNodes = _builder.rootNodes.sort(defaultSortFun);
        }
        setSubNodeIndex(_builder.rootNodes);
        return _builder;
    };
    /**返回一个带有虚拟根节点的树
     * */
    _builder.getVirtualRoot = function () {
        var _rNode = _builder.genernateAEmptyNode();
        _rNode.children = _builder.rootNodes;
        return _rNode;
    }
    return _builder;
};