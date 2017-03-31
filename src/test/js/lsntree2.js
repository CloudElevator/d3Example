/**��װ���ڵ�Ĳ���
 * @author ��ʤ�
 * @createTime 2017��03��31��
 *
 * */
var lsnTree = function () {
        var _builder = {};//�����Ŀ��ƶ���
        _builder.defaultNodeConfig;//ȱʡ�Ľڵ�����
        _builder.size = 0;//���Ľڵ���
        _builder.leafSize = 0;//Ҷ�ӽڵ���
        _builder.maxDepth = 0;//���
        /**����һ���ڵ���ƶ���
         * @param nodeConfig ���ڰ󶨿������ԵĽڵ����һ�㴫���½�����ͺã�����{}
         * @param idAttrName ��ʾ�����������������Ϊ����ʹ��'id'
         * @param parentIdAttrName ��ʾ���ڵ������������������Ϊ����ʹ��'parentId'
         * @param sortAttrName ��ʾ����������������Ϊ����ʹ�� 'order'
         * @return _config ���ؿ��ƶ����ڲ�����
         * */
        var genernateNodeConfiguration = function (nodeConfig, idAttrName, parentIdAttrName, sortAttrName) {
            nodeConfig.IdAttrName = 'id'; //������������������ʹ�÷�����_node.customAttrs['id']
            nodeConfig.ParentIdAttrName = 'parentId';//����������������ʹ�÷�����_node.customAttrs['parentId']
            nodeConfig.SortAttrName = 'order';//����˳�����������ʹ�÷�����_node.customAttrs['order']

            /**�ı��������������������ֶ�
             * @param idAttrName �µ�����������
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
            /**�ı������������ڵ������������ֶ�
             * @param parentIdAttrName �µĸ��ڵ�����������
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
            /**�ı���������������ֶ�
             * @param sortAttrName �µ�����������
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

        /**����һ������*/
        _builder.genernateAEmptyNode = function () {
            var _treeNode = {};
            _treeNode.id = undefined;//����
            _treeNode.parentId = undefined;//���ڵ�����������Ǹ��ڵ㣬��Ϊ��''
            _treeNode._nodeConfig = {};//�ڵ���ƶ���
            _treeNode._index = 0;//�ڵ���ͬһ�㼶�е���ţ���Ϊ�Ǹ��ڵ㣬����ֻ����0
            _treeNode.size = 0;//���Ľڵ���
            _treeNode.leafSize = 0;//Ҷ�ӽڵ���
            _treeNode.maxDepth = 0;//���
            _treeNode.curDepth = 1;//��ǰ��ȣ���Ϊ�Ǹ��ڵ㣬����ֻ����1
            _treeNode.customAttrs;//�Զ������ԣ���һ��{}
            _treeNode.children;//�ӽڵ㣬��һ��[]

            /**������Ѱ������Ϊid�Ľڵ�
             * @param id �ڵ�����ֵ
             * @return  �����ҵ��Ľڵ㣨�ڲ�����
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
            /**ȱʡ���ڲ�������
             * @param _node1 ���ڱȽϵĽڵ�1���ڲ�����
             * @param _node2 ���ڱȽϵĽڵ�2���ڲ�����
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
                //��������־Ͱ���������
                if (!isNaN(_param1) && !isNaN(_param2)) {
                    return Number(_param1) - Number(_param2);
                }
                //�������ְ��ַ����Ƚ�������
                return _param1 - _param2;
            };
            /**����ڵ�����Ҷ�ӽڵ��������
             * @param curDepth ��ǰ���
             * @param sortFun �ⲿ�����������������Ч������������ڲ�������
             * */
            _treeNode.figureOut = function (curDepth, sortFun) {
                if (curDepth == undefined || curDepth < 1) {
                    curDepth = 1;
                }
                _treeNode.size = 1;//��ʼΪ1
                _treeNode.leafSize = 0;//��ʼΪ0
                _treeNode.maxDepth = 1;//��ʼΪ1
                _treeNode.curDepth = curDepth;//��ʼΪ����ĵ�ǰ���
                if (_treeNode.children != undefined && _treeNode.children.length > 0) {//��������ӽڵ㣬��ݹ�����ӽڵ�
                    //���Ÿ���
                    if (sortFun != undefined) {
                        _treeNode.children = _treeNode.children.sort(sortFun);
                    } else {
                        _treeNode.children = _treeNode.children.sort(_treeNode.sort_);
                    }
                    var _nextDepth = curDepth + 1;
                    _treeNode.maxDepth++;//������ӽڵ㣬��ô���������2
                    for (var i = 0; i < _treeNode.children.length; i++) {
                        var _oneNode = _treeNode.children[i];
                        _oneNode._index = i;//�������
                        _oneNode.parentId = _treeNode.id;//���ø��ڵ�id
                        _oneNode.figureOut(_nextDepth, sortFun);
                        if (_oneNode.size <= 1) {//�����ӽڵ���
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
                    _treeNode.leafSize = 1;//���û���ӽڵ㣬���Լ�����Ҷ�ӽڵ�
                }
                return _treeNode;
            };
            /**ɾ��ĳ���ӽڵ�
             * @param id �ӽڵ�����ֵ
             * @return _removedNode���ڲ����󣩣����ر�ɾ���Ķ���
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
            /**ɾ��ĳ���ӽڵ�
             * @param _node �ڵ�����ڲ�����
             * @return _removedNode���ڲ����󣩣����ر�ɾ���Ķ���
             * */
            _treeNode.removeNode = function (_node) {
                //���ڵ㲻��ɾ��
                if (_node.parentId != null && _node.parentId != undefined) {
                    var _parentNode = _treeNode.findNodeById(_node.parentId);//���Ҹ��ڵ�
                    return _parentNode.removeANodeFromChildren(_node.id);
                }
            };
            /**���һ���ӽڵ�
             * @param _node �ӽڵ㣨�ڲ�����
             * */
            _treeNode.appendNode = function (_node) {
                var _existNode = _treeNode.findNodeById(_node.id);//�����ӽڵ�
                if (_existNode == null || _existNode == undefined) {//����������������ڵ�
                    _node.parentId = _treeNode.id;
                    if (_treeNode.children == undefined) {
                        _treeNode.children = [];
                    }
                    _treeNode.children.push(_node);
                } else {//�ڵ��Ѵ���
                    // ������ڵ㲻һ�£���Ǩ�Ƶ��µĸ��ڵ�֮��
                    if (_existNode.parentId != _treeNode.id) {
                        _treeNode.removeNode(_existNode);
                        _treeNode.children.push(_node);
                    }
                }
                return _treeNode;
            };
            return _treeNode;
        };

        _builder.rootNode = {children: []};//���ڵ�
        /**�����ڵ����
         * @param nodeAttrs �ڵ����Զ���
         * @param idAttrName ���Զ����б�ʾ�����������������Ϊ����ʹ��tree��Ĭ��������
         * @param parentIdAttrName ���Զ����б�ʾ���ڵ������������������Ϊ����ʹ��tree��Ĭ��������
         * @param sortAttrName ���Զ����б�ʾ����������������Ϊ����ʹ��tree��Ĭ��������
         * */
        var parseNodeAttr_ = function (nodeAttrs, idAttrName, parentIdAttrName, sortAttrName) {
            if (nodeAttrs == undefined) {
                //���Բ���Ϊ��
                return null;
            }
            var _node = _builder.genernateAEmptyNode();
            _node._nodeConfig = {};
            genernateNodeConfiguration(_node._nodeConfig, idAttrName, parentIdAttrName, sortAttrName);
            var _id = nodeAttrs[_node._nodeConfig.IdAttrName];
            if (_id == undefined || _id.length < 1) {
                //id����Ϊ��
                return null;
            }
            var _pid = nodeAttrs[_node._nodeConfig.ParentIdAttrName];
            _node.id = _id;
            _node.parentId = _pid;
            _node.customAttrs = nodeAttrs;
            return _node;
        };
        /**����һ���ڵ�
         * @param id �ڵ�����ֵ
         * @return _targetNode �����ҵ��Ľڵ㣨�ڲ�����
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
        /**����һ���ڵ�
         * @param id �ڵ�����ֵ
         * @return _targetNode �����ҵ��Ľڵ㣨�ڲ�����
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
        /**���һ���ӽڵ�
         * @param nodeAttrs �ӽڵ����Զ���
         * @param idAttrName ���Զ����б�ʾ�����������������Ϊ����ʹ��tree��Ĭ��������
         * @param parentIdAttrName ���Զ����б�ʾ���ڵ������������������Ϊ����ʹ��tree��Ĭ��������
         * @param sortAttrName ���Զ����б�ʾ����������������Ϊ����ʹ��tree��Ĭ��������
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