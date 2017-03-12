/*
 *  дһ������d3��������ͨ��js
 *  @param tableContainer ������������
 */
var createTableByD3 = function (tableModel) {
    if (tableModel == undefined) {
        return null;
    }
    tableModel.initTable();
    //����һ���������飬�����鶨����Ҫ��ʾ����
    tableModel.displayColumnArray = [];
    //����һ�ݿ���
    tableModel.copyDisplayColumnArray = function () {
        return tableModel.cloneArray(tableModel.displayColumnArray);
    };
    //��������
    tableModel.getDisplayColumnArrayLength = function (array) {
        if (tableModel.displayColumnArray != null && tableModel.displayColumnArray != undefined && tableModel.displayColumnArray.length > 0) {
            return tableModel.displayColumnArray.length;
        }
        return 0;
    };
    /**��ĳ�м��뵽��������β����ָ�����[��
     * @param columnField ���ֶα�ʶ
     * @param columnName ����
     * @param index �����λ��
     * */
    tableModel.appendTableTitle = function (columnField, columnName, index) {
        var array = tableModel.cloneArray(tableModel.displayColumnArray);
        if (columnField == null || columnField == undefined || columnField.trim().length < 1) {
            return tableModel;
        }
        if (columnName == null || columnName == undefined || columnName.trim().length < 1) {
            //�[��ָ������
            var newArray = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i].field != columnField) {
                    newArray.push(array[i]);
                }
            }
            tableModel.displayColumnArray = newArray;
            return tableModel;
        } else {
            //����һ����ͷ�ı�׼����
            var oneColumnTitle = {};
            oneColumnTitle.field = columnField;
            oneColumnTitle.name = columnName;
            //�����Ѵ��ڵģ����滻ֵ
            var hasFound = false;
            for (var i = 0; i < array.length; i++) {
                if (array[i].field == columnField) {
                    array[i] = oneColumnTitle;
                    hasFound = true;
                    break;
                }
            }
        }
        if (false == hasFound) {
            if (index != undefined && index >= 0 && index < array.length) {
                array[index] = oneColumnTitle;
            } else {
                array.push(oneColumnTitle);
            }
        }
        tableModel.displayColumnArray = array;
        return tableModel;
    }
    //����һ���������飬�����鶨��������У����������е�˳����������˳��������˳�����������
    tableModel.orderArray = [];
    ////////////////////������ͷstart///////////////////////////////////

    tableModel.renderTh = function () {
        var array = tableModel.cloneArray(tableModel.displayColumnArray);
        var titleColumns = [];
        if (true == tableModel.showTableHeader) {
            titleColumns = array;
        }
        tableModel.thead.selectAll("td").data(titleColumns)
            .enter()
            .append("td")
            .text(function (oneColumnTitle) {
                return oneColumnTitle.name;
            });
        tableModel.thead.selectAll("td").data(titleColumns)
            .text(function (oneColumnTitle) {
                return oneColumnTitle.name;
            });
        tableModel.thead.selectAll("td").data(titleColumns)
            .exit().remove();
        return tableModel;
    }
    ////////////////////������ͷend///////////////////////////////////

    ////////////////////����������start///////////////////////////////////
    /**ȱʡ��ʾĳһ�е�ֵ
     *@param rowIndex   �к�
     *@param oneColumnTitle ���ֶα�ʶ��
     *@param oneRowData һ������
     *@param td Ԥ���������ݵĵ�Ԫ�����d3.section��
     *@param colIndex   �к�
     * */
    var defaultShowARowValue = function (rowIndex, oneColumnTitle, oneRowData, td, colIndex) {
        if (colIndex == 0 && oneRowData[oneColumnTitle] == undefined) {
            //����ǵ�һ�У������ݶ�����û�и��ж�Ӧ��ֵ����Ϊ�������
            return rowIndex + 1;
        }
        else {
            return oneRowData[oneColumnTitle];
        }
    };
    /**��ʼ��������
     * @param tableRowData ������Json������
     * @param fillAColumnValueFunc ��ʾһ�����ݵĺ���
     * */
    tableModel.renderTBody = function (tableRowData, fillAColumnValueFunc) {
        tableModel.renderTh();
        var rowDataArray = tableModel.cloneArray(tableRowData);
        tableModel.tbody.selectAll("tr").data(rowDataArray)
            .enter()
            .append("tr").each(function (oneRowData, rowIndex) {
                renderRowContentTd(d3.select(this), tableModel.displayColumnArray, oneRowData, rowIndex, fillAColumnValueFunc);
            });
        // Update
        tableModel.tbody.selectAll("tr").data(rowDataArray)
            .each(function (oneRowData, rowIndex) {
                renderRowContentTd(d3.select(this), tableModel.displayColumnArray, oneRowData, rowIndex, fillAColumnValueFunc);
            });
        // Exit
        tableModel.tbody.selectAll("tr").data(rowDataArray)
            .exit().remove();
        return tableModel;
    }
    /**��ʼ���������е�һ�У��÷�����renderTBody���ã��ⲿ��Ҫʹ��
     *@param tdContainer ����td������
     *@param columnArray ��ͷ
     *@param oneRowData һ������
     *@param rowIndex   �к�
     *@param fillAColumnValueFunc ��ʾһ�����ݵĺ���
     * */
    this.renderRowContentTd = function (tdContainer, columnArray, oneRowData, rowIndex, fillAColumnValueFunc) {
        tdContainer.html("");
        for (var colIndex = 0; colIndex < columnArray.length; colIndex++) {
            var oneTd = tdContainer.append("td");
            var htmlContent = null;
            if (fillAColumnValueFunc == undefined) {
                htmlContent = defaultShowARowValue(rowIndex, columnArray[colIndex].field, oneRowData, oneTd, colIndex);
            } else {
                htmlContent = fillAColumnValueFunc(rowIndex, columnArray[colIndex].field, oneRowData, oneTd, colIndex);
            }
            if (htmlContent != null && htmlContent != undefined) {
                //����з���ֵ����td�����Ԫ�أ��������ΪfillAColumnValueFunc�������й������ݵ�����
                oneTd.html(htmlContent);
            }
        }
    }
    ////////////////////����������end///////////////////////////////////

    ////////////////////����ҳ��start///////////////////////////////////
    /**��дҳ������
     * @param footerColumnSize ҳ����Ҫռ������
     * @param fillTableFooterFunc ��дҳ�����ݵĺ���
     * */
    tableModel.fillTableFooter = function (fillTableFooterFunc) {
        tableModel.tfoot.html("");
        if (fillTableFooterFunc == null || fillTableFooterFunc == undefined) {
            return tableModel;
        }
        var array = tableModel.cloneArray(tableModel.displayColumnArray);
        for (var i = 0; i < array.length; i++) {
            var oneTd = tableModel.tfoot.append("td");
            //fillTableFooterFunc(td���б�ʶ,tdλ��)
            var htmlContent = fillTableFooterFunc(oneTd, array[i].field, i, array.length);
            if (htmlContent != null && htmlContent != undefined) {
                //����з���ֵ����tr�����Ԫ��
                oneTd.html(htmlContent);
            }
        }
        return tableModel;
    }
    ////////////////////����ҳ��end///////////////////////////////////
    return tableModel;
}