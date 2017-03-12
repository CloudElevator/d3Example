/*
 *  дһ������d3��������ͨ��js
 *  @param tableContainer ������������
 */
var createTableModelByD3 = function (tableContainer) {
    var that = {};//���ظ�������
    ////////////////////���ƾ�̬����start/////////////////////////////////
    /**�жϱ��������Ƿ�Ϊ��*/
    that.isNullArray = function (array) {
        if (array != null && array != undefined && array.length > 0) {
            return false;
        }
        return true;
    }
    /**����һ�����鿽��*/
    that.cloneArray = function (array) {
        if (that.isNullArray(array)) {
            return [];
        }
        var newArray = [];
        for (var i = 0; i < array.length; i++) {
            newArray[i] = array[i];
        }
        return newArray;
    }
    ////////////////////���ƾ�̬����end/////////////////////////////////

    that.container = tableContainer;//�������
    that.table = null;//������
    that.showTableHeader = true;//��ʶ�Ƿ���ʾ��ͷ
    that.thead = null;//��ͷ
    that.tbody = null;//����
    that.tfoot = null;//ҳ��
    /**��ʼ�����*/
    that.initTable = function () {
        try {
            d3.select(that.container).html("");//��ʼ���ű���λ��
            that.table = d3.select(that.container).append("table");//�������
        } catch (e) {
            that.container.html("");//��ʼ���ű���λ��
            that.table = that.container.append("table");//�������
        }
        that.thead = that.table.append("thead").append("tr");
        that.tbody = that.table.append("tbody");
        that.tfoot = that.table.append("tfoot").append("tr");
    };
    /**���ұ�ͷĳһ��
     * @param columnNumber �кţ���0��ʼ
     * @return ����ָ��λ�õĵ�Ԫ�������Ȼ��d3.section����
     * */
    that.getTheadCell = function (columnNumber) {
        if (that.thead == null || that.thead == undefined) {
            return null;
        }
        if (columnNumber == null || columnNumber == undefined || columnNumber < 0) {
            return null;
        }
        return d3.select(that.thead.selectAll("td")[0][columnNumber]);
    };
    /**����ҳ��ĳһ��
     * @param columnNumber �кţ���0��ʼ
     * @return ����ָ��λ�õĵ�Ԫ�������Ȼ��d3.section����
     * */
    that.getTFootCell = function (columnNumber) {
        if (that.tfoot == null || that.tfoot == undefined) {
            return null;
        }
        if (columnNumber == null || columnNumber == undefined || columnNumber < 0) {
            return null;
        }
        return d3.select(that.tfoot.selectAll("td")[0][columnNumber]);
    };
    /**ͳ�Ƶ�ǰ��������
     * @return ��������
     * */
    that.getRowSize = function () {
        var trs = that.tbody.selectAll("tr");
        return trs[0].length;
    };
    /**����һ������
     * @param rowNumber �кţ���0��ʼ
     * @return ����ָ���ж�����Ȼ��d3.section����
     * */
    that.getRow = function (rowNumber) {
        if (rowNumber == null || rowNumber == undefined || rowNumber < 0 || rowNumber > that.getRowSize()) {
            return null;
        }
        var trs = that.tbody.selectAll("tr");
        return d3.select(trs[0][rowNumber]);
    };
    /**ͳ�Ƶ�ǰ��������
     * @return ��������
     * */
    that.getColumnSize = function () {
        try {
            var tds = that.getRow(0).selectAll("td");
            return tds[0].length;
        } catch (e) {
            return 0;
        }
    };
    /**����ĳһ��ĳһ�е�����
     * @param rowNumber �кţ���0��ʼ
     * @param columnNumber �кţ���0��ʼ
     * @return ����ָ��λ�õĵ�Ԫ�������Ȼ��d3.section����
     * */
    that.getCell = function (rowNumber, columnNumber) {
        if (columnNumber == null || columnNumber == undefined || columnNumber < 0 || columnNumber > that.getColumnSize()) {
            return null;
        }
        var rowComponent = that.getRow(rowNumber);
        if (rowComponent == null || rowComponent == undefined) {
            return null;
        }
        return d3.select(rowComponent.selectAll("td")[0][columnNumber]);
    };

    /**���õݹ�ķ����ָ����ڵĵ�Ԫ��
     * @param rowNumber �ϲ�����ʼ�к�
     * @param columnNumber �ϲ�����ʼ�к�
     * @param from ����һ�������������������Լ�����һ��������/��/��/�ҵ���һ����������ġ�
     * @return ���ػָ���ĵ�Ԫ�������Ȼ��d3.section����
     * */
    that.restoreCellByRecursion = function (rowNumber, columnNumber, from) {
        var _cell = that.getCell(rowNumber, columnNumber);
        var _colspan = _cell.attr("colspan");
        var _rowspan = _cell.attr("rowspan");
        var _display = _cell.style("display");
        if ("none" == _display) {
            //���������״̬�ģ�˵����Ҫ�ָ�
            _cell.attr("colspan", null).attr("rowspan", null).style("display", null);
            if (from == undefined || from == null) {
                that.restoreCellByRecursion(rowNumber - 1, columnNumber, "up");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber, columnNumber - 1, "left");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//�ݹ���һ��
            } else if ("up" == from) {
                that.restoreCellByRecursion(rowNumber - 1, columnNumber, "up");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber, columnNumber - 1, "left");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//�ݹ���һ��
            } else if ("down" == from) {
                that.restoreCellByRecursion(rowNumber, columnNumber - 1, "left");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//�ݹ���һ��
            } else if ("left" == from) {
                that.restoreCellByRecursion(rowNumber, columnNumber - 1, "left");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber - 1, columnNumber, "up");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//�ݹ���һ��
            } else if ("right" == from) {
                that.restoreCellByRecursion(rowNumber - 1, columnNumber, "up");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//�ݹ���һ��
                that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//�ݹ���һ��
            } else {
                alert(rowNumber + "," + columnNumber);
            }
        } else if (from != undefined && (_colspan != undefined || _rowspan != undefined)) {
            if ("up" == from && parseInt(_rowspan) > 1) {
                //����Ǵ�����ĸ������������ģ��Ҵ˿�������һ��_rowspan>1�ģ��Ǿͱ�������ָ�
                _cell.attr("colspan", null).attr("rowspan", null).style("display", null);
            } else if ("left" == from && parseInt(_colspan) > 1) {
                //����Ǵ�����ĸ������������ģ��Ҵ˿�������һ��_colspan>1�ģ��Ǿͱ�������ָ�
                _cell.attr("colspan", null).attr("rowspan", null).style("display", null);
            }
        }
        return _cell;
    }
    /**�Ӻϲ�״̬�ָ�ԭ�����������꣬���õ�Ԫ�����ϲ������и��ӻ�ԭ
     * @param rowNumber �ϲ�����ʼ�к�
     * @param columnNumber �ϲ�����ʼ�к�
     * @return d3.section ���ر��ָ���ָ����Ԫ�����
     * */
    that.antiMerger = function (rowNumber, columnNumber) {
        var _cell = that.restoreCellByRecursion(rowNumber, columnNumber);
        var _colspan = _cell.attr("colspan");
        var _rowspan = _cell.attr("rowspan");
        _cell.attr("colspan", null).attr("rowspan", null).style("display", null);
        if (_colspan != undefined && _colspan > 1) {
            that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//�ݹ���һ��
        }
        if (_rowspan != undefined && _rowspan > 1) {
            that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//�ݹ���һ��
        }
        return _cell;
    }
    /**�Ӻϲ�״̬�ָ�һ��������������е�Ԫ��
     * @param rowNumberStart �����������ʼ�к�
     * @param columnNumberStart �����������ʼ�к�
     * @param rowNumberEnd �����������ֹ�к�
     * @param columnNumberEnd �����������ֹ�к�
     * @return ����that����
     * */
    that.antiMergerARectangle = function (rowNumberStart, columnNumberStart, rowNumberEnd, columnNumberEnd) {
        if (rowNumberEnd < rowNumberStart) {
            return that;
        }
        if (columnNumberEnd < columnNumberStart) {
            return that;
        }
        for (var _row_i = rowNumberStart; _row_i < rowNumberEnd; _row_i++) {
            for (var _col_i = columnNumberStart; _col_i < columnNumberEnd; _col_i++) {
                that.antiMerger(_row_i, _col_i);//�ָ��ϲ��ĵ�Ԫ��
            }
        }
        return that;
    }
    /**���úϲ���Ԫ��
     * @param rowNumber �ϲ�����ʼ�к�
     * @param columnNumber �ϲ�����ʼ�к�
     * @param colspan �ϲ�������
     * @param rowspan �ϲ�������
     * @return ���غϲ��õĵ�Ԫ�������Ȼ��d3.section����
     * */
    that.merge = function (rowNumber, columnNumber, colspan, rowspan) {
        var _rowSize = that.getRowSize();
        var _columnSize = that.getColumnSize();
        if (rowspan < 1) {
            rowspan = 1;
        } else if (rowNumber + rowspan > _rowSize) {
            rowspan = _rowSize - rowNumber;//���ֻ�ܺϲ���ĩ��
        }
        if (colspan < 1) {
            colspan = 1;
        } else if (columnNumber + colspan > _columnSize) {
            colspan = t_columnSize - columnNumber;//���ֻ�ܺϲ������һ��
        }
        var _oneCell = that.getCell(rowNumber, columnNumber);
        if (_oneCell != null && _oneCell != undefined) {
            //�Ȼָ���صĵ�Ԫ�������кϲ��ģ������ǲ�
            that.antiMergerARectangle(rowNumber, columnNumber, rowNumber + rowspan - 1, columnNumber + colspan - 1);
            if (colspan > 1) {
                _oneCell.attr("colspan", colspan);
            }
            if (rowspan > 1) {
                _oneCell.attr("rowspan", rowspan);
            }
            if (colspan > 1 || rowspan > 1) {
                //�������ı�Ϊ����
                for (var row_i = 0; row_i < rowspan; row_i++) {
                    for (var col_i = 0; col_i < colspan; col_i++) {
                        if (col_i == 0 && row_i == 0) {

                        } else {
                            var _hiddenOne = that.getCell(rowNumber + row_i, columnNumber + col_i);
                            _hiddenOne.attr("colspan", null).attr("rowspan", null).style("display", "none");
                        }
                    }
                }
            }
        }
        return _oneCell;
    }
    return that;
}