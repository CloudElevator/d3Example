/**��װ���ڵ�Ĳ���
 * @author ��ʤ�
 * @createTime 2017��03��31��
 *
 * */
var lsnTree = function () {
        var _builder = {};//�����Ŀ��ƶ���
        /**����һ������*/
        _builder.genernateAEmptyNode = function () {
            var _treeNode = {};
            _treeNode.IdAttrName = 'id';//������������������ʹ�÷�����_node.customAttrs['id']
            _treeNode.ParentIdAttrName = 'parentId';//����������������ʹ�÷�����_node.customAttrs['parentId']
            _treeNode.SortAttrName = 'order';//����˳�����������ʹ�÷�����_node.customAttrs['order']

            _treeNode.id;//����
            _treeNode.parentId;//���ڵ�����������Ǹ��ڵ㣬��Ϊ��''
            _treeNode._index = 0;//�ڵ���ͬһ�㼶�е���ţ���Ϊ�Ǹ��ڵ㣬����ֻ����0
            _treeNode.size = 0;//���Ľڵ���
            _treeNode.leafSize = 0;//Ҷ�ӽڵ���
            _treeNode.maxDepth = 0;//���
            _treeNode.curDepth = 1;//��ǰ��ȣ���Ϊ�Ǹ��ڵ㣬����ֻ����1
            _treeNode.customAttrs;//�Զ������ԣ���һ��{}
            _treeNode.children;//�ӽڵ㣬��һ��[]

            /**�ı��������������������ֶ�
             * @param idAttrName �µ�����������
             * @param defaultAttrName ȱʡ����������
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
            /**�ı������������ڵ������������ֶ�
             * @param parentIdAttrName �µĸ��ڵ�����������
             * @param defaultAttrName ȱʡ���ڵ�����������
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
            /**�ı���������������ֶ�
             * @param sortAttrName �µ�����������
             * @param defaultAttrName ȱʡ����������
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
                    if (_existNode.parentId != _parentNode.id) {
                        _treeNode.removeNode(_existNode);
                        _treeNode.children.push(_node);
                    }
                }
                return _treeNode;
            };
            return _treeNode;
        };

        _builder.rootNode = null;//���ڵ�
        /**�����ڵ����
         * @param _rootNode ���ĸ��ڵ㣨�ڲ����󣩣���������ȱʡֵ
         * @param nodeAttrs �ڵ����Զ���
         * @param idAttrName ���Զ����б�ʾ�����������������Ϊ����ʹ��tree��Ĭ��������
         * @param parentIdAttrName ���Զ����б�ʾ���ڵ������������������Ϊ����ʹ��tree��Ĭ��������
         * @param sortAttrName ���Զ����б�ʾ����������������Ϊ����ʹ��tree��Ĭ��������
         * */
        _builder.parseNodeAttr_ = function (_rootNode, nodeAttrs, idAttrName, parentIdAttrName, sortAttrName) {
            if (nodeAttrs == undefined) {
                //���Բ���Ϊ��
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
                //id����Ϊ��
                return null;
            }
            var _pid = nodeAttrs[_node.ParentIdAttrName];
            _node.id = _id;
            _node.parentId = _pid;
            _node.customAttrs = nodeAttrs;
            return _node;
        };


        /**���һ���ӽڵ�
         * @param nodeAttrs �ӽڵ����Զ���
         * @param idAttrName ���Զ����б�ʾ�����������������Ϊ����ʹ��tree��Ĭ��������
         * @param parentIdAttrName ���Զ����б�ʾ���ڵ������������������Ϊ����ʹ��tree��Ĭ��������
         * @param sortAttrName ���Զ����б�ʾ����������������Ϊ����ʹ��tree��Ĭ��������
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