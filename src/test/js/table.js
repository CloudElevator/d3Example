/*
 *  写一个利用d3创建表格的通用js
 *  @param tableContainer 创建表格的容器
 */
var createTableByD3 = function (tableContainer) {
    var that = {};//返回给外层调用
    that.table = d3.select(tableContainer).append("table");//创建表格
    ////////////////////创建表头start///////////////////////////////////
    /**判断标题数组是否为空*/
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
    ////////////////////创建表头end///////////////////////////////////

    ////////////////////创建表内容start///////////////////////////////////
    that.tbody = that.table.append("tbody");
    /**初始化表数据
     * @param tableRowData 表数据Json串数组
     * @param fillARowValueFunc 显示一行数据的函数
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
    ////////////////////创建表内容end///////////////////////////////////

    ////////////////////创建页脚start///////////////////////////////////
    that.tfoot = that.table.append("tfoot").append("tr");
    /**填写页脚内容
     * @param fillTableFooterFunc 填写页脚内容的函数
     * */
    that.fillTableFooter = function (fillTableFooterFunc) {
        if (fillTableFooterFunc == null || fillTableFooterFunc == undefined) {
            that.tfoot.html("");
        } else {
            fillTableFooterFunc(that.tfoot);
        }
        return that;
    }
    ////////////////////创建页脚end///////////////////////////////////
    return that;
}