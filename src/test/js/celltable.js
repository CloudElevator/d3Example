/*
 *  写一个利用d3创建指定行列数的表格
 *  @param tableContainer 创建表格的容器
 *  @param rowCount 行数
 *  @param columnCount 列数
 */
var createMatrixTableByD3 = function (tableContainer, rowCount, columnCount) {
    var that = {};//返回给外层调用
    that.rowCount = rowCount;
    that.columnCount = columnCount;
    try {
        d3.select(tableContainer).html("");//初始化放表格的位置
        that.table = d3.select(tableContainer).append("table");//创建表格
    } catch (e) {
        tableContainer.html("");//初始化放表格的位置
        that.table = tableContainer.append("table");//创建表格
    }
    ////////////////////创建表内容start///////////////////////////////////
    that.tbody = that.table.append("tbody");
    /**初始化空表格* */
    for (var row_i = 0; row_i < that.rowCount; row_i++) {
        var row = that.tbody.append("tr");
        for (var col_i = 0; col_i < that.columnCount; col_i++) {
            row.append("td");
        }
    }
    /**查找一行内容
     * @param rowNumber 行号，从0开始
     * @return 返回指定行对象（仍然是d3.section对象）
     * */
    that.getRow = function (rowNumber) {
        if (rowNumber == null || rowNumber == undefined || rowNumber < 0 || rowNumber > that.rowCount) {
            return null;
        }
        var trs = that.tbody.selectAll("tr");
        return d3.select(trs[0][rowNumber]);
    };
    /**查找某一行某一列的内容
     * @param rowNumber 行号，从0开始
     * @param columnNumber 列号，从0开始
     * @return 返回指定位置的单元格对象（仍然是d3.section对象）
     * */
    that.getCell = function (rowNumber, columnNumber) {
        if (columnNumber == null || columnNumber == undefined || columnNumber < 0 || columnNumber > that.columnCount) {
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
            }else{
                alert(rowNumber+","+columnNumber);
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
        if (rowspan < 1) {
            rowspan = 1;
        } else if (rowNumber + rowspan > that.rowCount) {
            rowspan = that.rowCount - rowNumber;//最多只能合并到末行
        }
        if (colspan < 1) {
            colspan = 1;
        } else if (columnNumber + colspan > that.columnCount) {
            colspan = that.columnCount - columnNumber;//最多只能合并到最后一列
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
    /**遍历所有单元格，并执行某个方法
     * @param handleCellFunc 要对td执行的函数
     * @param filterCellFunc 过滤函数，用于判断该td是否可以执行handleCellFunc
     * */
    that.renderTd = function (handleCellFunc, filterCellFunc) {
        that.tbody.selectAll("td")
            .each(function (d, cellIndex) {//过滤需要执行的单元格
                var isHandle = false;
                var _cell = d3.select(this);
                var _display = _cell.style("display");
                var isHidden = "none" == _display ? true : false;
                if (filterCellFunc == null || filterCellFunc == undefined) {
                    isHandle = !isHidden;
                } else {
                    var rowIndex = parseInt(cellIndex / that.columnCount);//计算当前cell所处的行数
                    var columnIndex = cellIndex % that.columnCount;//计算当前cell所处的列数
                    isHandle = filterCellFunc(_cell, rowIndex, columnIndex, isHidden);
                }
                if (true == isHandle) {
                    handleCellFunc(_cell, rowIndex, columnIndex);
                }
            });
        return that;
    }
    return that;
}