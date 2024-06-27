(()=>{
    "use strict";
    class n {
        callbacks = {};
        on(n, e) {
            this.callbacks[n] || (this.callbacks[n] = []),
            this.callbacks[n].push(e)
        }
        off(n, e) {
            const t = this.callbacks[n];
            t && (this.callbacks[n] = t.filter((n=>n !== e)))
        }
        emit(n, e) {
            const t = this.callbacks[n];
            t && t.forEach((n=>n(e)))
        }
    }
    var e, t, o, i, s;
    !function(n) {
        n[n.UNKNOWN_ERROR = 0] = "UNKNOWN_ERROR",
        n[n.BAD_REQUEST_ERROR = 1] = "BAD_REQUEST_ERROR",
        n[n.MANIFEST_NOT_FOUND_ERROR = 2] = "MANIFEST_NOT_FOUND_ERROR",
        n[n.MANIFEST_CONTENT_ERROR = 3] = "MANIFEST_CONTENT_ERROR",
        n[n.UNKNOWN_APP_ERROR = 100] = "UNKNOWN_APP_ERROR",
        n[n.USER_REJECTS_ERROR = 300] = "USER_REJECTS_ERROR",
        n[n.METHOD_NOT_SUPPORTED = 400] = "METHOD_NOT_SUPPORTED"
    }(e || (e = {})),
    function(n) {
        n[n.UNKNOWN_ERROR = 0] = "UNKNOWN_ERROR",
        n[n.METHOD_NOT_SUPPORTED = 400] = "METHOD_NOT_SUPPORTED"
    }(t || (t = {})),
    function(n) {
        n[n.UNKNOWN_ERROR = 0] = "UNKNOWN_ERROR",
        n[n.BAD_REQUEST_ERROR = 1] = "BAD_REQUEST_ERROR",
        n[n.UNKNOWN_APP_ERROR = 100] = "UNKNOWN_APP_ERROR",
        n[n.METHOD_NOT_SUPPORTED = 400] = "METHOD_NOT_SUPPORTED"
    }(o || (o = {})),
    function(n) {
        n[n.UNKNOWN_ERROR = 0] = "UNKNOWN_ERROR",
        n[n.BAD_REQUEST_ERROR = 1] = "BAD_REQUEST_ERROR",
        n[n.UNKNOWN_APP_ERROR = 100] = "UNKNOWN_APP_ERROR",
        n[n.USER_REJECTS_ERROR = 300] = "USER_REJECTS_ERROR",
        n[n.METHOD_NOT_SUPPORTED = 400] = "METHOD_NOT_SUPPORTED"
    }(i || (i = {})),
    function(n) {
        n[n.UNKNOWN_ERROR = 0] = "UNKNOWN_ERROR",
        n[n.BAD_REQUEST_ERROR = 1] = "BAD_REQUEST_ERROR",
        n[n.UNKNOWN_APP_ERROR = 100] = "UNKNOWN_APP_ERROR",
        n[n.USER_REJECTS_ERROR = 300] = "USER_REJECTS_ERROR",
        n[n.METHOD_NOT_SUPPORTED = 400] = "METHOD_NOT_SUPPORTED"
    }(s || (s = {}));
    class r extends Error {
        code;
        constructor(n, t=e.UNKNOWN_ERROR) {
            super(n),
            this.code = t
        }
    }
    var a = function(n, e, t, o) {
        return new (t || (t = Promise))((function(i, s) {
            function r(n) {
                try {
                    c(o.next(n))
                } catch (n) {
                    s(n)
                }
            }
            function a(n) {
                try {
                    c(o.throw(n))
                } catch (n) {
                    s(n)
                }
            }
            function c(n) {
                var e;
                n.done ? i(n.value) : (e = n.value,
                e instanceof t ? e : new t((function(n) {
                    n(e)
                }
                ))).then(r, a)
            }
            c((o = o.apply(n, e || [])).next())
        }
        ))
    };
    function c() {
        var n, e;
        const t = (null === (e = null === (n = window.navigator) || void 0 === n ? void 0 : n.userAgentData) || void 0 === e ? void 0 : e.platform) || window.navigator.platform
          , o = window.navigator.userAgent;
        let i = null;
        return -1 !== ["macOS", "Macintosh", "MacIntel", "MacPPC", "Mac68K"].indexOf(t) ? i = "mac" : -1 !== ["iPhone"].indexOf(t) ? i = "iphone" : -1 !== ["iPad", "iPod"].indexOf(t) ? i = "ipad" : -1 !== ["Win32", "Win64", "Windows", "WinCE"].indexOf(t) ? i = "windows" : (/Android/.test(o) || /Linux/.test(t)) && (i = "linux"),
        i
    }
    const d = ()=>({
        platform: c(),
        appName: "Tonkeeper",
        appVersion: "3.16.1",
        maxProtocolVersion: 2,
        features: ["SendTransaction", {
            name: "SendTransaction",
            maxMessages: 4
        }]
    })
      , R = n=>({
        event: "connect_error",
        id: Date.now(),
        payload: {
            code: n.code,
            message: n.message
        }
    });
    var E, l;
    const O = !!window.tonkeeper
      , _ = new class extends n {
        constructor(n) {
            super(),
            this.isTonkeeper = !0,
            this.targetOrigin = "*",
            this.nextJsonRpcId = 0,
            this.promises = {},
            this.onMessage = n=>{
                return e = this,
                t = void 0,
                i = function*() {
                    if (!n || !n.data)
                        return;
                    if ("TonkeeperAPI" !== n.data.type)
                        return;
                    const e = n.data;
                    if (!e || !e.message || !e.message.jsonrpc)
                        return;
                    const t = e.message;
                    if ("event"in t)
                        return void this.emit("tonConnect_event", {
                            event: t.event,
                            payload: t.payload,
                            id: t.id
                        });
                    const {id: o, method: i, error: s, result: r} = t;
                    if (void 0 !== o) {
                        const n = this.promises[o];
                        n && (t.error ? n.reject(s) : n.resolve(r),
                        delete this.promises[o])
                    } else
                        i && (n=>{
                            switch (n) {
                            case "accountsChanged":
                            case "chainChanged":
                                return !0;
                            default:
                                return !1
                            }
                        }
                        )(i) && this.emit(i, r)
                }
                ,
                new ((o = void 0) || (o = Promise))((function(n, s) {
                    function r(n) {
                        try {
                            c(i.next(n))
                        } catch (n) {
                            s(n)
                        }
                    }
                    function a(n) {
                        try {
                            c(i.throw(n))
                        } catch (n) {
                            s(n)
                        }
                    }
                    function c(e) {
                        var t;
                        e.done ? n(e.value) : (t = e.value,
                        t instanceof o ? t : new o((function(n) {
                            n(t)
                        }
                        ))).then(r, a)
                    }
                    c((i = i.apply(e, t || [])).next())
                }
                ));
                var e, t, o, i
            }
            ,
            n && (this.nextJsonRpcId = n.nextJsonRpcId,
            this.promises = n.promises,
            this.callbacks = n.callbacks,
            n.destroyTonkeeper()),
            window.addEventListener("message", this.onMessage)
        }
        send(n, ...e) {
            if (!n || "string" != typeof n)
                return Promise.reject("Method is not a valid string.");
            1 === e.length && e[0]instanceof Array && (e = e[0]);
            const t = {
                jsonrpc: "2.0",
                id: this.nextJsonRpcId++,
                method: n,
                params: e,
                origin: window.origin
            }
              , o = new Promise(((n,e)=>{
                this.promises[t.id] = {
                    resolve: n,
                    reject: e
                }
            }
            ));
            return window.postMessage({
                type: "TonkeeperProvider",
                message: t
            }, this.targetOrigin),
            o
        }
        destroyTonkeeper() {
            window.removeEventListener("message", this.onMessage)
        }
    }
    (null === (E = null === window || void 0 === window ? void 0 : window.tonkeeper) || void 0 === E ? void 0 : E.provider)
      , h = new class {
        constructor(n, e) {
            this.provider = n,
            this.callbacks = [],
            this.deviceInfo = d(),
            this.walletInfo = {
                name: "Tonkeeper",
                image: "https://tonkeeper.com/assets/tonconnect-icon.png",
                tondns: "tonkeeper.ton",
                about_url: "https://tonkeeper.com"
            },
            this.protocolVersion = 2,
            this.isWalletBrowser = !1,
            this.connect = (n,e)=>a(this, void 0, void 0, (function*() {
                var t;
                if (n > this.protocolVersion)
                    return this.notify(R(new r("Unsupported protocol version",1)));
                try {
                    const n = yield this.provider.send("tonConnect_connect", e);
                    return this.notify({
                        event: "connect",
                        id: Date.now(),
                        payload: {
                            items: n,
                            device: d()
                        }
                    })
                } catch (n) {
                    return n instanceof r ? this.notify(R(n)) : this.notify(R(new r(null !== (t = n.message) && void 0 !== t ? t : "Unknown error")))
                }
            }
            )),
            this.disconnect = ()=>a(this, void 0, void 0, (function*() {
                return yield this.provider.send("tonConnect_disconnect"),
                this.notify({
                    event: "disconnect",
                    id: Date.now(),
                    payload: {}
                })
            }
            )),
            this.restoreConnection = ()=>a(this, void 0, void 0, (function*() {
                var n;
                try {
                    const n = yield this.provider.send("tonConnect_reconnect", [{
                        name: "ton_addr"
                    }]);
                    return this.notify({
                        event: "connect",
                        id: Date.now(),
                        payload: {
                            items: n,
                            device: d()
                        }
                    })
                } catch (e) {
                    return e instanceof r ? this.notify(R(e)) : this.notify(R(new r(null !== (n = e.message) && void 0 !== n ? n : "Unknown error")))
                }
            }
            )),
            this.send = n=>a(this, void 0, void 0, (function*() {
                var e;
                try {
                    return {
                        result: yield this.provider.send(`tonConnect_${n.method}`, n.params.map((n=>JSON.parse(n)))),
                        id: String(n.id)
                    }
                } catch (t) {
                    return t instanceof r ? {
                        error: t,
                        id: String(n.id)
                    } : {
                        error: new r(null !== (e = t.message) && void 0 !== e ? e : "Unknown error"),
                        id: String(n.id)
                    }
                }
            }
            )),
            this.listen = n=>{
                this.callbacks.push(n);
                const e = this.callbacks;
                return ()=>{
                    const t = e.indexOf(n);
                    t > -1 && e.splice(t, 1)
                }
            }
            ,
            this.notify = n=>(this.callbacks.forEach((e=>e(n))),
            n),
            e ? this.callbacks = e.callbacks : (n.on("chainChanged", (()=>{
                this.notify({
                    event: "disconnect",
                    id: Date.now(),
                    payload: {}
                })
            }
            )),
            n.on("tonConnect_event", (n=>{
                var e;
                this.notify({
                    event: n.event,
                    id: null !== (e = n.id) && void 0 !== e ? e : Date.now(),
                    payload: n.payload
                })
            }
            )))
        }
    }
    (_,null === (l = null === window || void 0 === window ? void 0 : window.tonkeeper) || void 0 === l ? void 0 : l.tonconnect);
    window.tonkeeper = {
        provider: _,
        tonconnect: h
    },
    O || window.dispatchEvent(new Event("tonready"))
}
)();
