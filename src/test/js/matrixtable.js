/*
 *  写一个利用d3创建指定行列数的表格
 *  @param tableContainer 创建表格的容器
 *  @param rowCount 行数
 *  @param columnCount 列数
 */
var createMatrixTableByD3 = function (tableModel, rowCount, columnCount) {
    tableModel.rowCount = rowCount;
    tableModel.columnCount = columnCount;
    ////////////////////创建表内容start///////////////////////////////////
    tableModel.initTable();
    /**初始化空表格* */
    for (var row_i = 0; row_i < tableModel.rowCount; row_i++) {
        var row = tableModel.tbody.append("tr");
        for (var col_i = 0; col_i < tableModel.columnCount; col_i++) {
            row.append("td");
        }
    }
    /**遍历所有单元格，并执行某个方法
     * @param handleCellFunc 要对td执行的函数
     * @param filterCellFunc 过滤函数，用于判断该td是否可以执行handleCellFunc
     * */
    tableModel.renderTd = function (handleCellFunc, filterCellFunc) {
        tableModel.tbody.selectAll("td")
            .each(function (d, cellIndex) {//过滤需要执行的单元格
                var isHandle = false;
                var _cell = d3.select(this);
                var _display = _cell.style("display");
                var isHidden = "none" == _display ? true : false;
                if (filterCellFunc == null || filterCellFunc == undefined) {
                    isHandle = !isHidden;
                } else {
                    var rowIndex = parseInt(cellIndex / tableModel.columnCount);//计算当前cell所处的行数
                    var columnIndex = cellIndex % tableModel.columnCount;//计算当前cell所处的列数
                    isHandle = filterCellFunc(_cell, rowIndex, columnIndex, isHidden);
                }
                if (true == isHandle) {
                    handleCellFunc(_cell, rowIndex, columnIndex);
                }
            });
        return tableModel;
    }
    return tableModel;
}