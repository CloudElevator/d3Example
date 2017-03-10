/*
 *  дһ������d3��������ͨ��js
 *  @param tableContainer ������������
 */
var createTableByD3 = function (tableContainer) {

    var that = {};//���ظ�������
    /**�жϱ��������Ƿ�Ϊ��*/
    that.isNullArray = function (array) {
        if (array != null && array != undefined && array.length > 0) {
            return false;
        }
        return true;
    }
    //����һ�ݿ���
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
    try {
        d3.select(tableContainer).html("");//��ʼ���ű���λ��
        that.table = d3.select(tableContainer).append("table");//�������
    } catch (e) {
        tableContainer.html("");//��ʼ���ű���λ��
        that.table = tableContainer.append("table");//�������
    }
    //����һ���������飬�����鶨����Ҫ��ʾ����
    that.displayColumnArray = [];
    //����һ�ݿ���
    that.copyDisplayColumnArray = function () {
        return that.cloneArray(that.displayColumnArray);
    };
    //��������
    that.getDisplayColumnArrayLength = function (array) {
        if (that.displayColumnArray != null && that.displayColumnArray != undefined && that.displayColumnArray.length > 0) {
            return that.displayColumnArray.length;
        }
        return 0;
    };

    that.showTableHeader = true;//��ʶ�Ƿ���ʾ��ͷ
    /**��ĳ�м��뵽��������β����ָ�����[��
     * @param columnField ���ֶα�ʶ
     * @param columnName ����
     * @param index �����λ��
     * */
    that.appendTableTitle = function (columnField, columnName, index) {
        var array = that.cloneArray(that.displayColumnArray);
        if (columnField == null || columnField == undefined || columnField.trim().length < 1) {
            return that;
        }
        if (columnName == null || columnName == undefined || columnName.trim().length < 1) {
            //�[��ָ������
            var newArray = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i].field != columnField) {
                    newArray.push(array[i]);
                }
            }
            that.displayColumnArray = newArray;
            return that;
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
        that.displayColumnArray = array;
        return that;
    }
    //����һ���������飬�����鶨��������У����������е�˳����������˳��������˳�����������
    that.orderArray = [];
    ////////////////////������ͷstart///////////////////////////////////

    that.thead = that.table.append("thead").append("tr");
    that.renderTh = function () {
        var array = that.cloneArray(that.displayColumnArray);
        var titleColumns = [];
        if (true == that.showTableHeader) {
            titleColumns = array;
        }
        that.thead.selectAll("td").data(titleColumns)
            .enter()
            .append("td")
            .text(function (oneColumnTitle) {
                return oneColumnTitle.name;
            });
        that.thead.selectAll("td").data(titleColumns)
            .text(function (oneColumnTitle) {
                return oneColumnTitle.name;
            });
        that.thead.selectAll("td").data(titleColumns)
            .exit().remove();
        return that;
    }
    ////////////////////������ͷend///////////////////////////////////

    ////////////////////����������start///////////////////////////////////
    that.tbody = that.table.append("tbody");
    /**��ʼ��������
     * @param tableRowData ������Json������
     * @param fillAColumnValueFunc ��ʾһ�����ݵĺ���
     * */
    that.renderTBody = function (tableRowData, fillAColumnValueFunc) {
        that.renderTh();
        var rowDataArray = that.cloneArray(tableRowData);
        that.tbody.selectAll("tr").data(rowDataArray)
            .enter()
            .append("tr").each(function (oneRowData, rowIndex) {
                renderRowContentTd(d3.select(this),that.displayColumnArray, oneRowData, rowIndex, fillAColumnValueFunc);
            });
        // Update
        that.tbody.selectAll("tr").data(rowDataArray)
            .each(function (oneRowData, rowIndex) {
                renderRowContentTd(d3.select(this),that.displayColumnArray, oneRowData, rowIndex, fillAColumnValueFunc);
            });
        // Exit
        that.tbody.selectAll("tr").data(rowDataArray)
            .exit().remove();
        return that;
    }
    /**��ʼ���������е�һ�У��÷�����renderTBody���ã��ⲿ��Ҫʹ��
     *@param tdContainer ����td������
     *@param columnArray ��ͷ
     *@param oneRowData һ������
     *@param rowIndex   �к�
     *@param fillAColumnValueFunc ��ʾһ�����ݵĺ���
     * */
    this.renderRowContentTd = function (tdContainer,columnArray, oneRowData, rowIndex, fillAColumnValueFunc) {
        tdContainer.html("");
        for (var i = 0; i < columnArray.length; i++) {
            var oneTd = tdContainer.append("td");
            var htmlContent = fillAColumnValueFunc(rowIndex, columnArray[i].field, oneRowData, oneTd);
            if (htmlContent != null && htmlContent != undefined) {
                //����з���ֵ����td�����Ԫ�أ��������ΪfillAColumnValueFunc�������й������ݵ�����
                oneTd.html(htmlContent);
            }
        }
    }
    ////////////////////����������end///////////////////////////////////

    ////////////////////����ҳ��start///////////////////////////////////
    that.tfoot = that.table.append("tfoot").append("tr");
    /**��дҳ������
     * @param footerColumnSize ҳ����Ҫռ������
     * @param fillTableFooterFunc ��дҳ�����ݵĺ���
     * */
    that.fillTableFooter = function (fillTableFooterFunc) {
        that.tfoot.html("");
        if (fillTableFooterFunc== null || fillTableFooterFunc == undefined) {
            return that;
        }
        var array = that.cloneArray(that.displayColumnArray);
         for (var i = 0; i < array.length; i++) {
            var oneTd = that.tfoot.append("td");
            //fillTableFooterFunc(td���б�ʶ,tdλ��)
            var htmlContent = fillTableFooterFunc(oneTd,array[i].field, i,array.length);
            if (htmlContent != null && htmlContent != undefined) {
                //����з���ֵ����tr�����Ԫ��
                oneTd.html(htmlContent);
            }
        }
        return that;
    }
    ////////////////////����ҳ��end///////////////////////////////////
    return that;
}