/**封装树节点的操作
 * @author 刘胜楠
 * @createTime 2017年03月31日
 *
 * */
var lsnTree = function () {
        var _builder = {};//建树的控制对象
        _builder.defaultNodeConfig;//缺省的节点配置
        _builder.size = 0;//树的节点数
        _builder.leafSize = 0;//叶子节点数
        _builder.maxDepth = 0;//深度
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

        /**创建一个空树*/
        _builder.genernateAEmptyNode = function () {
            var _treeNode = {};
            _treeNode.id = undefined;//主键
            _treeNode.parentId = undefined;//父节点主键，如果是根节点，则为空''
            _treeNode._nodeConfig = {};//节点控制对象
            _treeNode._index = 0;//节点在同一层级中的序号，因为是根节点，所以只能是0
            _treeNode.size = 0;//树的节点数
            _treeNode.leafSize = 0;//叶子节点数
            _treeNode.maxDepth = 0;//深度
            _treeNode.curDepth = 1;//当前深度，因为是根节点，所以只能是1
            _treeNode.customAttrs;//自定义属性，是一个{}
            _treeNode.children;//子节点，是一个[]

            /**从向下寻找主键为id的节点
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
            /**缺省的内部排序函数
             * @param _node1 用于比较的节点1（内部对象）
             * @param _node2 用于比较的节点2（内部对象）
             * */
            _treeNode.sort_ = function (_node1, _node2) {
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
            /**计算节点数、叶子节点数和深度
             * @param curDepth 当前深度
             * @param sortFun 外部排序函数，如果不是有效函数，则调用内部排序函数
             * */
            _treeNode.figureOut = function (curDepth, sortFun) {
                if (curDepth == undefined || curDepth < 1) {
                    curDepth = 1;
                }
                _treeNode.size = 1;//初始为1
                _treeNode.leafSize = 0;//初始为0
                _treeNode.maxDepth = 1;//初始为1
                _treeNode.curDepth = curDepth;//初始为传入的当前深度
                if (_treeNode.children != undefined && _treeNode.children.length > 0) {//如果还有子节点，则递归计算子节点
                    //先排个序
                    if (sortFun != undefined) {
                        _treeNode.children = _treeNode.children.sort(sortFun);
                    } else {
                        _treeNode.children = _treeNode.children.sort(_treeNode.sort_);
                    }
                    var _nextDepth = curDepth + 1;
                    _treeNode.maxDepth++;//如果有子节点，那么深度自少是2
                    for (var i = 0; i < _treeNode.children.length; i++) {
                        var _oneNode = _treeNode.children[i];
                        _oneNode._index = i;//设置序号
                        _oneNode.parentId = _treeNode.id;//设置父节点id
                        _oneNode.figureOut(_nextDepth, sortFun);
                        if (_oneNode.size <= 1) {//再无子节点了
                            _treeNode.size++;
                            _treeNode.leafSize++;
                        } else {
                            _treeNode.size = _treeNode.size + 1 + _oneNode.size;
                            _treeNode.leafSize = _treeNode.leafSize + _oneNode.leafSize;
                            var _subNodeMaxDepth = _oneNode.maxDepth + 1;
                            if (_subNodeMaxDepth > _treeNode.maxDepth) {
                                _treeNode.maxDepth = _subNodeMaxDepth;
                            }
                        }
                    }
                } else {
                    _treeNode.leafSize = 1;//如果没有子节点，则自己就是叶子节点
                }
                return _treeNode;
            };
            /**删除某个子节点
             * @param id 子节点主键值
             * @return _removedNode（内部对象），返回被删除的对象
             * */
            _treeNode.removeANodeFromChildren = function (id) {
                var _children = _treeNode.children;
                if (_children != undefined && _children.length > 0) {
                    var _index = -1;
                    var _removedNode;
                    for (var i = 0; (i < _children.length && _index < 0); i++) {
                        var _oneNode = _children[i];
                        if (_oneNode.id != undefined && id == _oneNode.id) {
                            _index = i;
                            _removedNode = _oneNode;
                        }
                    }
                    if (_index >= 0) {
                        _treeNode.children.slice(_index, 1);
                        return _removedNode;
                    }
                }
                return null;
            };
            /**删除某个子节点
             * @param _node 节点对象（内部对象）
             * @return _removedNode（内部对象），返回被删除的对象
             * */
            _treeNode.removeNode = function (_node) {
                //根节点不能删除
                if (_node.parentId != null && _node.parentId != undefined) {
                    var _parentNode = _treeNode.findNodeById(_node.parentId);//查找父节点
                    return _parentNode.removeANodeFromChildren(_node.id);
                }
            };
            /**添加一个子节点
             * @param _node 子节点（内部对象）
             * */
            _treeNode.appendNode = function (_node) {
                var _existNode = _treeNode.findNodeById(_node.id);//查找子节点
                if (_existNode == null || _existNode == undefined) {//如果不存在则新增节点
                    _node.parentId = _treeNode.id;
                    if (_treeNode.children == undefined) {
                        _treeNode.children = [];
                    }
                    _treeNode.children.push(_node);
                } else {//节点已存在
                    // 如果父节点不一致，则迁移到新的父节点之下
                    if (_existNode.parentId != _treeNode.id) {
                        _treeNode.removeNode(_existNode);
                        _treeNode.children.push(_node);
                    }
                }
                return _treeNode;
            };
            return _treeNode;
        };

        _builder.rootNode = {children: []};//根节点
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
            var _node = _builder.genernateAEmptyNode();
            _node._nodeConfig = {};
            genernateNodeConfiguration(_node._nodeConfig, idAttrName, parentIdAttrName, sortAttrName);
            var _id = nodeAttrs[_node._nodeConfig.IdAttrName];
            if (_id == undefined || _id.length < 1) {
                //id不能为空
                return null;
            }
            var _pid = nodeAttrs[_node._nodeConfig.ParentIdAttrName];
            _node.id = _id;
            _node.parentId = _pid;
            _node.customAttrs = nodeAttrs;
            return _node;
        };
        /**查找一个节点
         * @param id 节点主键值
         * @return _targetNode 返回找到的节点（内部对象）
         * */
        _builder.findNodeById = function (id) {
            var _targetNode = null;
            var _nodes = _builder.rootNode.children;
            if (_nodes.length > 0) {
                for (var i = 0; i < _nodes.length; i++) {
                    var _root = _nodes[i];
                    _targetNode = _root.findNodeById(id);
                    if (_targetNode != null && _targetNode != undefined) {
                        return _targetNode;
                    }
                }
            }
            return _targetNode;
        };
        /**查找一个节点
         * @param id 节点主键值
         * @return _targetNode 返回找到的节点（内部对象）
         * */
        _builder.figureOut = function (curDepth, sortFun) {
            _builder.size = 0;
            _builder.leafSize = 0;
            _builder.maxDepth = 0;
            var _nodes = _builder.rootNode.children;
            if (_nodes.length > 0) {
                for (var i = 0; i < _nodes.length; i++) {
                    var _root = _nodes[i];
                    _root.figureOut(curDepth, sortFun);
                    _builder.size = _builder.size + _root.size;
                    _builder.leafSize = _builder.leafSize + _root.leafSize;
                    if (_root.maxDepth > _builder.maxDepth) {
                        _builder.maxDepth = _root.maxDepth;
                    }
                }
            }
            return _builder;
        };
        /**添加一个子节点
         * @param nodeAttrs 子节点属性对象
         * @param idAttrName 属性对象中表示主键的属性名，如果为空则使用tree的默认属性名
         * @param parentIdAttrName 属性对象中表示父节点主键的属性名，如果为空则使用tree的默认属性名
         * @param sortAttrName 属性对象中表示排序的属性名，如果为空则使用tree的默认属性名
         * */
        _builder.appendNode = function (nodeAttrs, idAttrName, parentIdAttrName, sortAttrName) {
            if (_builder.defaultNodeConfig == undefined || _builder.defaultNodeConfig == null) {
                _builder.defaultNodeConfig = {};
                genernateNodeConfiguration(_builder.defaultNodeConfig, idAttrName, parentIdAttrName, sortAttrName);
            }
            var _node = parseNodeAttr_(nodeAttrs, idAttrName, parentIdAttrName, sortAttrName);
            if (_builder.rootNode == undefined || _builder.rootNode == null) {
                _builder.rootNode = {children: []};
            } else if (_builder.rootNode.children == undefined) {
                _builder.rootNode.children = [];
            }
            var _parentNodeId = _node.parentId;
            if (_parentNodeId == null || _parentNodeId == '') {
                _builder.rootNode.children.push(_node);
            } else {
                var _parentNode = _builder.findNodeById(_parentNodeId);
                if (_parentNode != undefined && _parentNode != null) {
                    _parentNode.appendNode(_node);
                }
            }
            return _builder;
        };
        return _builder;
    }
    ;