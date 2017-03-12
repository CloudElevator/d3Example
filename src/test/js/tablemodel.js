/*
 *  写一个利用d3创建表格的通用js
 *  @param tableContainer 创建表格的容器
 */
var createTableModelByD3 = function (tableContainer) {
    var that = {};//返回给外层调用
    ////////////////////类似静态方法start/////////////////////////////////
    /**判断标题数组是否为空*/
    that.isNullArray = function (array) {
        if (array != null && array != undefined && array.length > 0) {
            return false;
        }
        return true;
    }
    /**返回一份数组拷贝*/
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
    ////////////////////类似静态方法end/////////////////////////////////

    that.container = tableContainer;//表格容器
    that.table = null;//表格对象
    that.showTableHeader = true;//标识是否显示表头
    that.thead = null;//表头
    that.tbody = null;//内容
    that.tfoot = null;//页脚
    /**初始化表格*/
    that.initTable = function () {
        try {
            d3.select(that.container).html("");//初始化放表格的位置
            that.table = d3.select(that.container).append("table");//创建表格
        } catch (e) {
            that.container.html("");//初始化放表格的位置
            that.table = that.container.append("table");//创建表格
        }
        that.thead = that.table.append("thead").append("tr");
        that.tbody = that.table.append("tbody");
        that.tfoot = that.table.append("tfoot").append("tr");
    };
    /**查找表头某一列
     * @param columnNumber 列号，从0开始
     * @return 返回指定位置的单元格对象（仍然是d3.section对象）
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
    /**查找页脚某一列
     * @param columnNumber 列号，从0开始
     * @return 返回指定位置的单元格对象（仍然是d3.section对象）
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
    /**统计当前表格的行数
     * @return 返回行数
     * */
    that.getRowSize = function () {
        var trs = that.tbody.selectAll("tr");
        return trs[0].length;
    };
    /**查找一行内容
     * @param rowNumber 行号，从0开始
     * @return 返回指定行对象（仍然是d3.section对象）
     * */
    that.getRow = function (rowNumber) {
        if (rowNumber == null || rowNumber == undefined || rowNumber < 0 || rowNumber > that.getRowSize()) {
            return null;
        }
        var trs = that.tbody.selectAll("tr");
        return d3.select(trs[0][rowNumber]);
    };
    /**统计当前表格的列数
     * @return 返回列数
     * */
    that.getColumnSize = function () {
        try {
            var tds = that.getRow(0).selectAll("td");
            return tds[0].length;
        } catch (e) {
            return 0;
        }
    };
    /**查找某一行某一列的内容
     * @param rowNumber 行号，从0开始
     * @param columnNumber 列号，从0开始
     * @return 返回指定位置的单元格对象（仍然是d3.section对象）
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

    /**利用递归的方法恢复相邻的单元格
     * @param rowNumber 合并的起始行号
     * @param columnNumber 合并的起始列号
     * @param from 这是一个方向参数，表面调用自己的上一级是向上/下/左/右的哪一个方向过来的。
     * @return 返回恢复后的单元格对象（仍然是d3.section对象）
     * */
    that.restoreCellByRecursion = function (rowNumber, columnNumber, from) {
        var _cell = that.getCell(rowNumber, columnNumber);
        var _colspan = _cell.attr("colspan");
        var _rowspan = _cell.attr("rowspan");
        var _display = _cell.style("display");
        if ("none" == _display) {
            //如果是隐藏状态的，说明需要恢复
            _cell.attr("colspan", null).attr("rowspan", null).style("display", null);
            if (from == undefined || from == null) {
                that.restoreCellByRecursion(rowNumber - 1, columnNumber, "up");//递归上一行
                that.restoreCellByRecursion(rowNumber, columnNumber - 1, "left");//递归左一列
                that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//递归下一行
                that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//递归右一列
            } else if ("up" == from) {
                that.restoreCellByRecursion(rowNumber - 1, columnNumber, "up");//递归上一行
                that.restoreCellByRecursion(rowNumber, columnNumber - 1, "left");//递归左一列
                that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//递归右一列
            } else if ("down" == from) {
                that.restoreCellByRecursion(rowNumber, columnNumber - 1, "left");//递归左一列
                that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//递归下一行
                that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//递归右一列
            } else if ("left" == from) {
                that.restoreCellByRecursion(rowNumber, columnNumber - 1, "left");//递归左一列
                that.restoreCellByRecursion(rowNumber - 1, columnNumber, "up");//递归上一行
                that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//递归下一行
            } else if ("right" == from) {
                that.restoreCellByRecursion(rowNumber - 1, columnNumber, "up");//递归上一行
                that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//递归下一行
                that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//递归右一列
            } else {
                alert(rowNumber + "," + columnNumber);
            }
        } else if (from != undefined && (_colspan != undefined || _rowspan != undefined)) {
            if ("up" == from && parseInt(_rowspan) > 1) {
                //如果是从下面的格子向上走来的，且此刻碰到了一个_rowspan>1的，那就必须把它恢复
                _cell.attr("colspan", null).attr("rowspan", null).style("display", null);
            } else if ("left" == from && parseInt(_colspan) > 1) {
                //如果是从右面的格子向左走来的，且此刻碰到了一个_colspan>1的，那就必须把它恢复
                _cell.attr("colspan", null).attr("rowspan", null).style("display", null);
            }
        }
        return _cell;
    }
    /**从合并状态恢复原样，给定坐标，将该单元格所合并的所有格子还原
     * @param rowNumber 合并的起始行号
     * @param columnNumber 合并的起始列号
     * @return d3.section 返回被恢复的指定单元格对象
     * */
    that.antiMerger = function (rowNumber, columnNumber) {
        var _cell = that.restoreCellByRecursion(rowNumber, columnNumber);
        var _colspan = _cell.attr("colspan");
        var _rowspan = _cell.attr("rowspan");
        _cell.attr("colspan", null).attr("rowspan", null).style("display", null);
        if (_colspan != undefined && _colspan > 1) {
            that.restoreCellByRecursion(rowNumber, columnNumber + 1, "right");//递归右一列
        }
        if (_rowspan != undefined && _rowspan > 1) {
            that.restoreCellByRecursion(rowNumber + 1, columnNumber, "down");//递归下一行
        }
        return _cell;
    }
    /**从合并状态恢复一个矩形区域的所有单元格
     * @param rowNumberStart 矩形区域的起始行号
     * @param columnNumberStart 矩形区域的起始列号
     * @param rowNumberEnd 矩形区域的终止行号
     * @param columnNumberEnd 矩形区域的终止列号
     * @return 返回that对象
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
                that.antiMerger(_row_i, _col_i);//恢复合并的单元格
            }
        }
        return that;
    }
    /**设置合并单元格
     * @param rowNumber 合并的起始行号
     * @param columnNumber 合并的起始列号
     * @param colspan 合并的列数
     * @param rowspan 合并的行数
     * @return 返回合并好的单元格对象（仍然是d3.section对象）
     * */
    that.merge = function (rowNumber, columnNumber, colspan, rowspan) {
        var _rowSize = that.getRowSize();
        var _columnSize = that.getColumnSize();
        if (rowspan < 1) {
            rowspan = 1;
        } else if (rowNumber + rowspan > _rowSize) {
            rowspan = _rowSize - rowNumber;//最多只能合并到末行
        }
        if (colspan < 1) {
            colspan = 1;
        } else if (columnNumber + colspan > _columnSize) {
            colspan = t_columnSize - columnNumber;//最多只能合并到最后一列
        }
        var _oneCell = that.getCell(rowNumber, columnNumber);
        if (_oneCell != null && _oneCell != undefined) {
            //先恢复相关的单元格，遇到有合并的，将它们拆开
            that.antiMergerARectangle(rowNumber, columnNumber, rowNumber + rowspan - 1, columnNumber + colspan - 1);
            if (colspan > 1) {
                _oneCell.attr("colspan", colspan);
            }
            if (rowspan > 1) {
                _oneCell.attr("rowspan", rowspan);
            }
            if (colspan > 1 || rowspan > 1) {
                //将其他的变为隐藏
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