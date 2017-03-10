/*
 *  дһ������d3����ָ���������ı��
 *  @param tableContainer ������������
 *  @param rowCount ����
 *  @param columnCount ����
 */
var createMatrixTableByD3 = function (tableContainer, rowCount, columnCount) {
    var that = {};//���ظ�������
    that.rowCount = rowCount;
    that.columnCount = columnCount;
    try {
        d3.select(tableContainer).html("");//��ʼ���ű���λ��
        that.table = d3.select(tableContainer).append("table");//�������
    } catch (e) {
        tableContainer.html("");//��ʼ���ű���λ��
        that.table = tableContainer.append("table");//�������
    }
    ////////////////////����������start///////////////////////////////////
    that.tbody = that.table.append("tbody");
    /**��ʼ���ձ��
     * */
    that.renderTBody = function () {
        var tableCell = {};
        tableCell.generateRowAndColumnArray = function () { //��ʼ���С���
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
    ////////////////////����������end///////////////////////////////////
    /**����һ������*/
    that.getRow = function (rowNumber) {
        if (rowNumber == null || rowNumber == undefined || rowNumber < 0 || rowNumber > that.rowCount) {
            return null;
        }
        var trs = that.tbody.selectAll("tr");
        return d3.select(trs[0][rowNumber]);
    };
    /**����ĳһ��ĳһ�е�����*/
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

    /**�������е�Ԫ�񣬲�ִ��ĳ������*/
    that.renderTd = function (handleCellFunc, filterCellFunc) {
        var tableCell = {};
        tableCell.generateCellArray = function () { //��ʼ���С���
            tableCell.cellArray = [];
            for (var i = 0; i < that.rowCount * that.columnCount; i++) {
                tableCell.cellArray.push(i);
            }
        };
        tableCell.generateCellArray();
        that.tbody.selectAll("td")
            .filter(function (d, cellIndex) {//������Ҫִ�еĵ�Ԫ��
                var isHandle=false;
                if (filterCellFunc == null || filterCellFunc == undefined) {
                    isHandle=true;
                }else{
                    var rowIndex = parseInt(cellIndex / that.columnCount);//���㵱ǰcell����������
                    var columnIndex = cellIndex % that.columnCount;//���㵱ǰcell����������
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