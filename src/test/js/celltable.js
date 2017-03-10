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
    /**初始化空表格
     * */
    that.renderTBody = function () {
        var tableCell = {};
        tableCell.generateRowAndColumnArray = function () { //初始化行、列
            tableCell.rowArray = [];
            for (var i = 0; i < that.rowCount; i++) {
                tableCell.rowArray.push(i);
            }
        };
        tableCell.generateRowAndColumnArray();
        var tableContent = that.tbody.selectAll("tr").data(tableCell.rowArray);
        tableContent.enter()
            .append("tr").each(function (oneRowData, rowIndex) {
                d3.select(this).html("");
                for (var i = 0; i < that.columnCount; i++) {
                    d3.select(this).append("td");
                }
            });
        // Update
        tableContent.data(tableCell.rowArray)
            .each(function (oneRowData, rowIndex) {
                d3.select(this).html("");
                for (var i = 0; i < that.columnCount; i++) {
                    d3.select(this).append("td");
                }
            });
        // Exit
        tableContent.exit().remove();
        return that;
    };
    ////////////////////创建表内容end///////////////////////////////////
    /**查找一行内容*/
    that.getRow = function (rowNumber) {
        if (rowNumber == null || rowNumber == undefined || rowNumber < 0 || rowNumber > that.rowCount) {
            return null;
        }
        var trs = that.tbody.selectAll("tr");
        return d3.select(trs[0][rowNumber]);
    };
    /**查找某一行某一列的内容*/
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

    /**遍历所有单元格，并执行某个方法*/
    that.renderTd = function (handleCellFunc, filterCellFunc) {
        var tableCell = {};
        tableCell.generateCellArray = function () { //初始化行、列
            tableCell.cellArray = [];
            for (var i = 0; i < that.rowCount * that.columnCount; i++) {
                tableCell.cellArray.push(i);
            }
        };
        tableCell.generateCellArray();
        that.tbody.selectAll("td")
            .filter(function (d, cellIndex) {//过滤需要执行的单元格
                var isHandle=false;
                if (filterCellFunc == null || filterCellFunc == undefined) {
                    isHandle=true;
                }else{
                    var rowIndex = parseInt(cellIndex / that.columnCount);//计算当前cell所处的行数
                    var columnIndex = cellIndex % that.columnCount;//计算当前cell所处的列数
                    isHandle= filterCellFunc(d3.select(this), rowIndex, columnIndex);
                }
                if(true==isHandle){
                    handleCellFunc(d3.select(this), rowIndex, columnIndex);
                }
            });
        return that;
    }
    return that;
}