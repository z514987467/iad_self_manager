﻿function PROFINETIOController(viewHandle, elementId, id, ip, mac, port, time, protocol) {
    this.pViewHandle = viewHandle;
    this.elementId = elementId
    this.id = id;
    this.ip = ip;
    this.mac = mac;
    this.port = port;
    this.time = time;
    this.protocol = protocol;

    this.pLblType = "#" + this.elementId + "_lblType";
    this.pLblTime = "#" + this.elementId + "_lblTime";
    this.pLblPort = "#" + this.elementId + "_lblPort";
    this.pLblIP = "#" + this.elementId + "_lblIP";
    this.pLblMAC = "#" + this.elementId + "_lblMAC";
    this.pTdProtocolList = "#" + this.elementId + "_tdProtocolList";
    this.pPagerContent = "#" + this.elementId + "_pagerContent";
    this.pLblTotalProtocol = "#" + this.elementId + "_lblTotalProtocol";

    this.pPager = null;
}

PROFINETIOController.prototype.init = function () {
    try {
        var parent = this;

        var tabTemplate = TemplateManager.getInstance().updateTemplate(TemplateManager.getInstance().getTemplate(Constants.TEMPLATES.AUDIT_PROTOCOL_PROFINETIO), {
            elementId: parent.elementId
        });
        this.pViewHandle.find(".layui-layer-content").html(tabTemplate);

        //init all controls and load data
        this.initControls();
        this.load();
    }
    catch (err) {
        console.error("ERROR - PROFINETIOController.init() - Unable to initialize: " + err.message);
    }
}

PROFINETIOController.prototype.initControls = function () {
    try {
    }
    catch (err) {
        console.error("ERROR - PROFINETIOController.initControls() - Unable to initialize control: " + err.message);
    }
}

PROFINETIOController.prototype.load = function () {
    try {
        //details
        $(this.pLblIP).html(this.ip);
        $(this.pLblMAC).html(this.mac);
        $(this.pLblPort).html(this.port);
        $(this.pLblTime).html(this.time);
        $(this.pLblType).html(this.protocol);
        //table
        this.pPager = null;
        this.selectProtocol(1);
    }
    catch (err) {
        console.error("ERROR - PROFINETIOController.load() - Unable to load: " + err.message);
    }
}

PROFINETIOController.prototype.selectProtocol = function (pageIndex) {
    var html = "";
    html += '<tr class="title">';
    html += '<td class="address" style="width:15%;">记录时间</td>';
    html += '<td class="address" style="width:15%;">功能码</td>';
    html += '<td class="address" style="width:15%;">操作接口</td>';
    html += '<td class="address">数据类型</td>';
    html += '</tr>';
    try {
        var parent = this;
        var link = APPCONFIG["default"].GET_PROTOCOL + "?protocol=" + this.protocol + "&page=" + pageIndex + "&flowdataHeadId=" + this.id;
        var promise = URLManager.getInstance().ajaxCall(link);
        promise.fail(function (jqXHR, textStatus, err) {
            console.log(textStatus + " - " + err.message);
            html += "<tr><td colspan='4'>暂无数据</td></tr>";
            $(parent.pTdProtocolList).html(html);
        });
        promise.done(function (result) {
            if (typeof (result) != "undefined" && typeof (result.rows) != "undefined") {
                if (result.rows.length > 0) {
                    for (var i = 0; i < result.rows.length; i++) {
                        html += "<tr>";
                        html += "<td style='width:15%;'>" + result.rows[i][6] + "</td>";
                        html += "<td style='width:15%;'>" + result.rows[i][2] + "</td>";
                        html += "<td style='width:15%;'>" + result.rows[i][3] + "</td>";
                        html += "<td>"+result.rows[i][4]+"</td>";
                        html += "</tr>";
                    }
                }
                else {
                    html += "<tr><td colspan='4'>暂无数据</td></tr>";
                }
            }
            else {
                html += "<tr><td colspan='4'>暂无数据</td></tr>";
            }
            if (typeof (result.total) != "undefined") {
                $(parent.pLblTotalProtocol).text(result.total);
            }

            $(parent.pTdProtocolList).html(html);

            if (parent.pPager == null) {
                parent.pPager = new kea.base.utility.PagerController($(parent.pPagerContent), parent.elementId, 10, result.total, function (pageIndex, filters) {
                    parent.selectProtocol(pageIndex);
                });
                parent.pPager.init(Constants.TEMPLATES.UTILITY_PAGER1);
            }
        });
    }
    catch (err) {
        html += "<tr><td colspan='4'>暂无数据</td></tr>";
        $(this.pTdProtocolList).html(html);
        console.error("ERROR - PROFINETIOController.selectProtocol() - Unable to get all events: " + err.message);
    }
}

ContentFactory.assignToPackage("kea.base.PROFINETIOController", PROFINETIOController);

