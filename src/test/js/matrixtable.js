/*
 *  дһ������d3����ָ���������ı��
 *  @param tableContainer ������������
 *  @param rowCount ����
 *  @param columnCount ����
 */
var createMatrixTableByD3 = function (tableModel, rowCount, columnCount) {
    tableModel.rowCount = rowCount;
    tableModel.columnCount = columnCount;
    ////////////////////����������start///////////////////////////////////
    tableModel.initTable();
    /**��ʼ���ձ��* */
    for (var row_i = 0; row_i < tableModel.rowCount; row_i++) {
        var row = tableModel.tbody.append("tr");
        for (var col_i = 0; col_i < tableModel.columnCount; col_i++) {
            row.append("td");
        }
    }
    /**�������е�Ԫ�񣬲�ִ��ĳ������
     * @param handleCellFunc Ҫ��tdִ�еĺ���
     * @param filterCellFunc ���˺����������жϸ�td�Ƿ����ִ��handleCellFunc
     * */
    tableModel.renderTd = function (handleCellFunc, filterCellFunc) {
        tableModel.tbody.selectAll("td")
            .each(function (d, cellIndex) {//������Ҫִ�еĵ�Ԫ��
                var isHandle = false;
                var _cell = d3.select(this);
                var _display = _cell.style("display");
                var isHidden = "none" == _display ? true : false;
                if (filterCellFunc == null || filterCellFunc == undefined) {
                    isHandle = !isHidden;
                } else {
                    var rowIndex = parseInt(cellIndex / tableModel.columnCount);//���㵱ǰcell����������
                    var columnIndex = cellIndex % tableModel.columnCount;//���㵱ǰcell����������
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