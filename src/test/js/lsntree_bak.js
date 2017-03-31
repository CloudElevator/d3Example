/**封装树节点的操作
 * @author 刘胜楠
 * @createTime 2017年03月31日
 *
 * */
var lsnTree = function () {
        var _builder = {};//建树的控制对象
        /**创建一个空树*/
        _builder.genernateAEmptyNode = function () {
            var _treeNode = {};
            _treeNode.IdAttrName = 'id';//描述主键的属性名，使用方法：_node.customAttrs['id']
            _treeNode.ParentIdAttrName = 'parentId';//描述父的属性名，使用方法：_node.customAttrs['parentId']
            _treeNode.SortAttrName = 'order';//描述顺序的属性名，使用方法：_node.customAttrs['order']

            _treeNode.id;//主键
            _treeNode.parentId;//父节点主键，如果是根节点，则为空''
            _treeNode._index = 0;//节点在同一层级中的序号，因为是根节点，所以只能是0
            _treeNode.size = 0;//树的节点数
            _treeNode.leafSize = 0;//叶子节点数
            _treeNode.maxDepth = 0;//深度
            _treeNode.curDepth = 1;//当前深度，因为是根节点，所以只能是1
            _treeNode.customAttrs;//自定义属性，是一个{}
            _treeNode.children;//子节点，是一个[]

            /**改变用于描述主键的属性字段
             * @param idAttrName 新的主键属性名
             * @param defaultAttrName 缺省主键属性名
             * */
            _treeNode.setIdAttrName = function (idAttrName, defaultAttrName) {
                if (idAttrName == undefined || idAttrName.trim().length < 1) {
                    if (defaultAttrName != undefined && defaultAttrName.length > 0) {
                        idAttrName = defaultAttrName;
                    } else {
                        idAttrName = "id";
                    }
                }
                _treeNode.IdAttrName = idAttrName;
                return _treeNode;
            };
            /**改变用于描述父节点主键的属性字段
             * @param parentIdAttrName 新的父节点主键属性名
             * @param defaultAttrName 缺省父节点主键属性名
             * */
            _treeNode.setParentIdAttrName = function (parentIdAttrName, defaultAttrName) {
                if (parentIdAttrName == undefined || parentIdAttrName.trim().length < 1) {
                    if (defaultAttrName != undefined && defaultAttrName.length > 0) {
                        parentIdAttrName = defaultAttrName;
                    } else {
                        parentIdAttrName = "parentId";
                    }
                }
                _treeNode.ParentIdAttrName = parentIdAttrName;
                return _treeNode;
            };
            /**改变用于排序的属性字段
             * @param sortAttrName 新的排序属性名
             * @param defaultAttrName 缺省排序属性名
             * */
            _treeNode.setSortAttrName = function (sortAttrName, defaultAttrName) {
                if (sortAttrName == undefined || sortAttrName.trim().length < 1) {
                    if (defaultAttrName != undefined && defaultAttrName.length > 0) {
                        sortAttrName = defaultAttrName;
                    } else {
                        sortAttrName = "parentId";
                    }
                }
                _treeNode.SortAttrName = sortAttrName;
                return _treeNode;
            };
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
                var _param1 = _node1.customAttrs[_node1.SortAttrName];
                var _param2 = _node2.customAttrs[_node2.SortAttrName];
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
                    if (_existNode.parentId != _parentNode.id) {
                        _treeNode.removeNode(_existNode);
                        _treeNode.children.push(_node);
                    }
                }
                return _treeNode;
            };
            return _treeNode;
        };

        _builder.rootNode = null;//根节点
        /**解析节点对象
         * @param _rootNode 树的根节点（内部对象），用于设置缺省值
         * @param nodeAttrs 节点属性对象
         * @param idAttrName 属性对象中表示主键的属性名，如果为空则使用tree的默认属性名
         * @param parentIdAttrName 属性对象中表示父节点主键的属性名，如果为空则使用tree的默认属性名
         * @param sortAttrName 属性对象中表示排序的属性名，如果为空则使用tree的默认属性名
         * */
        _builder.parseNodeAttr_ = function (_rootNode, nodeAttrs, idAttrName, parentIdAttrName, sortAttrName) {
            if (nodeAttrs == undefined) {
                //属性不能为空
                return null;
            }
            var _node = _builder.genernateAEmptyNode();
            if (_rootNode != null && _rootNode != undefined) {
                _node.setIdAttrName(idAttrName, _rootNode.IdAttrName);
                _node.setParentIdAttrName(parentIdAttrName, _rootNode.ParentIdAttrName);
                _node.setSortAttrName(sortAttrName, _rootNode.SortAttrName);
            } else {
                _node.setIdAttrName(idAttrName);
                _node.setParentIdAttrName(parentIdAttrName);
                _node.setSortAttrName(sortAttrName);
            }
            var _id = nodeAttrs[_node.IdAttrName];
            if (_id == undefined || _id.length < 1) {
                //id不能为空
                return null;
            }
            var _pid = nodeAttrs[_node.ParentIdAttrName];
            _node.id = _id;
            _node.parentId = _pid;
            _node.customAttrs = nodeAttrs;
            return _node;
        };


        /**添加一个子节点
         * @param nodeAttrs 子节点属性对象
         * @param idAttrName 属性对象中表示主键的属性名，如果为空则使用tree的默认属性名
         * @param parentIdAttrName 属性对象中表示父节点主键的属性名，如果为空则使用tree的默认属性名
         * @param sortAttrName 属性对象中表示排序的属性名，如果为空则使用tree的默认属性名
         * */
        _builder.appendNode = function (nodeAttrs, idAttrName, parentIdAttrName, sortAttrName) {
            var _node = _builder.parseNodeAttr_(_builder.rootNode, nodeAttrs, idAttrName, parentIdAttrName, sortAttrName);
            if (_builder.rootNode == undefined || _builder.rootNode == null) {
                _builder.rootNode = _node;
            } else {
                var _parentNodeId = _node.parentId;
                if (_parentNodeId == null || _parentNodeId == '') {
                    _builder.rootNode = _node;
                } else {
                    var _parentNode = _builder.rootNode.findNodeById(_parentNodeId);
                    if (_parentNode != undefined && _parentNode != null) {
                        _parentNode.appendNode(_node);
                    }
                }
            }
            return _builder;
        }
        return _builder;
    }
    ;