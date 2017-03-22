/**事件关系图，事件数组辅助对象*/
var lsnEventArrayHandle = function () {
    var _eventHandle = {};
    /**事件列表
     * [{id:xxx,timeZones:{},peopleArray:[],eventObj:{}}]
     * */
    _eventHandle.eventArray = [];
    /**清空事件列表*/
    _eventHandle.clearEvents = function () {
        _eventHandle.eventArray = [];
        return _eventHandle;
    };
    /**添加一个事件
     * @param id 事件标识符，允许重复，但相同id的事件被视为同一事件
     * @param timeZones 事件时间{start:142342975,end:159238473}
     * @param peopleArray 参与事件的人物[{userName:'张三',……},……]
     * @param eventObj 事件{title:'启动天网',level:3,description:'在xxxx的背景下，张三组织召开XXX会议，会议一致通过启动天网行动的议案'}
     *        其中，level表示所处纵坐标的位置
     * */
    _eventHandle.appendEvent = function (id, timeZones, peopleArray, eventObj) {
        var _oneEvent = {};
        _oneEvent.id = id;
        _oneEvent.timeZones = timeZones;
        _oneEvent.peopleArray = peopleArray;
        _oneEvent.eventObj = eventObj;
        _eventHandle.eventArray.push(_oneEvent);
        return _eventHandle;
    };
    /**删除一个事件
     * @param id 根据id删除事件对象
     * */
    _eventHandle.removeEvent = function (id) {
        if (id != undefined && id != null) {
            if (_eventHandle.eventArray != undefined && _eventHandle.eventArray != null) {
                var newArray = [];
                _eventHandle.eventArray.forEach(function (oneEvent, i) {
                    if (id == oneEvent.id) {

                    } else {
                        newArray.push(oneEvent);
                    }
                });
                _eventHandle.eventArray = newArray;
            }
        }
        return _eventHandle;
    };
    return _eventHandle;
};

/**事件关系图，画图对象*/
var lsnEventChart = function () {
    var _chart = {};
    var _spacing = 55;//间距
    var _width = 1000, _height = 300, // <-1B
        _margins = {top: 30, left: 30, right: 30, bottom: 30},
        _x, _y,
        _data = [],
        _colors = d3.scale.category10(),
        _svg,
        _bodyG,
        _line;
    _chart.render = function () { // <-2A
        if (!_svg) {
            _svg = d3.select("body").append("svg") // <-2B
                .attr("height", _height)
                .attr("width", _width);
            renderAxes(_svg);
            defineBodyClip(_svg);
        }
        renderBody(_svg);
    };
    function renderAxes(svg) {
        var axesG = svg.append("g")
            .attr("class", "axtest" +
            "" +
            "es");
        renderXAxis(axesG);
        renderYAxis(axesG);
    }

    function renderXAxis(axesG) {
        var xAxis = d3.svg.axis()
            .scale(_x.range([0, quadrantWidth()]))
            .ticks(Math.round(quadrantWidth() / _spacing))
            .orient("bottom");
        axesG.append("g")
            .attr("class", "x axis")
            .attr("transform", function () {
                return "translate(" + xStart() + "," + yStart() + ")";
            })
            .call(xAxis);

        d3.selectAll("g.x g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", -quadrantHeight());
    }

    function renderYAxis(axesG) {
        var yAxis = d3.svg.axis()
            .scale(_y.range([quadrantHeight(), 0]))
            .orient("left");

        axesG.append("g")
            .attr("class", "y axis")
            .attr("transform", function () {
                return "translate(" + xStart() + "," + yEnd() + ")";
            })
            .call(yAxis);

        d3.selectAll("g.y g.tick")
            .append("line")
            .classed("grid-line", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", quadrantWidth())
            .attr("y2", 0);
    }

    function defineBodyClip(svg) { // <-2C
        var padding = 5;
        svg.append("defs")
            .append("clipPath")
            .attr("id", "body-clip")
            .append("rect")
            .attr("x", 0 - padding)
            .attr("y", 0)
            .attr("width", quadrantWidth() + 2 * padding)
            .attr("height", quadrantHeight());
    }

    function renderBody(svg) { // <-2D
        if (!_bodyG)
            _bodyG = svg.append("g")
                .attr("class", "body")
                .attr("transform", "translate("
                + xStart() + ","
                + yEnd() + ")") // <-2E
                .attr("clip-path", "url(#body-clip)");
        renderLines();
        renderDots();
    }

    function renderLines() {
        _line = d3.svg.line() //<-4A
            .x(function (d) {
                return _x(d.x);
            })
            .y(function (d) {
                return _y(d.y);
            });

        _bodyG.selectAll("path.line")
            .data(_data)
            .enter() //<-4B
            .append("path")
            .style("stroke", function (d, i) {
                return _colors(i); //<-4C
            })
            .attr("class", "line");
        _bodyG.selectAll("path.line")
            .data(_data)
            .transition() //<-4D
            .attr("d", function (d) {
                return _line(d);
            });
    }

    function renderDots() {
        _data.forEach(function (list, i) {
            _bodyG.selectAll("circle._" + i) //<-4E
                .data(list)
                .enter()
                .append("circle")
                .attr("class", "dot _" + i);
            _bodyG.selectAll("circle._" + i)
                .data(list)
                .style("stroke", function (d) {
                    return _colors(i); //<-4F
                })
                .transition() //<-4G
                .attr("cx", function (d) {
                    return _x(d.x);
                })
                .attr("cy", function (d) {
                    return _y(d.y);
                })
                .attr("r", 4.5);
        });
    }

    function xStart() {
        return _margins.left;
    }

    function yStart() {
        return _height - _margins.bottom;
    }

    function xEnd() {
        return _width - _margins.right;
    }

    function yEnd() {
        return _margins.top;
    }

    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }

    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };
    _chart.height = function (h) { // <-1C
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };
    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };
    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };
    _chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };
    _chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };
    _chart.addSeries = function (series) { // <-1D
        _data.push(series);
        return _chart;
    };
    return _chart; // <-1E

};