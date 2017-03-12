/*
 *  控制表格的菜单
 *  @param tableContainer 创建表格的容器
 */
var tableConfigPopupByD3 = function (tableContainer) {

    var that = {};//返回给外层调用

    that.configTab= createMatrixTableByD3(createTableModelByD3(tableContainer), 3, 3);
   /**创建一个控制菜单*/
    that.refreshConfigTab=function(){
        that.configTab.table.style("display",null).style("float","left");
        that.configTab.getCell(0,0).html("每页显示行数：");
        that.configTab.getCell(0,1).html("").append("input").attr("type","number").attr("min",1).attr("max",100).attr("value",15);
        return that;
    }
    return that;
}