/*
 *  写一个利用d3创建表格的通用js
 *  @param tableContainer 创建表格的容器
 */
var createTableByD3 = function (tableModel) {
    if (tableModel == undefined) {
        return null;
    }
    tableModel.initTable();
    //定义一个过滤数组，该数组定义需要显示的列
    tableModel.displayColumnArray = [];
    //返回一份拷贝
    tableModel.copyDisplayColumnArray = function () {
        return tableModel.cloneArray(tableModel.displayColumnArray);
    };
    //计算列数
    tableModel.getDisplayColumnArrayLength = function (array) {
        if (tableModel.displayColumnArray != null && tableModel.displayColumnArray != undefined && tableModel.displayColumnArray.length > 0) {
            return tableModel.displayColumnArray.length;
        }
        return 0;
    };
    /**将某列加入到过滤数组尾部或將指定列隱藏
     * @param columnField 列字段标识
     * @param columnName 列名
     * @param index 插入的位置
     * */
    tableModel.appendTableTitle = function (columnField, columnName, index) {
        var array = tableModel.cloneArray(tableModel.displayColumnArray);
        if (columnField == null || columnField == undefined || columnField.trim().length < 1) {
            return tableModel;
        }
        if (columnName == null || columnName == undefined || columnName.trim().length < 1) {
            //隱藏指定的列
            var newArray = [];
            for (var i = 0; i < array.length; i++) {
                if (array[i].field != columnField) {
                    newArray.push(array[i]);
                }
            }
            tableModel.displayColumnArray = newArray;
            return tableModel;
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
        tableModel.displayColumnArray = array;
        return tableModel;
    }
    //定义一个排序数组，该数组定义排序的列，列在数组中的顺序就是排序的顺序，排序还有顺序、逆序的区别
    tableModel.orderArray = [];
    ////////////////////创建表头start///////////////////////////////////

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
    ////////////////////创建表头end///////////////////////////////////

    ////////////////////创建表内容start///////////////////////////////////
    /**缺省显示某一行的值
     *@param rowIndex   行号
     *@param oneColumnTitle 列字段标识符
     *@param oneRowData 一行数据
     *@param td 预备填入数据的单元格对象（d3.section）
     *@param colIndex   列号
     * */
    var defaultShowARowValue = function (rowIndex, oneColumnTitle, oneRowData, td, colIndex) {
        if (colIndex == 0 && oneRowData[oneColumnTitle] == undefined) {
            //如果是第一列，且数据对象中没有该列对应的值，认为是序号列
            return rowIndex + 1;
        }
        else {
            return oneRowData[oneColumnTitle];
        }
    };
    /**初始化表数据
     * @param tableRowData 表数据Json串数组
     * @param fillAColumnValueFunc 显示一列数据的函数
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
    /**初始化表数据中的一行，该方法由renderTBody调用，外部不要使用
     *@param tdContainer 承载td的容器
     *@param columnArray 表头
     *@param oneRowData 一行数据
     *@param rowIndex   行号
     *@param fillAColumnValueFunc 显示一列数据的函数
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
                //如果有返回值就向td中添加元素，否则就认为fillAColumnValueFunc函数自行管理内容的设置
                oneTd.html(htmlContent);
            }
        }
    }
    ////////////////////创建表内容end///////////////////////////////////

    ////////////////////创建页脚start///////////////////////////////////
    /**填写页脚内容
     * @param footerColumnSize 页脚需要占的列数
     * @param fillTableFooterFunc 填写页脚内容的函数
     * */
    tableModel.fillTableFooter = function (fillTableFooterFunc) {
        tableModel.tfoot.html("");
        if (fillTableFooterFunc == null || fillTableFooterFunc == undefined) {
            return tableModel;
        }
        var array = tableModel.cloneArray(tableModel.displayColumnArray);
        for (var i = 0; i < array.length; i++) {
            var oneTd = tableModel.tfoot.append("td");
            //fillTableFooterFunc(td，列标识,td位置)
            var htmlContent = fillTableFooterFunc(oneTd, array[i].field, i, array.length);
            if (htmlContent != null && htmlContent != undefined) {
                //如果有返回值就向tr中添加元素
                oneTd.html(htmlContent);
            }
        }
        return tableModel;
    }
    ////////////////////创建页脚end///////////////////////////////////
    return tableModel;
}