var oMsgbox = null;
var g_orgTop = 0;
var g_orgHeight = 0;
var g_orgLeft = 0;
var g_orgWidth = 0;

var oContent = null;
var oDragBoth = null;
var oDragL = null;
var oDragT = null;
var oDragR = null;
var oDragB = null;

window.onload = function() {
    var oBtnClose = null;
    var oH2Title = null;
    var aDiv = null;
    var fnDrag = null;
    var i = 0;

    oMsgbox = document.getElementById('msgbox');

    oBtnClose = oMsgbox.getElementsByTagName('a')[0];
    oH2Title = oMsgbox.getElementsByTagName('h2')[0];

    aDiv = oMsgbox.getElementsByTagName('div');

    oBtnClose.onmousedown = function() {
        oMsgbox.style.display = 'none';
    };

    oMsgbox.style.left = (document.body.scrollLeft || document.documentElement.scrollLeft) + (document.documentElement.clientWidth - oMsgbox.offsetWidth) / 2 + 'px';
    oMsgbox.style.top = (document.body.scrollTop || document.documentElement.scrollTop) + (document.documentElement.clientHeight - oMsgbox.offsetHeight) / 2 + 'px';

    new PerfectDraging
        (
            oH2Title,
            function() {
                return {
                    x: oMsgbox.offsetLeft,
                    y: oMsgbox.offsetTop
                };
            },
            function(x, y) {
                var iSTop = document.body.scrollTop || document.documentElement.scrollTop;

                if (x < 0) {
                    x = 0;
                } else if (x + oMsgbox.offsetWidth > document.documentElement.clientWidth) {
                    x = document.body.clientWidth - oMsgbox.offsetWidth;
                }

                if (y < iSTop) {
                    y = iSTop;
                } else if (y + oMsgbox.offsetHeight > document.documentElement.clientHeight + iSTop) {
                    y = document.documentElement.clientHeight - oMsgbox.offsetHeight + iSTop;
                }
                oMsgbox.style.left = x + 'px';
                oMsgbox.style.top = y + 'px';
            }
        );

    for (i = 0; i < aDiv.length; i++) {
        fnDrag = null;
        switch (aDiv[i].className) {
            case 'drag':
                fnDrag = doBothDrag;
                oDragBoth = aDiv[i];
                break;
            case 'bar_t':
                fnDrag = doTDrag;
                oDragT = aDiv[i];
                break;
            case 'bar_r':
                fnDrag = doRDrag;
                oDragR = aDiv[i];
                break;
            case 'bar_b':
                fnDrag = doBDrag;
                oDragB = aDiv[i];
                break;
            case 'bar_l':
                fnDrag = doLDrag;
                oDragL = aDiv[i];
                break;
            case 'content':
                oContent = aDiv[i];
                break;
        }

        if (!fnDrag) {
            continue;
        }

        new PerfectDraging
            (
                aDiv[i],
                function() {
                    g_orgTop = oMsgbox.offsetTop;
                    g_orgHeight = oMsgbox.offsetHeight;
                    g_orgLeft = oMsgbox.offsetLeft;
                    g_orgWidth = oMsgbox.offsetWidth;
                    return {
                        x: oMsgbox.offsetWidth,
                        y: oMsgbox.offsetHeight
                    };
                },
                fnDrag
                /*function (x, y)
                {
                	fnDrag(x, y);
                }*/
            );
    }
};

function doBothDrag(x, y) {
    if (x < 110) {
        x = 110;
    }

    oMsgbox.style.width = x - 8 + 'px';
    oDragT.style.width = x + 'px';
    oDragB.style.width = x + 'px';

    if (y < 35) {
        y = 35;
    }

    oMsgbox.style.height = y - 8 + 'px';
    oDragL.style.height = y + 'px';
    oDragR.style.height = y + 'px';
    oDragBoth.style.top = y - 16 + 'px';
}

function doTDrag(x, y) {
    var h = 2 * g_orgHeight - y;
    if (h < 35) {
        h = 35;
    }

    oMsgbox.style.top = g_orgTop + g_orgHeight - h + 'px';
    oMsgbox.style.height = h - 8 + 'px';

    oDragL.style.height = h + 2 + 'px';
    oDragR.style.height = h + 2 + 'px';

    oDragBoth.style.top = h - 16 + 'px';
}

function doRDrag(x, y) {
    if (x < 110) {
        x = 110;
    }
    oMsgbox.style.width = x - 8 + 'px';

    oDragT.style.width = x + 2 + 'px';
    oDragB.style.width = x + 2 + 'px';
}

function doBDrag(x, y) {
    if (y < 35) {
        y = 35;
    }
    oMsgbox.style.height = y - 8 + 'px';

    oDragL.style.height = y + 2 + 'px';
    oDragR.style.height = y + 2 + 'px';

    oDragBoth.style.top = y - 16 + 'px';
}

function doLDrag(x, y) {
    var w = 2 * g_orgWidth - x;
    if (w < 110) {
        w = 110;
    }
    oMsgbox.style.left = g_orgLeft + g_orgWidth - w + 'px';
    oMsgbox.style.width = w - 8 + 'px';

    oDragT.style.width = w + 2 + 'px';
    oDragB.style.width = w + 2 + 'px';
}

function PerfectDraging(oElement, fnGetPos, fnOnDrag) {
    var obj = this;

    this.oElement = oElement;
    this.fnGetPos = fnGetPos;
    this.fnOnDrag = fnOnDrag;
    this.__oStartOffset__ = {
        x: 0,
        y: 0
    };

    this.fnOnMouseUp = function(ev) {
        obj.stopDrag(window.event || ev);
    };

    this.fnOnMouseMove = function(ev) {
        obj.doDrag(window.event || ev);
    };

    this.oElement.onmousedown = function(ev) {
        obj.startDrag(window.event || ev);
    };
}

PerfectDraging.prototype.startDrag = function(oEvent) {
    var oPos = this.fnGetPos();
    //var x=oEvent.pageX || oEvent.x;
    //var y=oEvent.pageY || oEvent.y;
    var x = oEvent.clientX;
    var y = oEvent.clientY;

    this.__oStartOffset__.x = x - oPos.x;
    this.__oStartOffset__.y = y - oPos.y;

    if (this.oElement.setCapture) {
        this.oElement.setCapture();

        this.oElement.onmouseup = this.fnOnMouseUp;
        this.oElement.onmousemove = this.fnOnMouseMove;
    } else {
        document.addEventListener("mouseup", this.fnOnMouseUp, true);
        document.addEventListener("mousemove", this.fnOnMouseMove, true);

        window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
    }
};

PerfectDraging.prototype.stopDrag = function(oEvent) {
    if (this.oElement.releaseCapture) {
        this.oElement.releaseCapture();

        this.oElement.onmouseup = null;
        this.oElement.onmousemove = null;
    } else {
        document.removeEventListener("mouseup", this.fnOnMouseUp, true);
        document.removeEventListener("mousemove", this.fnOnMouseMove, true);

        window.releaseEvents(Event.MOUSE_MOVE | Event.MOUSE_UP);
    }
};

PerfectDraging.prototype.doDrag = function(oEvent) {
    //var x=oEvent.pageX || oEvent.x;
    //var y=oEvent.pageY || oEvent.y;
    var x = oEvent.clientX;
    var y = oEvent.clientY;

    this.fnOnDrag(x - this.__oStartOffset__.x, y - this.__oStartOffset__.y);
};