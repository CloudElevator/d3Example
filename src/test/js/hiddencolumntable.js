/*
 *  ���Ʊ��Ĳ˵�
 *  @param tableContainer ������������
 */
var tableConfigPopupByD3 = function (tableContainer) {

    var that = {};//���ظ�������

    that.configTab= createMatrixTableByD3(createTableModelByD3(tableContainer), 3, 3);
   /**����һ�����Ʋ˵�*/
    that.refreshConfigTab=function(){
        that.configTab.table.style("display",null).style("float","left");
        that.configTab.getCell(0,0).html("ÿҳ��ʾ������");
        that.configTab.getCell(0,1).html("").append("input").attr("type","number").attr("min",1).attr("max",100).attr("value",15);
        return that;
    }
    return that;
}