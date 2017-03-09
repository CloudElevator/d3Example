/*
 *  дһ������d3��������ͨ��js
 *  @param tableContainer ������������
 */
var createTableByD3 = function (tableContainer) {
    var that = {};//���ظ�������
    that.table = d3.select(tableContainer).append("table");//�������
    ////////////////////������ͷstart///////////////////////////////////
    /**�жϱ��������Ƿ�Ϊ��*/
    that.isNullArray = function (array) {
        if (array != null && array != undefined && array.length > 0) {
            return false;
        }
        return true;
    }
    that.thead = that.table.append("thead").append("tr");
    that.renderTh = function (titleArray) {
        that.thead.selectAll("td").data(titleArray)
            .enter()
            .append("td")
            .text(function (d) {
                return d;
            });
        that.thead.selectAll("td").data(titleArray)
            .text(function (d) {
                return d;
            });
        that.thead.selectAll("td").data(titleArray)
            .exit() // <- J
            .remove();
        return that;
    }
    ////////////////////������ͷend///////////////////////////////////

    ////////////////////����������start///////////////////////////////////
    that.tbody = that.table.append("tbody");
    /**��ʼ��������
     * @param tableRowData ������Json������
     * @param fillARowValueFunc ��ʾһ�����ݵĺ���
     * */
    that.renderTBody = function (tableRowData, fillARowValueFunc) {
        that.tbody.selectAll("tr").data(tableRowData)
            .enter()
            .append("tr").each(function (d, i) {
                fillARowValueFunc(this, d, i);
            });
        // Update
        that.tbody.selectAll("tr").data(tableRowData)
            .each(function (d, i) {
                fillARowValueFunc(this, d, i);
            });
        // Exit
        that.tbody.selectAll("tr").data(tableRowData)
            .exit() // <- J
            .remove();
        return that;
    }
    ////////////////////����������end///////////////////////////////////

    ////////////////////����ҳ��start///////////////////////////////////
    that.tfoot = that.table.append("tfoot").append("tr");
    /**��дҳ������
     * @param fillTableFooterFunc ��дҳ�����ݵĺ���
     * */
    that.fillTableFooter = function (fillTableFooterFunc) {
        if (fillTableFooterFunc == null || fillTableFooterFunc == undefined) {
            that.tfoot.html("");
        } else {
            fillTableFooterFunc(that.tfoot);
        }
        return that;
    }
    ////////////////////����ҳ��end///////////////////////////////////
    return that;
}