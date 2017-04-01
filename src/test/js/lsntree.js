/**��װ���ڵ�Ĳ���
 * @author ��ʤ�
 * @createTime 2017��03��31��
 *
 * */
var lsnTree;
lsnTree = function () {
    var _builder = {};//�����Ŀ��ƶ���
    _builder.defaultNodeConfig;//ȱʡ�Ľڵ�����
    _builder.rootSize = 0;//�м�����
    _builder.size = 0;//���Ľڵ���
    _builder.leafSize = 0;//Ҷ�ӽڵ���
    _builder.maxDepth = 0;//���
    _builder.allNodes = [];//ȫ���ڵ㣬ʹ�����Ա��Žڵ㣬���ٵݹ����
    _builder.rootNodes = [];//���ڵ�
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

    /**����һ���ڵ�
     * @param id �ڵ�����ֵ
     * @return _treeNode �����ҵ��Ľڵ㣨�ڲ�����
     * */
    _builder.findNodeById = function (id) {
        var _nodes = _builder.allNodes;
        if (_nodes != undefined && _nodes.length > 0) {
            for (var i = 0; i < _nodes.length; i++) {
                var _one = _nodes[i];//_one��_treeNode�ж���Ķ���
                if (_one.id != undefined && _one.id == id) {
                    return _one;
                }
            }
        }
        return null;
    };

    /**ɾ��ĳ���ӽڵ�
     * @param _node �ڵ�����ڲ�����
     * @return _treeNode���ڲ����󣩣����ر�ɾ���Ķ���
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
                //�������ĳ���ڵ���ӽڵ㣬��ôҲҪ�����
                if (undefined != _removedNode.parentNode && null != _removedNode.parentNode) {
                    _removedNode = _removedNode.parentNode.removeANodeFromChildren(_node.id);
                }
                return _removedNode;
            }
        }
        return _removedNode;
    };
    /**����һ������*/
    _builder.genernateAEmptyNode = function () {
        var _treeNode = {};
        _treeNode.id = undefined;//����
        _treeNode.parentId = undefined;//���ڵ�����������Ǹ��ڵ㣬��Ϊ��''
        _treeNode.parentNode = undefined;//���ڵ�
        _treeNode.rootNode = undefined;//���ڵ�
        _treeNode._nodeConfig = {};//�ڵ���ƶ���
        _treeNode.index = -1;//�ڵ���ͬһ�㼶�е����
        _treeNode.curDepth = 1;//�ڵ����
        _treeNode.customAttrs = {};//�Զ������ԣ���һ��{}
        _treeNode.children = [];//�ӽڵ㣬��һ��[]
        /**���ݸ��ڵ�Id�жϸýڵ��Ƿ��Ǹ��ڵ�*/
        _treeNode.isRoot = function () {
            return undefined == _treeNode.parentId || null == _treeNode.parentId || _treeNode.parentId.length < 1;
        };
        /**�����ӽڵ��жϸýڵ��Ƿ���Ҷ��*/
        _treeNode.isLeaf = function () {
            return undefined == _treeNode.children || null == _treeNode.children || _treeNode.children.length < 1;
        };
        /**��ȫ�ֽڵ��������ҵ��ýڵ���ӽڵ�
         * ǰ�����������нڵ��id��parentId�����ú���
         * */
        _treeNode.setChildren = function () {
            _treeNode.children = [];
            var _nodes = _builder.allNodes;
            if (_nodes != undefined && _nodes.length > 0) {
                for (var i = 0; i < _nodes.length; i++) {
                    var _one = _nodes[i];//_one��_treeNode�ж���Ķ���
                    if (_one.parentId != undefined && _one.parentId == _treeNode.id) {
                        _one.parentNode = _treeNode;//ͬʱ�����ӽڵ�ĸ��ڵ�ָ��
                        _treeNode.children.push(_one);
                    }
                }
            }
            return _treeNode;
        };

        /**�����нڵ�ƽ�滯*/
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
        /**����ýڵ�����
         * ǰ�������нڵ��parentNode�����ú���
         * */
        _treeNode.figureOutCurDepth = function () {
            var _pNode = this.parentNode;
            var _depth = 1;
            while (undefined != _pNode && undefined != _pNode.id) {
                _depth++;
                if (_pNode.isRoot()) {
                    this.rootNode = _pNode;//���ø��ڵ�
                }
                _pNode = _pNode.parentNode;
            }
            this.curDepth = _depth;
            return this.curDepth;
        };
        /**������Ѱ������Ϊid�Ľڵ�
         * ǰ���������ӽڵ��children�����ú���
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

        /**ɾ��ĳ���ӽڵ�
         * @param id �ӽڵ�����ֵ
         * @return _removedNode���ڲ����󣩣����ر�ɾ���Ķ���
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
    //////////////////����һ�ÿ�������////////////////////////////////

    /**����ýڵ���ӽڵ���ͬһ�㼶�е����
     * ǰ�������нڵ��parentNode��children�����ú���
     * */
    var setSubNodeIndex = function (nodeArray) {
        if (nodeArray != undefined && nodeArray.length > 0) {
            nodeArray.forEach(function (_subNode, _index) {
                _subNode.index = _index;
            });
        }
    };
    /**ȱʡ���ڲ�������
     * @param _node1 ���ڱȽϵĽڵ�1���ڲ�����
     * @param _node2 ���ڱȽϵĽڵ�2���ڲ�����
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
        //��������־Ͱ���������
        if (!isNaN(_param1) && !isNaN(_param2)) {
            return Number(_param1) - Number(_param2);
        }
        //�������ְ��ַ����Ƚ�������
        return _param1 - _param2;
    };
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
        var _node = _builder.genernateAEmptyNode();//����һ�ÿ���
        _node._nodeConfig = {};
        //����һ���ڵ���ƶ���
        genernateNodeConfiguration(_node._nodeConfig, idAttrName, parentIdAttrName, sortAttrName);
        var _id = nodeAttrs[_node._nodeConfig.IdAttrName];
        if (_id == undefined || _id.length < 1) {
            //id����Ϊ��
            return null;
        }
        var _pid = nodeAttrs[_node._nodeConfig.ParentIdAttrName];
        //���úùؼ���id��parentId
        _node.id = _id;
        _node.parentId = _pid;
        _node.customAttrs = nodeAttrs;//�����Զ�������
        return _node;
    };
    /**һ����������ӽڵ�
     * @param customNodeArray �Զ���Ľڵ�����
     * @param idAttrName ���Զ����б�ʾ�����������������Ϊ����ʹ��tree��Ĭ��������
     * @param parentIdAttrName ���Զ����б�ʾ���ڵ������������������Ϊ����ʹ��tree��Ĭ��������
     * @param sortAttrName ���Զ����б�ʾ����������������Ϊ����ʹ��tree��Ĭ��������
     * */
    _builder.appendNodes = function (customNodeArray, idAttrName, parentIdAttrName, sortAttrName) {
        if (customNodeArray != undefined && customNodeArray != null && customNodeArray.length > 0) {
            customNodeArray.forEach(function (aCustomNode) {
                _builder.appendNode(aCustomNode, idAttrName, parentIdAttrName, sortAttrName);
            });
        }
        return _builder;
    };
    /**���һ���ӽڵ�
     * @param aCustomNode һ���Զ���ڵ����
     * @param idAttrName ���Զ����б�ʾ�����������������Ϊ����ʹ��tree��Ĭ��������
     * @param parentIdAttrName ���Զ����б�ʾ���ڵ������������������Ϊ����ʹ��tree��Ĭ��������
     * @param sortAttrName ���Զ����б�ʾ����������������Ϊ����ʹ��tree��Ĭ��������
     * */
    _builder.appendNode = function (aCustomNode, idAttrName, parentIdAttrName, sortAttrName) {
        if (_builder.defaultNodeConfig == undefined || _builder.defaultNodeConfig == null) {
            _builder.defaultNodeConfig = {};
            //���ȱʡ�Ľڵ���ƶ���
            genernateNodeConfiguration(_builder.defaultNodeConfig, idAttrName, parentIdAttrName, sortAttrName);
        }
        //����һ���Զ������
        var _node = parseNodeAttr_(aCustomNode, idAttrName, parentIdAttrName, sortAttrName);
        var _existsNode = _builder.findNodeById(_node.id);
        if (_existsNode != null && _existsNode != undefined) {
            //˵���Ѿ������ˣ��ܾ�����
            return _builder;
        }
        if (_builder.allNodes == undefined || _builder.allNodes == null) {
            _builder.allNodes = [];
        }
        _builder.allNodes.push(_node);
        return _builder;
    };
    /**��Ⱦ���нڵ㣬1���������нڵ���ӽڵ�͸��ڵ㣻2����������Ľڵ��������ڵ㡢Ҷ�ӽڵ����������ȣ�3������
     * @param sortFun �ⲿ�����������������Ч������������ڲ�������
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
            setSubNodeIndex(_oneNode.children);//�����ӽڵ�����
        });
        //���ڵ�������������
        if (sortFun != undefined) {
            _builder.rootNodes = _builder.rootNodes.sort(sortFun);
        } else {
            _builder.rootNodes = _builder.rootNodes.sort(defaultSortFun);
        }
        setSubNodeIndex(_builder.rootNodes);
        return _builder;
    };
    /**����һ������������ڵ����
     * */
    _builder.getVirtualRoot = function () {
        var _rNode = _builder.genernateAEmptyNode();
        _rNode.children = _builder.rootNodes;
        return _rNode;
    }
    return _builder;
};