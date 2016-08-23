var ECity = ECity || {};
ECity.setting = {};
ECity.setting.data = {
    cookie: {
        cookieKey: "SN_CITY",
        cookieVale: "",
        hostName: "",
        cityOuterSepatator: "|",
        cityInnerSeparator: "_",
        cookiePath: "",
        cookieTime: "",
        cookieDomain: "",
        oldCookieCityKey: "cityId",
        oldCookieDistrictKey: "districtId",
        oldCookieCityValue: "",
        oldCookieDistrictValue: "",
        hostDomain: "",
        protocol: "",
        port: "",
        root: "",
        protocolSepatator: "//",
        portSepatator: ":",
        root: "/ip-web"
    },
    url: {cookieUrl: "", cityArrayUrl: "", districtArrayUrl: "", districtUrl: "", lesUrl: ""},
    flag: {user: "1", sys: "2", sys_user: "3"},
    type: {pc: "pc", pcd: "pcd"},
    city: {cityArray: [], cityType: "", cityInfo: {}},
    init: function (f) {
        var e = ECity.setting.data;
        var c = e.cookie;
        var b = e.url;
        var g = e.city;
        var d = e.type;
        c.hostName = document.location.hostname;
        c.hostDomain = document.location.hostname;
        c.protocol = document.location.protocol;
        c.port = document.location.port;
        var a = new Date();
        a.setFullYear(a.getFullYear() + 1);
        c.cookieTime = "; expires = " + a.toUTCString();
        c.cookiePath = "; path = /";
        if (c.hostName.indexOf(".suning.com") != -1) {
            c.cookieDomain = "; domain =.suning.com";
            c.hostName = c.protocol + "//ipservice.suning.com"
        } else {
            if (c.hostName.indexOf(".cnsuning.com") != -1) {
                c.cookieDomain = "; domain =.cnsuning.com";
                if (c.hostName.indexOf("pre") != -1) {
                    c.hostName = c.protocol + "//ipservicepre.cnsuning.com"
                } else {
                    c.hostName = c.protocol + "//ipservicepre.cnsuning.com"
                }
            } else {
                c.cookieDomain += c.hostName;
                c.hostName = "http://ipservicepre.cnsuning.com/ip-web"
            }
        }
        b.cookieUrl = c.hostName + "/ipQuery.do?";
        b.provinceArrayUrl = c.hostName + "/provinceList-";
        b.cityArrayUrl = c.hostName + "/cityList-";
        b.districtArrayUrl = c.hostName + "/districtList-";
        b.districtUrl = c.hostName + "/districtDetail-";
        b.lesUrl = c.hostName + "/cityAndDistrict-";
        b.provinceAndCityUrl = c.hostName + "/provinceAndCity-";
        b.cityMapById = c.hostName + "/cityMapById-";
        g.cityType = f ? d.pc : d.pcd
    }
};
ECity.setting.util = {
    equalsByPCD: function (a, b) {
        if (!a || !b) {
            return false
        }
        if (a.provinceMDMId == b.provinceMDMId && a.cityMDMId == b.cityMDMId && a.districtCommerceId == b.districtCommerceId) {
            return true
        }
        return false
    }, equalsByPC: function (a, b) {
        if (!a || !b) {
            return false
        }
        if (a.provinceMDMId == b.provinceMDMId && a.cityMDMId == b.cityMDMId) {
            return true
        }
        return false
    }, isEmpty: function (b) {
        if (!b) {
            return true
        }
        for (var a in b) {
            if (typeof b[a] != "undefined") {
                return false
            }
        }
        return true
    }, equalsByCD: function (d, c, a) {
        if (!d) {
            return null
        }
        if (!c) {
            return null
        }
        if (!a || a.length == 0) {
            return null
        }
        for (var b in a) {
            if (d === a[b].cityCommerceId && c === a[b].districtCommerceId) {
                return a[b]
            }
        }
        return null
    }, equalsByC: function (c, a) {
        if (!c) {
            return null
        }
        if (!a || a.length == 0) {
            return null
        }
        for (var b in a) {
            if (c === a[b].cityCommerceId) {
                return a[b]
            }
        }
        return null
    }, convertToOut: function (b) {
        if (!b || this.isEmpty(b)) {
            return null
        }
        var a = {};
        a.province = {};
        a.city = {};
        a.district = {};
        a.province.id = b.provinceMDMId;
        a.province.cid = b.provinceCommerceId;
        a.province.name = b.provinceName;
        a.city.id = b.cityMDMId;
        a.city.cid = b.cityCommerceId;
        a.city.lesId = b.cityLESId;
        a.city.name = b.cityName;
        a.district.id = b.districtMDMId;
        a.district.cid = b.districtCommerceId;
        a.district.lesId = b.districtLESId;
        a.district.name = b.districtName;
        return a
    }, convertToIn: function (a) {
        if (!a || this.isEmpty(a)) {
            return null
        }
        var b = {};
        if (a.province && !this.isEmpty(a.province)) {
            b.provinceMDMId = a.province.id;
            b.provinceCommerceId = a.province.cid;
            b.provinceName = a.province.name
        }
        if (a.city && !this.isEmpty(a.city)) {
            b.cityMDMId = a.city.id;
            b.cityCommerceId = a.city.cid;
            b.cityLESId = a.city.lesId;
            b.cityName = a.city.name
        }
        if (a.district && !this.isEmpty(a.district)) {
            b.districtMDMId = a.district.id;
            b.districtLESId = a.district.lesId;
            b.districtCommerceId = a.district.cid;
            b.districtName = a.district.name
        }
        return b
    }
};
ECity.IPCookie = (function () {
    var H = ECity.setting.data;
    var i = ECity.setting.util;
    var u = H.cookie;
    var w = H.flag;
    var K = H.type;
    var m = H.city;
    var c = H.url;
    var A = [];

    function F(L) {
        A = A.concat(L)
    }

    var B = [];

    function l(L) {
        B = B.concat(L)
    }

    var y = [];

    function x(L) {
        y = y.concat(L)
    }

    var s = [];

    function E(L) {
        s = s.concat(L)
    }

    var g = function (N) {
        C();
        if (u.cookieValue) {
            var M = u.cookieValue;
            var L = M.split(u.cityOuterSepatator);
            r(L, N)
        } else {
            G(N)
        }
    };
    var G = function (M) {
        z();
        var L = {};
        if (u.oldCookieCityValue) {
            if (u.oldCookieDistrictValue) {
                L = i.equalsByCD(u.oldCookieCityValue, u.oldCookieDistrictValue, m.cityArray);
                if (L) {
                    m.cityInfo = L;
                    if (!i.equalsByPCD(L, m.cityArray[0])) {
                        b();
                        p()
                    }
                    if (typeof M == "function") {
                        M(i.convertToOut(m.cityInfo))
                    }
                } else {
                    e(M)
                }
            } else {
                L = i.equalsByC(u.oldCookieCityValue, m.cityArray);
                if (L) {
                    m.cityInfo = L;
                    a();
                    if (!i.equalsByPCD(L, m.cityArray[0])) {
                        b();
                        p()
                    }
                    if (typeof M == "function") {
                        M(i.convertToOut(m.cityInfo))
                    }
                } else {
                    e(M)
                }
            }
        } else {
            if (m.cityArray && m.cityArray.length != 0) {
                m.cityInfo = m.cityArray[0];
                a();
                if (typeof M == "function") {
                    M(i.convertToOut(m.cityInfo))
                }
            } else {
                e(M)
            }
        }
    };
    var t = function (L, M) {
        if (L && !i.isEmpty(L)) {
            m.cityInfo = i.convertToIn(L)
        }
        b();
        a();
        p();
        if (typeof M == "function") {
            M(i.convertToOut(m.cityInfo))
        }
    };
    var C = function () {
        var L = document.cookie;
        if (!L) {
            return
        }
        var O = L.match(RegExp("(^| )" + u.oldCookieCityKey + "=([^;]*)(;|$)"));
        var N = L.match(RegExp("(^| )" + u.oldCookieDistrictKey + "=([^;]*)(;|$)"));
        var M = L.match(RegExp("(^| )" + u.cookieKey + "=([^;]*)(;|$)"));
        if (O && O[2] && O[2].length != 0) {
            u.oldCookieCityValue = decodeURIComponent(O[2])
        }
        if (N && N[2] && N[2].length != 0) {
            u.oldCookieDistrictValue = decodeURIComponent(N[2])
        }
        if (M && M[2] && M[2].length != 0) {
            u.cookieValue = decodeURIComponent(M[2])
        }
    };
    var e = function (L) {
        F(L);
        if (A.length == 1) {
            d(L)
        }
    };
    var d = function (M) {
        var L = c.cookieUrl;
        if (u.oldCookieCityValue) {
            L += u.oldCookieCityKey + "=" + u.oldCookieCityValue;
            if (u.oldCookieDistrictValue) {
                L += "&" + u.oldCookieDistrictKey + "=" + u.oldCookieDistrictValue
            }
        }
        $.ajax({
            type: "GET",
            url: L,
            cache: true,
            async: false,
            dataType: "jsonp",
            jsonpCallback: "cookieCallback",
            success: function (N) {
                var P = [];
                if (u.oldCookieCityValue) {
                    if (u.oldCookieDistrictValue) {
                        N.flag = w.user;
                        N.count = 1
                    } else {
                        N.flag = w.sys_user;
                        N.count = 0
                    }
                } else {
                    N.flag = w.sys;
                    N.count = 0
                }
                m.cityInfo = N;
                if (m.cityArray && m.cityArray.length != 0) {
                    b()
                } else {
                    P.push(N);
                    m.cityArray = P
                }
                p();
                if (u.oldCookieCityValue && u.oldCookieDistrictValue && u.oldCookieDistrictValue != N.districtCommerceId) {
                    a()
                }
                if (!u.oldCookieCityValue || !u.oldCookieDistrictValue) {
                    a()
                }
                if (typeof M == "function") {
                    for (var O in A) {
                        A[O](i.convertToOut(m.cityInfo))
                    }
                    A = []
                }
            }
        })
    };

    function n() {
    }

    var r = function (T, S) {
        var M = [];
        var N = T[0].split(u.cityInnerSeparator);
        var P = {};
        var O = N[0];
        var L = N[1];
        var Q = N[4];
        var R = c.cityMapById + O + "-" + L + "-" + Q + "-cityMapCallback.htm";
        $.ajax({
            type: "GET",
            url: R,
            cache: true,
            async: true,
            dataType: "jsonp",
            jsonp: false,
            jsonpCallback: "cityMapCallback",
            success: function (X) {
                if (X.returnCode == "1") {
                    P.provinceMDMId = X.pMdmId;
                    P.provinceLESId = X.pMdmId
                } else {
                    P.provinceMDMId = N[0];
                    P.provinceLESId = N[0]
                }
                P.provinceCommerceId = "";
                P.provinceName = X.pName;
                if (X.returnCode == "2") {
                    P.cityLESId = X.cLesId;
                    P.cityMDMId = X.cMdmId;
                    P.cityCommerceId = X.cCommerceId
                } else {
                    P.cityLESId = N[1];
                    P.cityMDMId = N[2];
                    P.cityCommerceId = N[3]
                }
                P.cityName = X.cName;
                if (X.returnCode == "3" || X.returnCode == "2") {
                    P.districtLESId = X.dLesId;
                    P.districtCommerceId = X.dCommerceId
                } else {
                    P.districtLESId = N[4];
                    P.districtCommerceId = N[5]
                }
                P.districtMDMId = "";
                P.districtName = X.dName;
                P.flag = N[6];
                P.count = N[7];
                var U = false;
                var W = m.cityArray.length;
                for (var V = 0; V < W; V++) {
                    if (i.equalsByPCD(m.cityArray[V], P)) {
                        U = true
                    }
                }
                if (!U) {
                    m.cityArray.push(P)
                }
                T.shift();
                if (X.returnCode != "0") {
                    D();
                    p()
                }
                if (m.cityArray.length == 1 && X.returnCode != "0") {
                    J();
                    a()
                }
                if (T.length == 0) {
                    G(S)
                } else {
                    r(T, S)
                }
            }
        })
    };
    var D = function () {
        var L = new Date();
        L.setTime(L.getTime() - 10000);
        cookieTemp = u.cookieKey + "=" + encodeURIComponent("");
        cookieTemp += "; expires = " + L.toGMTString();
        cookieTemp += u.cookiePath;
        cookieTemp += u.cookieDomain;
        document.cookie = cookieTemp
    };
    var J = function () {
        var L = new Date();
        L.setTime(L.getTime() - 10000);
        cookieCity = u.oldCookieCityKey + "=" + encodeURIComponent("");
        cookieCity += "; expires = " + L.toGMTString();
        cookieCity += u.cookiePath;
        cookieCity += u.cookieDomain;
        document.cookie = cookieCity;
        u.oldCookieCityValue = "";
        cookieDistrict = u.oldCookieDistrictKey + "=" + encodeURIComponent("");
        cookieDistrict += "; expires = " + L.toGMTString();
        cookieDistrict += u.cookiePath;
        cookieDistrict += u.cookieDomain;
        document.cookie = cookieDistrict;
        u.oldCookieDistrictValue = ""
    };
    var z = function () {
        var P = m.cityArray;
        if (!P || P.length == 0) {
            return
        }
        var N = P.length;
        for (var M = 0; M < N; M++) {
            var O = P[M];
            if (O.provinceMDMId == O.cityLESId || !O.cityLESId || O.cityLESId == "null" || typeof O.cityLESId == "undefined" || O.districtLESId == "null" || typeof O.districtLESId == "undefined" || typeof O.cityName == "undefined" || typeof O.districtName == "undefined") {
                if (u.cookieValue) {
                    var L = new Date();
                    L.setTime(L.getTime() - 10000);
                    cookieTemp = u.cookieKey + "=" + encodeURIComponent("");
                    cookieTemp += "; expires = " + L.toGMTString();
                    cookieTemp += u.cookiePath;
                    cookieTemp += u.cookieDomain;
                    document.cookie = cookieTemp;
                    cookieCity = u.oldCookieCityKey + "=" + encodeURIComponent("");
                    cookieCity += "; expires = " + L.toGMTString();
                    cookieCity += u.cookiePath;
                    cookieCity += u.cookieDomain;
                    document.cookie = cookieCity;
                    u.oldCookieCityValue = "";
                    cookieDistrict = u.oldCookieDistrictKey + "=" + encodeURIComponent("");
                    cookieDistrict += "; expires = " + L.toGMTString();
                    cookieDistrict += u.cookiePath;
                    cookieDistrict += u.cookieDomain;
                    document.cookie = cookieDistrict;
                    u.oldCookieDistrictValue = "";
                    m.cityArray = null;
                    break
                }
            }
        }
    };
    var a = function () {
        var M = m.cityArray;
        if (!M || M.length == 0) {
            return
        }
        u.oldCookieCityValue = M[0].cityCommerceId;
        u.oldCookieDistrictValue = M[0].districtCommerceId;
        var L = "";
        var N = "";
        L = u.oldCookieCityKey + "=" + encodeURIComponent(u.oldCookieCityValue);
        L += u.cookieTime;
        L += u.cookiePath;
        L += u.cookieDomain;
        document.cookie = L;
        N = u.oldCookieDistrictKey + "=" + encodeURIComponent(u.oldCookieDistrictValue);
        N += u.cookieTime;
        N += u.cookiePath;
        N += u.cookieDomain;
        document.cookie = N
    };
    var p = function () {
        var N = m.cityArray;
        var P = "";
        var O = "";
        if (!N || N.length == 0) {
            return
        }
        var M = N.length;
        for (var L = 0; L != M; L++) {
            O += N[L].provinceMDMId;
            O += u.cityInnerSeparator;
            O += N[L].cityLESId;
            O += u.cityInnerSeparator;
            O += N[L].cityMDMId;
            O += u.cityInnerSeparator;
            O += N[L].cityCommerceId;
            O += u.cityInnerSeparator;
            O += N[L].districtLESId;
            O += u.cityInnerSeparator;
            O += N[L].districtCommerceId;
            O += u.cityInnerSeparator;
            O += N[L].flag;
            O += u.cityInnerSeparator;
            O += N[L].count;
            if (L == M - 1) {
                break
            }
            O += u.cityOuterSepatator
        }
        u.cookieValue = O;
        P = u.cookieKey + "=" + encodeURIComponent(u.cookieValue);
        P += u.cookieTime;
        P += u.cookiePath;
        P += u.cookieDomain;
        document.cookie = P
    };
    var b = function () {
        var R = m.cityArray;
        var O = m.cityType;
        var Q = m.cityInfo;
        if (i.isEmpty(Q) || !R || i.isEmpty(R[0])) {
            return
        }
        var N = [];
        var P = R[0];
        var M = R[1];
        var L = R[2];
        if (O == K.pc) {
            if (P.flag == w.sys) {
                Q.flag = w.sys_user;
                Q.count = 0;
                N.push(Q);
                m.cityArray = N;
                return
            }
            if (P.flag == w.sys_user) {
                if (i.equalsByPC(Q, P)) {
                    return
                } else {
                    if (i.equalsByPC(Q, M)) {
                        N.push(M);
                        if (!i.isEmpty(L)) {
                            N.push(L)
                        }
                        m.cityArray = N;
                        return
                    } else {
                        if (i.equalsByPC(Q, L)) {
                            N.push(L);
                            N.push(M);
                            m.cityArray = N;
                            return
                        } else {
                            Q.flag = w.sys_user;
                            Q.count = 0;
                            N.push(Q);
                            if (!i.isEmpty(M)) {
                                N.push(M);
                                if (!i.isEmpty(L)) {
                                    N.push(L)
                                }
                            }
                            m.cityArray = N;
                            return
                        }
                    }
                }
            }
            if (P.flag == w.user) {
                if (i.equalsByPC(Q, P)) {
                    return
                } else {
                    if (i.equalsByPC(Q, M)) {
                        N.push(M);
                        N.push(P);
                        if (!i.isEmpty(L)) {
                            N.push(L)
                        }
                        m.cityArray = N;
                        return
                    } else {
                        if (i.equalsByPC(Q, L)) {
                            N.push(L);
                            N.push(P);
                            N.push(M);
                            m.cityArray = N;
                            return
                        } else {
                            Q.flag = w.sys_user;
                            Q.count = 0;
                            N.push(Q);
                            N.push(P);
                            if (!i.isEmpty(M)) {
                                N.push(M)
                            }
                            m.cityArray = N;
                            return
                        }
                    }
                }
            }
        } else {
            if (P.flag == w.sys) {
                Q.flag = w.user;
                Q.count = 1;
                N.push(Q);
                m.cityArray = N;
                return
            }
            if (P.flag == w.sys_user) {
                if (i.equalsByPCD(Q, P)) {
                    P.count++;
                    P.flag = w.user;
                    return
                } else {
                    if (i.equalsByPCD(Q, M)) {
                        M.count++;
                        N.push(M);
                        if (!i.isEmpty(L)) {
                            N.push(L)
                        }
                        m.cityArray = N;
                        return
                    } else {
                        if (i.equalsByPCD(Q, L)) {
                            L.count++;
                            N.push(L);
                            N.push(M);
                            m.cityArray = N;
                            return
                        } else {
                            Q.flag = w.user;
                            Q.count = 1;
                            N.push(Q);
                            if (!i.isEmpty(M)) {
                                N.push(M);
                                if (!i.isEmpty(L)) {
                                    N.push(L)
                                }
                            }
                            m.cityArray = N;
                            return
                        }
                    }
                }
            }
            if (P.flag == w.user) {
                if (i.equalsByPCD(Q, P)) {
                    P.count++;
                    return
                } else {
                    if (i.equalsByPCD(Q, M)) {
                        M.count++;
                        N.push(M);
                        N.push(P);
                        if (!i.isEmpty(L)) {
                            N.push(L)
                        }
                        m.cityArray = N;
                        return
                    } else {
                        if (i.equalsByPCD(Q, L)) {
                            L.count++;
                            N.push(L);
                            N.push(P);
                            N.push(M);
                            m.cityArray = N;
                            return
                        } else {
                            Q.flag = w.user;
                            Q.count = 1;
                            N.push(Q);
                            N.push(P);
                            if (!i.isEmpty(M)) {
                                N.push(M)
                            }
                            m.cityArray = N;
                            return
                        }
                    }
                }
            }
        }
    };
    var j = function (L, M) {
        x(M);
        if (y.length == 1) {
            f(L, M)
        }
    };
    var f = function (M, N) {
        var L = c.cityArrayUrl + M + "_20150401-cityListCallback.htm";
        $.ajax({
            type: "GET",
            url: L,
            cache: true,
            async: true,
            dataType: "jsonp",
            jsonp: false,
            jsonpCallback: "cityListCallback",
            success: function (T) {
                var R = [];
                R = T.cities;
                var U = [];
                var S = R.length;
                for (var Q = 0; Q != S; Q++) {
                    var O = {};
                    O.name = R[Q].name;
                    O.id = R[Q].mdmId;
                    O.cid = R[Q].commerceId;
                    O.lesId = R[Q].lesId;
                    O.pinyin = R[Q].pinyin.charAt(0);
                    O.defaultId = R[Q].defaultDistrictMdmId;
                    U.push(O)
                }
                if (typeof N == "function") {
                    for (var P in y) {
                        y[P](U)
                    }
                    y = []
                }
            }
        })
    };
    var q = function (L, M) {
        E(M);
        if (s.length == 1) {
            v(L, M)
        }
    };
    var v = function (M, N) {
        var L = c.districtArrayUrl + M + "_20150401-districtListCallback.htm";
        $.ajax({
            type: "GET",
            url: L,
            cache: true,
            async: true,
            dataType: "jsonp",
            jsonp: false,
            jsonpCallback: "districtListCallback",
            success: function (P) {
                var S = [];
                S = P.districts;
                var U = [];
                var T = S.length;
                for (var R = 0; R != T; R++) {
                    var O = {};
                    O.name = S[R].name;
                    O.id = S[R].mdmId;
                    O.cid = S[R].commerceId;
                    O.lesId = S[R].lesId;
                    O.pinyin = S[R].pinyin.charAt(0);
                    U.push(O)
                }
                if (typeof N == "function") {
                    for (var Q in s) {
                        s[Q](U)
                    }
                    s = []
                }
            }
        })
    };
    var h = function (L) {
        l(L);
        if (B.length == 1) {
            I(L)
        }
    };
    var I = function (M) {
        var L = c.provinceArrayUrl + "provinceListCallback.htm";
        $.ajax({
            type: "GET",
            url: L,
            cache: true,
            async: true,
            dataType: "jsonp",
            jsonp: false,
            jsonpCallback: "provinceListCallback",
            success: function (Q) {
                var R = [];
                R = Q.provinces;
                var T = [];
                var S = R.length;
                for (var P = 0; P != S; P++) {
                    var N = {};
                    N.name = R[P].name;
                    N.id = R[P].mdmId;
                    N.cid = R[P].commerceId;
                    N.pinyin = R[P].pinyin.charAt(0);
                    N.defaultId = R[P].defaultCityMdmId;
                    T.push(N)
                }
                if (typeof M == "function") {
                    for (var O in B) {
                        B[O](T)
                    }
                    B = []
                }
            }
        })
    };
    var o = function (M, N) {
        var L = c.districtUrl + M + "_20150401-districtCallback.htm";
        $.ajax({
            type: "GET",
            url: L,
            cache: true,
            async: true,
            dataType: "jsonp",
            jsonp: false,
            jsonpCallback: "districtCallback",
            success: function (O) {
                var P = {};
                if (typeof N == "function") {
                    P.id = O.mdmId;
                    P.cid = O.commerceId;
                    P.lesId = O.lesId;
                    P.name = O.name;
                    N(P)
                }
            }
        })
    };
    var k = function (N, M) {
        var L = c.provinceAndCityUrl + N + "-provinceandcityCallBack.htm";
        $.ajax({
            type: "GET",
            url: L,
            cache: true,
            async: true,
            dataType: "jsonp",
            jsonp: false,
            jsonpCallback: "provinceandcityCallBack",
            success: function (Q) {
                var P = {};
                var O = {};
                if (typeof M == "function") {
                    O.pMdmId = Q.pMdmId;
                    O.pName = Q.pName;
                    O.cMdmId = Q.cMdmId;
                    O.cCommerceId = Q.cCommerceId;
                    O.cName = Q.cName;
                    P.provinceAndCity = O;
                    M(P)
                }
            }
        })
    };
    return {
        showCity: g,
        setCity: t,
        getRemoteDistrict: o,
        getRemoteDistrictArray: q,
        getRemoteCityArray: j,
        getRemoteProvinceArray: h,
        getProvinceAndCityByCityId: k
    }
}());
ECity.API = {
    init: function (a) {
        ECity.setting.data.init(a)
    }, ipCookie: ECity.IPCookie, util: ECity.setting.util, getCity: function (a) {
        this.ipCookie.showCity(a)
    }, setCity: function (a, b) {
        this.ipCookie.setCity(a, b)
    }, getDataCity: function () {
        var b = ECity.setting.data.city.cityArray;
        var a = {};
        if (b && !this.util.isEmpty(b[0])) {
            a = this.util.convertToOut(b[0])
        }
        return a
    }, getLastUsedCities: function () {
        var c = ECity.setting.data.city.cityArray;
        var b = [];
        if (c) {
            for (var a in c) {
                b.push(this.util.convertToOut(c[a]))
            }
        }
        return b
    }, getCityId: function () {
        var a = ECity.setting.data.city.cityArray;
        if (a && !this.util.isEmpty(a[0])) {
            return a[0].cityCommerceId
        }
        return ""
    }, getDistrictId: function () {
        var a = ECity.setting.data.city.cityArray;
        if (a && !this.util.isEmpty(a[0])) {
            return a[0].districtCommerceId
        }
        return ""
    }, getDistrict: function (a, b) {
        this.ipCookie.getRemoteDistrict(a, b)
    }, getDistrictList: function (b, a) {
        this.ipCookie.getRemoteDistrictArray(b, a)
    }, getCityList: function (a, b) {
        this.ipCookie.getRemoteCityArray(a, b)
    }, getProvinceList: function (a) {
        this.ipCookie.getRemoteProvinceArray(a)
    }, getProvinceAndCityByCityId: function (b, a) {
        this.ipCookie.getProvinceAndCityByCityId(b, a)
    }
};
(function (d) {
    if (!jQuery) {
        throw new Error("The plugin requires jQuery")
    }
    var i = function () {
        if (this instanceof i == false) {
            return new i()
        }
    };
    i.prototype = {
        init: function (k, j) {
            this.eles = k;
            this.opts = j;
            this.flag = true;
            this.render()
        }, render: function () {
            var j = this;
            this.setTemps(function (k) {
                j.getCity(k)
            })
        }, setTemps: function (n) {
            var p = this;
            var j = this.eles;
            var o = this.opts;
            var m = '<style id="ui-city-style">' + "ul,li,p,h3,h5,em,b,i,span,a{ margin: 0; padding: 0; }" + "ul,li { list-style: none; }" + '.clearfix:after{ content:"."; display:block; height:0; clear:both; visibility:hidden}' + ".clearfix{ zoom:1}" + ".ui-city a," + ".ui-city a:visited{ line-height:14px; color:#333; text-decoration: none; outline: none; cursor: pointer;}" + ".ui-city a:hover { text-decoration:none; }" + ".ui-city { display:inline-block;*dispplay:inline;*zoom:1; font-size: 12px; position: relative; z-index: 0}" + ".ui-city .dn { display: none; }" + ".ui-city .db { display: block; }" + ".ui-city .dib { display: inline-block; }" + ".ui-city .arr { display: inline-block; width: 0; height:0; border-color: #bbb transparent transparent; border-width: 5px; border-style: solid dashed dashed; font-size: 0; line-height: 0; overflow: hidden; }" + ".ui-city a.ui-city-toggle:hover { color:#333;}" + ".ui-city-toggle { display:inline-block; border: 1px solid #bbb; padding:6px 5px 6px 6px; color: #000;background: #fff; position: relative; z-index: 100}" + ".ui-city-toggle .address-placement {font-style: normal; float: left;}" + ".ui-city-toggle span { padding-right: 5px}" + ".ui-city-toggle span:hover {color: #333;}" + ".ui-city-toggle .arr { margin-right:5px;position: relative; top:5px; float: left;}" + ".ui-city-group { display:none; position: absolute;background: #fff; left: 0; top:27px;border: 1px solid #ccc; margin-top:-1px; width: 420px; z-index: 99; box-shadow: 0 0 6px #ddd;padding-top:5px;}" + ".ui-city-group .ui-city-close  { position: absolute;right: 0;top: 0;padding: 5px 10px;overflow: hidden;}" + ".ui-city-group .ui-city-close i { font: 700 14px/1.5 simsun;margin-left:-4px; color: #aaa}" + ".ui-city-group-header { padding-top: 10px;  }" + ".ui-city-group-header p { padding-left:15px; margin-bottom: 10px; }" + ".ui-city-group-header .address-title { }" + ".ui-city-group-header .address-item {clear:both; }" + ".ui-city-group-header .address-item a," + ".ui-city-group-header .address-item a:visited{ display: inline-block;zoom:1; padding-top: 4px; padding-left: 5px; padding-bottom: 4px; margin-right: 10px; border: 1px solid #bbb; }" + ".ui-city-group-header .address-item a:hover {  background: #f90; color: #fff;border:1px solid #f90; }" + ".ui-city-group-header .address-item a span { padding-right:5px}" + ".ui-city-group-content { margin: 10px 10px 0 10px; background:#fff;}" + ".ui-city-group-content .nav-tabs { padding-left: 6px  }" + ".ui-city-group-content .nav-tabs li {float: left; position: relative; z-index:2;border: 1px solid #ccc; height: 26px;background:#fff;margin-right: 6px; margin-bottom:0; cursor: pointer; }" + ".ui-city-group-content .nav-tabs li p { padding: 6px 10px 6px 10px;border:1px solid #fff; }" + ".ui-city-group-content .nav-tabs li a," + ".ui-city-group-content .nav-tabs li a:visited{ color: #999;float: left}" + ".ui-city-group-content .nav-tabs li .arr { position: relative; top: 3px;left: 5px;font-size: 0; line-height: 0;}" + ".ui-city-group-content .nav-tabs li.current { border: 2px solid #ffb84e; border-bottom:none; z-index: 4;}" + ".ui-city-group-content .nav-tabs li.current p { padding: 6px 10px 5px 10px; position: relative; z-index: 4; border:none; }" + ".ui-city-group-content .nav-tabs li.current .arr { border-color:  transparent transparent #f90; border-style:  dashed dashed solid; top:-2px; }" + ".ui-city-group-content .nav-tabs li.current a," + ".ui-city-group-content .nav-tabs li.current a:visited{ display:inline-block; color: #333; }" + ".ui-city-group-content .nav-tabs li.active a," + ".ui-city-group-content .nav-tabs li.active a:visited{ display:inline-block; color: #333; }" + ".ui-city-group-content .tab-content { border-top: 2px solid #ffb84e;top:-2px;  position: relative; z-index: 3}" + ".ui-city-group-content .tab-content .tab-panel { display: none; padding-top: 3px; padding-bottom: 15px; background: #fff;padding-left: 8px }" + ".ui-city-group-content .tab-content .tab-panel.active { display: block;}" + '.ui-city-group-content .tab-content li:after { content:"."; display:block; height:0; clear:both; visibility:hidden }' + ".ui-city-group-content .tab-content li { *zoom:1;}" + ".ui-city-group-content .tab-content li span {display:inline-block;width: 98px;}" + ".ui-city-group-content .tab-content li a," + ".ui-city-group-content .tab-content li a:visited { display:inline-block; background:#fff;margin: 2px; padding: 5px; color:#000; }" + ".ui-city-group-content .tab-content li a:hover { background: #f90; color: #fff;}" + ".ui-city-group-content .tab-content li a.on," + ".ui-city-group-content .tab-content li a.on:visited { background: #f90;color: #fff; }" + ".ui-city-group-content .tab-content .pr-panel li a{ }" + ".ui-city.active { z-index: 10}" + ".ui-city.active a.ui-city-toggle { border: 1px solid #ccc;background:#fff;border-bottom:none;box-shadow: 0 -1px 1px #ddd}" + ".ui-city.active a.ui-city-toggle:hover { color: #333; background: #fff; text-decoration: none;}" + ".ui-city.active a.ui-city-toggle .arr{ border-color:  transparent transparent #f90; border-style:  dashed dashed solid; top:0; }" + ".ui-city.active .ui-city-group { display: block; }" + ".ui-city .arr {transition:All .2s ease;-webkit-transition:All .2s ease;-moz-transition:All .2s ease;-o-transition:All .2s ease;-ms-transition:All .2s ease;}" + "</style>";
            if (d("#ui-city-style").size() == 0) {
                d("body").prepend(d(m))
            }
            var l = d('<div class="ui-city"></div>');
            d("a", p.eles).live("click", function () {
                return false
            });
            var k;
            this.getInfo = {};
            this.changeFlag = !0;
            this.queryInfo = function (q) {
                if (o.cityId != "" && o.cityId != undefined) {
                    o.city = true;
                    p.getAddressByDefault(function () {
                        p.getInfoByCityid(o.cityId, function (r) {
                            q(r);
                            setTimeout(function () {
                                n(r)
                            }, 10)
                        })
                    })
                } else {
                    p.getAddressByDefault(function (r) {
                        q(r);
                        setTimeout(function () {
                            n(r)
                        }, 10)
                    })
                }
            };
            this.queryInfo(function (s) {
                var q = s.province;
                var w = s.city;
                var u = s.district;
                var v = [q.id, q.cid, "", q.name].join(",");
                var t = [w.id, w.cid, u.lesId, w.name].join(",");
                var r = [u.id, u.cid, u.lesId, u.name].join(",");
                var x = q.id;
                p.getInfo = s;
                if (/^10$|^20$|^30$|^320$/.test(x)) {
                    if (!!o.city) {
                        k = d('<a name="item_none_dizhi_01" href="###" class="ui-city-toggle" hidefocus="true"><em class="address-placement"><span id="provinceName" class="pr dn"  role=' + v + ">" + q.name + '</span><span id="citybName" class="ct"  role=' + t + ">" + w.name + '</span></em><b class="arr"></b></a>')
                    } else {
                        k = d('<a name="item_none_dizhi_01" href="###" class="ui-city-toggle" hidefocus="true"><em class="address-placement"><span id="provinceName" class="pr dn"  role=' + v + ">" + s.province.name + '</span><span class="ct" id="citybName" role=' + t + ">" + w.name + '</span><span id="districtName" class="ds" role=' + r + ">" + u.name + '</span></em><b class="arr"></b></a>')
                    }
                } else {
                    if (!!o.city) {
                        k = d('<a name="item_none_dizhi_01" href="###" class="ui-city-toggle" hidefocus="true"><em class="address-placement"><span id="provinceName" class="pr"  role=' + v + ">" + q.name + '</span><span id="citybName" class="ct"  role=' + t + ">" + w.name + '</span></em><b class="arr"></b></a>')
                    } else {
                        k = d('<a name="item_none_dizhi_01" href="###" class="ui-city-toggle" hidefocus="true"><em class="address-placement"><span id="provinceName" class="pr"  role=' + v + ">" + q.name + '</span><span id="citybName" class="ct"  role=' + t + ">" + w.name + '</span><span id="districtName" class="ds" role=' + r + ">" + u.name + '</span></em><b class="arr"></b></a>')
                    }
                }
                l.append(k);
                d(j).append(l);
                p.openPanel(o, s)
            })
        }, openPanel: function (l, m) {
            var k = this;
            var j = d(this.eles).find(".ui-city");
            j.one("click.open", function (o) {
                var n = o || n;
                if (n) {
                    n.stopPropagation()
                }
                k.getAllDetail(l, m);
                d(this).addClass("active");
                return false
            })
        }, closePanel: function () {
            var l = this;
            var j = d(this.eles).find(".ui-city");
            var k = d(this.eles).find(".ui-city-close");
            k.on("click.close", function (n) {
                var m = n || m;
                if (m) {
                    m.stopPropagation()
                }
                j.removeClass("active");
                return false
            });
            d(document).not(this).on("click.close", function () {
                if (!j.hasClass("active")) {
                    return
                }
                j.removeClass("active");
                return false
            })
        }, getAllDetail: function (r, E) {
            var o = this;
            var v = this.eles;
            var j = E.province;
            var w = E.city;
            var u = E.district;
            var B = [j.id, j.cid, "", j.name, j.defaultId].join(",");
            var z = [w.id, w.cid, w.lesId, w.name, w.defaultId].join(",");
            var s = [u.id, u.cid, u.lesId, u.name].join(",");
            var t = j.id;
            var C = d(this.eles).find(".ui-city");
            var x = C.find(".ui-city-toggle");
            var D = d('<div class="ui-city-group"></div>');
            var m = d('<a name="item_none_dizhi_guanbi" class="ui-city-close" href="###"><i>&gt;</i><i>&lt;</i></a>');
            D.append(m);
            var A = d('<div class="ui-city-group-header"><p class="address-title">甯哥敤鍦板潃锛�</p></div>');
            var l = d('<p class="address-item"></p>');
            if (!!r.used && !r.city) {
                o.getUsedAddress(function (F) {
                    if (!F) {
                        return
                    }
                    d.each(F, function (I, H) {
                        if (I == 0) {
                            return
                        }
                        if (H != null) {
                            var G = H.province;
                            var N = H.city;
                            var L = H.district;
                            var M = [G.id, G.cid, "", G.name, G.defaultId].join(",");
                            var K = [N.id, N.cid, N.lesId, N.name, G.defaultId].join(",");
                            var J = [L.id, L.cid, L.lesId, L.name].join(",");
                            l.append(d('<a name="item_none_dizhi_chy0' + I + '" href="###"><span class="pr dn" role=' + M + ">" + G.name + '</span><span class="ct" role=' + K + ">" + N.name + '</span><span class="ds"  role=' + J + ">" + L.name + "</span></a>"))
                        }
                    });
                    A.append(l);
                    if (!!r.used && !r.city && F.length > 1) {
                        D.prepend(A)
                    }
                })
            }
            var n = d('<div class="ui-city-group-content"></div>');
            if (!r.city) {
                var k = d('<ul class="nav-tabs clearfix"><li name="item_none_dizhi_02" id="provinceShow" class="active"  role=' + B + '><p><a href="###">' + j.name + '</a><b class="arr"></b></p></li><li name="item_none_dizhi_03" id="citybShow" class="active"  role=' + z + "," + w.defaultId + '><p><a href="###">' + w.name + '</a><b class="arr"></b></p></li><li name="item_none_dizhi_04" id="districtShow" class="active current" role=' + s + "," + u.defaultId + '><p><a href="###">' + u.name + '</a><b class="arr"></b></p></li></ul>')
            } else {
                var k = d('<ul class="nav-tabs clearfix"><li name="item_none_dizhi_02" id="provinceShow" class="active" role=' + B + '><p><a href="###">' + j.name + '</a><b class="arr"></b></p></li><li name="item_none_dizhi_03" id="citybShow" class="active current" role=' + z + "," + w.defaultId + '><p><a href="###">' + w.name + '</a><b class="arr"></b></p></li></ul>')
            }
            var y = d('<div class="tab-content"></div>');
            var q = d('<ul class="tab-panel pr-panel"></ul><ul class="tab-panel ct-panel"><li>姝ｅ湪鍔犺浇涓�...</li></ul><ul class="tab-panel ds-panel active"><li></li></ul>');
            o.setInfo = o.getInfo;
            if (!!r.state) {
                var p = d("<li></li>");
                q.eq(0).append(p);
                o.getProvinceList(function (F) {
                    d.each(F, function (H, G) {
                        var I = [G.id, G.cid, "", G.name, G.defaultId].join(",");
                        if (G.id == o.getInfo.province.id) {
                            q.children(":eq(0)").append('<span><a name="item_none_dizhi_sheng" href="###" class="on" role=' + I + ">" + G.name + "</a></span>")
                        } else {
                            q.children(":eq(0)").append('<span><a name="item_none_dizhi_sheng" href="###" role=' + I + ">" + G.name + "</a></span>")
                        }
                    });
                    y.append(q);
                    o.getProvinces(C, l, x, y, k, q, A, D, function () {
                        return o.getCities(k, y, q, C, x, function () {
                            return o.getDistricts(k, y, x, C, function () {
                                return o.setDetailAddress(x, k, y, C)
                            })
                        })
                    })
                })
            } else {
            }
            n.append(k);
            n.append(y);
            D.append(n);
            C.append(D);
            d(v).append(C);
            o.closePanel();
            k.find("li").each(function (F) {
                d(this).on("click", function (G) {
                    if (d(this).hasClass("active")) {
                        d(this).addClass("current").siblings().removeClass("current");
                        y.children(":eq(" + F + ")").addClass("active").siblings().removeClass("active")
                    }
                    return false
                })
            });
            if (!!r.used && !r.city) {
                o.setAddressByUsed(l, x, C, q, y, k, A, D)
            }
        }, getProvinces: function (n, r, k, s, t, m, l, q, o) {
            var p = this;
            var j = this.opts;
            n.on("click", function (u) {
                if (u) {
                    u.stopPropagation()
                }
                d(this).addClass("active");
                if (typeof r !== undefined) {
                    r.html("")
                }
                p.getUsedAddress(function (v) {
                    if (!v) {
                        return
                    }
                    d.each(v, function (y, x) {
                        if (y == 0) {
                            return
                        }
                        var w = x.province;
                        var D = x.city;
                        var B = x.district;
                        var C = [w.id, w.cid, "", w.name, w.defaultId].join(",");
                        var A = [D.id, D.cid, D.lesId, D.name, w.defaultId].join(",");
                        var z = [B.id, B.cid, B.lesId, B.name].join(",");
                        r.append(d('<a name="item_none_dizhi_chy0' + y + '" href="###"><span class="pr dn" role=' + C + ">" + w.name + '</span><span class="ct" role=' + A + ">" + D.name + '</span><span class="ds"  role=' + z + ">" + B.name + "</span></a>"))
                    });
                    l.append(r);
                    if (!!j.used && !j.city && v.length > 1) {
                        q.prepend(l)
                    }
                });
                if (!!j.used && !j.city) {
                    p.setAddressByUsed(r, k, n, m, s, t, l, q)
                }
                return false
            });
            o()
        }, setAddressByUsed: function (q, k, n, m, r, s, l, p) {
            var o = this;
            var j = this.opts;
            n.off("click.setDefaultAddress").on("click.setDefaultAddress", ".address-item a", function (u) {
                if (u) {
                    u.stopPropagation()
                }
                var E = d(this).clone();
                var t = E.find(".pr").attr("role");
                var C = E.find(".ct").attr("role");
                var y = E.find(".ds").attr("role");
                var G = t.split(",");
                var v = C.split(",");
                var H = y.split(",");
                if (!/^10\,|^20\,|^30,|^320\,/.test(t)) {
                    E.find("span:hidden").removeClass("dn")
                }
                o.setInfo.province = {id: G[0], cid: G[1], name: G[3]};
                o.setInfo.city = {id: v[0], cid: v[1], lesId: v[2], name: v[3]};
                o.setInfo.district = {id: H[0], cid: H[1], lesId: H[2], name: H[3]};
                k.find("em").html(E.children());
                n.removeClass("active");
                o.setDefaultAddress(o.setInfo, function (J) {
                    if (d.type(j.changeCb) == "function") {
                        return j.changeCb(J)
                    }
                });
                var x = o.getInfo;
                var w = x.province;
                var z = x.city;
                var I = x.district;
                var A = [w.id, w.cid, "", w.name, w.defaultId].join(",");
                var D = [z.id, z.cid, z.lesId, z.name, z.defaultId].join(",");
                var B = [I.id, I.cid, I.lesId, I.name, I.defaultId].join(",");
                if (!j.city) {
                    s.html('<li class="active"  role=' + A + '><p><a href="###">' + w.name + '</a><b class="arr"></b></p></li><li class="active"  role=' + D + '><p><a href="###">' + z.name + '</a><b class="arr"></b></p></li><li class="active current" role=' + B + '><p><a href="###">' + I.name + '</a><b class="arr"></b></p></li>')
                } else {
                    s.html('<li class="active" role=' + A + '><p><a href="###">' + w.name + '</a><b class="arr"></b></p></li><li class="active current" role=' + D + '><p><a href="###">' + z.name + '</a><b class="arr"></b></p></li>')
                }
                m.removeClass("active").eq(2).addClass("active");
                if (!!j.state) {
                    var F = d("<li></li>");
                    m.eq(0).html("").append(F);
                    o.getProvinceList(function (J) {
                        d.each(J, function (L, K) {
                            var M = [K.id, K.cid, "", K.name, K.defaultId].join(",");
                            if (K.id == w.id) {
                                m.children(":eq(0)").append('<span><a name="item_none_dizhi_sheng" href="###" class="on" role=' + M + ">" + K.name + "</a></span>")
                            } else {
                                m.children(":eq(0)").append('<span><a name="item_none_dizhi_sheng" href="###" role=' + M + ">" + K.name + "</a></span>")
                            }
                        });
                        r.append(m);
                        o.getProvinces(n, q, k, r, s, m, l, p, function () {
                            return o.getCities(s, r, m, n, k, function () {
                                return o.getDistricts(s, r, k, n, function () {
                                    return o.setDetailAddress(k, s, r, n)
                                })
                            })
                        })
                    })
                } else {
                }
                s.find("li").each(function (J) {
                    d(this).on("click", function (K) {
                        if (d(this).hasClass("active")) {
                            d(this).addClass("current").siblings().removeClass("current");
                            r.children(":eq(" + J + ")").addClass("active").siblings().removeClass("active")
                        }
                        return false
                    })
                });
                return false
            })
        }, getCities: function (u, t, l, m, k, n) {
            var p = this;
            var j = this.opts;
            var o = t.find(".ct-panel li");
            var r = t.find(".ds-panel li");
            t.find(".pr-panel a").on("click", function (y) {
                if (y) {
                    y.stopPropagation()
                }
                u.children(":eq(1)").find("a").html("璇烽€夋嫨甯�").end().end().children(":eq(2)").removeClass("active").find("a").html("璇烽€夋嫨鍘垮尯");
                d(this).addClass("on").parent().siblings().find("a").removeClass("on");
                var A = d(this).attr("role");
                var w = A.split(",");
                p.setInfo.province = {id: w[0], cid: w[1], name: w[3], lesId: w[2]};
                var v = w[0];
                var x = w[4];
                var z = d(this).text();
                o.html("");
                p.getCityById(v, function (B) {
                    d.each(B, function (E, D) {
                        var F = [D.id, D.cid, D.lesId, D.name, D.defaultId].join(",");
                        if (D.id == p.getInfo.city.id) {
                            o.append('<span><a name="item_none_dizhi_shi" href="###" class="on" role=' + F + ">" + D.name + "</a></span>")
                        } else {
                            o.append('<span><a name="item_none_dizhi_shi" href="###" role=' + F + ">" + D.name + "</a></span>")
                        }
                    });
                    n();
                    if (B.length !== 1) {
                        u.children(":eq(1)").addClass("active current");
                        t.find(".pr-panel").removeClass("active").end().find(".ct-panel").addClass("active")
                    } else {
                        if (!!j.city) {
                            m.removeClass("active")
                        }
                        var C = [B[0].id + "," + B[0].cid + "," + B[0].name + "," + B[0].defaultId].join(",");
                        u.children(":eq(1)").attr("role", C).find("a").text(z);
                        p.setInfo.city = {id: B[0].id, cid: B[0].cid, name: B[0].name, lesId: B[0].lesId};
                        p.getDefaultDistrict(B[0].defaultId, function (D) {
                            p.setInfo.district = {id: D.id, cid: D.cid, name: D.name, lesId: D.lesId};
                            if (!!j.city) {
                                p.setDefaultAddress(p.setInfo, function (F) {
                                    var G = k.find("span:eq(0)");
                                    var E = k.find("span:eq(1)");
                                    G.attr("role", p.setInfo.province.id + "," + p.setInfo.province.cid + "," + p.setInfo.province.name).text(p.setInfo.province.name);
                                    E.attr("role", p.setInfo.city.id + "," + p.setInfo.city.cid + "," + p.setInfo.city.name + "," + p.setInfo.province.lesId).text(p.setInfo.city.name);
                                    G.text() == E.text() && d.trim(G) != "鍚夋灄" ? k.find(".pr").addClass("dn") : k.find(".pr").removeClass("dn")
                                })
                            }
                            if (d.type(j.cityCb) == "function") {
                                j.cityCb(p.getInfo)
                            }
                            u.children(":eq(1)").removeClass("active")
                        })
                    }
                });
                if (/^10\,|^20\,|^30,|^320\,/.test(v + ",")) {
                    p.changeFlag = !!0;
                    if (!j.city) {
                        u.children().eq(1).removeClass("active current").end().eq(2).addClass("current");
                        t.find(".pr-panel").removeClass("active").end().find(".ds-panel").addClass("active");
                        p.getDistrictsById(x, function (B) {
                            r.html("");
                            d.each(B, function (D, C) {
                                var E = [C.id, C.cid, C.lesId, C.name, C.defaultId].join(",");
                                r.append('<span><a href="###" role=' + E + ">" + C.name + "</a></span>")
                            });
                            if (d.type(j.cityCb) == "function") {
                                j.cityCb(p.getInfo)
                            }
                            p.setDetailAddress(k, u, t, m)
                        });
                        u.children(":eq(0)").addClass("active").removeClass("current")
                    }
                } else {
                    u.children(":eq(0)").removeClass("current")
                }
                u.children(":eq(0)").attr("role", A).find("a").text(z);
                return false
            });
            var s = p.getInfo.province.id;
            var q = p.getInfo.city.id;
            p.getCityById(s, function (v) {
                o.html("");
                d.each(v, function (x, w) {
                    var y = [w.id, w.cid, w.lesId, w.name, w.defaultId].join(",");
                    if (w.id == p.getInfo.city.id) {
                        o.append('<span><a name="item_none_dizhi_shi" href="###" class="on" role=' + y + ">" + w.name + "</a></span>")
                    } else {
                        o.append('<span><a name="item_none_dizhi_shi" href="###" role=' + y + ">" + w.name + "</a></span>")
                    }
                });
                if (v.length == 1) {
                    u.children().eq(1).removeClass("active current");
                    u.children().eq(2).addClass("current");
                    t.find(".pr-panel").removeClass("active").end().find(".ds-panel").addClass("active")
                } else {
                    u.children(":eq(1)").addClass("active")
                }
                if (!!j.city) {
                    if (v.length == 1) {
                        u.children(":eq(0)").addClass("active current").siblings().removeClass("active current");
                        t.children(":eq(0)").addClass("active").siblings().removeClass("active")
                    } else {
                        t.children(":eq(1)").addClass("active").siblings().removeClass("active")
                    }
                }
                n()
            });
            p.getDistrictsById(q, function (v) {
                r.html("");
                d.each(v, function (x, w) {
                    var y = [w.id, w.cid, w.lesId, w.name, w.defaultId].join(",");
                    if (w.id == p.getInfo.district.id) {
                        r.append('<span><a name="item_none_dizhi_qu" href="###" class="on" role=' + y + ">" + w.name + "</a></span>")
                    } else {
                        r.append('<span><a name="item_none_dizhi_qu" href="###" role=' + y + ">" + w.name + "</a></span>")
                    }
                });
                p.setDetailAddress(k, u, t, m)
            })
        }, getDistricts: function (q, m, k, l, j) {
            var o = this;
            var n = this.opts;
            var p = m.find(".ds-panel li");
            m.find(".ct-panel a").on("click", function (s) {
                o.changeFlag = !!0;
                if (s) {
                    s.stopPropagation()
                }
                d(this).addClass("on").parent().siblings().find("a").removeClass("on");
                var v = d(this).attr("role");
                o.setInfo.city = {
                    id: v.split(",")[0],
                    cid: v.split(",")[1],
                    lesId: v.split(",")[2],
                    name: v.split(",")[3]
                };
                var r = v.split(",")[0];
                var t = d(this).text();
                if (!n.city) {
                    q.children(":eq(2)").find("a").html("璇烽€夋嫨鍘垮尯");
                    p.html("");
                    o.getDistrictsById(r, function (w) {
                        d.each(w, function (y, x) {
                            var z = [x.id, x.cid, x.lesId, x.name, x.defaultId].join(",");
                            if (x.id == o.getInfo.district.id) {
                                p.append('<span><a name="item_none_dizhi_qu" href="###" class="on" role=' + z + ">" + x.name + "</a></span>")
                            } else {
                                p.append('<span><a name="item_none_dizhi_qu" href="###" role=' + z + ">" + x.name + "</a></span>")
                            }
                        });
                        j();
                        if (d.type(n.cityCb) == "function") {
                            n.cityCb(o.getInfo)
                        }
                    });
                    m.find(".ct-panel").removeClass("active").end().find(".ds-panel").addClass("active");
                    q.children(":eq(1)").addClass("active").removeClass("current").attr("role", v).find("a").text(t).end().end().children(":eq(2)").addClass("active current")
                } else {
                    var u = v.split(",")[4];
                    o.getDefaultDistrict(u, function (y) {
                        l.removeClass("active");
                        o.setInfo.district = {id: y.id, cid: y.cid, name: y.name, lesId: y.lesId};
                        q.children(":eq(1)").attr("role", v).find("a").text(t);
                        var z = q.find("a:eq(0)").text();
                        var w = q.find("a:eq(1)").text();
                        var x = o.setInfo.district.name;
                        z == w && d.trim(z) != "鍚夋灄" ? k.find(".pr").addClass("dn") : k.find(".pr").removeClass("dn");
                        k.find(".pr").text(z).end().find(".ct").text(w);
                        o.setDefaultAddress(o.setInfo, function (C) {
                            var H = k.find("span:eq(0)");
                            var B = k.find("span:eq(1)");
                            var E = o.setInfo;
                            var A = E.province;
                            var G = E.city;
                            var F = [A.id, A.cid, A.name, ""].join(",");
                            var D = [G.id, G.cid, G.name, "", G.lesId].join(",");
                            H.attr("role", F).text(A.name).removeClass("dn");
                            B.attr("role", D).text(G.name)
                        });
                        if (d.type(n.cityCb) == "function") {
                            n.cityCb(o.getInfo)
                        }
                    })
                }
                return false
            })
        }, setDetailAddress: function (j, o, l, k) {
            var n = this;
            var m = this.opts;
            l.find(".ds-panel a").on("click", function (q) {
                if (q) {
                    q.stopPropagation()
                }
                k.removeClass("active");
                d(this).addClass("on").parent().siblings().find("a").removeClass("on");
                var v = d(this).attr("role");
                var x = v.split(",");
                n.setInfo.district = {id: x[0], cid: x[1], lesId: x[2], name: x[3]};
                var B = x[0];
                var D = d(this).text();
                var p = o.find("a:eq(0)").text();
                var z = o.find("a:eq(1)").text();
                var t = o.find("a:eq(2)").text();
                var s = n.getInfo;
                var r = s.province;
                var u = s.city;
                var C = s.district;
                var w = [r.id, r.cid, r.name].join(",");
                var A = [u.id, u.cid, u.name, "", u.lesId].join(",");
                var y = [C.id, C.cid, C.name, "", C.lesId].join(",");
                o.children(":eq(2)").attr("role", v).find("a").text(D);
                p == z && d.trim(p) != "鍚夋灄" ? j.find(".pr").addClass("dn") : j.find(".pr").removeClass("dn");
                j.find(".pr").attr("role", w).text(p).end().find(".ct").attr("role", A).text(z).end().find(".ds").attr("role", y).text(D);
                n.setDefaultAddress(n.setInfo, function (E) {
                    if (d.type(m.distCb) != "function" || d.type(m.changeCb) != "function") {
                        return
                    }
                    if (n.changeFlag == false) {
                        m.changeCb(E);
                        n.changeFlag = true
                    } else {
                        m.distCb(E)
                    }
                });
                return false
            })
        }, getAddressByDefault: function (j) {
            ECity.API.getCity(function (k) {
                return j(k)
            })
        }, getUsedAddress: function (j) {
            var k = ECity.API.getLastUsedCities();
            return j(k)
        }, getProvinceList: function (j) {
            ECity.API.getProvinceList(function (k) {
                return j(k)
            })
        }, getCityById: function (k, j) {
            ECity.API.getCityList(k, function (l) {
                return j(l)
            })
        }, getDistrictsById: function (k, j) {
            ECity.API.getDistrictList(k, function (l) {
                return j(l)
            })
        }, setDefaultAddress: function (k, j) {
            ECity.API.setCity(k, function (l) {
                return j(l)
            })
        }, getDefaultDistrict: function (k, j) {
            ECity.API.getDistrict(k, function (l) {
                return j(l)
            })
        }, getCity: function (k) {
            var j = this;
            j.opts.getCity(k)
        }, getInfoByCityid: function (k, j) {
            ECity.API.getProvinceAndCityByCityId(k, function (m) {
                var l = m.provinceAndCity;
                var n = {};
                n.province = {id: l.pMdmId, cid: l.pMdmId, name: l.pName};
                n.city = {id: l.cMdmId, cid: l.cCommerceId, name: l.cName};
                n.district = {id: "", cid: "", name: ""};
                j(n)
            })
        }
    };
    window.mCity = {};
    mCity.API = {};
    mCity.API.getCity = function (j) {
        ECity.API.getCity(function (k) {
            return j(k)
        })
    };
    mCity.API.getCityId = function () {
        ECity.API.getCityId()
    };
    mCity.API.getDistrictId = function () {
        ECity.API.getDistrictId()
    };
    var c = {
        city: false,
        state: true,
        used: true,
        cityCb: d.noop,
        distCb: d.noop,
        getCity: d.noop,
        changeCb: d.noop,
        cityId: ""
    };
    var h = document.location.host;
    var e = document.location.hostname;
    var g = document.location.protocol;
    var b = document.location.port;
    var f = "/ip-web";
    var a;
    if (/\.cnsuning\.com/ig.test(h)) {
        if (h.indexOf("pre") != -1) {
            a = g + "//ipservicepre.cnsuning.com"
        } else {
            a = g + "//ipservicepre.cnsuning.com"
        }
    } else {
        if (/\.suning\.com/ig.test(h)) {
            a = g + "//ipservice.suning.com"
        } else {
            a = "http://ipservicepre.cnsuning.com/ip-web"
        }
    }
    d.fn.mCity = function (j) {
        var k = this;
        try {
            ECity.API.init(j.city ? j.city : c.city)
        } catch (l) {
        }
        return k.each(function () {
            var m = d.extend({}, c, j);
            i().init(this, m)
        })
    }
})(jQuery);