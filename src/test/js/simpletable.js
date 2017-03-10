/*
 *  写一个利用d3创建表格的通用js
 *  @param tableContainer 创建表格的容器
 */
var createTableByD3 = function (tableContainer) {

    var that = {};//返回给外层调用
    /**判断标题数组是否为空*/
    that.isNullArray = function (array) {
        if (array != null && array != undefined && array.length > 0) {
            return false;
        }
        return true;
    }
    //返回一份拷贝
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
        d3.select(tableContainer).html("");//初始化放表格的位置
        that.table = d3.select(tableContainer).append("table");//创建表格
    } catch (e) {
        tableContainer.html("");//初始化放表格的位置
        that.table = tableContainer.append("table");//创建表格
    }
    //定义一个过滤数组，该数组定义需要显示的列
    that.displayColumnArray = [];
    //返回一份拷贝
    that.copyDisplayColumnArray = function () {
        return that.cloneArray(that.displayColumnArray);
    };
    //计算列数
    that.getDisplayColumnArrayLength = function (array) {
        if (that.displayColumnArray != null && that.displayColumnArray != undefined && that.displayColumnArray.length > 0) {
            return that.displayColumnArray.length;
        }
        return 0;
    };

    that.showTableHeader = true;//标识是否显示表头
    /**将某列加入到过滤数组尾部或將指定列隱藏
     * @param columnField 列字段标识
     * @param columnName 列名
     * @param index 插入的位置
     * */
    that.appendTableTitle = function (columnField, columnName, index) {
        var array = that.cloneArray(that.displayColumnArray);
        if (columnField == null || columnField == undefined || columnField.trim().length < 1) {
            return that;
        }
        if (columnName == null || columnName == undefined || columnName.trim().length < 1) {
            //隱藏指定的列
            var newArray = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i].field != columnField) {
                    newArray.push(array[i]);
                }
            }
            that.displayColumnArray = newArray;
            return that;
        } else {
            //定义一个表头的标准对象
            var oneColumnTitle = {};
            oneColumnTitle.field = columnField;
            oneColumnTitle.name = columnName;
            //发现已存在的，仅替换值
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
    //定义一个排序数组，该数组定义排序的列，列在数组中的顺序就是排序的顺序，排序还有顺序、逆序的区别
    that.orderArray = [];
    ////////////////////创建表头start///////////////////////////////////

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
    ////////////////////创建表头end///////////////////////////////////

    ////////////////////创建表内容start///////////////////////////////////
    that.tbody = that.table.append("tbody");
    /**初始化表数据
     * @param tableRowData 表数据Json串数组
     * @param fillAColumnValueFunc 显示一列数据的函数
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
    /**初始化表数据中的一行，该方法由renderTBody调用，外部不要使用
     *@param tdContainer 承载td的容器
     *@param columnArray 表头
     *@param oneRowData 一行数据
     *@param rowIndex   行号
     *@param fillAColumnValueFunc 显示一列数据的函数
     * */
    this.renderRowContentTd = function (tdContainer,columnArray, oneRowData, rowIndex, fillAColumnValueFunc) {
        tdContainer.html("");
        for (var i = 0; i < columnArray.length; i++) {
            var oneTd = tdContainer.append("td");
            var htmlContent = fillAColumnValueFunc(rowIndex, columnArray[i].field, oneRowData, oneTd);
            if (htmlContent != null && htmlContent != undefined) {
                //如果有返回值就向td中添加元素，否则就认为fillAColumnValueFunc函数自行管理内容的设置
                oneTd.html(htmlContent);
            }
        }
    }
    ////////////////////创建表内容end///////////////////////////////////

    ////////////////////创建页脚start///////////////////////////////////
    that.tfoot = that.table.append("tfoot").append("tr");
    /**填写页脚内容
     * @param footerColumnSize 页脚需要占的列数
     * @param fillTableFooterFunc 填写页脚内容的函数
     * */
    that.fillTableFooter = function (fillTableFooterFunc) {
        that.tfoot.html("");
        if (fillTableFooterFunc== null || fillTableFooterFunc == undefined) {
            return that;
        }
        var array = that.cloneArray(that.displayColumnArray);
         for (var i = 0; i < array.length; i++) {
            var oneTd = that.tfoot.append("td");
            //fillTableFooterFunc(td，列标识,td位置)
            var htmlContent = fillTableFooterFunc(oneTd,array[i].field, i,array.length);
            if (htmlContent != null && htmlContent != undefined) {
                //如果有返回值就向tr中添加元素
                oneTd.html(htmlContent);
            }
        }
        return that;
    }
    ////////////////////创建页脚end///////////////////////////////////
    return that;
}