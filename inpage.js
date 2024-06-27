/*! For license information please see inpage.js.LICENSE.txt */
(()=>{
    var t, e, n = {
        "../../../node_modules/@solana/buffer-layout/lib/Layout.js": (t,e,n)=>{
            "use strict";
            e._O = e.Jq = e.KB = e.u8 = e.cv = void 0,
            e.Ik = e.A9 = e.n_ = e.gM = void 0;
            const r = n("../../../node_modules/buffer/index.js");
            function o(t) {
                if (!(t instanceof Uint8Array))
                    throw new TypeError("b must be a Uint8Array")
            }
            function i(t) {
                return o(t),
                r.Buffer.from(t.buffer, t.byteOffset, t.length)
            }
            class s {
                constructor(t, e) {
                    if (!Number.isInteger(t))
                        throw new TypeError("span must be an integer");
                    this.span = t,
                    this.property = e
                }
                makeDestinationObject() {
                    return {}
                }
                getSpan(t, e) {
                    if (0 > this.span)
                        throw new RangeError("indeterminate span");
                    return this.span
                }
                replicate(t) {
                    const e = Object.create(this.constructor.prototype);
                    return Object.assign(e, this),
                    e.property = t,
                    e
                }
                fromArray(t) {}
            }
            function a(t, e) {
                return e.property ? t + "[" + e.property + "]" : t
            }
            class u extends s {
                isCount() {
                    throw new Error("ExternalLayout is abstract")
                }
            }
            class c extends u {
                constructor(t, e=0, n) {
                    if (!(t instanceof s))
                        throw new TypeError("layout must be a Layout");
                    if (!Number.isInteger(e))
                        throw new TypeError("offset must be integer or undefined");
                    super(t.span, n || t.property),
                    this.layout = t,
                    this.offset = e
                }
                isCount() {
                    return this.layout instanceof l || this.layout instanceof f
                }
                decode(t, e=0) {
                    return this.layout.decode(t, e + this.offset)
                }
                encode(t, e, n=0) {
                    return this.layout.encode(t, e, n + this.offset)
                }
            }
            class l extends s {
                constructor(t, e) {
                    if (super(t, e),
                    6 < this.span)
                        throw new RangeError("span must not exceed 6 bytes")
                }
                decode(t, e=0) {
                    return i(t).readUIntLE(e, this.span)
                }
                encode(t, e, n=0) {
                    return i(e).writeUIntLE(t, n, this.span),
                    this.span
                }
            }
            class f extends s {
                constructor(t, e) {
                    if (super(t, e),
                    6 < this.span)
                        throw new RangeError("span must not exceed 6 bytes")
                }
                decode(t, e=0) {
                    return i(t).readUIntBE(e, this.span)
                }
                encode(t, e, n=0) {
                    return i(e).writeUIntBE(t, n, this.span),
                    this.span
                }
            }
            const h = Math.pow(2, 32);
            function d(t) {
                const e = Math.floor(t / h);
                return {
                    hi32: e,
                    lo32: t - e * h
                }
            }
            function p(t, e) {
                return t * h + e
            }
            class y extends s {
                constructor(t) {
                    super(8, t)
                }
                decode(t, e=0) {
                    const n = i(t)
                      , r = n.readUInt32LE(e);
                    return p(n.readUInt32LE(e + 4), r)
                }
                encode(t, e, n=0) {
                    const r = d(t)
                      , o = i(e);
                    return o.writeUInt32LE(r.lo32, n),
                    o.writeUInt32LE(r.hi32, n + 4),
                    8
                }
            }
            class g extends s {
                constructor(t) {
                    super(8, t)
                }
                decode(t, e=0) {
                    const n = i(t)
                      , r = n.readUInt32LE(e);
                    return p(n.readInt32LE(e + 4), r)
                }
                encode(t, e, n=0) {
                    const r = d(t)
                      , o = i(e);
                    return o.writeUInt32LE(r.lo32, n),
                    o.writeInt32LE(r.hi32, n + 4),
                    8
                }
            }
            class m extends s {
                constructor(t, e, n) {
                    if (!(t instanceof s))
                        throw new TypeError("elementLayout must be a Layout");
                    if (!(e instanceof u && e.isCount() || Number.isInteger(e) && 0 <= e))
                        throw new TypeError("count must be non-negative integer or an unsigned integer ExternalLayout");
                    let r = -1;
                    !(e instanceof u) && 0 < t.span && (r = e * t.span),
                    super(r, n),
                    this.elementLayout = t,
                    this.count = e
                }
                getSpan(t, e=0) {
                    if (0 <= this.span)
                        return this.span;
                    let n = 0
                      , r = this.count;
                    if (r instanceof u && (r = r.decode(t, e)),
                    0 < this.elementLayout.span)
                        n = r * this.elementLayout.span;
                    else {
                        let o = 0;
                        for (; o < r; )
                            n += this.elementLayout.getSpan(t, e + n),
                            ++o
                    }
                    return n
                }
                decode(t, e=0) {
                    const n = [];
                    let r = 0
                      , o = this.count;
                    for (o instanceof u && (o = o.decode(t, e)); r < o; )
                        n.push(this.elementLayout.decode(t, e)),
                        e += this.elementLayout.getSpan(t, e),
                        r += 1;
                    return n
                }
                encode(t, e, n=0) {
                    const r = this.elementLayout
                      , o = t.reduce(((t,o)=>t + r.encode(o, e, n + t)), 0);
                    return this.count instanceof u && this.count.encode(t.length, e, n),
                    o
                }
            }
            class b extends s {
                constructor(t, e, n) {
                    if (!Array.isArray(t) || !t.reduce(((t,e)=>t && e instanceof s), !0))
                        throw new TypeError("fields must be array of Layout instances");
                    "boolean" == typeof e && void 0 === n && (n = e,
                    e = void 0);
                    for (const e of t)
                        if (0 > e.span && void 0 === e.property)
                            throw new Error("fields cannot contain unnamed variable-length layout");
                    let r = -1;
                    try {
                        r = t.reduce(((t,e)=>t + e.getSpan()), 0)
                    } catch (t) {}
                    super(r, e),
                    this.fields = t,
                    this.decodePrefixes = !!n
                }
                getSpan(t, e=0) {
                    if (0 <= this.span)
                        return this.span;
                    let n = 0;
                    try {
                        n = this.fields.reduce(((n,r)=>{
                            const o = r.getSpan(t, e);
                            return e += o,
                            n + o
                        }
                        ), 0)
                    } catch (t) {
                        throw new RangeError("indeterminate span")
                    }
                    return n
                }
                decode(t, e=0) {
                    o(t);
                    const n = this.makeDestinationObject();
                    for (const r of this.fields)
                        if (void 0 !== r.property && (n[r.property] = r.decode(t, e)),
                        e += r.getSpan(t, e),
                        this.decodePrefixes && t.length === e)
                            break;
                    return n
                }
                encode(t, e, n=0) {
                    const r = n;
                    let o = 0
                      , i = 0;
                    for (const r of this.fields) {
                        let s = r.span;
                        if (i = 0 < s ? s : 0,
                        void 0 !== r.property) {
                            const o = t[r.property];
                            void 0 !== o && (i = r.encode(o, e, n),
                            0 > s && (s = r.getSpan(e, n)))
                        }
                        o = n,
                        n += s
                    }
                    return o + i - r
                }
                fromArray(t) {
                    const e = this.makeDestinationObject();
                    for (const n of this.fields)
                        void 0 !== n.property && 0 < t.length && (e[n.property] = t.shift());
                    return e
                }
                layoutFor(t) {
                    if ("string" != typeof t)
                        throw new TypeError("property must be string");
                    for (const e of this.fields)
                        if (e.property === t)
                            return e
                }
                offsetOf(t) {
                    if ("string" != typeof t)
                        throw new TypeError("property must be string");
                    let e = 0;
                    for (const n of this.fields) {
                        if (n.property === t)
                            return e;
                        0 > n.span ? e = -1 : 0 <= e && (e += n.span)
                    }
                }
            }
            class w extends s {
                constructor(t, e) {
                    if (!(t instanceof u && t.isCount() || Number.isInteger(t) && 0 <= t))
                        throw new TypeError("length must be positive integer or an unsigned integer ExternalLayout");
                    let n = -1;
                    t instanceof u || (n = t),
                    super(n, e),
                    this.length = t
                }
                getSpan(t, e) {
                    let n = this.span;
                    return 0 > n && (n = this.length.decode(t, e)),
                    n
                }
                decode(t, e=0) {
                    let n = this.span;
                    return 0 > n && (n = this.length.decode(t, e)),
                    i(t).slice(e, e + n)
                }
                encode(t, e, n) {
                    let r = this.length;
                    if (this.length instanceof u && (r = t.length),
                    !(t instanceof Uint8Array && r === t.length))
                        throw new TypeError(a("Blob.encode", this) + " requires (length " + r + ") Uint8Array as src");
                    if (n + r > e.length)
                        throw new RangeError("encoding overruns Uint8Array");
                    const o = i(t);
                    return i(e).write(o.toString("hex"), n, r, "hex"),
                    this.length instanceof u && this.length.encode(r, e, n),
                    r
                }
            }
            e.cv = (t,e,n)=>new c(t,e,n),
            e.u8 = t=>new l(1,t),
            e.KB = t=>new l(2,t),
            e.Jq = t=>new l(4,t),
            e._O = t=>new y(t),
            e.gM = t=>new g(t),
            e.n_ = (t,e,n)=>new b(t,e,n),
            e.A9 = (t,e,n)=>new m(t,e,n),
            e.Ik = (t,e)=>new w(t,e)
        }
        ,
        "../../../node_modules/@solana/web3.js/lib/index.browser.esm.js": (t,e,n)=>{
            "use strict";
            n.d(e, {
                PublicKey: ()=>_n,
                Transaction: ()=>Vn,
                VersionedTransaction: ()=>Zn
            });
            var r = {};
            n.r(r),
            n.d(r, {
                abytes: ()=>W,
                bitGet: ()=>it,
                bitLen: ()=>ot,
                bitMask: ()=>at,
                bitSet: ()=>st,
                bytesToHex: ()=>F,
                bytesToNumberBE: ()=>V,
                bytesToNumberLE: ()=>Z,
                concatBytes: ()=>et,
                createHmacDrbg: ()=>lt,
                ensureBytes: ()=>tt,
                equalBytes: ()=>nt,
                hexToBytes: ()=>$,
                hexToNumber: ()=>H,
                isBytes: ()=>C,
                numberToBytesBE: ()=>J,
                numberToBytesLE: ()=>Q,
                numberToHexUnpadded: ()=>K,
                numberToVarBytesBE: ()=>X,
                utf8ToBytes: ()=>rt,
                validateObject: ()=>ht
            });
            var o = n("../../../node_modules/buffer/index.js");
            function i(t) {
                if (!Number.isSafeInteger(t) || t < 0)
                    throw new Error(`positive integer expected, not ${t}`)
            }
            function s(t, ...e) {
                if (!((n = t)instanceof Uint8Array || null != n && "object" == typeof n && "Uint8Array" === n.constructor.name))
                    throw new Error("Uint8Array expected");
                var n;
                if (e.length > 0 && !e.includes(t.length))
                    throw new Error(`Uint8Array expected of length ${e}, not of length=${t.length}`)
            }
            function a(t, e=!0) {
                if (t.destroyed)
                    throw new Error("Hash instance has been destroyed");
                if (e && t.finished)
                    throw new Error("Hash#digest() has already been called")
            }
            function u(t, e) {
                s(t);
                const n = e.outputLen;
                if (t.length < n)
                    throw new Error(`digestInto() expects output buffer of length at least ${n}`)
            }
            const c = "object" == typeof globalThis && "crypto"in globalThis ? globalThis.crypto : void 0
              , l = t=>new DataView(t.buffer,t.byteOffset,t.byteLength)
              , f = (t,e)=>t << 32 - e | t >>> e
              , h = 68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0];
            function d(t) {
                for (let n = 0; n < t.length; n++)
                    t[n] = (e = t[n]) << 24 & 4278190080 | e << 8 & 16711680 | e >>> 8 & 65280 | e >>> 24 & 255;
                var e
            }
            function p(t) {
                if ("string" != typeof t)
                    throw new Error("utf8ToBytes expected string, got " + typeof t);
                return new Uint8Array((new TextEncoder).encode(t))
            }
            function y(t) {
                return "string" == typeof t && (t = p(t)),
                s(t),
                t
            }
            function g(...t) {
                let e = 0;
                for (let n = 0; n < t.length; n++) {
                    const r = t[n];
                    s(r),
                    e += r.length
                }
                const n = new Uint8Array(e);
                for (let e = 0, r = 0; e < t.length; e++) {
                    const o = t[e];
                    n.set(o, r),
                    r += o.length
                }
                return n
            }
            class m {
                clone() {
                    return this._cloneInto()
                }
            }
            function b(t) {
                const e = e=>t().update(y(e)).digest()
                  , n = t();
                return e.outputLen = n.outputLen,
                e.blockLen = n.blockLen,
                e.create = ()=>t(),
                e
            }
            function w(t=32) {
                if (c && "function" == typeof c.getRandomValues)
                    return c.getRandomValues(new Uint8Array(t));
                throw new Error("crypto.getRandomValues must be defined")
            }
            const v = (t,e,n)=>t & e ^ t & n ^ e & n;
            class M extends m {
                constructor(t, e, n, r) {
                    super(),
                    this.blockLen = t,
                    this.outputLen = e,
                    this.padOffset = n,
                    this.isLE = r,
                    this.finished = !1,
                    this.length = 0,
                    this.pos = 0,
                    this.destroyed = !1,
                    this.buffer = new Uint8Array(t),
                    this.view = l(this.buffer)
                }
                update(t) {
                    a(this);
                    const {view: e, buffer: n, blockLen: r} = this
                      , o = (t = y(t)).length;
                    for (let i = 0; i < o; ) {
                        const s = Math.min(r - this.pos, o - i);
                        if (s !== r)
                            n.set(t.subarray(i, i + s), this.pos),
                            this.pos += s,
                            i += s,
                            this.pos === r && (this.process(e, 0),
                            this.pos = 0);
                        else {
                            const e = l(t);
                            for (; r <= o - i; i += r)
                                this.process(e, i)
                        }
                    }
                    return this.length += t.length,
                    this.roundClean(),
                    this
                }
                digestInto(t) {
                    a(this),
                    u(t, this),
                    this.finished = !0;
                    const {buffer: e, view: n, blockLen: r, isLE: o} = this;
                    let {pos: i} = this;
                    e[i++] = 128,
                    this.buffer.subarray(i).fill(0),
                    this.padOffset > r - i && (this.process(n, 0),
                    i = 0);
                    for (let t = i; t < r; t++)
                        e[t] = 0;
                    !function(t, e, n, r) {
                        if ("function" == typeof t.setBigUint64)
                            return t.setBigUint64(e, n, r);
                        const o = BigInt(32)
                          , i = BigInt(4294967295)
                          , s = Number(n >> o & i)
                          , a = Number(n & i)
                          , u = r ? 4 : 0
                          , c = r ? 0 : 4;
                        t.setUint32(e + u, s, r),
                        t.setUint32(e + c, a, r)
                    }(n, r - 8, BigInt(8 * this.length), o),
                    this.process(n, 0);
                    const s = l(t)
                      , c = this.outputLen;
                    if (c % 4)
                        throw new Error("_sha2: outputLen should be aligned to 32bit");
                    const f = c / 4
                      , h = this.get();
                    if (f > h.length)
                        throw new Error("_sha2: outputLen bigger than state");
                    for (let t = 0; t < f; t++)
                        s.setUint32(4 * t, h[t], o)
                }
                digest() {
                    const {buffer: t, outputLen: e} = this;
                    this.digestInto(t);
                    const n = t.slice(0, e);
                    return this.destroy(),
                    n
                }
                _cloneInto(t) {
                    t || (t = new this.constructor),
                    t.set(...this.get());
                    const {blockLen: e, buffer: n, length: r, finished: o, destroyed: i, pos: s} = this;
                    return t.length = r,
                    t.pos = s,
                    t.finished = o,
                    t.destroyed = i,
                    r % e && t.buffer.set(n),
                    t
                }
            }
            const x = BigInt(2 ** 32 - 1)
              , j = BigInt(32);
            function I(t, e=!1) {
                return e ? {
                    h: Number(t & x),
                    l: Number(t >> j & x)
                } : {
                    h: 0 | Number(t >> j & x),
                    l: 0 | Number(t & x)
                }
            }
            function A(t, e=!1) {
                let n = new Uint32Array(t.length)
                  , r = new Uint32Array(t.length);
                for (let o = 0; o < t.length; o++) {
                    const {h: i, l: s} = I(t[o], e);
                    [n[o],r[o]] = [i, s]
                }
                return [n, r]
            }
            const S = (t,e,n)=>t << n | e >>> 32 - n
              , _ = (t,e,n)=>e << n | t >>> 32 - n
              , E = (t,e,n)=>e << n - 32 | t >>> 64 - n
              , k = (t,e,n)=>t << n - 32 | e >>> 64 - n
              , O = {
                fromBig: I,
                split: A,
                toBig: (t,e)=>BigInt(t >>> 0) << j | BigInt(e >>> 0),
                shrSH: (t,e,n)=>t >>> n,
                shrSL: (t,e,n)=>t << 32 - n | e >>> n,
                rotrSH: (t,e,n)=>t >>> n | e << 32 - n,
                rotrSL: (t,e,n)=>t << 32 - n | e >>> n,
                rotrBH: (t,e,n)=>t << 64 - n | e >>> n - 32,
                rotrBL: (t,e,n)=>t >>> n - 32 | e << 64 - n,
                rotr32H: (t,e)=>e,
                rotr32L: (t,e)=>t,
                rotlSH: S,
                rotlSL: _,
                rotlBH: E,
                rotlBL: k,
                add: function(t, e, n, r) {
                    const o = (e >>> 0) + (r >>> 0);
                    return {
                        h: t + n + (o / 2 ** 32 | 0) | 0,
                        l: 0 | o
                    }
                },
                add3L: (t,e,n)=>(t >>> 0) + (e >>> 0) + (n >>> 0),
                add3H: (t,e,n,r)=>e + n + r + (t / 2 ** 32 | 0) | 0,
                add4L: (t,e,n,r)=>(t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0),
                add4H: (t,e,n,r,o)=>e + n + r + o + (t / 2 ** 32 | 0) | 0,
                add5H: (t,e,n,r,o,i)=>e + n + r + o + i + (t / 2 ** 32 | 0) | 0,
                add5L: (t,e,n,r,o)=>(t >>> 0) + (e >>> 0) + (n >>> 0) + (r >>> 0) + (o >>> 0)
            }
              , [L,T] = (()=>O.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map((t=>BigInt(t)))))()
              , B = new Uint32Array(80)
              , N = new Uint32Array(80);
            class P extends M {
                constructor() {
                    super(128, 64, 16, !1),
                    this.Ah = 1779033703,
                    this.Al = -205731576,
                    this.Bh = -1150833019,
                    this.Bl = -2067093701,
                    this.Ch = 1013904242,
                    this.Cl = -23791573,
                    this.Dh = -1521486534,
                    this.Dl = 1595750129,
                    this.Eh = 1359893119,
                    this.El = -1377402159,
                    this.Fh = -1694144372,
                    this.Fl = 725511199,
                    this.Gh = 528734635,
                    this.Gl = -79577749,
                    this.Hh = 1541459225,
                    this.Hl = 327033209
                }
                get() {
                    const {Ah: t, Al: e, Bh: n, Bl: r, Ch: o, Cl: i, Dh: s, Dl: a, Eh: u, El: c, Fh: l, Fl: f, Gh: h, Gl: d, Hh: p, Hl: y} = this;
                    return [t, e, n, r, o, i, s, a, u, c, l, f, h, d, p, y]
                }
                set(t, e, n, r, o, i, s, a, u, c, l, f, h, d, p, y) {
                    this.Ah = 0 | t,
                    this.Al = 0 | e,
                    this.Bh = 0 | n,
                    this.Bl = 0 | r,
                    this.Ch = 0 | o,
                    this.Cl = 0 | i,
                    this.Dh = 0 | s,
                    this.Dl = 0 | a,
                    this.Eh = 0 | u,
                    this.El = 0 | c,
                    this.Fh = 0 | l,
                    this.Fl = 0 | f,
                    this.Gh = 0 | h,
                    this.Gl = 0 | d,
                    this.Hh = 0 | p,
                    this.Hl = 0 | y
                }
                process(t, e) {
                    for (let n = 0; n < 16; n++,
                    e += 4)
                        B[n] = t.getUint32(e),
                        N[n] = t.getUint32(e += 4);
                    for (let t = 16; t < 80; t++) {
                        const e = 0 | B[t - 15]
                          , n = 0 | N[t - 15]
                          , r = O.rotrSH(e, n, 1) ^ O.rotrSH(e, n, 8) ^ O.shrSH(e, n, 7)
                          , o = O.rotrSL(e, n, 1) ^ O.rotrSL(e, n, 8) ^ O.shrSL(e, n, 7)
                          , i = 0 | B[t - 2]
                          , s = 0 | N[t - 2]
                          , a = O.rotrSH(i, s, 19) ^ O.rotrBH(i, s, 61) ^ O.shrSH(i, s, 6)
                          , u = O.rotrSL(i, s, 19) ^ O.rotrBL(i, s, 61) ^ O.shrSL(i, s, 6)
                          , c = O.add4L(o, u, N[t - 7], N[t - 16])
                          , l = O.add4H(c, r, a, B[t - 7], B[t - 16]);
                        B[t] = 0 | l,
                        N[t] = 0 | c
                    }
                    let {Ah: n, Al: r, Bh: o, Bl: i, Ch: s, Cl: a, Dh: u, Dl: c, Eh: l, El: f, Fh: h, Fl: d, Gh: p, Gl: y, Hh: g, Hl: m} = this;
                    for (let t = 0; t < 80; t++) {
                        const e = O.rotrSH(l, f, 14) ^ O.rotrSH(l, f, 18) ^ O.rotrBH(l, f, 41)
                          , b = O.rotrSL(l, f, 14) ^ O.rotrSL(l, f, 18) ^ O.rotrBL(l, f, 41)
                          , w = l & h ^ ~l & p
                          , v = f & d ^ ~f & y
                          , M = O.add5L(m, b, v, T[t], N[t])
                          , x = O.add5H(M, g, e, w, L[t], B[t])
                          , j = 0 | M
                          , I = O.rotrSH(n, r, 28) ^ O.rotrBH(n, r, 34) ^ O.rotrBH(n, r, 39)
                          , A = O.rotrSL(n, r, 28) ^ O.rotrBL(n, r, 34) ^ O.rotrBL(n, r, 39)
                          , S = n & o ^ n & s ^ o & s
                          , _ = r & i ^ r & a ^ i & a;
                        g = 0 | p,
                        m = 0 | y,
                        p = 0 | h,
                        y = 0 | d,
                        h = 0 | l,
                        d = 0 | f,
                        ({h: l, l: f} = O.add(0 | u, 0 | c, 0 | x, 0 | j)),
                        u = 0 | s,
                        c = 0 | a,
                        s = 0 | o,
                        a = 0 | i,
                        o = 0 | n,
                        i = 0 | r;
                        const E = O.add3L(j, A, _);
                        n = O.add3H(E, x, I, S),
                        r = 0 | E
                    }
                    ({h: n, l: r} = O.add(0 | this.Ah, 0 | this.Al, 0 | n, 0 | r)),
                    ({h: o, l: i} = O.add(0 | this.Bh, 0 | this.Bl, 0 | o, 0 | i)),
                    ({h: s, l: a} = O.add(0 | this.Ch, 0 | this.Cl, 0 | s, 0 | a)),
                    ({h: u, l: c} = O.add(0 | this.Dh, 0 | this.Dl, 0 | u, 0 | c)),
                    ({h: l, l: f} = O.add(0 | this.Eh, 0 | this.El, 0 | l, 0 | f)),
                    ({h, l: d} = O.add(0 | this.Fh, 0 | this.Fl, 0 | h, 0 | d)),
                    ({h: p, l: y} = O.add(0 | this.Gh, 0 | this.Gl, 0 | p, 0 | y)),
                    ({h: g, l: m} = O.add(0 | this.Hh, 0 | this.Hl, 0 | g, 0 | m)),
                    this.set(n, r, o, i, s, a, u, c, l, f, h, d, p, y, g, m)
                }
                roundClean() {
                    B.fill(0),
                    N.fill(0)
                }
                destroy() {
                    this.buffer.fill(0),
                    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                }
            }
            const z = b((()=>new P))
              , U = BigInt(0)
              , D = BigInt(1)
              , R = BigInt(2);
            function C(t) {
                return t instanceof Uint8Array || null != t && "object" == typeof t && "Uint8Array" === t.constructor.name
            }
            function W(t) {
                if (!C(t))
                    throw new Error("Uint8Array expected")
            }
            const q = Array.from({
                length: 256
            }, ((t,e)=>e.toString(16).padStart(2, "0")));
            function F(t) {
                W(t);
                let e = "";
                for (let n = 0; n < t.length; n++)
                    e += q[t[n]];
                return e
            }
            function K(t) {
                const e = t.toString(16);
                return 1 & e.length ? `0${e}` : e
            }
            function H(t) {
                if ("string" != typeof t)
                    throw new Error("hex string expected, got " + typeof t);
                return BigInt("" === t ? "0" : `0x${t}`)
            }
            const Y = {
                _0: 48,
                _9: 57,
                _A: 65,
                _F: 70,
                _a: 97,
                _f: 102
            };
            function G(t) {
                return t >= Y._0 && t <= Y._9 ? t - Y._0 : t >= Y._A && t <= Y._F ? t - (Y._A - 10) : t >= Y._a && t <= Y._f ? t - (Y._a - 10) : void 0
            }
            function $(t) {
                if ("string" != typeof t)
                    throw new Error("hex string expected, got " + typeof t);
                const e = t.length
                  , n = e / 2;
                if (e % 2)
                    throw new Error("padded hex string expected, got unpadded hex of length " + e);
                const r = new Uint8Array(n);
                for (let e = 0, o = 0; e < n; e++,
                o += 2) {
                    const n = G(t.charCodeAt(o))
                      , i = G(t.charCodeAt(o + 1));
                    if (void 0 === n || void 0 === i) {
                        const e = t[o] + t[o + 1];
                        throw new Error('hex string expected, got non-hex character "' + e + '" at index ' + o)
                    }
                    r[e] = 16 * n + i
                }
                return r
            }
            function V(t) {
                return H(F(t))
            }
            function Z(t) {
                return W(t),
                H(F(Uint8Array.from(t).reverse()))
            }
            function J(t, e) {
                return $(t.toString(16).padStart(2 * e, "0"))
            }
            function Q(t, e) {
                return J(t, e).reverse()
            }
            function X(t) {
                return $(K(t))
            }
            function tt(t, e, n) {
                let r;
                if ("string" == typeof e)
                    try {
                        r = $(e)
                    } catch (n) {
                        throw new Error(`${t} must be valid hex string, got "${e}". Cause: ${n}`)
                    }
                else {
                    if (!C(e))
                        throw new Error(`${t} must be hex string or Uint8Array`);
                    r = Uint8Array.from(e)
                }
                const o = r.length;
                if ("number" == typeof n && o !== n)
                    throw new Error(`${t} expected ${n} bytes, got ${o}`);
                return r
            }
            function et(...t) {
                let e = 0;
                for (let n = 0; n < t.length; n++) {
                    const r = t[n];
                    W(r),
                    e += r.length
                }
                const n = new Uint8Array(e);
                for (let e = 0, r = 0; e < t.length; e++) {
                    const o = t[e];
                    n.set(o, r),
                    r += o.length
                }
                return n
            }
            function nt(t, e) {
                if (t.length !== e.length)
                    return !1;
                let n = 0;
                for (let r = 0; r < t.length; r++)
                    n |= t[r] ^ e[r];
                return 0 === n
            }
            function rt(t) {
                if ("string" != typeof t)
                    throw new Error("utf8ToBytes expected string, got " + typeof t);
                return new Uint8Array((new TextEncoder).encode(t))
            }
            function ot(t) {
                let e;
                for (e = 0; t > U; t >>= D,
                e += 1)
                    ;
                return e
            }
            function it(t, e) {
                return t >> BigInt(e) & D
            }
            function st(t, e, n) {
                return t | (n ? D : U) << BigInt(e)
            }
            const at = t=>(R << BigInt(t - 1)) - D
              , ut = t=>new Uint8Array(t)
              , ct = t=>Uint8Array.from(t);
            function lt(t, e, n) {
                if ("number" != typeof t || t < 2)
                    throw new Error("hashLen must be a number");
                if ("number" != typeof e || e < 2)
                    throw new Error("qByteLen must be a number");
                if ("function" != typeof n)
                    throw new Error("hmacFn must be a function");
                let r = ut(t)
                  , o = ut(t)
                  , i = 0;
                const s = ()=>{
                    r.fill(1),
                    o.fill(0),
                    i = 0
                }
                  , a = (...t)=>n(o, r, ...t)
                  , u = (t=ut())=>{
                    o = a(ct([0]), t),
                    r = a(),
                    0 !== t.length && (o = a(ct([1]), t),
                    r = a())
                }
                  , c = ()=>{
                    if (i++ >= 1e3)
                        throw new Error("drbg: tried 1000 values");
                    let t = 0;
                    const n = [];
                    for (; t < e; ) {
                        r = a();
                        const e = r.slice();
                        n.push(e),
                        t += r.length
                    }
                    return et(...n)
                }
                ;
                return (t,e)=>{
                    let n;
                    for (s(),
                    u(t); !(n = e(c())); )
                        u();
                    return s(),
                    n
                }
            }
            const ft = {
                bigint: t=>"bigint" == typeof t,
                function: t=>"function" == typeof t,
                boolean: t=>"boolean" == typeof t,
                string: t=>"string" == typeof t,
                stringOrUint8Array: t=>"string" == typeof t || C(t),
                isSafeInteger: t=>Number.isSafeInteger(t),
                array: t=>Array.isArray(t),
                field: (t,e)=>e.Fp.isValid(t),
                hash: t=>"function" == typeof t && Number.isSafeInteger(t.outputLen)
            };
            function ht(t, e, n={}) {
                const r = (e,n,r)=>{
                    const o = ft[n];
                    if ("function" != typeof o)
                        throw new Error(`Invalid validator "${n}", expected function`);
                    const i = t[e];
                    if (!(r && void 0 === i || o(i, t)))
                        throw new Error(`Invalid param ${String(e)}=${i} (${typeof i}), expected ${n}`)
                }
                ;
                for (const [t,n] of Object.entries(e))
                    r(t, n, !1);
                for (const [t,e] of Object.entries(n))
                    r(t, e, !0);
                return t
            }
            const dt = BigInt(0)
              , pt = BigInt(1)
              , yt = BigInt(2)
              , gt = BigInt(3)
              , mt = BigInt(4)
              , bt = BigInt(5)
              , wt = BigInt(8);
            function vt(t, e) {
                const n = t % e;
                return n >= dt ? n : e + n
            }
            function Mt(t, e, n) {
                if (n <= dt || e < dt)
                    throw new Error("Expected power/modulo > 0");
                if (n === pt)
                    return dt;
                let r = pt;
                for (; e > dt; )
                    e & pt && (r = r * t % n),
                    t = t * t % n,
                    e >>= pt;
                return r
            }
            function xt(t, e, n) {
                let r = t;
                for (; e-- > dt; )
                    r *= r,
                    r %= n;
                return r
            }
            function jt(t, e) {
                if (t === dt || e <= dt)
                    throw new Error(`invert: expected positive integers, got n=${t} mod=${e}`);
                let n = vt(t, e)
                  , r = e
                  , o = dt
                  , i = pt
                  , s = pt
                  , a = dt;
                for (; n !== dt; ) {
                    const t = r / n
                      , e = r % n
                      , u = o - s * t
                      , c = i - a * t;
                    r = n,
                    n = e,
                    o = s,
                    i = a,
                    s = u,
                    a = c
                }
                if (r !== pt)
                    throw new Error("invert: does not exist");
                return vt(o, e)
            }
            BigInt(9),
            BigInt(16);
            const It = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];
            function At(t, e) {
                const n = void 0 !== e ? e : t.toString(2).length;
                return {
                    nBitLength: n,
                    nByteLength: Math.ceil(n / 8)
                }
            }
            function St(t, e, n=!1, r={}) {
                if (t <= dt)
                    throw new Error(`Expected Field ORDER > 0, got ${t}`);
                const {nBitLength: o, nByteLength: i} = At(t, e);
                if (i > 2048)
                    throw new Error("Field lengths over 2048 bytes are not supported");
                const s = function(t) {
                    if (t % mt === gt) {
                        const e = (t + pt) / mt;
                        return function(t, n) {
                            const r = t.pow(n, e);
                            if (!t.eql(t.sqr(r), n))
                                throw new Error("Cannot find square root");
                            return r
                        }
                    }
                    if (t % wt === bt) {
                        const e = (t - bt) / wt;
                        return function(t, n) {
                            const r = t.mul(n, yt)
                              , o = t.pow(r, e)
                              , i = t.mul(n, o)
                              , s = t.mul(t.mul(i, yt), o)
                              , a = t.mul(i, t.sub(s, t.ONE));
                            if (!t.eql(t.sqr(a), n))
                                throw new Error("Cannot find square root");
                            return a
                        }
                    }
                    return function(t) {
                        const e = (t - pt) / yt;
                        let n, r, o;
                        for (n = t - pt,
                        r = 0; n % yt === dt; n /= yt,
                        r++)
                            ;
                        for (o = yt; o < t && Mt(o, e, t) !== t - pt; o++)
                            ;
                        if (1 === r) {
                            const e = (t + pt) / mt;
                            return function(t, n) {
                                const r = t.pow(n, e);
                                if (!t.eql(t.sqr(r), n))
                                    throw new Error("Cannot find square root");
                                return r
                            }
                        }
                        const i = (n + pt) / yt;
                        return function(t, s) {
                            if (t.pow(s, e) === t.neg(t.ONE))
                                throw new Error("Cannot find square root");
                            let a = r
                              , u = t.pow(t.mul(t.ONE, o), n)
                              , c = t.pow(s, i)
                              , l = t.pow(s, n);
                            for (; !t.eql(l, t.ONE); ) {
                                if (t.eql(l, t.ZERO))
                                    return t.ZERO;
                                let e = 1;
                                for (let n = t.sqr(l); e < a && !t.eql(n, t.ONE); e++)
                                    n = t.sqr(n);
                                const n = t.pow(u, pt << BigInt(a - e - 1));
                                u = t.sqr(n),
                                c = t.mul(c, n),
                                l = t.mul(l, u),
                                a = e
                            }
                            return c
                        }
                    }(t)
                }(t)
                  , a = Object.freeze({
                    ORDER: t,
                    BITS: o,
                    BYTES: i,
                    MASK: at(o),
                    ZERO: dt,
                    ONE: pt,
                    create: e=>vt(e, t),
                    isValid: e=>{
                        if ("bigint" != typeof e)
                            throw new Error("Invalid field element: expected bigint, got " + typeof e);
                        return dt <= e && e < t
                    }
                    ,
                    is0: t=>t === dt,
                    isOdd: t=>(t & pt) === pt,
                    neg: e=>vt(-e, t),
                    eql: (t,e)=>t === e,
                    sqr: e=>vt(e * e, t),
                    add: (e,n)=>vt(e + n, t),
                    sub: (e,n)=>vt(e - n, t),
                    mul: (e,n)=>vt(e * n, t),
                    pow: (t,e)=>function(t, e, n) {
                        if (n < dt)
                            throw new Error("Expected power > 0");
                        if (n === dt)
                            return t.ONE;
                        if (n === pt)
                            return e;
                        let r = t.ONE
                          , o = e;
                        for (; n > dt; )
                            n & pt && (r = t.mul(r, o)),
                            o = t.sqr(o),
                            n >>= pt;
                        return r
                    }(a, t, e),
                    div: (e,n)=>vt(e * jt(n, t), t),
                    sqrN: t=>t * t,
                    addN: (t,e)=>t + e,
                    subN: (t,e)=>t - e,
                    mulN: (t,e)=>t * e,
                    inv: e=>jt(e, t),
                    sqrt: r.sqrt || (t=>s(a, t)),
                    invertBatch: t=>function(t, e) {
                        const n = new Array(e.length)
                          , r = e.reduce(((e,r,o)=>t.is0(r) ? e : (n[o] = e,
                        t.mul(e, r))), t.ONE)
                          , o = t.inv(r);
                        return e.reduceRight(((e,r,o)=>t.is0(r) ? e : (n[o] = t.mul(e, n[o]),
                        t.mul(e, r))), o),
                        n
                    }(a, t),
                    cmov: (t,e,n)=>n ? e : t,
                    toBytes: t=>n ? Q(t, i) : J(t, i),
                    fromBytes: t=>{
                        if (t.length !== i)
                            throw new Error(`Fp.fromBytes: expected ${i}, got ${t.length}`);
                        return n ? Z(t) : V(t)
                    }
                });
                return Object.freeze(a)
            }
            function _t(t) {
                if ("bigint" != typeof t)
                    throw new Error("field order must be bigint");
                const e = t.toString(2).length;
                return Math.ceil(e / 8)
            }
            function Et(t) {
                const e = _t(t);
                return e + Math.ceil(e / 2)
            }
            const kt = BigInt(0)
              , Ot = BigInt(1);
            function Lt(t, e) {
                const n = (t,e)=>{
                    const n = e.negate();
                    return t ? n : e
                }
                  , r = t=>({
                    windows: Math.ceil(e / t) + 1,
                    windowSize: 2 ** (t - 1)
                });
                return {
                    constTimeNegate: n,
                    unsafeLadder(e, n) {
                        let r = t.ZERO
                          , o = e;
                        for (; n > kt; )
                            n & Ot && (r = r.add(o)),
                            o = o.double(),
                            n >>= Ot;
                        return r
                    },
                    precomputeWindow(t, e) {
                        const {windows: n, windowSize: o} = r(e)
                          , i = [];
                        let s = t
                          , a = s;
                        for (let t = 0; t < n; t++) {
                            a = s,
                            i.push(a);
                            for (let t = 1; t < o; t++)
                                a = a.add(s),
                                i.push(a);
                            s = a.double()
                        }
                        return i
                    },
                    wNAF(e, o, i) {
                        const {windows: s, windowSize: a} = r(e);
                        let u = t.ZERO
                          , c = t.BASE;
                        const l = BigInt(2 ** e - 1)
                          , f = 2 ** e
                          , h = BigInt(e);
                        for (let t = 0; t < s; t++) {
                            const e = t * a;
                            let r = Number(i & l);
                            i >>= h,
                            r > a && (r -= f,
                            i += Ot);
                            const s = e
                              , d = e + Math.abs(r) - 1
                              , p = t % 2 != 0
                              , y = r < 0;
                            0 === r ? c = c.add(n(p, o[s])) : u = u.add(n(y, o[d]))
                        }
                        return {
                            p: u,
                            f: c
                        }
                    },
                    wNAFCached(t, e, n, r) {
                        const o = t._WINDOW_SIZE || 1;
                        let i = e.get(t);
                        return i || (i = this.precomputeWindow(t, o),
                        1 !== o && e.set(t, r(i))),
                        this.wNAF(o, i, n)
                    }
                }
            }
            function Tt(t) {
                return ht(t.Fp, It.reduce(((t,e)=>(t[e] = "function",
                t)), {
                    ORDER: "bigint",
                    MASK: "bigint",
                    BYTES: "isSafeInteger",
                    BITS: "isSafeInteger"
                })),
                ht(t, {
                    n: "bigint",
                    h: "bigint",
                    Gx: "field",
                    Gy: "field"
                }, {
                    nBitLength: "isSafeInteger",
                    nByteLength: "isSafeInteger"
                }),
                Object.freeze({
                    ...At(t.n, t.nBitLength),
                    ...t,
                    p: t.Fp.ORDER
                })
            }
            const Bt = BigInt(0)
              , Nt = BigInt(1)
              , Pt = BigInt(2)
              , zt = BigInt(8)
              , Ut = {
                zip215: !0
            };
            function Dt(t) {
                const e = function(t) {
                    const e = Tt(t);
                    return ht(t, {
                        hash: "function",
                        a: "bigint",
                        d: "bigint",
                        randomBytes: "function"
                    }, {
                        adjustScalarBytes: "function",
                        domain: "function",
                        uvRatio: "function",
                        mapToCurve: "function"
                    }),
                    Object.freeze({
                        ...e
                    })
                }(t)
                  , {Fp: n, n: r, prehash: o, hash: i, randomBytes: s, nByteLength: a, h: u} = e
                  , c = Pt << BigInt(8 * a) - Nt
                  , l = n.create
                  , f = e.uvRatio || ((t,e)=>{
                    try {
                        return {
                            isValid: !0,
                            value: n.sqrt(t * n.inv(e))
                        }
                    } catch (t) {
                        return {
                            isValid: !1,
                            value: Bt
                        }
                    }
                }
                )
                  , h = e.adjustScalarBytes || (t=>t)
                  , d = e.domain || ((t,e,n)=>{
                    if (e.length || n)
                        throw new Error("Contexts/pre-hash are not supported");
                    return t
                }
                )
                  , p = t=>"bigint" == typeof t && Bt < t
                  , y = (t,e)=>p(t) && p(e) && t < e
                  , g = t=>t === Bt || y(t, c);
                function m(t, e) {
                    if (y(t, e))
                        return t;
                    throw new Error(`Expected valid scalar < ${e}, got ${typeof t} ${t}`)
                }
                function b(t) {
                    return t === Bt ? t : m(t, r)
                }
                const w = new Map;
                function v(t) {
                    if (!(t instanceof M))
                        throw new Error("ExtendedPoint expected")
                }
                class M {
                    constructor(t, e, n, r) {
                        if (this.ex = t,
                        this.ey = e,
                        this.ez = n,
                        this.et = r,
                        !g(t))
                            throw new Error("x required");
                        if (!g(e))
                            throw new Error("y required");
                        if (!g(n))
                            throw new Error("z required");
                        if (!g(r))
                            throw new Error("t required")
                    }
                    get x() {
                        return this.toAffine().x
                    }
                    get y() {
                        return this.toAffine().y
                    }
                    static fromAffine(t) {
                        if (t instanceof M)
                            throw new Error("extended point not allowed");
                        const {x: e, y: n} = t || {};
                        if (!g(e) || !g(n))
                            throw new Error("invalid affine point");
                        return new M(e,n,Nt,l(e * n))
                    }
                    static normalizeZ(t) {
                        const e = n.invertBatch(t.map((t=>t.ez)));
                        return t.map(((t,n)=>t.toAffine(e[n]))).map(M.fromAffine)
                    }
                    _setWindowSize(t) {
                        this._WINDOW_SIZE = t,
                        w.delete(this)
                    }
                    assertValidity() {
                        const {a: t, d: n} = e;
                        if (this.is0())
                            throw new Error("bad point: ZERO");
                        const {ex: r, ey: o, ez: i, et: s} = this
                          , a = l(r * r)
                          , u = l(o * o)
                          , c = l(i * i)
                          , f = l(c * c)
                          , h = l(a * t);
                        if (l(c * l(h + u)) !== l(f + l(n * l(a * u))))
                            throw new Error("bad point: equation left != right (1)");
                        if (l(r * o) !== l(i * s))
                            throw new Error("bad point: equation left != right (2)")
                    }
                    equals(t) {
                        v(t);
                        const {ex: e, ey: n, ez: r} = this
                          , {ex: o, ey: i, ez: s} = t
                          , a = l(e * s)
                          , u = l(o * r)
                          , c = l(n * s)
                          , f = l(i * r);
                        return a === u && c === f
                    }
                    is0() {
                        return this.equals(M.ZERO)
                    }
                    negate() {
                        return new M(l(-this.ex),this.ey,this.ez,l(-this.et))
                    }
                    double() {
                        const {a: t} = e
                          , {ex: n, ey: r, ez: o} = this
                          , i = l(n * n)
                          , s = l(r * r)
                          , a = l(Pt * l(o * o))
                          , u = l(t * i)
                          , c = n + r
                          , f = l(l(c * c) - i - s)
                          , h = u + s
                          , d = h - a
                          , p = u - s
                          , y = l(f * d)
                          , g = l(h * p)
                          , m = l(f * p)
                          , b = l(d * h);
                        return new M(y,g,b,m)
                    }
                    add(t) {
                        v(t);
                        const {a: n, d: r} = e
                          , {ex: o, ey: i, ez: s, et: a} = this
                          , {ex: u, ey: c, ez: f, et: h} = t;
                        if (n === BigInt(-1)) {
                            const t = l((i - o) * (c + u))
                              , e = l((i + o) * (c - u))
                              , n = l(e - t);
                            if (n === Bt)
                                return this.double();
                            const r = l(s * Pt * h)
                              , d = l(a * Pt * f)
                              , p = d + r
                              , y = e + t
                              , g = d - r
                              , m = l(p * n)
                              , b = l(y * g)
                              , w = l(p * g)
                              , v = l(n * y);
                            return new M(m,b,v,w)
                        }
                        const d = l(o * u)
                          , p = l(i * c)
                          , y = l(a * r * h)
                          , g = l(s * f)
                          , m = l((o + i) * (u + c) - d - p)
                          , b = g - y
                          , w = g + y
                          , x = l(p - n * d)
                          , j = l(m * b)
                          , I = l(w * x)
                          , A = l(m * x)
                          , S = l(b * w);
                        return new M(j,I,S,A)
                    }
                    subtract(t) {
                        return this.add(t.negate())
                    }
                    wNAF(t) {
                        return I.wNAFCached(this, w, t, M.normalizeZ)
                    }
                    multiply(t) {
                        const {p: e, f: n} = this.wNAF(m(t, r));
                        return M.normalizeZ([e, n])[0]
                    }
                    multiplyUnsafe(t) {
                        let e = b(t);
                        return e === Bt ? j : this.equals(j) || e === Nt ? this : this.equals(x) ? this.wNAF(e).p : I.unsafeLadder(this, e)
                    }
                    isSmallOrder() {
                        return this.multiplyUnsafe(u).is0()
                    }
                    isTorsionFree() {
                        return I.unsafeLadder(this, r).is0()
                    }
                    toAffine(t) {
                        const {ex: e, ey: r, ez: o} = this
                          , i = this.is0();
                        null == t && (t = i ? zt : n.inv(o));
                        const s = l(e * t)
                          , a = l(r * t)
                          , u = l(o * t);
                        if (i)
                            return {
                                x: Bt,
                                y: Nt
                            };
                        if (u !== Nt)
                            throw new Error("invZ was invalid");
                        return {
                            x: s,
                            y: a
                        }
                    }
                    clearCofactor() {
                        const {h: t} = e;
                        return t === Nt ? this : this.multiplyUnsafe(t)
                    }
                    static fromHex(t, r=!1) {
                        const {d: o, a: i} = e
                          , s = n.BYTES
                          , a = (t = tt("pointHex", t, s)).slice()
                          , u = t[s - 1];
                        a[s - 1] = -129 & u;
                        const h = Z(a);
                        h === Bt || m(h, r ? c : n.ORDER);
                        const d = l(h * h)
                          , p = l(d - Nt)
                          , y = l(o * d - i);
                        let {isValid: g, value: b} = f(p, y);
                        if (!g)
                            throw new Error("Point.fromHex: invalid y coordinate");
                        const w = (b & Nt) === Nt
                          , v = !!(128 & u);
                        if (!r && b === Bt && v)
                            throw new Error("Point.fromHex: x=0 and x_0=1");
                        return v !== w && (b = l(-b)),
                        M.fromAffine({
                            x: b,
                            y: h
                        })
                    }
                    static fromPrivateKey(t) {
                        return _(t).point
                    }
                    toRawBytes() {
                        const {x: t, y: e} = this.toAffine()
                          , r = Q(e, n.BYTES);
                        return r[r.length - 1] |= t & Nt ? 128 : 0,
                        r
                    }
                    toHex() {
                        return F(this.toRawBytes())
                    }
                }
                M.BASE = new M(e.Gx,e.Gy,Nt,l(e.Gx * e.Gy)),
                M.ZERO = new M(Bt,Nt,Nt,Bt);
                const {BASE: x, ZERO: j} = M
                  , I = Lt(M, 8 * a);
                function A(t) {
                    return vt(t, r)
                }
                function S(t) {
                    return A(Z(t))
                }
                function _(t) {
                    const e = a;
                    t = tt("private key", t, e);
                    const n = tt("hashed private key", i(t), 2 * e)
                      , r = h(n.slice(0, e))
                      , o = n.slice(e, 2 * e)
                      , s = S(r)
                      , u = x.multiply(s)
                      , c = u.toRawBytes();
                    return {
                        head: r,
                        prefix: o,
                        scalar: s,
                        point: u,
                        pointBytes: c
                    }
                }
                function E(t=new Uint8Array, ...e) {
                    const n = et(...e);
                    return S(i(d(n, tt("context", t), !!o)))
                }
                const k = Ut;
                return x._setWindowSize(8),
                {
                    CURVE: e,
                    getPublicKey: function(t) {
                        return _(t).pointBytes
                    },
                    sign: function(t, e, r={}) {
                        t = tt("message", t),
                        o && (t = o(t));
                        const {prefix: i, scalar: s, pointBytes: u} = _(e)
                          , c = E(r.context, i, t)
                          , l = x.multiply(c).toRawBytes()
                          , f = A(c + E(r.context, l, u, t) * s);
                        return b(f),
                        tt("result", et(l, Q(f, n.BYTES)), 2 * a)
                    },
                    verify: function(t, e, r, i=k) {
                        const {context: s, zip215: a} = i
                          , u = n.BYTES;
                        t = tt("signature", t, 2 * u),
                        e = tt("message", e),
                        o && (e = o(e));
                        const c = Z(t.slice(u, 2 * u));
                        let l, f, h;
                        try {
                            l = M.fromHex(r, a),
                            f = M.fromHex(t.slice(0, u), a),
                            h = x.multiplyUnsafe(c)
                        } catch (t) {
                            return !1
                        }
                        if (!a && l.isSmallOrder())
                            return !1;
                        const d = E(s, f.toRawBytes(), l.toRawBytes(), e);
                        return f.add(l.multiplyUnsafe(d)).subtract(h).clearCofactor().equals(M.ZERO)
                    },
                    ExtendedPoint: M,
                    utils: {
                        getExtendedPublicKey: _,
                        randomPrivateKey: ()=>s(n.BYTES),
                        precompute: (t=8,e=M.BASE)=>(e._setWindowSize(t),
                        e.multiply(BigInt(3)),
                        e)
                    }
                }
            }
            const Rt = BigInt("57896044618658097711785492504343953926634992332820282019728792003956564819949")
              , Ct = BigInt("19681161376707505956807079304988542015446066515923890162744021073123829784752")
              , Wt = (BigInt(0),
            BigInt(1))
              , qt = BigInt(2)
              , Ft = BigInt(5)
              , Kt = BigInt(10)
              , Ht = BigInt(20)
              , Yt = BigInt(40)
              , Gt = BigInt(80);
            const $t = St(Rt, void 0, !0)
              , Vt = {
                a: BigInt(-1),
                d: BigInt("37095705934669439343138083508754565189542113879843219016388785533085940283555"),
                Fp: $t,
                n: BigInt("7237005577332262213973186563042994240857116359379907606001950938285454250989"),
                h: BigInt(8),
                Gx: BigInt("15112221349535400772501151409588531511454012693041857206046113283949847762202"),
                Gy: BigInt("46316835694926478169428394003475163141307993866256225615783033603165251855960"),
                hash: z,
                randomBytes: w,
                adjustScalarBytes: function(t) {
                    return t[0] &= 248,
                    t[31] &= 127,
                    t[31] |= 64,
                    t
                },
                uvRatio: function(t, e) {
                    const n = Rt
                      , r = vt(e * e * e, n)
                      , o = vt(r * r * e, n);
                    let i = vt(t * r * function(t) {
                        const e = Rt
                          , n = t * t % e * t % e
                          , r = xt(n, qt, e) * n % e
                          , o = xt(r, Wt, e) * t % e
                          , i = xt(o, Ft, e) * o % e
                          , s = xt(i, Kt, e) * i % e
                          , a = xt(s, Ht, e) * s % e
                          , u = xt(a, Yt, e) * a % e
                          , c = xt(u, Gt, e) * u % e
                          , l = xt(c, Gt, e) * u % e
                          , f = xt(l, Kt, e) * i % e;
                        return {
                            pow_p_5_8: xt(f, qt, e) * t % e,
                            b2: n
                        }
                    }(t * o).pow_p_5_8, n);
                    const s = vt(e * i * i, n)
                      , a = i
                      , u = vt(i * Ct, n)
                      , c = s === t
                      , l = s === vt(-t, n)
                      , f = s === vt(-t * Ct, n);
                    return c && (i = a),
                    (l || f) && (i = u),
                    (vt(i, n) & pt) === pt && (i = vt(-i, n)),
                    {
                        isValid: c || l,
                        value: i
                    }
                }
            }
              , Zt = Dt(Vt);
            const Jt = ($t.ORDER + BigInt(3)) / BigInt(8);
            $t.pow(qt, Jt),
            $t.sqrt($t.neg($t.ONE)),
            $t.ORDER,
            BigInt(5),
            BigInt(8),
            BigInt(486662),
            function(t, e) {
                if (!t.isOdd)
                    throw new Error("Field doesn't have isOdd");
                const n = t.sqrt(e);
                t.isOdd(n) && t.neg(n)
            }($t, $t.neg(BigInt(486664))),
            BigInt("25063068953384623474111414158702152701244531502492656460079210482610430750235"),
            BigInt("54469307008909316920995813868745141605393597292927456921205312896311721017578"),
            BigInt("1159843021668779879193775521855586647937357759715417654439879720876111806838"),
            BigInt("40440834346308536858101042469323190826248399146238708352240133220865137265952"),
            BigInt("0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
            var Qt = n("../../../node_modules/bn.js/lib/bn.js")
              , Xt = n.n(Qt)
              , te = n("../../../node_modules/bs58/index.js")
              , ee = n.n(te);
            const ne = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298])
              , re = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225])
              , oe = new Uint32Array(64);
            class ie extends M {
                constructor() {
                    super(64, 32, 8, !1),
                    this.A = 0 | re[0],
                    this.B = 0 | re[1],
                    this.C = 0 | re[2],
                    this.D = 0 | re[3],
                    this.E = 0 | re[4],
                    this.F = 0 | re[5],
                    this.G = 0 | re[6],
                    this.H = 0 | re[7]
                }
                get() {
                    const {A: t, B: e, C: n, D: r, E: o, F: i, G: s, H: a} = this;
                    return [t, e, n, r, o, i, s, a]
                }
                set(t, e, n, r, o, i, s, a) {
                    this.A = 0 | t,
                    this.B = 0 | e,
                    this.C = 0 | n,
                    this.D = 0 | r,
                    this.E = 0 | o,
                    this.F = 0 | i,
                    this.G = 0 | s,
                    this.H = 0 | a
                }
                process(t, e) {
                    for (let n = 0; n < 16; n++,
                    e += 4)
                        oe[n] = t.getUint32(e, !1);
                    for (let t = 16; t < 64; t++) {
                        const e = oe[t - 15]
                          , n = oe[t - 2]
                          , r = f(e, 7) ^ f(e, 18) ^ e >>> 3
                          , o = f(n, 17) ^ f(n, 19) ^ n >>> 10;
                        oe[t] = o + oe[t - 7] + r + oe[t - 16] | 0
                    }
                    let {A: n, B: r, C: o, D: i, E: s, F: a, G: u, H: c} = this;
                    for (let t = 0; t < 64; t++) {
                        const e = c + (f(s, 6) ^ f(s, 11) ^ f(s, 25)) + ((l = s) & a ^ ~l & u) + ne[t] + oe[t] | 0
                          , h = (f(n, 2) ^ f(n, 13) ^ f(n, 22)) + v(n, r, o) | 0;
                        c = u,
                        u = a,
                        a = s,
                        s = i + e | 0,
                        i = o,
                        o = r,
                        r = n,
                        n = e + h | 0
                    }
                    var l;
                    n = n + this.A | 0,
                    r = r + this.B | 0,
                    o = o + this.C | 0,
                    i = i + this.D | 0,
                    s = s + this.E | 0,
                    a = a + this.F | 0,
                    u = u + this.G | 0,
                    c = c + this.H | 0,
                    this.set(n, r, o, i, s, a, u, c)
                }
                roundClean() {
                    oe.fill(0)
                }
                destroy() {
                    this.set(0, 0, 0, 0, 0, 0, 0, 0),
                    this.buffer.fill(0)
                }
            }
            const se = b((()=>new ie));
            var ae = n("../../../node_modules/borsh/lib/index.js")
              , ue = n("../../../node_modules/@solana/buffer-layout/lib/Layout.js")
              , ce = n("../../../node_modules/bigint-buffer/dist/browser.js");
            n("../../../node_modules/console-browserify/index.js");
            class le extends TypeError {
                constructor(t, e) {
                    let n;
                    const {message: r, ...o} = t
                      , {path: i} = t;
                    super(0 === i.length ? r : "At path: " + i.join(".") + " -- " + r),
                    Object.assign(this, o),
                    this.name = this.constructor.name,
                    this.failures = ()=>{
                        var r;
                        return null != (r = n) ? r : n = [t, ...e()]
                    }
                }
            }
            function fe(t) {
                return "object" == typeof t && null != t
            }
            function he(t) {
                return "string" == typeof t ? JSON.stringify(t) : "" + t
            }
            function de(t, e, n, r) {
                if (!0 === t)
                    return;
                !1 === t ? t = {} : "string" == typeof t && (t = {
                    message: t
                });
                const {path: o, branch: i} = e
                  , {type: s} = n
                  , {refinement: a, message: u="Expected a value of type `" + s + "`" + (a ? " with refinement `" + a + "`" : "") + ", but received: `" + he(r) + "`"} = t;
                return {
                    value: r,
                    type: s,
                    refinement: a,
                    key: o[o.length - 1],
                    path: o,
                    branch: i,
                    ...t,
                    message: u
                }
            }
            function *pe(t, e, n, r) {
                var o;
                fe(o = t) && "function" == typeof o[Symbol.iterator] || (t = [t]);
                for (const o of t) {
                    const t = de(o, e, n, r);
                    t && (yield t)
                }
            }
            function *ye(t, e, n={}) {
                const {path: r=[], branch: o=[t], coerce: i=!1, mask: s=!1} = n
                  , a = {
                    path: r,
                    branch: o
                };
                if (i && (t = e.coercer(t, a),
                s && "type" !== e.type && fe(e.schema) && fe(t) && !Array.isArray(t)))
                    for (const n in t)
                        void 0 === e.schema[n] && delete t[n];
                let u = !0;
                for (const n of e.validator(t, a))
                    u = !1,
                    yield[n, void 0];
                for (let[n,c,l] of e.entries(t, a)) {
                    const e = ye(c, l, {
                        path: void 0 === n ? r : [...r, n],
                        branch: void 0 === n ? o : [...o, c],
                        coerce: i,
                        mask: s
                    });
                    for (const r of e)
                        r[0] ? (u = !1,
                        yield[r[0], void 0]) : i && (c = r[1],
                        void 0 === n ? t = c : t instanceof Map ? t.set(n, c) : t instanceof Set ? t.add(c) : fe(t) && (t[n] = c))
                }
                if (u)
                    for (const n of e.refiner(t, a))
                        u = !1,
                        yield[n, void 0];
                u && (yield[void 0, t])
            }
            class ge {
                constructor(t) {
                    const {type: e, schema: n, validator: r, refiner: o, coercer: i=(t=>t), entries: s=function*() {}
                    } = t;
                    this.type = e,
                    this.schema = n,
                    this.entries = s,
                    this.coercer = i,
                    this.validator = r ? (t,e)=>pe(r(t, e), e, this, t) : ()=>[],
                    this.refiner = o ? (t,e)=>pe(o(t, e), e, this, t) : ()=>[]
                }
                assert(t) {
                    return function(t, e) {
                        const n = we(t, e);
                        if (n[0])
                            throw n[0]
                    }(t, this)
                }
                create(t) {
                    return me(t, this)
                }
                is(t) {
                    return be(t, this)
                }
                mask(t) {
                    return function(t, e) {
                        const n = we(t, e, {
                            coerce: !0,
                            mask: !0
                        });
                        if (n[0])
                            throw n[0];
                        return n[1]
                    }(t, this)
                }
                validate(t, e={}) {
                    return we(t, this, e)
                }
            }
            function me(t, e) {
                const n = we(t, e, {
                    coerce: !0
                });
                if (n[0])
                    throw n[0];
                return n[1]
            }
            function be(t, e) {
                return !we(t, e)[0]
            }
            function we(t, e, n={}) {
                const r = ye(t, e, n)
                  , o = function(t) {
                    const {done: e, value: n} = t.next();
                    return e ? void 0 : n
                }(r);
                return o[0] ? [new le(o[0],(function*() {
                    for (const t of r)
                        t[0] && (yield t[0])
                }
                )), void 0] : [void 0, o[1]]
            }
            function ve(t, e) {
                return new ge({
                    type: t,
                    schema: null,
                    validator: e
                })
            }
            function Me(t) {
                return new ge({
                    type: "array",
                    schema: t,
                    *entries(e) {
                        if (t && Array.isArray(e))
                            for (const [n,r] of e.entries())
                                yield[n, r, t]
                    },
                    coercer: t=>Array.isArray(t) ? t.slice() : t,
                    validator: t=>Array.isArray(t) || "Expected an array value, but received: " + he(t)
                })
            }
            function xe() {
                return ve("boolean", (t=>"boolean" == typeof t))
            }
            function je(t) {
                return ve("instance", (e=>e instanceof t || "Expected a `" + t.name + "` instance, but received: " + he(e)))
            }
            function Ie(t) {
                const e = he(t)
                  , n = typeof t;
                return new ge({
                    type: "literal",
                    schema: "string" === n || "number" === n || "boolean" === n ? t : null,
                    validator: n=>n === t || "Expected the literal `" + e + "`, but received: " + he(n)
                })
            }
            function Ae(t) {
                return new ge({
                    ...t,
                    validator: (e,n)=>null === e || t.validator(e, n),
                    refiner: (e,n)=>null === e || t.refiner(e, n)
                })
            }
            function Se() {
                return ve("number", (t=>"number" == typeof t && !isNaN(t) || "Expected a number, but received: " + he(t)))
            }
            function _e(t) {
                return new ge({
                    ...t,
                    validator: (e,n)=>void 0 === e || t.validator(e, n),
                    refiner: (e,n)=>void 0 === e || t.refiner(e, n)
                })
            }
            function Ee(t, e) {
                return new ge({
                    type: "record",
                    schema: null,
                    *entries(n) {
                        if (fe(n))
                            for (const r in n) {
                                const o = n[r];
                                yield[r, r, t],
                                yield[r, o, e]
                            }
                    },
                    validator: t=>fe(t) || "Expected an object, but received: " + he(t)
                })
            }
            function ke() {
                return ve("string", (t=>"string" == typeof t || "Expected a string, but received: " + he(t)))
            }
            function Oe(t) {
                const e = ve("never", (()=>!1));
                return new ge({
                    type: "tuple",
                    schema: null,
                    *entries(n) {
                        if (Array.isArray(n)) {
                            const r = Math.max(t.length, n.length);
                            for (let o = 0; o < r; o++)
                                yield[o, n[o], t[o] || e]
                        }
                    },
                    validator: t=>Array.isArray(t) || "Expected an array, but received: " + he(t)
                })
            }
            function Le(t) {
                const e = Object.keys(t);
                return new ge({
                    type: "type",
                    schema: t,
                    *entries(n) {
                        if (fe(n))
                            for (const r of e)
                                yield[r, n[r], t[r]]
                    },
                    validator: t=>fe(t) || "Expected an object, but received: " + he(t)
                })
            }
            function Te(t) {
                const e = t.map((t=>t.type)).join(" | ");
                return new ge({
                    type: "union",
                    schema: null,
                    validator(n, r) {
                        const o = [];
                        for (const e of t) {
                            const [...t] = ye(n, e, r)
                              , [i] = t;
                            if (!i[0])
                                return [];
                            for (const [e] of t)
                                e && o.push(e)
                        }
                        return ["Expected the value to satisfy a union of `" + e + "`, but received: " + he(n), ...o]
                    }
                })
            }
            function Be() {
                return ve("unknown", (()=>!0))
            }
            function Ne(t, e, n) {
                return new ge({
                    ...t,
                    coercer: (r,o)=>be(r, e) ? t.coercer(n(r, o), o) : t.coercer(r, o)
                })
            }
            n("../../../node_modules/jayson/lib/client/browser/index.js"),
            n("../../../node_modules/rpc-websockets/dist/lib/client.js"),
            n("../../../node_modules/rpc-websockets/dist/lib/client/websocket.browser.js");
            const Pe = []
              , ze = []
              , Ue = []
              , De = BigInt(0)
              , Re = BigInt(1)
              , Ce = BigInt(2)
              , We = BigInt(7)
              , qe = BigInt(256)
              , Fe = BigInt(113);
            for (let t = 0, e = Re, n = 1, r = 0; t < 24; t++) {
                [n,r] = [r, (2 * n + 3 * r) % 5],
                Pe.push(2 * (5 * r + n)),
                ze.push((t + 1) * (t + 2) / 2 % 64);
                let o = De;
                for (let t = 0; t < 7; t++)
                    e = (e << Re ^ (e >> We) * Fe) % qe,
                    e & Ce && (o ^= Re << (Re << BigInt(t)) - Re);
                Ue.push(o)
            }
            const [Ke,He] = A(Ue, !0)
              , Ye = (t,e,n)=>n > 32 ? E(t, e, n) : S(t, e, n)
              , Ge = (t,e,n)=>n > 32 ? k(t, e, n) : _(t, e, n);
            class $e extends m {
                constructor(t, e, n, r=!1, o=24) {
                    if (super(),
                    this.blockLen = t,
                    this.suffix = e,
                    this.outputLen = n,
                    this.enableXOF = r,
                    this.rounds = o,
                    this.pos = 0,
                    this.posOut = 0,
                    this.finished = !1,
                    this.destroyed = !1,
                    i(n),
                    0 >= this.blockLen || this.blockLen >= 200)
                        throw new Error("Sha3 supports only keccak-f1600 function");
                    var s;
                    this.state = new Uint8Array(200),
                    this.state32 = (s = this.state,
                    new Uint32Array(s.buffer,s.byteOffset,Math.floor(s.byteLength / 4)))
                }
                keccak() {
                    h || d(this.state32),
                    function(t, e=24) {
                        const n = new Uint32Array(10);
                        for (let r = 24 - e; r < 24; r++) {
                            for (let e = 0; e < 10; e++)
                                n[e] = t[e] ^ t[e + 10] ^ t[e + 20] ^ t[e + 30] ^ t[e + 40];
                            for (let e = 0; e < 10; e += 2) {
                                const r = (e + 8) % 10
                                  , o = (e + 2) % 10
                                  , i = n[o]
                                  , s = n[o + 1]
                                  , a = Ye(i, s, 1) ^ n[r]
                                  , u = Ge(i, s, 1) ^ n[r + 1];
                                for (let n = 0; n < 50; n += 10)
                                    t[e + n] ^= a,
                                    t[e + n + 1] ^= u
                            }
                            let e = t[2]
                              , o = t[3];
                            for (let n = 0; n < 24; n++) {
                                const r = ze[n]
                                  , i = Ye(e, o, r)
                                  , s = Ge(e, o, r)
                                  , a = Pe[n];
                                e = t[a],
                                o = t[a + 1],
                                t[a] = i,
                                t[a + 1] = s
                            }
                            for (let e = 0; e < 50; e += 10) {
                                for (let r = 0; r < 10; r++)
                                    n[r] = t[e + r];
                                for (let r = 0; r < 10; r++)
                                    t[e + r] ^= ~n[(r + 2) % 10] & n[(r + 4) % 10]
                            }
                            t[0] ^= Ke[r],
                            t[1] ^= He[r]
                        }
                        n.fill(0)
                    }(this.state32, this.rounds),
                    h || d(this.state32),
                    this.posOut = 0,
                    this.pos = 0
                }
                update(t) {
                    a(this);
                    const {blockLen: e, state: n} = this
                      , r = (t = y(t)).length;
                    for (let o = 0; o < r; ) {
                        const i = Math.min(e - this.pos, r - o);
                        for (let e = 0; e < i; e++)
                            n[this.pos++] ^= t[o++];
                        this.pos === e && this.keccak()
                    }
                    return this
                }
                finish() {
                    if (this.finished)
                        return;
                    this.finished = !0;
                    const {state: t, suffix: e, pos: n, blockLen: r} = this;
                    t[n] ^= e,
                    128 & e && n === r - 1 && this.keccak(),
                    t[r - 1] ^= 128,
                    this.keccak()
                }
                writeInto(t) {
                    a(this, !1),
                    s(t),
                    this.finish();
                    const e = this.state
                      , {blockLen: n} = this;
                    for (let r = 0, o = t.length; r < o; ) {
                        this.posOut >= n && this.keccak();
                        const i = Math.min(n - this.posOut, o - r);
                        t.set(e.subarray(this.posOut, this.posOut + i), r),
                        this.posOut += i,
                        r += i
                    }
                    return t
                }
                xofInto(t) {
                    if (!this.enableXOF)
                        throw new Error("XOF is not possible for this instance");
                    return this.writeInto(t)
                }
                xof(t) {
                    return i(t),
                    this.xofInto(new Uint8Array(t))
                }
                digestInto(t) {
                    if (u(t, this),
                    this.finished)
                        throw new Error("digest() was already called");
                    return this.writeInto(t),
                    this.destroy(),
                    t
                }
                digest() {
                    return this.digestInto(new Uint8Array(this.outputLen))
                }
                destroy() {
                    this.destroyed = !0,
                    this.state.fill(0)
                }
                _cloneInto(t) {
                    const {blockLen: e, suffix: n, outputLen: r, rounds: o, enableXOF: i} = this;
                    return t || (t = new $e(e,n,r,i,o)),
                    t.state32.set(this.state32),
                    t.pos = this.pos,
                    t.posOut = this.posOut,
                    t.finished = this.finished,
                    t.rounds = o,
                    t.suffix = n,
                    t.outputLen = r,
                    t.enableXOF = i,
                    t.destroyed = this.destroyed,
                    t
                }
            }
            const Ve = ((t,e,n)=>b((()=>new $e(e,t,n))))(1, 136, 32);
            class Ze extends m {
                constructor(t, e) {
                    super(),
                    this.finished = !1,
                    this.destroyed = !1,
                    function(t) {
                        if ("function" != typeof t || "function" != typeof t.create)
                            throw new Error("Hash should be wrapped by utils.wrapConstructor");
                        i(t.outputLen),
                        i(t.blockLen)
                    }(t);
                    const n = y(e);
                    if (this.iHash = t.create(),
                    "function" != typeof this.iHash.update)
                        throw new Error("Expected instance of class which extends utils.Hash");
                    this.blockLen = this.iHash.blockLen,
                    this.outputLen = this.iHash.outputLen;
                    const r = this.blockLen
                      , o = new Uint8Array(r);
                    o.set(n.length > r ? t.create().update(n).digest() : n);
                    for (let t = 0; t < o.length; t++)
                        o[t] ^= 54;
                    this.iHash.update(o),
                    this.oHash = t.create();
                    for (let t = 0; t < o.length; t++)
                        o[t] ^= 106;
                    this.oHash.update(o),
                    o.fill(0)
                }
                update(t) {
                    return a(this),
                    this.iHash.update(t),
                    this
                }
                digestInto(t) {
                    a(this),
                    s(t, this.outputLen),
                    this.finished = !0,
                    this.iHash.digestInto(t),
                    this.oHash.update(t),
                    this.oHash.digestInto(t),
                    this.destroy()
                }
                digest() {
                    const t = new Uint8Array(this.oHash.outputLen);
                    return this.digestInto(t),
                    t
                }
                _cloneInto(t) {
                    t || (t = Object.create(Object.getPrototypeOf(this), {}));
                    const {oHash: e, iHash: n, finished: r, destroyed: o, blockLen: i, outputLen: s} = this;
                    return t.finished = r,
                    t.destroyed = o,
                    t.blockLen = i,
                    t.outputLen = s,
                    t.oHash = e._cloneInto(t.oHash),
                    t.iHash = n._cloneInto(t.iHash),
                    t
                }
                destroy() {
                    this.destroyed = !0,
                    this.oHash.destroy(),
                    this.iHash.destroy()
                }
            }
            const Je = (t,e,n)=>new Ze(t,e).update(n).digest();
            Je.create = (t,e)=>new Ze(t,e);
            const {bytesToNumberBE: Qe, hexToBytes: Xe} = r
              , tn = {
                Err: class extends Error {
                    constructor(t="") {
                        super(t)
                    }
                }
                ,
                _parseInt(t) {
                    const {Err: e} = tn;
                    if (t.length < 2 || 2 !== t[0])
                        throw new e("Invalid signature integer tag");
                    const n = t[1]
                      , r = t.subarray(2, n + 2);
                    if (!n || r.length !== n)
                        throw new e("Invalid signature integer: wrong length");
                    if (128 & r[0])
                        throw new e("Invalid signature integer: negative");
                    if (0 === r[0] && !(128 & r[1]))
                        throw new e("Invalid signature integer: unnecessary leading zero");
                    return {
                        d: Qe(r),
                        l: t.subarray(n + 2)
                    }
                },
                toSig(t) {
                    const {Err: e} = tn
                      , n = "string" == typeof t ? Xe(t) : t;
                    W(n);
                    let r = n.length;
                    if (r < 2 || 48 != n[0])
                        throw new e("Invalid signature tag");
                    if (n[1] !== r - 2)
                        throw new e("Invalid signature: incorrect length");
                    const {d: o, l: i} = tn._parseInt(n.subarray(2))
                      , {d: s, l: a} = tn._parseInt(i);
                    if (a.length)
                        throw new e("Invalid signature: left bytes after parsing");
                    return {
                        r: o,
                        s
                    }
                },
                hexFromSig(t) {
                    const e = t=>8 & Number.parseInt(t[0], 16) ? "00" + t : t
                      , n = t=>{
                        const e = t.toString(16);
                        return 1 & e.length ? `0${e}` : e
                    }
                      , r = e(n(t.s))
                      , o = e(n(t.r))
                      , i = r.length / 2
                      , s = o.length / 2
                      , a = n(i)
                      , u = n(s);
                    return `30${n(s + i + 4)}02${u}${o}02${a}${r}`
                }
            }
              , en = BigInt(0)
              , nn = BigInt(1)
              , rn = (BigInt(2),
            BigInt(3));
            function on(t) {
                const e = function(t) {
                    const e = Tt(t);
                    return ht(e, {
                        hash: "hash",
                        hmac: "function",
                        randomBytes: "function"
                    }, {
                        bits2int: "function",
                        bits2int_modN: "function",
                        lowS: "boolean"
                    }),
                    Object.freeze({
                        lowS: !0,
                        ...e
                    })
                }(t)
                  , {Fp: n, n: r} = e
                  , o = n.BYTES + 1
                  , i = 2 * n.BYTES + 1;
                function s(t) {
                    return vt(t, r)
                }
                function a(t) {
                    return jt(t, r)
                }
                const {ProjectivePoint: u, normPrivateKeyToScalar: c, weierstrassEquation: l, isWithinCurveOrder: f} = function(t) {
                    const e = function(t) {
                        const e = Tt(t);
                        ht(e, {
                            a: "field",
                            b: "field"
                        }, {
                            allowedPrivateKeyLengths: "array",
                            wrapPrivateKey: "boolean",
                            isTorsionFree: "function",
                            clearCofactor: "function",
                            allowInfinityPoint: "boolean",
                            fromBytes: "function",
                            toBytes: "function"
                        });
                        const {endo: n, Fp: r, a: o} = e;
                        if (n) {
                            if (!r.eql(o, r.ZERO))
                                throw new Error("Endomorphism can only be defined for Koblitz curves that have a=0");
                            if ("object" != typeof n || "bigint" != typeof n.beta || "function" != typeof n.splitScalar)
                                throw new Error("Expected endomorphism with beta: bigint and splitScalar: function")
                        }
                        return Object.freeze({
                            ...e
                        })
                    }(t)
                      , {Fp: n} = e
                      , r = e.toBytes || ((t,e,r)=>{
                        const o = e.toAffine();
                        return et(Uint8Array.from([4]), n.toBytes(o.x), n.toBytes(o.y))
                    }
                    )
                      , o = e.fromBytes || (t=>{
                        const e = t.subarray(1);
                        return {
                            x: n.fromBytes(e.subarray(0, n.BYTES)),
                            y: n.fromBytes(e.subarray(n.BYTES, 2 * n.BYTES))
                        }
                    }
                    );
                    function i(t) {
                        const {a: r, b: o} = e
                          , i = n.sqr(t)
                          , s = n.mul(i, t);
                        return n.add(n.add(s, n.mul(t, r)), o)
                    }
                    if (!n.eql(n.sqr(e.Gy), i(e.Gx)))
                        throw new Error("bad generator point: equation left != right");
                    function s(t) {
                        return "bigint" == typeof t && en < t && t < e.n
                    }
                    function a(t) {
                        if (!s(t))
                            throw new Error("Expected valid bigint: 0 < bigint < curve.n")
                    }
                    function u(t) {
                        const {allowedPrivateKeyLengths: n, nByteLength: r, wrapPrivateKey: o, n: i} = e;
                        if (n && "bigint" != typeof t) {
                            if (C(t) && (t = F(t)),
                            "string" != typeof t || !n.includes(t.length))
                                throw new Error("Invalid key");
                            t = t.padStart(2 * r, "0")
                        }
                        let s;
                        try {
                            s = "bigint" == typeof t ? t : V(tt("private key", t, r))
                        } catch (e) {
                            throw new Error(`private key must be ${r} bytes, hex or bigint, not ${typeof t}`)
                        }
                        return o && (s = vt(s, i)),
                        a(s),
                        s
                    }
                    const c = new Map;
                    function l(t) {
                        if (!(t instanceof f))
                            throw new Error("ProjectivePoint expected")
                    }
                    class f {
                        constructor(t, e, r) {
                            if (this.px = t,
                            this.py = e,
                            this.pz = r,
                            null == t || !n.isValid(t))
                                throw new Error("x required");
                            if (null == e || !n.isValid(e))
                                throw new Error("y required");
                            if (null == r || !n.isValid(r))
                                throw new Error("z required")
                        }
                        static fromAffine(t) {
                            const {x: e, y: r} = t || {};
                            if (!t || !n.isValid(e) || !n.isValid(r))
                                throw new Error("invalid affine point");
                            if (t instanceof f)
                                throw new Error("projective point not allowed");
                            const o = t=>n.eql(t, n.ZERO);
                            return o(e) && o(r) ? f.ZERO : new f(e,r,n.ONE)
                        }
                        get x() {
                            return this.toAffine().x
                        }
                        get y() {
                            return this.toAffine().y
                        }
                        static normalizeZ(t) {
                            const e = n.invertBatch(t.map((t=>t.pz)));
                            return t.map(((t,n)=>t.toAffine(e[n]))).map(f.fromAffine)
                        }
                        static fromHex(t) {
                            const e = f.fromAffine(o(tt("pointHex", t)));
                            return e.assertValidity(),
                            e
                        }
                        static fromPrivateKey(t) {
                            return f.BASE.multiply(u(t))
                        }
                        _setWindowSize(t) {
                            this._WINDOW_SIZE = t,
                            c.delete(this)
                        }
                        assertValidity() {
                            if (this.is0()) {
                                if (e.allowInfinityPoint && !n.is0(this.py))
                                    return;
                                throw new Error("bad point: ZERO")
                            }
                            const {x: t, y: r} = this.toAffine();
                            if (!n.isValid(t) || !n.isValid(r))
                                throw new Error("bad point: x or y not FE");
                            const o = n.sqr(r)
                              , s = i(t);
                            if (!n.eql(o, s))
                                throw new Error("bad point: equation left != right");
                            if (!this.isTorsionFree())
                                throw new Error("bad point: not in prime-order subgroup")
                        }
                        hasEvenY() {
                            const {y: t} = this.toAffine();
                            if (n.isOdd)
                                return !n.isOdd(t);
                            throw new Error("Field doesn't support isOdd")
                        }
                        equals(t) {
                            l(t);
                            const {px: e, py: r, pz: o} = this
                              , {px: i, py: s, pz: a} = t
                              , u = n.eql(n.mul(e, a), n.mul(i, o))
                              , c = n.eql(n.mul(r, a), n.mul(s, o));
                            return u && c
                        }
                        negate() {
                            return new f(this.px,n.neg(this.py),this.pz)
                        }
                        double() {
                            const {a: t, b: r} = e
                              , o = n.mul(r, rn)
                              , {px: i, py: s, pz: a} = this;
                            let u = n.ZERO
                              , c = n.ZERO
                              , l = n.ZERO
                              , h = n.mul(i, i)
                              , d = n.mul(s, s)
                              , p = n.mul(a, a)
                              , y = n.mul(i, s);
                            return y = n.add(y, y),
                            l = n.mul(i, a),
                            l = n.add(l, l),
                            u = n.mul(t, l),
                            c = n.mul(o, p),
                            c = n.add(u, c),
                            u = n.sub(d, c),
                            c = n.add(d, c),
                            c = n.mul(u, c),
                            u = n.mul(y, u),
                            l = n.mul(o, l),
                            p = n.mul(t, p),
                            y = n.sub(h, p),
                            y = n.mul(t, y),
                            y = n.add(y, l),
                            l = n.add(h, h),
                            h = n.add(l, h),
                            h = n.add(h, p),
                            h = n.mul(h, y),
                            c = n.add(c, h),
                            p = n.mul(s, a),
                            p = n.add(p, p),
                            h = n.mul(p, y),
                            u = n.sub(u, h),
                            l = n.mul(p, d),
                            l = n.add(l, l),
                            l = n.add(l, l),
                            new f(u,c,l)
                        }
                        add(t) {
                            l(t);
                            const {px: r, py: o, pz: i} = this
                              , {px: s, py: a, pz: u} = t;
                            let c = n.ZERO
                              , h = n.ZERO
                              , d = n.ZERO;
                            const p = e.a
                              , y = n.mul(e.b, rn);
                            let g = n.mul(r, s)
                              , m = n.mul(o, a)
                              , b = n.mul(i, u)
                              , w = n.add(r, o)
                              , v = n.add(s, a);
                            w = n.mul(w, v),
                            v = n.add(g, m),
                            w = n.sub(w, v),
                            v = n.add(r, i);
                            let M = n.add(s, u);
                            return v = n.mul(v, M),
                            M = n.add(g, b),
                            v = n.sub(v, M),
                            M = n.add(o, i),
                            c = n.add(a, u),
                            M = n.mul(M, c),
                            c = n.add(m, b),
                            M = n.sub(M, c),
                            d = n.mul(p, v),
                            c = n.mul(y, b),
                            d = n.add(c, d),
                            c = n.sub(m, d),
                            d = n.add(m, d),
                            h = n.mul(c, d),
                            m = n.add(g, g),
                            m = n.add(m, g),
                            b = n.mul(p, b),
                            v = n.mul(y, v),
                            m = n.add(m, b),
                            b = n.sub(g, b),
                            b = n.mul(p, b),
                            v = n.add(v, b),
                            g = n.mul(m, v),
                            h = n.add(h, g),
                            g = n.mul(M, v),
                            c = n.mul(w, c),
                            c = n.sub(c, g),
                            g = n.mul(w, m),
                            d = n.mul(M, d),
                            d = n.add(d, g),
                            new f(c,h,d)
                        }
                        subtract(t) {
                            return this.add(t.negate())
                        }
                        is0() {
                            return this.equals(f.ZERO)
                        }
                        wNAF(t) {
                            return d.wNAFCached(this, c, t, (t=>{
                                const e = n.invertBatch(t.map((t=>t.pz)));
                                return t.map(((t,n)=>t.toAffine(e[n]))).map(f.fromAffine)
                            }
                            ))
                        }
                        multiplyUnsafe(t) {
                            const r = f.ZERO;
                            if (t === en)
                                return r;
                            if (a(t),
                            t === nn)
                                return this;
                            const {endo: o} = e;
                            if (!o)
                                return d.unsafeLadder(this, t);
                            let {k1neg: i, k1: s, k2neg: u, k2: c} = o.splitScalar(t)
                              , l = r
                              , h = r
                              , p = this;
                            for (; s > en || c > en; )
                                s & nn && (l = l.add(p)),
                                c & nn && (h = h.add(p)),
                                p = p.double(),
                                s >>= nn,
                                c >>= nn;
                            return i && (l = l.negate()),
                            u && (h = h.negate()),
                            h = new f(n.mul(h.px, o.beta),h.py,h.pz),
                            l.add(h)
                        }
                        multiply(t) {
                            a(t);
                            let r, o, i = t;
                            const {endo: s} = e;
                            if (s) {
                                const {k1neg: t, k1: e, k2neg: a, k2: u} = s.splitScalar(i);
                                let {p: c, f: l} = this.wNAF(e)
                                  , {p: h, f: p} = this.wNAF(u);
                                c = d.constTimeNegate(t, c),
                                h = d.constTimeNegate(a, h),
                                h = new f(n.mul(h.px, s.beta),h.py,h.pz),
                                r = c.add(h),
                                o = l.add(p)
                            } else {
                                const {p: t, f: e} = this.wNAF(i);
                                r = t,
                                o = e
                            }
                            return f.normalizeZ([r, o])[0]
                        }
                        multiplyAndAddUnsafe(t, e, n) {
                            const r = f.BASE
                              , o = (t,e)=>e !== en && e !== nn && t.equals(r) ? t.multiply(e) : t.multiplyUnsafe(e)
                              , i = o(this, e).add(o(t, n));
                            return i.is0() ? void 0 : i
                        }
                        toAffine(t) {
                            const {px: e, py: r, pz: o} = this
                              , i = this.is0();
                            null == t && (t = i ? n.ONE : n.inv(o));
                            const s = n.mul(e, t)
                              , a = n.mul(r, t)
                              , u = n.mul(o, t);
                            if (i)
                                return {
                                    x: n.ZERO,
                                    y: n.ZERO
                                };
                            if (!n.eql(u, n.ONE))
                                throw new Error("invZ was invalid");
                            return {
                                x: s,
                                y: a
                            }
                        }
                        isTorsionFree() {
                            const {h: t, isTorsionFree: n} = e;
                            if (t === nn)
                                return !0;
                            if (n)
                                return n(f, this);
                            throw new Error("isTorsionFree() has not been declared for the elliptic curve")
                        }
                        clearCofactor() {
                            const {h: t, clearCofactor: n} = e;
                            return t === nn ? this : n ? n(f, this) : this.multiplyUnsafe(e.h)
                        }
                        toRawBytes(t=!0) {
                            return this.assertValidity(),
                            r(f, this, t)
                        }
                        toHex(t=!0) {
                            return F(this.toRawBytes(t))
                        }
                    }
                    f.BASE = new f(e.Gx,e.Gy,n.ONE),
                    f.ZERO = new f(n.ZERO,n.ONE,n.ZERO);
                    const h = e.nBitLength
                      , d = Lt(f, e.endo ? Math.ceil(h / 2) : h);
                    return {
                        CURVE: e,
                        ProjectivePoint: f,
                        normPrivateKeyToScalar: u,
                        weierstrassEquation: i,
                        isWithinCurveOrder: s
                    }
                }({
                    ...e,
                    toBytes(t, e, r) {
                        const o = e.toAffine()
                          , i = n.toBytes(o.x)
                          , s = et;
                        return r ? s(Uint8Array.from([e.hasEvenY() ? 2 : 3]), i) : s(Uint8Array.from([4]), i, n.toBytes(o.y))
                    },
                    fromBytes(t) {
                        const e = t.length
                          , r = t[0]
                          , s = t.subarray(1);
                        if (e !== o || 2 !== r && 3 !== r) {
                            if (e === i && 4 === r)
                                return {
                                    x: n.fromBytes(s.subarray(0, n.BYTES)),
                                    y: n.fromBytes(s.subarray(n.BYTES, 2 * n.BYTES))
                                };
                            throw new Error(`Point of length ${e} was invalid. Expected ${o} compressed bytes or ${i} uncompressed bytes`)
                        }
                        {
                            const t = V(s);
                            if (!(en < (a = t) && a < n.ORDER))
                                throw new Error("Point is not on curve");
                            const e = l(t);
                            let o;
                            try {
                                o = n.sqrt(e)
                            } catch (t) {
                                const e = t instanceof Error ? ": " + t.message : "";
                                throw new Error("Point is not on curve" + e)
                            }
                            return !(1 & ~r) != ((o & nn) === nn) && (o = n.neg(o)),
                            {
                                x: t,
                                y: o
                            }
                        }
                        var a
                    }
                })
                  , h = t=>F(J(t, e.nByteLength));
                function d(t) {
                    return t > r >> nn
                }
                const p = (t,e,n)=>V(t.slice(e, n));
                class y {
                    constructor(t, e, n) {
                        this.r = t,
                        this.s = e,
                        this.recovery = n,
                        this.assertValidity()
                    }
                    static fromCompact(t) {
                        const n = e.nByteLength;
                        return t = tt("compactSignature", t, 2 * n),
                        new y(p(t, 0, n),p(t, n, 2 * n))
                    }
                    static fromDER(t) {
                        const {r: e, s: n} = tn.toSig(tt("DER", t));
                        return new y(e,n)
                    }
                    assertValidity() {
                        if (!f(this.r))
                            throw new Error("r must be 0 < r < CURVE.n");
                        if (!f(this.s))
                            throw new Error("s must be 0 < s < CURVE.n")
                    }
                    addRecoveryBit(t) {
                        return new y(this.r,this.s,t)
                    }
                    recoverPublicKey(t) {
                        const {r, s: o, recovery: i} = this
                          , c = w(tt("msgHash", t));
                        if (null == i || ![0, 1, 2, 3].includes(i))
                            throw new Error("recovery id invalid");
                        const l = 2 === i || 3 === i ? r + e.n : r;
                        if (l >= n.ORDER)
                            throw new Error("recovery id 2 or 3 invalid");
                        const f = 1 & i ? "03" : "02"
                          , d = u.fromHex(f + h(l))
                          , p = a(l)
                          , y = s(-c * p)
                          , g = s(o * p)
                          , m = u.BASE.multiplyAndAddUnsafe(d, y, g);
                        if (!m)
                            throw new Error("point at infinify");
                        return m.assertValidity(),
                        m
                    }
                    hasHighS() {
                        return d(this.s)
                    }
                    normalizeS() {
                        return this.hasHighS() ? new y(this.r,s(-this.s),this.recovery) : this
                    }
                    toDERRawBytes() {
                        return $(this.toDERHex())
                    }
                    toDERHex() {
                        return tn.hexFromSig({
                            r: this.r,
                            s: this.s
                        })
                    }
                    toCompactRawBytes() {
                        return $(this.toCompactHex())
                    }
                    toCompactHex() {
                        return h(this.r) + h(this.s)
                    }
                }
                const g = {
                    isValidPrivateKey(t) {
                        try {
                            return c(t),
                            !0
                        } catch (t) {
                            return !1
                        }
                    },
                    normPrivateKeyToScalar: c,
                    randomPrivateKey: ()=>{
                        const t = Et(e.n);
                        return function(t, e, n=!1) {
                            const r = t.length
                              , o = _t(e)
                              , i = Et(e);
                            if (r < 16 || r < i || r > 1024)
                                throw new Error(`expected ${i}-1024 bytes of input, got ${r}`);
                            const s = vt(n ? V(t) : Z(t), e - pt) + pt;
                            return n ? Q(s, o) : J(s, o)
                        }(e.randomBytes(t), e.n)
                    }
                    ,
                    precompute: (t=8,e=u.BASE)=>(e._setWindowSize(t),
                    e.multiply(BigInt(3)),
                    e)
                };
                function m(t) {
                    const e = C(t)
                      , n = "string" == typeof t
                      , r = (e || n) && t.length;
                    return e ? r === o || r === i : n ? r === 2 * o || r === 2 * i : t instanceof u
                }
                const b = e.bits2int || function(t) {
                    const n = V(t)
                      , r = 8 * t.length - e.nBitLength;
                    return r > 0 ? n >> BigInt(r) : n
                }
                  , w = e.bits2int_modN || function(t) {
                    return s(b(t))
                }
                  , v = at(e.nBitLength);
                function M(t) {
                    if ("bigint" != typeof t)
                        throw new Error("bigint expected");
                    if (!(en <= t && t < v))
                        throw new Error(`bigint expected < 2^${e.nBitLength}`);
                    return J(t, e.nByteLength)
                }
                const x = {
                    lowS: e.lowS,
                    prehash: !1
                }
                  , j = {
                    lowS: e.lowS,
                    prehash: !1
                };
                return u.BASE._setWindowSize(8),
                {
                    CURVE: e,
                    getPublicKey: function(t, e=!0) {
                        return u.fromPrivateKey(t).toRawBytes(e)
                    },
                    getSharedSecret: function(t, e, n=!0) {
                        if (m(t))
                            throw new Error("first arg must be private key");
                        if (!m(e))
                            throw new Error("second arg must be public key");
                        return u.fromHex(e).multiply(c(t)).toRawBytes(n)
                    },
                    sign: function(t, r, o=x) {
                        const {seed: i, k2sig: l} = function(t, r, o=x) {
                            if (["recovered", "canonical"].some((t=>t in o)))
                                throw new Error("sign() legacy options not supported");
                            const {hash: i, randomBytes: l} = e;
                            let {lowS: h, prehash: p, extraEntropy: g} = o;
                            null == h && (h = !0),
                            t = tt("msgHash", t),
                            p && (t = tt("prehashed msgHash", i(t)));
                            const m = w(t)
                              , v = c(r)
                              , j = [M(v), M(m)];
                            if (null != g && !1 !== g) {
                                const t = !0 === g ? l(n.BYTES) : g;
                                j.push(tt("extraEntropy", t))
                            }
                            const I = et(...j)
                              , A = m;
                            return {
                                seed: I,
                                k2sig: function(t) {
                                    const e = b(t);
                                    if (!f(e))
                                        return;
                                    const n = a(e)
                                      , r = u.BASE.multiply(e).toAffine()
                                      , o = s(r.x);
                                    if (o === en)
                                        return;
                                    const i = s(n * s(A + o * v));
                                    if (i === en)
                                        return;
                                    let c = (r.x === o ? 0 : 2) | Number(r.y & nn)
                                      , l = i;
                                    return h && d(i) && (l = function(t) {
                                        return d(t) ? s(-t) : t
                                    }(i),
                                    c ^= 1),
                                    new y(o,l,c)
                                }
                            }
                        }(t, r, o)
                          , h = e;
                        return lt(h.hash.outputLen, h.nByteLength, h.hmac)(i, l)
                    },
                    verify: function(t, n, r, o=j) {
                        const i = t;
                        if (n = tt("msgHash", n),
                        r = tt("publicKey", r),
                        "strict"in o)
                            throw new Error("options.strict was renamed to lowS");
                        const {lowS: c, prehash: l} = o;
                        let f, h;
                        try {
                            if ("string" == typeof i || C(i))
                                try {
                                    f = y.fromDER(i)
                                } catch (t) {
                                    if (!(t instanceof tn.Err))
                                        throw t;
                                    f = y.fromCompact(i)
                                }
                            else {
                                if ("object" != typeof i || "bigint" != typeof i.r || "bigint" != typeof i.s)
                                    throw new Error("PARSE");
                                {
                                    const {r: t, s: e} = i;
                                    f = new y(t,e)
                                }
                            }
                            h = u.fromHex(r)
                        } catch (t) {
                            if ("PARSE" === t.message)
                                throw new Error("signature must be Signature instance, Uint8Array or hex string");
                            return !1
                        }
                        if (c && f.hasHighS())
                            return !1;
                        l && (n = e.hash(n));
                        const {r: d, s: p} = f
                          , g = w(n)
                          , m = a(p)
                          , b = s(g * m)
                          , v = s(d * m)
                          , M = u.BASE.multiplyAndAddUnsafe(h, b, v)?.toAffine();
                        return !!M && s(M.x) === d
                    },
                    ProjectivePoint: u,
                    Signature: y,
                    utils: g
                }
            }
            function sn(t) {
                return {
                    hash: t,
                    hmac: (e,...n)=>Je(t, e, g(...n)),
                    randomBytes: w
                }
            }
            BigInt(4);
            const an = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f")
              , un = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141")
              , cn = BigInt(1)
              , ln = BigInt(2)
              , fn = (t,e)=>(t + e / ln) / e;
            const hn = St(an, void 0, void 0, {
                sqrt: function(t) {
                    const e = an
                      , n = BigInt(3)
                      , r = BigInt(6)
                      , o = BigInt(11)
                      , i = BigInt(22)
                      , s = BigInt(23)
                      , a = BigInt(44)
                      , u = BigInt(88)
                      , c = t * t * t % e
                      , l = c * c * t % e
                      , f = xt(l, n, e) * l % e
                      , h = xt(f, n, e) * l % e
                      , d = xt(h, ln, e) * c % e
                      , p = xt(d, o, e) * d % e
                      , y = xt(p, i, e) * p % e
                      , g = xt(y, a, e) * y % e
                      , m = xt(g, u, e) * g % e
                      , b = xt(m, a, e) * y % e
                      , w = xt(b, n, e) * l % e
                      , v = xt(w, s, e) * p % e
                      , M = xt(v, r, e) * c % e
                      , x = xt(M, ln, e);
                    if (!hn.eql(hn.sqr(x), t))
                        throw new Error("Cannot find square root");
                    return x
                }
            })
              , dn = function(t, e) {
                const n = e=>on({
                    ...t,
                    ...sn(e)
                });
                return Object.freeze({
                    ...n(e),
                    create: n
                })
            }({
                a: BigInt(0),
                b: BigInt(7),
                Fp: hn,
                n: un,
                Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
                Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
                h: BigInt(1),
                lowS: !0,
                endo: {
                    beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
                    splitScalar: t=>{
                        const e = un
                          , n = BigInt("0x3086d221a7d46bcde86c90e49284eb15")
                          , r = -cn * BigInt("0xe4437ed6010e88286f547fa90abfe4c3")
                          , o = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8")
                          , i = n
                          , s = BigInt("0x100000000000000000000000000000000")
                          , a = fn(i * t, e)
                          , u = fn(-r * t, e);
                        let c = vt(t - a * n - u * o, e)
                          , l = vt(-a * r - u * i, e);
                        const f = c > s
                          , h = l > s;
                        if (f && (c = e - c),
                        h && (l = e - l),
                        c > s || l > s)
                            throw new Error("splitScalar: Endomorphism failed, k=" + t);
                        return {
                            k1neg: f,
                            k1: c,
                            k2neg: h,
                            k2: l
                        }
                    }
                }
            }, se);
            BigInt(0),
            dn.ProjectivePoint;
            var pn = n("../../../node_modules/console-browserify/index.js");
            Zt.utils.randomPrivateKey;
            const yn = ()=>{
                const t = Zt.utils.randomPrivateKey()
                  , e = gn(t)
                  , n = new Uint8Array(64);
                return n.set(t),
                n.set(e, 32),
                {
                    publicKey: e,
                    secretKey: n
                }
            }
              , gn = Zt.getPublicKey;
            function mn(t) {
                try {
                    return Zt.ExtendedPoint.fromHex(t),
                    !0
                } catch {
                    return !1
                }
            }
            const bn = (t,e)=>Zt.sign(t, e.slice(0, 32))
              , wn = Zt.verify
              , vn = t=>o.Buffer.isBuffer(t) ? t : t instanceof Uint8Array ? o.Buffer.from(t.buffer, t.byteOffset, t.byteLength) : o.Buffer.from(t);
            class Mn {
                constructor(t) {
                    Object.assign(this, t)
                }
                encode() {
                    return o.Buffer.from((0,
                    ae.serialize)(xn, this))
                }
                static decode(t) {
                    return (0,
                    ae.deserialize)(xn, this, t)
                }
                static decodeUnchecked(t) {
                    return (0,
                    ae.deserializeUnchecked)(xn, this, t)
                }
            }
            const xn = new Map;
            var jn;
            let In;
            const An = 32;
            let Sn = 1;
            In = Symbol.toStringTag;
            class _n extends Mn {
                constructor(t) {
                    if (super({}),
                    this._bn = void 0,
                    function(t) {
                        return void 0 !== t._bn
                    }(t))
                        this._bn = t._bn;
                    else {
                        if ("string" == typeof t) {
                            const e = ee().decode(t);
                            if (e.length != An)
                                throw new Error("Invalid public key input");
                            this._bn = new (Xt())(e)
                        } else
                            this._bn = new (Xt())(t);
                        if (this._bn.byteLength() > An)
                            throw new Error("Invalid public key input")
                    }
                }
                static unique() {
                    const t = new _n(Sn);
                    return Sn += 1,
                    new _n(t.toBuffer())
                }
                equals(t) {
                    return this._bn.eq(t._bn)
                }
                toBase58() {
                    return ee().encode(this.toBytes())
                }
                toJSON() {
                    return this.toBase58()
                }
                toBytes() {
                    const t = this.toBuffer();
                    return new Uint8Array(t.buffer,t.byteOffset,t.byteLength)
                }
                toBuffer() {
                    const t = this._bn.toArrayLike(o.Buffer);
                    if (t.length === An)
                        return t;
                    const e = o.Buffer.alloc(32);
                    return t.copy(e, 32 - t.length),
                    e
                }
                get[In]() {
                    return `PublicKey(${this.toString()})`
                }
                toString() {
                    return this.toBase58()
                }
                static async createWithSeed(t, e, n) {
                    const r = o.Buffer.concat([t.toBuffer(), o.Buffer.from(e), n.toBuffer()])
                      , i = se(r);
                    return new _n(i)
                }
                static createProgramAddressSync(t, e) {
                    let n = o.Buffer.alloc(0);
                    t.forEach((function(t) {
                        if (t.length > 32)
                            throw new TypeError("Max seed length exceeded");
                        n = o.Buffer.concat([n, vn(t)])
                    }
                    )),
                    n = o.Buffer.concat([n, e.toBuffer(), o.Buffer.from("ProgramDerivedAddress")]);
                    const r = se(n);
                    if (mn(r))
                        throw new Error("Invalid seeds, address must fall off the curve");
                    return new _n(r)
                }
                static async createProgramAddress(t, e) {
                    return this.createProgramAddressSync(t, e)
                }
                static findProgramAddressSync(t, e) {
                    let n, r = 255;
                    for (; 0 != r; ) {
                        try {
                            const i = t.concat(o.Buffer.from([r]));
                            n = this.createProgramAddressSync(i, e)
                        } catch (t) {
                            if (t instanceof TypeError)
                                throw t;
                            r--;
                            continue
                        }
                        return [n, r]
                    }
                    throw new Error("Unable to find a viable program address nonce")
                }
                static async findProgramAddress(t, e) {
                    return this.findProgramAddressSync(t, e)
                }
                static isOnCurve(t) {
                    return mn(new _n(t).toBytes())
                }
            }
            jn = _n,
            _n.default = new jn("11111111111111111111111111111111"),
            xn.set(_n, {
                kind: "struct",
                fields: [["_bn", "u256"]]
            }),
            new _n("BPFLoader1111111111111111111111111111111111");
            const En = 1232;
            class kn extends Error {
                constructor(t) {
                    super(`Signature ${t} has expired: block height exceeded.`),
                    this.signature = void 0,
                    this.signature = t
                }
            }
            Object.defineProperty(kn.prototype, "name", {
                value: "TransactionExpiredBlockheightExceededError"
            });
            class On extends Error {
                constructor(t, e) {
                    super(`Transaction was not confirmed in ${e.toFixed(2)} seconds. It is unknown if it succeeded or failed. Check signature ${t} using the Solana Explorer or CLI tools.`),
                    this.signature = void 0,
                    this.signature = t
                }
            }
            Object.defineProperty(On.prototype, "name", {
                value: "TransactionExpiredTimeoutError"
            });
            class Ln extends Error {
                constructor(t) {
                    super(`Signature ${t} has expired: the nonce is no longer valid.`),
                    this.signature = void 0,
                    this.signature = t
                }
            }
            Object.defineProperty(Ln.prototype, "name", {
                value: "TransactionExpiredNonceInvalidError"
            });
            class Tn {
                constructor(t, e) {
                    this.staticAccountKeys = void 0,
                    this.accountKeysFromLookups = void 0,
                    this.staticAccountKeys = t,
                    this.accountKeysFromLookups = e
                }
                keySegments() {
                    const t = [this.staticAccountKeys];
                    return this.accountKeysFromLookups && (t.push(this.accountKeysFromLookups.writable),
                    t.push(this.accountKeysFromLookups.readonly)),
                    t
                }
                get(t) {
                    for (const e of this.keySegments()) {
                        if (t < e.length)
                            return e[t];
                        t -= e.length
                    }
                }
                get length() {
                    return this.keySegments().flat().length
                }
                compileInstructions(t) {
                    if (this.length > 256)
                        throw new Error("Account index overflow encountered during compilation");
                    const e = new Map;
                    this.keySegments().flat().forEach(((t,n)=>{
                        e.set(t.toBase58(), n)
                    }
                    ));
                    const n = t=>{
                        const n = e.get(t.toBase58());
                        if (void 0 === n)
                            throw new Error("Encountered an unknown instruction account key during compilation");
                        return n
                    }
                    ;
                    return t.map((t=>({
                        programIdIndex: n(t.programId),
                        accountKeyIndexes: t.keys.map((t=>n(t.pubkey))),
                        data: t.data
                    })))
                }
            }
            const Bn = (t="publicKey")=>ue.Ik(32, t)
              , Nn = (t="signature")=>ue.Ik(64, t)
              , Pn = (t="string")=>{
                const e = ue.n_([ue.Jq("length"), ue.Jq("lengthPadding"), ue.Ik(ue.cv(ue.Jq(), -8), "chars")], t)
                  , n = e.decode.bind(e)
                  , r = e.encode.bind(e)
                  , i = e;
                return i.decode = (t,e)=>n(t, e).chars.toString(),
                i.encode = (t,e,n)=>{
                    const i = {
                        chars: o.Buffer.from(t, "utf8")
                    };
                    return r(i, e, n)
                }
                ,
                i.alloc = t=>ue.Jq().span + ue.Jq().span + o.Buffer.from(t, "utf8").length,
                i
            }
            ;
            function zn(t, e) {
                const n = t=>{
                    if (t.span >= 0)
                        return t.span;
                    if ("function" == typeof t.alloc)
                        return t.alloc(e[t.property]);
                    if ("count"in t && "elementLayout"in t) {
                        const r = e[t.property];
                        if (Array.isArray(r))
                            return r.length * n(t.elementLayout)
                    } else if ("fields"in t)
                        return zn({
                            layout: t
                        }, e[t.property]);
                    return 0
                }
                ;
                let r = 0;
                return t.layout.fields.forEach((t=>{
                    r += n(t)
                }
                )),
                r
            }
            function Un(t) {
                let e = 0
                  , n = 0;
                for (; ; ) {
                    let r = t.shift();
                    if (e |= (127 & r) << 7 * n,
                    n += 1,
                    !(128 & r))
                        break
                }
                return e
            }
            function Dn(t, e) {
                let n = e;
                for (; ; ) {
                    let e = 127 & n;
                    if (n >>= 7,
                    0 == n) {
                        t.push(e);
                        break
                    }
                    e |= 128,
                    t.push(e)
                }
            }
            function Rn(t, e) {
                if (!t)
                    throw new Error(e || "Assertion failed")
            }
            class Cn {
                constructor(t, e) {
                    this.payer = void 0,
                    this.keyMetaMap = void 0,
                    this.payer = t,
                    this.keyMetaMap = e
                }
                static compile(t, e) {
                    const n = new Map
                      , r = t=>{
                        const e = t.toBase58();
                        let r = n.get(e);
                        return void 0 === r && (r = {
                            isSigner: !1,
                            isWritable: !1,
                            isInvoked: !1
                        },
                        n.set(e, r)),
                        r
                    }
                      , o = r(e);
                    o.isSigner = !0,
                    o.isWritable = !0;
                    for (const e of t) {
                        r(e.programId).isInvoked = !0;
                        for (const t of e.keys) {
                            const e = r(t.pubkey);
                            e.isSigner ||= t.isSigner,
                            e.isWritable ||= t.isWritable
                        }
                    }
                    return new Cn(e,n)
                }
                getMessageComponents() {
                    const t = [...this.keyMetaMap.entries()];
                    Rn(t.length <= 256, "Max static account keys length exceeded");
                    const e = t.filter((([,t])=>t.isSigner && t.isWritable))
                      , n = t.filter((([,t])=>t.isSigner && !t.isWritable))
                      , r = t.filter((([,t])=>!t.isSigner && t.isWritable))
                      , o = t.filter((([,t])=>!t.isSigner && !t.isWritable))
                      , i = {
                        numRequiredSignatures: e.length + n.length,
                        numReadonlySignedAccounts: n.length,
                        numReadonlyUnsignedAccounts: o.length
                    };
                    {
                        Rn(e.length > 0, "Expected at least one writable signer key");
                        const [t] = e[0];
                        Rn(t === this.payer.toBase58(), "Expected first writable signer key to be the fee payer")
                    }
                    return [i, [...e.map((([t])=>new _n(t))), ...n.map((([t])=>new _n(t))), ...r.map((([t])=>new _n(t))), ...o.map((([t])=>new _n(t)))]]
                }
                extractTableLookup(t) {
                    const [e,n] = this.drainKeysFoundInLookupTable(t.state.addresses, (t=>!t.isSigner && !t.isInvoked && t.isWritable))
                      , [r,o] = this.drainKeysFoundInLookupTable(t.state.addresses, (t=>!t.isSigner && !t.isInvoked && !t.isWritable));
                    if (0 !== e.length || 0 !== r.length)
                        return [{
                            accountKey: t.key,
                            writableIndexes: e,
                            readonlyIndexes: r
                        }, {
                            writable: n,
                            readonly: o
                        }]
                }
                drainKeysFoundInLookupTable(t, e) {
                    const n = new Array
                      , r = new Array;
                    for (const [o,i] of this.keyMetaMap.entries())
                        if (e(i)) {
                            const e = new _n(o)
                              , i = t.findIndex((t=>t.equals(e)));
                            i >= 0 && (Rn(i < 256, "Max lookup table index exceeded"),
                            n.push(i),
                            r.push(e),
                            this.keyMetaMap.delete(o))
                        }
                    return [n, r]
                }
            }
            const Wn = "Reached end of buffer unexpectedly";
            function qn(t) {
                if (0 === t.length)
                    throw new Error(Wn);
                return t.shift()
            }
            function Fn(t, ...e) {
                const [n] = e;
                if (2 === e.length ? n + (e[1] ?? 0) > t.length : n >= t.length)
                    throw new Error(Wn);
                return t.splice(...e)
            }
            class Kn {
                constructor(t) {
                    this.header = void 0,
                    this.accountKeys = void 0,
                    this.recentBlockhash = void 0,
                    this.instructions = void 0,
                    this.indexToProgramIds = new Map,
                    this.header = t.header,
                    this.accountKeys = t.accountKeys.map((t=>new _n(t))),
                    this.recentBlockhash = t.recentBlockhash,
                    this.instructions = t.instructions,
                    this.instructions.forEach((t=>this.indexToProgramIds.set(t.programIdIndex, this.accountKeys[t.programIdIndex])))
                }
                get version() {
                    return "legacy"
                }
                get staticAccountKeys() {
                    return this.accountKeys
                }
                get compiledInstructions() {
                    return this.instructions.map((t=>({
                        programIdIndex: t.programIdIndex,
                        accountKeyIndexes: t.accounts,
                        data: ee().decode(t.data)
                    })))
                }
                get addressTableLookups() {
                    return []
                }
                getAccountKeys() {
                    return new Tn(this.staticAccountKeys)
                }
                static compile(t) {
                    const e = Cn.compile(t.instructions, t.payerKey)
                      , [n,r] = e.getMessageComponents()
                      , o = new Tn(r).compileInstructions(t.instructions).map((t=>({
                        programIdIndex: t.programIdIndex,
                        accounts: t.accountKeyIndexes,
                        data: ee().encode(t.data)
                    })));
                    return new Kn({
                        header: n,
                        accountKeys: r,
                        recentBlockhash: t.recentBlockhash,
                        instructions: o
                    })
                }
                isAccountSigner(t) {
                    return t < this.header.numRequiredSignatures
                }
                isAccountWritable(t) {
                    const e = this.header.numRequiredSignatures;
                    return t >= this.header.numRequiredSignatures ? t - e < this.accountKeys.length - e - this.header.numReadonlyUnsignedAccounts : t < e - this.header.numReadonlySignedAccounts
                }
                isProgramId(t) {
                    return this.indexToProgramIds.has(t)
                }
                programIds() {
                    return [...this.indexToProgramIds.values()]
                }
                nonProgramIds() {
                    return this.accountKeys.filter(((t,e)=>!this.isProgramId(e)))
                }
                serialize() {
                    const t = this.accountKeys.length;
                    let e = [];
                    Dn(e, t);
                    const n = this.instructions.map((t=>{
                        const {accounts: e, programIdIndex: n} = t
                          , r = Array.from(ee().decode(t.data));
                        let i = [];
                        Dn(i, e.length);
                        let s = [];
                        return Dn(s, r.length),
                        {
                            programIdIndex: n,
                            keyIndicesCount: o.Buffer.from(i),
                            keyIndices: e,
                            dataLength: o.Buffer.from(s),
                            data: r
                        }
                    }
                    ));
                    let r = [];
                    Dn(r, n.length);
                    let i = o.Buffer.alloc(En);
                    o.Buffer.from(r).copy(i);
                    let s = r.length;
                    n.forEach((t=>{
                        const e = ue.n_([ue.u8("programIdIndex"), ue.Ik(t.keyIndicesCount.length, "keyIndicesCount"), ue.A9(ue.u8("keyIndex"), t.keyIndices.length, "keyIndices"), ue.Ik(t.dataLength.length, "dataLength"), ue.A9(ue.u8("userdatum"), t.data.length, "data")]).encode(t, i, s);
                        s += e
                    }
                    )),
                    i = i.slice(0, s);
                    const a = ue.n_([ue.Ik(1, "numRequiredSignatures"), ue.Ik(1, "numReadonlySignedAccounts"), ue.Ik(1, "numReadonlyUnsignedAccounts"), ue.Ik(e.length, "keyCount"), ue.A9(Bn("key"), t, "keys"), Bn("recentBlockhash")])
                      , u = {
                        numRequiredSignatures: o.Buffer.from([this.header.numRequiredSignatures]),
                        numReadonlySignedAccounts: o.Buffer.from([this.header.numReadonlySignedAccounts]),
                        numReadonlyUnsignedAccounts: o.Buffer.from([this.header.numReadonlyUnsignedAccounts]),
                        keyCount: o.Buffer.from(e),
                        keys: this.accountKeys.map((t=>vn(t.toBytes()))),
                        recentBlockhash: ee().decode(this.recentBlockhash)
                    };
                    let c = o.Buffer.alloc(2048);
                    const l = a.encode(u, c);
                    return i.copy(c, l),
                    c.slice(0, l + i.length)
                }
                static from(t) {
                    let e = [...t];
                    const n = qn(e);
                    if (n !== (127 & n))
                        throw new Error("Versioned messages must be deserialized with VersionedMessage.deserialize()");
                    const r = qn(e)
                      , i = qn(e)
                      , s = Un(e);
                    let a = [];
                    for (let t = 0; t < s; t++) {
                        const t = Fn(e, 0, An);
                        a.push(new _n(o.Buffer.from(t)))
                    }
                    const u = Fn(e, 0, An)
                      , c = Un(e);
                    let l = [];
                    for (let t = 0; t < c; t++) {
                        const t = qn(e)
                          , n = Fn(e, 0, Un(e))
                          , r = Fn(e, 0, Un(e))
                          , i = ee().encode(o.Buffer.from(r));
                        l.push({
                            programIdIndex: t,
                            accounts: n,
                            data: i
                        })
                    }
                    const f = {
                        header: {
                            numRequiredSignatures: n,
                            numReadonlySignedAccounts: r,
                            numReadonlyUnsignedAccounts: i
                        },
                        recentBlockhash: ee().encode(o.Buffer.from(u)),
                        accountKeys: a,
                        instructions: l
                    };
                    return new Kn(f)
                }
            }
            class Hn {
                constructor(t) {
                    this.header = void 0,
                    this.staticAccountKeys = void 0,
                    this.recentBlockhash = void 0,
                    this.compiledInstructions = void 0,
                    this.addressTableLookups = void 0,
                    this.header = t.header,
                    this.staticAccountKeys = t.staticAccountKeys,
                    this.recentBlockhash = t.recentBlockhash,
                    this.compiledInstructions = t.compiledInstructions,
                    this.addressTableLookups = t.addressTableLookups
                }
                get version() {
                    return 0
                }
                get numAccountKeysFromLookups() {
                    let t = 0;
                    for (const e of this.addressTableLookups)
                        t += e.readonlyIndexes.length + e.writableIndexes.length;
                    return t
                }
                getAccountKeys(t) {
                    let e;
                    if (t && "accountKeysFromLookups"in t && t.accountKeysFromLookups) {
                        if (this.numAccountKeysFromLookups != t.accountKeysFromLookups.writable.length + t.accountKeysFromLookups.readonly.length)
                            throw new Error("Failed to get account keys because of a mismatch in the number of account keys from lookups");
                        e = t.accountKeysFromLookups
                    } else if (t && "addressLookupTableAccounts"in t && t.addressLookupTableAccounts)
                        e = this.resolveAddressTableLookups(t.addressLookupTableAccounts);
                    else if (this.addressTableLookups.length > 0)
                        throw new Error("Failed to get account keys because address table lookups were not resolved");
                    return new Tn(this.staticAccountKeys,e)
                }
                isAccountSigner(t) {
                    return t < this.header.numRequiredSignatures
                }
                isAccountWritable(t) {
                    const e = this.header.numRequiredSignatures
                      , n = this.staticAccountKeys.length;
                    return t >= n ? t - n < this.addressTableLookups.reduce(((t,e)=>t + e.writableIndexes.length), 0) : t >= this.header.numRequiredSignatures ? t - e < n - e - this.header.numReadonlyUnsignedAccounts : t < e - this.header.numReadonlySignedAccounts
                }
                resolveAddressTableLookups(t) {
                    const e = {
                        writable: [],
                        readonly: []
                    };
                    for (const n of this.addressTableLookups) {
                        const r = t.find((t=>t.key.equals(n.accountKey)));
                        if (!r)
                            throw new Error(`Failed to find address lookup table account for table key ${n.accountKey.toBase58()}`);
                        for (const t of n.writableIndexes) {
                            if (!(t < r.state.addresses.length))
                                throw new Error(`Failed to find address for index ${t} in address lookup table ${n.accountKey.toBase58()}`);
                            e.writable.push(r.state.addresses[t])
                        }
                        for (const t of n.readonlyIndexes) {
                            if (!(t < r.state.addresses.length))
                                throw new Error(`Failed to find address for index ${t} in address lookup table ${n.accountKey.toBase58()}`);
                            e.readonly.push(r.state.addresses[t])
                        }
                    }
                    return e
                }
                static compile(t) {
                    const e = Cn.compile(t.instructions, t.payerKey)
                      , n = new Array
                      , r = {
                        writable: new Array,
                        readonly: new Array
                    }
                      , o = t.addressLookupTableAccounts || [];
                    for (const t of o) {
                        const o = e.extractTableLookup(t);
                        if (void 0 !== o) {
                            const [t,{writable: e, readonly: i}] = o;
                            n.push(t),
                            r.writable.push(...e),
                            r.readonly.push(...i)
                        }
                    }
                    const [i,s] = e.getMessageComponents()
                      , a = new Tn(s,r).compileInstructions(t.instructions);
                    return new Hn({
                        header: i,
                        staticAccountKeys: s,
                        recentBlockhash: t.recentBlockhash,
                        compiledInstructions: a,
                        addressTableLookups: n
                    })
                }
                serialize() {
                    const t = Array();
                    Dn(t, this.staticAccountKeys.length);
                    const e = this.serializeInstructions()
                      , n = Array();
                    Dn(n, this.compiledInstructions.length);
                    const r = this.serializeAddressTableLookups()
                      , o = Array();
                    Dn(o, this.addressTableLookups.length);
                    const i = ue.n_([ue.u8("prefix"), ue.n_([ue.u8("numRequiredSignatures"), ue.u8("numReadonlySignedAccounts"), ue.u8("numReadonlyUnsignedAccounts")], "header"), ue.Ik(t.length, "staticAccountKeysLength"), ue.A9(Bn(), this.staticAccountKeys.length, "staticAccountKeys"), Bn("recentBlockhash"), ue.Ik(n.length, "instructionsLength"), ue.Ik(e.length, "serializedInstructions"), ue.Ik(o.length, "addressTableLookupsLength"), ue.Ik(r.length, "serializedAddressTableLookups")])
                      , s = new Uint8Array(En)
                      , a = i.encode({
                        prefix: 128,
                        header: this.header,
                        staticAccountKeysLength: new Uint8Array(t),
                        staticAccountKeys: this.staticAccountKeys.map((t=>t.toBytes())),
                        recentBlockhash: ee().decode(this.recentBlockhash),
                        instructionsLength: new Uint8Array(n),
                        serializedInstructions: e,
                        addressTableLookupsLength: new Uint8Array(o),
                        serializedAddressTableLookups: r
                    }, s);
                    return s.slice(0, a)
                }
                serializeInstructions() {
                    let t = 0;
                    const e = new Uint8Array(En);
                    for (const n of this.compiledInstructions) {
                        const r = Array();
                        Dn(r, n.accountKeyIndexes.length);
                        const o = Array();
                        Dn(o, n.data.length),
                        t += ue.n_([ue.u8("programIdIndex"), ue.Ik(r.length, "encodedAccountKeyIndexesLength"), ue.A9(ue.u8(), n.accountKeyIndexes.length, "accountKeyIndexes"), ue.Ik(o.length, "encodedDataLength"), ue.Ik(n.data.length, "data")]).encode({
                            programIdIndex: n.programIdIndex,
                            encodedAccountKeyIndexesLength: new Uint8Array(r),
                            accountKeyIndexes: n.accountKeyIndexes,
                            encodedDataLength: new Uint8Array(o),
                            data: n.data
                        }, e, t)
                    }
                    return e.slice(0, t)
                }
                serializeAddressTableLookups() {
                    let t = 0;
                    const e = new Uint8Array(En);
                    for (const n of this.addressTableLookups) {
                        const r = Array();
                        Dn(r, n.writableIndexes.length);
                        const o = Array();
                        Dn(o, n.readonlyIndexes.length),
                        t += ue.n_([Bn("accountKey"), ue.Ik(r.length, "encodedWritableIndexesLength"), ue.A9(ue.u8(), n.writableIndexes.length, "writableIndexes"), ue.Ik(o.length, "encodedReadonlyIndexesLength"), ue.A9(ue.u8(), n.readonlyIndexes.length, "readonlyIndexes")]).encode({
                            accountKey: n.accountKey.toBytes(),
                            encodedWritableIndexesLength: new Uint8Array(r),
                            writableIndexes: n.writableIndexes,
                            encodedReadonlyIndexesLength: new Uint8Array(o),
                            readonlyIndexes: n.readonlyIndexes
                        }, e, t)
                    }
                    return e.slice(0, t)
                }
                static deserialize(t) {
                    let e = [...t];
                    const n = qn(e)
                      , r = 127 & n;
                    Rn(n !== r, "Expected versioned message but received legacy message"),
                    Rn(0 === r, `Expected versioned message with version 0 but found version ${r}`);
                    const o = {
                        numRequiredSignatures: qn(e),
                        numReadonlySignedAccounts: qn(e),
                        numReadonlyUnsignedAccounts: qn(e)
                    }
                      , i = []
                      , s = Un(e);
                    for (let t = 0; t < s; t++)
                        i.push(new _n(Fn(e, 0, An)));
                    const a = ee().encode(Fn(e, 0, An))
                      , u = Un(e)
                      , c = [];
                    for (let t = 0; t < u; t++) {
                        const t = qn(e)
                          , n = Fn(e, 0, Un(e))
                          , r = Un(e)
                          , o = new Uint8Array(Fn(e, 0, r));
                        c.push({
                            programIdIndex: t,
                            accountKeyIndexes: n,
                            data: o
                        })
                    }
                    const l = Un(e)
                      , f = [];
                    for (let t = 0; t < l; t++) {
                        const t = new _n(Fn(e, 0, An))
                          , n = Fn(e, 0, Un(e))
                          , r = Fn(e, 0, Un(e));
                        f.push({
                            accountKey: t,
                            writableIndexes: n,
                            readonlyIndexes: r
                        })
                    }
                    return new Hn({
                        header: o,
                        staticAccountKeys: i,
                        recentBlockhash: a,
                        compiledInstructions: c,
                        addressTableLookups: f
                    })
                }
            }
            const Yn = {
                deserializeMessageVersion(t) {
                    const e = t[0]
                      , n = 127 & e;
                    return n === e ? "legacy" : n
                },
                deserialize: t=>{
                    const e = Yn.deserializeMessageVersion(t);
                    if ("legacy" === e)
                        return Kn.from(t);
                    if (0 === e)
                        return Hn.deserialize(t);
                    throw new Error(`Transaction message version ${e} deserialization is not supported`)
                }
            }
              , Gn = o.Buffer.alloc(64).fill(0);
            class $n {
                constructor(t) {
                    this.keys = void 0,
                    this.programId = void 0,
                    this.data = o.Buffer.alloc(0),
                    this.programId = t.programId,
                    this.keys = t.keys,
                    t.data && (this.data = t.data)
                }
                toJSON() {
                    return {
                        keys: this.keys.map((({pubkey: t, isSigner: e, isWritable: n})=>({
                            pubkey: t.toJSON(),
                            isSigner: e,
                            isWritable: n
                        }))),
                        programId: this.programId.toJSON(),
                        data: [...this.data]
                    }
                }
            }
            class Vn {
                get signature() {
                    return this.signatures.length > 0 ? this.signatures[0].signature : null
                }
                constructor(t) {
                    if (this.signatures = [],
                    this.feePayer = void 0,
                    this.instructions = [],
                    this.recentBlockhash = void 0,
                    this.lastValidBlockHeight = void 0,
                    this.nonceInfo = void 0,
                    this.minNonceContextSlot = void 0,
                    this._message = void 0,
                    this._json = void 0,
                    t)
                        if (t.feePayer && (this.feePayer = t.feePayer),
                        t.signatures && (this.signatures = t.signatures),
                        Object.prototype.hasOwnProperty.call(t, "nonceInfo")) {
                            const {minContextSlot: e, nonceInfo: n} = t;
                            this.minNonceContextSlot = e,
                            this.nonceInfo = n
                        } else if (Object.prototype.hasOwnProperty.call(t, "lastValidBlockHeight")) {
                            const {blockhash: e, lastValidBlockHeight: n} = t;
                            this.recentBlockhash = e,
                            this.lastValidBlockHeight = n
                        } else {
                            const {recentBlockhash: e, nonceInfo: n} = t;
                            n && (this.nonceInfo = n),
                            this.recentBlockhash = e
                        }
                }
                toJSON() {
                    return {
                        recentBlockhash: this.recentBlockhash || null,
                        feePayer: this.feePayer ? this.feePayer.toJSON() : null,
                        nonceInfo: this.nonceInfo ? {
                            nonce: this.nonceInfo.nonce,
                            nonceInstruction: this.nonceInfo.nonceInstruction.toJSON()
                        } : null,
                        instructions: this.instructions.map((t=>t.toJSON())),
                        signers: this.signatures.map((({publicKey: t})=>t.toJSON()))
                    }
                }
                add(...t) {
                    if (0 === t.length)
                        throw new Error("No instructions");
                    return t.forEach((t=>{
                        "instructions"in t ? this.instructions = this.instructions.concat(t.instructions) : "data"in t && "programId"in t && "keys"in t ? this.instructions.push(t) : this.instructions.push(new $n(t))
                    }
                    )),
                    this
                }
                compileMessage() {
                    if (this._message && JSON.stringify(this.toJSON()) === JSON.stringify(this._json))
                        return this._message;
                    let t, e, n;
                    if (this.nonceInfo ? (t = this.nonceInfo.nonce,
                    e = this.instructions[0] != this.nonceInfo.nonceInstruction ? [this.nonceInfo.nonceInstruction, ...this.instructions] : this.instructions) : (t = this.recentBlockhash,
                    e = this.instructions),
                    !t)
                        throw new Error("Transaction recentBlockhash required");
                    if (e.length < 1 && pn.warn("No instructions provided"),
                    this.feePayer)
                        n = this.feePayer;
                    else {
                        if (!(this.signatures.length > 0 && this.signatures[0].publicKey))
                            throw new Error("Transaction fee payer required");
                        n = this.signatures[0].publicKey
                    }
                    for (let t = 0; t < e.length; t++)
                        if (void 0 === e[t].programId)
                            throw new Error(`Transaction instruction index ${t} has undefined program id`);
                    const r = []
                      , o = [];
                    e.forEach((t=>{
                        t.keys.forEach((t=>{
                            o.push({
                                ...t
                            })
                        }
                        ));
                        const e = t.programId.toString();
                        r.includes(e) || r.push(e)
                    }
                    )),
                    r.forEach((t=>{
                        o.push({
                            pubkey: new _n(t),
                            isSigner: !1,
                            isWritable: !1
                        })
                    }
                    ));
                    const i = [];
                    o.forEach((t=>{
                        const e = t.pubkey.toString()
                          , n = i.findIndex((t=>t.pubkey.toString() === e));
                        n > -1 ? (i[n].isWritable = i[n].isWritable || t.isWritable,
                        i[n].isSigner = i[n].isSigner || t.isSigner) : i.push(t)
                    }
                    )),
                    i.sort((function(t, e) {
                        return t.isSigner !== e.isSigner ? t.isSigner ? -1 : 1 : t.isWritable !== e.isWritable ? t.isWritable ? -1 : 1 : t.pubkey.toBase58().localeCompare(e.pubkey.toBase58(), "en", {
                            localeMatcher: "best fit",
                            usage: "sort",
                            sensitivity: "variant",
                            ignorePunctuation: !1,
                            numeric: !1,
                            caseFirst: "lower"
                        })
                    }
                    ));
                    const s = i.findIndex((t=>t.pubkey.equals(n)));
                    if (s > -1) {
                        const [t] = i.splice(s, 1);
                        t.isSigner = !0,
                        t.isWritable = !0,
                        i.unshift(t)
                    } else
                        i.unshift({
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !0
                        });
                    for (const t of this.signatures) {
                        const e = i.findIndex((e=>e.pubkey.equals(t.publicKey)));
                        if (!(e > -1))
                            throw new Error(`unknown signer: ${t.publicKey.toString()}`);
                        i[e].isSigner || (i[e].isSigner = !0,
                        pn.warn("Transaction references a signature that is unnecessary, only the fee payer and instruction signer accounts should sign a transaction. This behavior is deprecated and will throw an error in the next major version release."))
                    }
                    let a = 0
                      , u = 0
                      , c = 0;
                    const l = []
                      , f = [];
                    i.forEach((({pubkey: t, isSigner: e, isWritable: n})=>{
                        e ? (l.push(t.toString()),
                        a += 1,
                        n || (u += 1)) : (f.push(t.toString()),
                        n || (c += 1))
                    }
                    ));
                    const h = l.concat(f)
                      , d = e.map((t=>{
                        const {data: e, programId: n} = t;
                        return {
                            programIdIndex: h.indexOf(n.toString()),
                            accounts: t.keys.map((t=>h.indexOf(t.pubkey.toString()))),
                            data: ee().encode(e)
                        }
                    }
                    ));
                    return d.forEach((t=>{
                        Rn(t.programIdIndex >= 0),
                        t.accounts.forEach((t=>Rn(t >= 0)))
                    }
                    )),
                    new Kn({
                        header: {
                            numRequiredSignatures: a,
                            numReadonlySignedAccounts: u,
                            numReadonlyUnsignedAccounts: c
                        },
                        accountKeys: h,
                        recentBlockhash: t,
                        instructions: d
                    })
                }
                _compile() {
                    const t = this.compileMessage()
                      , e = t.accountKeys.slice(0, t.header.numRequiredSignatures);
                    return this.signatures.length === e.length && this.signatures.every(((t,n)=>e[n].equals(t.publicKey))) || (this.signatures = e.map((t=>({
                        signature: null,
                        publicKey: t
                    })))),
                    t
                }
                serializeMessage() {
                    return this._compile().serialize()
                }
                async getEstimatedFee(t) {
                    return (await t.getFeeForMessage(this.compileMessage())).value
                }
                setSigners(...t) {
                    if (0 === t.length)
                        throw new Error("No signers");
                    const e = new Set;
                    this.signatures = t.filter((t=>{
                        const n = t.toString();
                        return !e.has(n) && (e.add(n),
                        !0)
                    }
                    )).map((t=>({
                        signature: null,
                        publicKey: t
                    })))
                }
                sign(...t) {
                    if (0 === t.length)
                        throw new Error("No signers");
                    const e = new Set
                      , n = [];
                    for (const r of t) {
                        const t = r.publicKey.toString();
                        e.has(t) || (e.add(t),
                        n.push(r))
                    }
                    this.signatures = n.map((t=>({
                        signature: null,
                        publicKey: t.publicKey
                    })));
                    const r = this._compile();
                    this._partialSign(r, ...n)
                }
                partialSign(...t) {
                    if (0 === t.length)
                        throw new Error("No signers");
                    const e = new Set
                      , n = [];
                    for (const r of t) {
                        const t = r.publicKey.toString();
                        e.has(t) || (e.add(t),
                        n.push(r))
                    }
                    const r = this._compile();
                    this._partialSign(r, ...n)
                }
                _partialSign(t, ...e) {
                    const n = t.serialize();
                    e.forEach((t=>{
                        const e = bn(n, t.secretKey);
                        this._addSignature(t.publicKey, vn(e))
                    }
                    ))
                }
                addSignature(t, e) {
                    this._compile(),
                    this._addSignature(t, e)
                }
                _addSignature(t, e) {
                    Rn(64 === e.length);
                    const n = this.signatures.findIndex((e=>t.equals(e.publicKey)));
                    if (n < 0)
                        throw new Error(`unknown signer: ${t.toString()}`);
                    this.signatures[n].signature = o.Buffer.from(e)
                }
                verifySignatures(t=!0) {
                    return !this._getMessageSignednessErrors(this.serializeMessage(), t)
                }
                _getMessageSignednessErrors(t, e) {
                    const n = {};
                    for (const {signature: r, publicKey: o} of this.signatures)
                        null === r ? e && (n.missing ||= []).push(o) : wn(r, t, o.toBytes()) || (n.invalid ||= []).push(o);
                    return n.invalid || n.missing ? n : void 0
                }
                serialize(t) {
                    const {requireAllSignatures: e, verifySignatures: n} = Object.assign({
                        requireAllSignatures: !0,
                        verifySignatures: !0
                    }, t)
                      , r = this.serializeMessage();
                    if (n) {
                        const t = this._getMessageSignednessErrors(r, e);
                        if (t) {
                            let e = "Signature verification failed.";
                            throw t.invalid && (e += `\nInvalid signature for public key${1 === t.invalid.length ? "" : "(s)"} [\`${t.invalid.map((t=>t.toBase58())).join("`, `")}\`].`),
                            t.missing && (e += `\nMissing signature for public key${1 === t.missing.length ? "" : "(s)"} [\`${t.missing.map((t=>t.toBase58())).join("`, `")}\`].`),
                            new Error(e)
                        }
                    }
                    return this._serialize(r)
                }
                _serialize(t) {
                    const {signatures: e} = this
                      , n = [];
                    Dn(n, e.length);
                    const r = n.length + 64 * e.length + t.length
                      , i = o.Buffer.alloc(r);
                    return Rn(e.length < 256),
                    o.Buffer.from(n).copy(i, 0),
                    e.forEach((({signature: t},e)=>{
                        null !== t && (Rn(64 === t.length, "signature has invalid length"),
                        o.Buffer.from(t).copy(i, n.length + 64 * e))
                    }
                    )),
                    t.copy(i, n.length + 64 * e.length),
                    Rn(i.length <= En, `Transaction too large: ${i.length} > 1232`),
                    i
                }
                get keys() {
                    return Rn(1 === this.instructions.length),
                    this.instructions[0].keys.map((t=>t.pubkey))
                }
                get programId() {
                    return Rn(1 === this.instructions.length),
                    this.instructions[0].programId
                }
                get data() {
                    return Rn(1 === this.instructions.length),
                    this.instructions[0].data
                }
                static from(t) {
                    let e = [...t];
                    const n = Un(e);
                    let r = [];
                    for (let t = 0; t < n; t++) {
                        const t = Fn(e, 0, 64);
                        r.push(ee().encode(o.Buffer.from(t)))
                    }
                    return Vn.populate(Kn.from(e), r)
                }
                static populate(t, e=[]) {
                    const n = new Vn;
                    return n.recentBlockhash = t.recentBlockhash,
                    t.header.numRequiredSignatures > 0 && (n.feePayer = t.accountKeys[0]),
                    e.forEach(((e,r)=>{
                        const o = {
                            signature: e == ee().encode(Gn) ? null : ee().decode(e),
                            publicKey: t.accountKeys[r]
                        };
                        n.signatures.push(o)
                    }
                    )),
                    t.instructions.forEach((e=>{
                        const r = e.accounts.map((e=>{
                            const r = t.accountKeys[e];
                            return {
                                pubkey: r,
                                isSigner: n.signatures.some((t=>t.publicKey.toString() === r.toString())) || t.isAccountSigner(e),
                                isWritable: t.isAccountWritable(e)
                            }
                        }
                        ));
                        n.instructions.push(new $n({
                            keys: r,
                            programId: t.accountKeys[e.programIdIndex],
                            data: ee().decode(e.data)
                        }))
                    }
                    )),
                    n._message = t,
                    n._json = n.toJSON(),
                    n
                }
            }
            class Zn {
                get version() {
                    return this.message.version
                }
                constructor(t, e) {
                    if (this.signatures = void 0,
                    this.message = void 0,
                    void 0 !== e)
                        Rn(e.length === t.header.numRequiredSignatures, "Expected signatures length to be equal to the number of required signatures"),
                        this.signatures = e;
                    else {
                        const e = [];
                        for (let n = 0; n < t.header.numRequiredSignatures; n++)
                            e.push(new Uint8Array(64));
                        this.signatures = e
                    }
                    this.message = t
                }
                serialize() {
                    const t = this.message.serialize()
                      , e = Array();
                    Dn(e, this.signatures.length);
                    const n = ue.n_([ue.Ik(e.length, "encodedSignaturesLength"), ue.A9(Nn(), this.signatures.length, "signatures"), ue.Ik(t.length, "serializedMessage")])
                      , r = new Uint8Array(2048)
                      , o = n.encode({
                        encodedSignaturesLength: new Uint8Array(e),
                        signatures: this.signatures,
                        serializedMessage: t
                    }, r);
                    return r.slice(0, o)
                }
                static deserialize(t) {
                    let e = [...t];
                    const n = []
                      , r = Un(e);
                    for (let t = 0; t < r; t++)
                        n.push(new Uint8Array(Fn(e, 0, 64)));
                    const o = Yn.deserialize(new Uint8Array(e));
                    return new Zn(o,n)
                }
                sign(t) {
                    const e = this.message.serialize()
                      , n = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures);
                    for (const r of t) {
                        const t = n.findIndex((t=>t.equals(r.publicKey)));
                        Rn(t >= 0, `Cannot sign with non signer key ${r.publicKey.toBase58()}`),
                        this.signatures[t] = bn(e, r.secretKey)
                    }
                }
                addSignature(t, e) {
                    Rn(64 === e.byteLength, "Signature must be 64 bytes long");
                    const n = this.message.staticAccountKeys.slice(0, this.message.header.numRequiredSignatures).findIndex((e=>e.equals(t)));
                    Rn(n >= 0, `Can not add signature; \`${t.toBase58()}\` is not required to sign this transaction`),
                    this.signatures[n] = e
                }
            }
            const Jn = new _n("SysvarC1ock11111111111111111111111111111111")
              , Qn = (new _n("SysvarEpochSchedu1e111111111111111111111111"),
            new _n("Sysvar1nstructions1111111111111111111111111"),
            new _n("SysvarRecentB1ockHashes11111111111111111111"))
              , Xn = new _n("SysvarRent111111111111111111111111111111111")
              , tr = (new _n("SysvarRewards111111111111111111111111111111"),
            new _n("SysvarS1otHashes111111111111111111111111111"),
            new _n("SysvarS1otHistory11111111111111111111111111"),
            new _n("SysvarStakeHistory1111111111111111111111111"));
            async function er(t, e, n, r) {
                const o = r && {
                    skipPreflight: r.skipPreflight,
                    preflightCommitment: r.preflightCommitment || r.commitment,
                    maxRetries: r.maxRetries,
                    minContextSlot: r.minContextSlot
                }
                  , i = await t.sendTransaction(e, n, o);
                let s;
                if (null != e.recentBlockhash && null != e.lastValidBlockHeight)
                    s = (await t.confirmTransaction({
                        abortSignal: r?.abortSignal,
                        signature: i,
                        blockhash: e.recentBlockhash,
                        lastValidBlockHeight: e.lastValidBlockHeight
                    }, r && r.commitment)).value;
                else if (null != e.minNonceContextSlot && null != e.nonceInfo) {
                    const {nonceInstruction: n} = e.nonceInfo
                      , o = n.keys[0].pubkey;
                    s = (await t.confirmTransaction({
                        abortSignal: r?.abortSignal,
                        minContextSlot: e.minNonceContextSlot,
                        nonceAccountPubkey: o,
                        nonceValue: e.nonceInfo.nonce,
                        signature: i
                    }, r && r.commitment)).value
                } else
                    null != r?.abortSignal && pn.warn("sendAndConfirmTransaction(): A transaction with a deprecated confirmation strategy was supplied along with an `abortSignal`. Only transactions having `lastValidBlockHeight` or a combination of `nonceInfo` and `minNonceContextSlot` are abortable."),
                    s = (await t.confirmTransaction(i, r && r.commitment)).value;
                if (s.err)
                    throw new Error(`Transaction ${i} failed (${JSON.stringify(s)})`);
                return i
            }
            function nr(t) {
                return new Promise((e=>setTimeout(e, t)))
            }
            function rr(t, e) {
                const n = t.layout.span >= 0 ? t.layout.span : zn(t, e)
                  , r = o.Buffer.alloc(n)
                  , i = Object.assign({
                    instruction: t.index
                }, e);
                return t.layout.encode(i, r),
                r
            }
            const or = ue._O("lamportsPerSignature")
              , ir = ue.n_([ue.Jq("version"), ue.Jq("state"), Bn("authorizedPubkey"), Bn("nonce"), ue.n_([or], "feeCalculator")]).span
              , sr = (8,
            t=>{
                const e = (0,
                ue.Ik)(8, t)
                  , {encode: n, decode: r} = (t=>({
                    decode: t.decode.bind(t),
                    encode: t.encode.bind(t)
                }))(e)
                  , i = e;
                return i.decode = (t,e)=>{
                    const n = r(t, e);
                    return (0,
                    ce.oU)(o.Buffer.from(n))
                }
                ,
                i.encode = (t,e,r)=>{
                    const o = (0,
                    ce.k$)(t, 8);
                    return n(o, e, r)
                }
                ,
                i
            }
            );
            const ar = Object.freeze({
                Create: {
                    index: 0,
                    layout: ue.n_([ue.Jq("instruction"), ue.gM("lamports"), ue.gM("space"), Bn("programId")])
                },
                Assign: {
                    index: 1,
                    layout: ue.n_([ue.Jq("instruction"), Bn("programId")])
                },
                Transfer: {
                    index: 2,
                    layout: ue.n_([ue.Jq("instruction"), sr("lamports")])
                },
                CreateWithSeed: {
                    index: 3,
                    layout: ue.n_([ue.Jq("instruction"), Bn("base"), Pn("seed"), ue.gM("lamports"), ue.gM("space"), Bn("programId")])
                },
                AdvanceNonceAccount: {
                    index: 4,
                    layout: ue.n_([ue.Jq("instruction")])
                },
                WithdrawNonceAccount: {
                    index: 5,
                    layout: ue.n_([ue.Jq("instruction"), ue.gM("lamports")])
                },
                InitializeNonceAccount: {
                    index: 6,
                    layout: ue.n_([ue.Jq("instruction"), Bn("authorized")])
                },
                AuthorizeNonceAccount: {
                    index: 7,
                    layout: ue.n_([ue.Jq("instruction"), Bn("authorized")])
                },
                Allocate: {
                    index: 8,
                    layout: ue.n_([ue.Jq("instruction"), ue.gM("space")])
                },
                AllocateWithSeed: {
                    index: 9,
                    layout: ue.n_([ue.Jq("instruction"), Bn("base"), Pn("seed"), ue.gM("space"), Bn("programId")])
                },
                AssignWithSeed: {
                    index: 10,
                    layout: ue.n_([ue.Jq("instruction"), Bn("base"), Pn("seed"), Bn("programId")])
                },
                TransferWithSeed: {
                    index: 11,
                    layout: ue.n_([ue.Jq("instruction"), sr("lamports"), Pn("seed"), Bn("programId")])
                },
                UpgradeNonceAccount: {
                    index: 12,
                    layout: ue.n_([ue.Jq("instruction")])
                }
            });
            class ur {
                constructor() {}
                static createAccount(t) {
                    const e = rr(ar.Create, {
                        lamports: t.lamports,
                        space: t.space,
                        programId: vn(t.programId.toBuffer())
                    });
                    return new $n({
                        keys: [{
                            pubkey: t.fromPubkey,
                            isSigner: !0,
                            isWritable: !0
                        }, {
                            pubkey: t.newAccountPubkey,
                            isSigner: !0,
                            isWritable: !0
                        }],
                        programId: this.programId,
                        data: e
                    })
                }
                static transfer(t) {
                    let e, n;
                    return "basePubkey"in t ? (e = rr(ar.TransferWithSeed, {
                        lamports: BigInt(t.lamports),
                        seed: t.seed,
                        programId: vn(t.programId.toBuffer())
                    }),
                    n = [{
                        pubkey: t.fromPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: t.basePubkey,
                        isSigner: !0,
                        isWritable: !1
                    }, {
                        pubkey: t.toPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }]) : (e = rr(ar.Transfer, {
                        lamports: BigInt(t.lamports)
                    }),
                    n = [{
                        pubkey: t.fromPubkey,
                        isSigner: !0,
                        isWritable: !0
                    }, {
                        pubkey: t.toPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }]),
                    new $n({
                        keys: n,
                        programId: this.programId,
                        data: e
                    })
                }
                static assign(t) {
                    let e, n;
                    return "basePubkey"in t ? (e = rr(ar.AssignWithSeed, {
                        base: vn(t.basePubkey.toBuffer()),
                        seed: t.seed,
                        programId: vn(t.programId.toBuffer())
                    }),
                    n = [{
                        pubkey: t.accountPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: t.basePubkey,
                        isSigner: !0,
                        isWritable: !1
                    }]) : (e = rr(ar.Assign, {
                        programId: vn(t.programId.toBuffer())
                    }),
                    n = [{
                        pubkey: t.accountPubkey,
                        isSigner: !0,
                        isWritable: !0
                    }]),
                    new $n({
                        keys: n,
                        programId: this.programId,
                        data: e
                    })
                }
                static createAccountWithSeed(t) {
                    const e = rr(ar.CreateWithSeed, {
                        base: vn(t.basePubkey.toBuffer()),
                        seed: t.seed,
                        lamports: t.lamports,
                        space: t.space,
                        programId: vn(t.programId.toBuffer())
                    });
                    let n = [{
                        pubkey: t.fromPubkey,
                        isSigner: !0,
                        isWritable: !0
                    }, {
                        pubkey: t.newAccountPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }];
                    return t.basePubkey != t.fromPubkey && n.push({
                        pubkey: t.basePubkey,
                        isSigner: !0,
                        isWritable: !1
                    }),
                    new $n({
                        keys: n,
                        programId: this.programId,
                        data: e
                    })
                }
                static createNonceAccount(t) {
                    const e = new Vn;
                    "basePubkey"in t && "seed"in t ? e.add(ur.createAccountWithSeed({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.noncePubkey,
                        basePubkey: t.basePubkey,
                        seed: t.seed,
                        lamports: t.lamports,
                        space: ir,
                        programId: this.programId
                    })) : e.add(ur.createAccount({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.noncePubkey,
                        lamports: t.lamports,
                        space: ir,
                        programId: this.programId
                    }));
                    const n = {
                        noncePubkey: t.noncePubkey,
                        authorizedPubkey: t.authorizedPubkey
                    };
                    return e.add(this.nonceInitialize(n)),
                    e
                }
                static nonceInitialize(t) {
                    const e = rr(ar.InitializeNonceAccount, {
                        authorized: vn(t.authorizedPubkey.toBuffer())
                    })
                      , n = {
                        keys: [{
                            pubkey: t.noncePubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Qn,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Xn,
                            isSigner: !1,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: e
                    };
                    return new $n(n)
                }
                static nonceAdvance(t) {
                    const e = rr(ar.AdvanceNonceAccount)
                      , n = {
                        keys: [{
                            pubkey: t.noncePubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Qn,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: t.authorizedPubkey,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: e
                    };
                    return new $n(n)
                }
                static nonceWithdraw(t) {
                    const e = rr(ar.WithdrawNonceAccount, {
                        lamports: t.lamports
                    });
                    return new $n({
                        keys: [{
                            pubkey: t.noncePubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: t.toPubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Qn,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Xn,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: t.authorizedPubkey,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: e
                    })
                }
                static nonceAuthorize(t) {
                    const e = rr(ar.AuthorizeNonceAccount, {
                        authorized: vn(t.newAuthorizedPubkey.toBuffer())
                    });
                    return new $n({
                        keys: [{
                            pubkey: t.noncePubkey,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: t.authorizedPubkey,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: e
                    })
                }
                static allocate(t) {
                    let e, n;
                    return "basePubkey"in t ? (e = rr(ar.AllocateWithSeed, {
                        base: vn(t.basePubkey.toBuffer()),
                        seed: t.seed,
                        space: t.space,
                        programId: vn(t.programId.toBuffer())
                    }),
                    n = [{
                        pubkey: t.accountPubkey,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: t.basePubkey,
                        isSigner: !0,
                        isWritable: !1
                    }]) : (e = rr(ar.Allocate, {
                        space: t.space
                    }),
                    n = [{
                        pubkey: t.accountPubkey,
                        isSigner: !0,
                        isWritable: !0
                    }]),
                    new $n({
                        keys: n,
                        programId: this.programId,
                        data: e
                    })
                }
            }
            ur.programId = new _n("11111111111111111111111111111111");
            class cr {
                constructor() {}
                static getMinNumSignatures(t) {
                    return 2 * (Math.ceil(t / cr.chunkSize) + 1 + 1)
                }
                static async load(t, e, n, r, i) {
                    {
                        const o = await t.getMinimumBalanceForRentExemption(i.length)
                          , s = await t.getAccountInfo(n.publicKey, "confirmed");
                        let a = null;
                        if (null !== s) {
                            if (s.executable)
                                return pn.error("Program load failed, account is already executable"),
                                !1;
                            s.data.length !== i.length && (a = a || new Vn,
                            a.add(ur.allocate({
                                accountPubkey: n.publicKey,
                                space: i.length
                            }))),
                            s.owner.equals(r) || (a = a || new Vn,
                            a.add(ur.assign({
                                accountPubkey: n.publicKey,
                                programId: r
                            }))),
                            s.lamports < o && (a = a || new Vn,
                            a.add(ur.transfer({
                                fromPubkey: e.publicKey,
                                toPubkey: n.publicKey,
                                lamports: o - s.lamports
                            })))
                        } else
                            a = (new Vn).add(ur.createAccount({
                                fromPubkey: e.publicKey,
                                newAccountPubkey: n.publicKey,
                                lamports: o > 0 ? o : 1,
                                space: i.length,
                                programId: r
                            }));
                        null !== a && await er(t, a, [e, n], {
                            commitment: "confirmed"
                        })
                    }
                    const s = ue.n_([ue.Jq("instruction"), ue.Jq("offset"), ue.Jq("bytesLength"), ue.Jq("bytesLengthPadding"), ue.A9(ue.u8("byte"), ue.cv(ue.Jq(), -8), "bytes")])
                      , a = cr.chunkSize;
                    let u = 0
                      , c = i
                      , l = [];
                    for (; c.length > 0; ) {
                        const i = c.slice(0, a)
                          , f = o.Buffer.alloc(a + 16);
                        s.encode({
                            instruction: 0,
                            offset: u,
                            bytes: i,
                            bytesLength: 0,
                            bytesLengthPadding: 0
                        }, f);
                        const h = (new Vn).add({
                            keys: [{
                                pubkey: n.publicKey,
                                isSigner: !0,
                                isWritable: !0
                            }],
                            programId: r,
                            data: f
                        });
                        if (l.push(er(t, h, [e, n], {
                            commitment: "confirmed"
                        })),
                        t._rpcEndpoint.includes("solana.com")) {
                            const t = 4;
                            await nr(1e3 / t)
                        }
                        u += a,
                        c = c.slice(a)
                    }
                    await Promise.all(l);
                    {
                        const i = ue.n_([ue.Jq("instruction")])
                          , s = o.Buffer.alloc(i.span);
                        i.encode({
                            instruction: 1
                        }, s);
                        const a = (new Vn).add({
                            keys: [{
                                pubkey: n.publicKey,
                                isSigner: !0,
                                isWritable: !0
                            }, {
                                pubkey: Xn,
                                isSigner: !1,
                                isWritable: !1
                            }],
                            programId: r,
                            data: s
                        })
                          , u = "processed"
                          , c = await t.sendTransaction(a, [e, n], {
                            preflightCommitment: u
                        })
                          , {context: l, value: f} = await t.confirmTransaction({
                            signature: c,
                            lastValidBlockHeight: a.lastValidBlockHeight,
                            blockhash: a.recentBlockhash
                        }, u);
                        if (f.err)
                            throw new Error(`Transaction ${c} failed (${JSON.stringify(f)})`);
                        for (; ; ) {
                            try {
                                if (await t.getSlot({
                                    commitment: u
                                }) > l.slot)
                                    break
                            } catch {}
                            await new Promise((t=>setTimeout(t, Math.round(200))))
                        }
                    }
                    return !0
                }
            }
            cr.chunkSize = 932,
            new _n("BPFLoader2111111111111111111111111111111111"),
            Object.prototype.toString,
            Object.keys,
            Error,
            Error,
            globalThis.fetch,
            ue.n_([ue.Jq("typeIndex"), sr("deactivationSlot"), ue._O("lastExtendedSlot"), ue.u8("lastExtendedStartIndex"), ue.u8(), ue.A9(Bn(), ue.cv(ue.u8(), -1), "authority")]);
            const lr = Ne(je(_n), ke(), (t=>new _n(t)))
              , fr = Oe([ke(), Ie("base64")])
              , hr = Ne(je(o.Buffer), fr, (t=>o.Buffer.from(t[0], "base64")));
            function dr(t) {
                return Te([Le({
                    jsonrpc: Ie("2.0"),
                    id: ke(),
                    result: t
                }), Le({
                    jsonrpc: Ie("2.0"),
                    id: ke(),
                    error: Le({
                        code: Be(),
                        message: ke(),
                        data: _e(ve("any", (()=>!0)))
                    })
                })])
            }
            const pr = dr(Be());
            function yr(t) {
                return Ne(dr(t), pr, (e=>"error"in e ? e : {
                    ...e,
                    result: me(e.result, t)
                }))
            }
            function gr(t) {
                return yr(Le({
                    context: Le({
                        slot: Se()
                    }),
                    value: t
                }))
            }
            function mr(t) {
                return Le({
                    context: Le({
                        slot: Se()
                    }),
                    value: t
                })
            }
            const br = Le({
                foundation: Se(),
                foundationTerm: Se(),
                initial: Se(),
                taper: Se(),
                terminal: Se()
            })
              , wr = (yr(Me(Ae(Le({
                epoch: Se(),
                effectiveSlot: Se(),
                amount: Se(),
                postBalance: Se(),
                commission: _e(Ae(Se()))
            })))),
            Me(Le({
                slot: Se(),
                prioritizationFee: Se()
            })))
              , vr = Le({
                total: Se(),
                validator: Se(),
                foundation: Se(),
                epoch: Se()
            })
              , Mr = Le({
                epoch: Se(),
                slotIndex: Se(),
                slotsInEpoch: Se(),
                absoluteSlot: Se(),
                blockHeight: _e(Se()),
                transactionCount: _e(Se())
            })
              , xr = Le({
                slotsPerEpoch: Se(),
                leaderScheduleSlotOffset: Se(),
                warmup: xe(),
                firstNormalEpoch: Se(),
                firstNormalSlot: Se()
            })
              , jr = Ee(ke(), Me(Se()))
              , Ir = Ae(Te([Le({}), ke()]))
              , Ar = Le({
                err: Ir
            })
              , Sr = Ie("receivedSignature");
            Le({
                "solana-core": ke(),
                "feature-set": _e(Se())
            }),
            gr(Le({
                err: Ae(Te([Le({}), ke()])),
                logs: Ae(Me(ke())),
                accounts: _e(Ae(Me(Ae(Le({
                    executable: xe(),
                    owner: ke(),
                    lamports: Se(),
                    data: Me(ke()),
                    rentEpoch: _e(Se())
                }))))),
                unitsConsumed: _e(Se()),
                returnData: _e(Ae(Le({
                    programId: ke(),
                    data: Oe([ke(), Ie("base64")])
                })))
            })),
            gr(Le({
                byIdentity: Ee(ke(), Me(Se())),
                range: Le({
                    firstSlot: Se(),
                    lastSlot: Se()
                })
            })),
            yr(br),
            yr(vr),
            yr(wr),
            yr(Mr),
            yr(xr),
            yr(jr),
            yr(Se()),
            gr(Le({
                total: Se(),
                circulating: Se(),
                nonCirculating: Se(),
                nonCirculatingAccounts: Me(lr)
            }));
            const _r = Le({
                amount: ke(),
                uiAmount: Ae(Se()),
                decimals: Se(),
                uiAmountString: _e(ke())
            })
              , Er = (gr(Me(Le({
                address: lr,
                amount: ke(),
                uiAmount: Ae(Se()),
                decimals: Se(),
                uiAmountString: _e(ke())
            }))),
            gr(Me(Le({
                pubkey: lr,
                account: Le({
                    executable: xe(),
                    owner: lr,
                    lamports: Se(),
                    data: hr,
                    rentEpoch: Se()
                })
            }))),
            Le({
                program: ke(),
                parsed: Be(),
                space: Se()
            }))
              , kr = (gr(Me(Le({
                pubkey: lr,
                account: Le({
                    executable: xe(),
                    owner: lr,
                    lamports: Se(),
                    data: Er,
                    rentEpoch: Se()
                })
            }))),
            gr(Me(Le({
                lamports: Se(),
                address: lr
            }))),
            Le({
                executable: xe(),
                owner: lr,
                lamports: Se(),
                data: hr,
                rentEpoch: Se()
            }))
              , Or = (Le({
                pubkey: lr,
                account: kr
            }),
            Ne(Te([je(o.Buffer), Er]), Te([fr, Er]), (t=>Array.isArray(t) ? me(t, hr) : t)))
              , Lr = Le({
                executable: xe(),
                owner: lr,
                lamports: Se(),
                data: Or,
                rentEpoch: Se()
            })
              , Tr = (Le({
                pubkey: lr,
                account: Lr
            }),
            Le({
                state: Te([Ie("active"), Ie("inactive"), Ie("activating"), Ie("deactivating")]),
                active: Se(),
                inactive: Se()
            }),
            yr(Me(Le({
                signature: ke(),
                slot: Se(),
                err: Ir,
                memo: Ae(ke()),
                blockTime: _e(Ae(Se()))
            }))),
            yr(Me(Le({
                signature: ke(),
                slot: Se(),
                err: Ir,
                memo: Ae(ke()),
                blockTime: _e(Ae(Se()))
            }))),
            Le({
                subscription: Se(),
                result: mr(kr)
            }),
            Le({
                pubkey: lr,
                account: kr
            }))
              , Br = (Le({
                subscription: Se(),
                result: mr(Tr)
            }),
            Le({
                parent: Se(),
                slot: Se(),
                root: Se()
            }))
              , Nr = (Le({
                subscription: Se(),
                result: Br
            }),
            Te([Le({
                type: Te([Ie("firstShredReceived"), Ie("completed"), Ie("optimisticConfirmation"), Ie("root")]),
                slot: Se(),
                timestamp: Se()
            }), Le({
                type: Ie("createdBank"),
                parent: Se(),
                slot: Se(),
                timestamp: Se()
            }), Le({
                type: Ie("frozen"),
                slot: Se(),
                timestamp: Se(),
                stats: Le({
                    numTransactionEntries: Se(),
                    numSuccessfulTransactions: Se(),
                    numFailedTransactions: Se(),
                    maxTransactionsPerEntry: Se()
                })
            }), Le({
                type: Ie("dead"),
                slot: Se(),
                timestamp: Se(),
                err: ke()
            })]))
              , Pr = (Le({
                subscription: Se(),
                result: Nr
            }),
            Le({
                subscription: Se(),
                result: mr(Te([Ar, Sr]))
            }),
            Le({
                subscription: Se(),
                result: Se()
            }),
            Le({
                pubkey: ke(),
                gossip: Ae(ke()),
                tpu: Ae(ke()),
                rpc: Ae(ke()),
                version: Ae(ke())
            }),
            Le({
                votePubkey: ke(),
                nodePubkey: ke(),
                activatedStake: Se(),
                epochVoteAccount: xe(),
                epochCredits: Me(Oe([Se(), Se(), Se()])),
                commission: Se(),
                lastVote: Se(),
                rootSlot: Ae(Se())
            }))
              , zr = (yr(Le({
                current: Me(Pr),
                delinquent: Me(Pr)
            })),
            Te([Ie("processed"), Ie("confirmed"), Ie("finalized")]))
              , Ur = Le({
                slot: Se(),
                confirmations: Ae(Se()),
                err: Ir,
                confirmationStatus: _e(zr)
            })
              , Dr = (gr(Me(Ae(Ur))),
            yr(Se()),
            Le({
                accountKey: lr,
                writableIndexes: Me(Se()),
                readonlyIndexes: Me(Se())
            }))
              , Rr = Le({
                signatures: Me(ke()),
                message: Le({
                    accountKeys: Me(ke()),
                    header: Le({
                        numRequiredSignatures: Se(),
                        numReadonlySignedAccounts: Se(),
                        numReadonlyUnsignedAccounts: Se()
                    }),
                    instructions: Me(Le({
                        accounts: Me(Se()),
                        data: ke(),
                        programIdIndex: Se()
                    })),
                    recentBlockhash: ke(),
                    addressTableLookups: _e(Me(Dr))
                })
            })
              , Cr = Le({
                pubkey: lr,
                signer: xe(),
                writable: xe(),
                source: _e(Te([Ie("transaction"), Ie("lookupTable")]))
            })
              , Wr = Le({
                accountKeys: Me(Cr),
                signatures: Me(ke())
            })
              , qr = Le({
                parsed: Be(),
                program: ke(),
                programId: lr
            })
              , Fr = Le({
                accounts: Me(lr),
                data: ke(),
                programId: lr
            })
              , Kr = Ne(Te([Fr, qr]), Te([Le({
                parsed: Be(),
                program: ke(),
                programId: ke()
            }), Le({
                accounts: Me(ke()),
                data: ke(),
                programId: ke()
            })]), (t=>me(t, "accounts"in t ? Fr : qr)))
              , Hr = Le({
                signatures: Me(ke()),
                message: Le({
                    accountKeys: Me(Cr),
                    instructions: Me(Kr),
                    recentBlockhash: ke(),
                    addressTableLookups: _e(Ae(Me(Dr)))
                })
            })
              , Yr = Le({
                accountIndex: Se(),
                mint: ke(),
                owner: _e(ke()),
                uiTokenAmount: _r
            })
              , Gr = Le({
                writable: Me(lr),
                readonly: Me(lr)
            })
              , $r = Le({
                err: Ir,
                fee: Se(),
                innerInstructions: _e(Ae(Me(Le({
                    index: Se(),
                    instructions: Me(Le({
                        accounts: Me(Se()),
                        data: ke(),
                        programIdIndex: Se()
                    }))
                })))),
                preBalances: Me(Se()),
                postBalances: Me(Se()),
                logMessages: _e(Ae(Me(ke()))),
                preTokenBalances: _e(Ae(Me(Yr))),
                postTokenBalances: _e(Ae(Me(Yr))),
                loadedAddresses: _e(Gr),
                computeUnitsConsumed: _e(Se())
            })
              , Vr = Le({
                err: Ir,
                fee: Se(),
                innerInstructions: _e(Ae(Me(Le({
                    index: Se(),
                    instructions: Me(Kr)
                })))),
                preBalances: Me(Se()),
                postBalances: Me(Se()),
                logMessages: _e(Ae(Me(ke()))),
                preTokenBalances: _e(Ae(Me(Yr))),
                postTokenBalances: _e(Ae(Me(Yr))),
                loadedAddresses: _e(Gr),
                computeUnitsConsumed: _e(Se())
            })
              , Zr = Te([Ie(0), Ie("legacy")])
              , Jr = Le({
                pubkey: ke(),
                lamports: Se(),
                postBalance: Ae(Se()),
                rewardType: Ae(ke()),
                commission: _e(Ae(Se()))
            })
              , Qr = (yr(Ae(Le({
                blockhash: ke(),
                previousBlockhash: ke(),
                parentSlot: Se(),
                transactions: Me(Le({
                    transaction: Rr,
                    meta: Ae($r),
                    version: _e(Zr)
                })),
                rewards: _e(Me(Jr)),
                blockTime: Ae(Se()),
                blockHeight: Ae(Se())
            }))),
            yr(Ae(Le({
                blockhash: ke(),
                previousBlockhash: ke(),
                parentSlot: Se(),
                rewards: _e(Me(Jr)),
                blockTime: Ae(Se()),
                blockHeight: Ae(Se())
            }))),
            yr(Ae(Le({
                blockhash: ke(),
                previousBlockhash: ke(),
                parentSlot: Se(),
                transactions: Me(Le({
                    transaction: Wr,
                    meta: Ae($r),
                    version: _e(Zr)
                })),
                rewards: _e(Me(Jr)),
                blockTime: Ae(Se()),
                blockHeight: Ae(Se())
            }))),
            yr(Ae(Le({
                blockhash: ke(),
                previousBlockhash: ke(),
                parentSlot: Se(),
                transactions: Me(Le({
                    transaction: Hr,
                    meta: Ae(Vr),
                    version: _e(Zr)
                })),
                rewards: _e(Me(Jr)),
                blockTime: Ae(Se()),
                blockHeight: Ae(Se())
            }))),
            yr(Ae(Le({
                blockhash: ke(),
                previousBlockhash: ke(),
                parentSlot: Se(),
                transactions: Me(Le({
                    transaction: Wr,
                    meta: Ae(Vr),
                    version: _e(Zr)
                })),
                rewards: _e(Me(Jr)),
                blockTime: Ae(Se()),
                blockHeight: Ae(Se())
            }))),
            yr(Ae(Le({
                blockhash: ke(),
                previousBlockhash: ke(),
                parentSlot: Se(),
                rewards: _e(Me(Jr)),
                blockTime: Ae(Se()),
                blockHeight: Ae(Se())
            }))),
            yr(Ae(Le({
                blockhash: ke(),
                previousBlockhash: ke(),
                parentSlot: Se(),
                transactions: Me(Le({
                    transaction: Rr,
                    meta: Ae($r)
                })),
                rewards: _e(Me(Jr)),
                blockTime: Ae(Se())
            }))),
            yr(Ae(Le({
                blockhash: ke(),
                previousBlockhash: ke(),
                parentSlot: Se(),
                signatures: Me(ke()),
                blockTime: Ae(Se())
            }))),
            yr(Ae(Le({
                slot: Se(),
                meta: Ae($r),
                blockTime: _e(Ae(Se())),
                transaction: Rr,
                version: _e(Zr)
            }))),
            yr(Ae(Le({
                slot: Se(),
                transaction: Hr,
                meta: Ae(Vr),
                blockTime: _e(Ae(Se())),
                version: _e(Zr)
            }))),
            gr(Le({
                blockhash: ke(),
                feeCalculator: Le({
                    lamportsPerSignature: Se()
                })
            })),
            gr(Le({
                blockhash: ke(),
                lastValidBlockHeight: Se()
            })),
            gr(xe()),
            yr(Me(Le({
                slot: Se(),
                numTransactions: Se(),
                numSlots: Se(),
                samplePeriodSecs: Se()
            }))),
            gr(Ae(Le({
                feeCalculator: Le({
                    lamportsPerSignature: Se()
                })
            }))),
            yr(ke()),
            yr(ke()),
            Le({
                err: Ir,
                logs: Me(ke()),
                signature: ke()
            }));
            Le({
                result: mr(Qr),
                subscription: Se()
            });
            class Xr {
                constructor(t) {
                    this._keypair = void 0,
                    this._keypair = t ?? yn()
                }
                static generate() {
                    return new Xr(yn())
                }
                static fromSecretKey(t, e) {
                    if (64 !== t.byteLength)
                        throw new Error("bad secret key size");
                    const n = t.slice(32, 64);
                    if (!e || !e.skipValidation) {
                        const e = t.slice(0, 32)
                          , r = gn(e);
                        for (let t = 0; t < 32; t++)
                            if (n[t] !== r[t])
                                throw new Error("provided secretKey is invalid")
                    }
                    return new Xr({
                        publicKey: n,
                        secretKey: t
                    })
                }
                static fromSeed(t) {
                    const e = gn(t)
                      , n = new Uint8Array(64);
                    return n.set(t),
                    n.set(e, 32),
                    new Xr({
                        publicKey: e,
                        secretKey: n
                    })
                }
                get publicKey() {
                    return new _n(this._keypair.publicKey)
                }
                get secretKey() {
                    return new Uint8Array(this._keypair.secretKey)
                }
            }
            Object.freeze({
                CreateLookupTable: {
                    index: 0,
                    layout: ue.n_([ue.Jq("instruction"), sr("recentSlot"), ue.u8("bumpSeed")])
                },
                FreezeLookupTable: {
                    index: 1,
                    layout: ue.n_([ue.Jq("instruction")])
                },
                ExtendLookupTable: {
                    index: 2,
                    layout: ue.n_([ue.Jq("instruction"), sr(), ue.A9(Bn(), ue.cv(ue.Jq(), -8), "addresses")])
                },
                DeactivateLookupTable: {
                    index: 3,
                    layout: ue.n_([ue.Jq("instruction")])
                },
                CloseLookupTable: {
                    index: 4,
                    layout: ue.n_([ue.Jq("instruction")])
                }
            });
            new _n("AddressLookupTab1e1111111111111111111111111");
            Object.freeze({
                RequestUnits: {
                    index: 0,
                    layout: ue.n_([ue.u8("instruction"), ue.Jq("units"), ue.Jq("additionalFee")])
                },
                RequestHeapFrame: {
                    index: 1,
                    layout: ue.n_([ue.u8("instruction"), ue.Jq("bytes")])
                },
                SetComputeUnitLimit: {
                    index: 2,
                    layout: ue.n_([ue.u8("instruction"), ue.Jq("units")])
                },
                SetComputeUnitPrice: {
                    index: 3,
                    layout: ue.n_([ue.u8("instruction"), sr("microLamports")])
                }
            });
            new _n("ComputeBudget111111111111111111111111111111");
            const to = ue.n_([ue.u8("numSignatures"), ue.u8("padding"), ue.KB("signatureOffset"), ue.KB("signatureInstructionIndex"), ue.KB("publicKeyOffset"), ue.KB("publicKeyInstructionIndex"), ue.KB("messageDataOffset"), ue.KB("messageDataSize"), ue.KB("messageInstructionIndex")]);
            class eo {
                constructor() {}
                static createInstructionWithPublicKey(t) {
                    const {publicKey: e, message: n, signature: r, instructionIndex: i} = t;
                    Rn(32 === e.length, `Public Key must be 32 bytes but received ${e.length} bytes`),
                    Rn(64 === r.length, `Signature must be 64 bytes but received ${r.length} bytes`);
                    const s = to.span
                      , a = s + e.length
                      , u = a + r.length
                      , c = o.Buffer.alloc(u + n.length)
                      , l = null == i ? 65535 : i;
                    return to.encode({
                        numSignatures: 1,
                        padding: 0,
                        signatureOffset: a,
                        signatureInstructionIndex: l,
                        publicKeyOffset: s,
                        publicKeyInstructionIndex: l,
                        messageDataOffset: u,
                        messageDataSize: n.length,
                        messageInstructionIndex: l
                    }, c),
                    c.fill(e, s),
                    c.fill(r, a),
                    c.fill(n, u),
                    new $n({
                        keys: [],
                        programId: eo.programId,
                        data: c
                    })
                }
                static createInstructionWithPrivateKey(t) {
                    const {privateKey: e, message: n, instructionIndex: r} = t;
                    Rn(64 === e.length, `Private key must be 64 bytes but received ${e.length} bytes`);
                    try {
                        const t = Xr.fromSecretKey(e)
                          , o = t.publicKey.toBytes()
                          , i = bn(n, t.secretKey);
                        return this.createInstructionWithPublicKey({
                            publicKey: o,
                            message: n,
                            signature: i,
                            instructionIndex: r
                        })
                    } catch (t) {
                        throw new Error(`Error creating instruction; ${t}`)
                    }
                }
            }
            eo.programId = new _n("Ed25519SigVerify111111111111111111111111111"),
            dn.utils.isValidPrivateKey;
            const no = dn.getPublicKey
              , ro = ue.n_([ue.u8("numSignatures"), ue.KB("signatureOffset"), ue.u8("signatureInstructionIndex"), ue.KB("ethAddressOffset"), ue.u8("ethAddressInstructionIndex"), ue.KB("messageDataOffset"), ue.KB("messageDataSize"), ue.u8("messageInstructionIndex"), ue.Ik(20, "ethAddress"), ue.Ik(64, "signature"), ue.u8("recoveryId")]);
            class oo {
                constructor() {}
                static publicKeyToEthAddress(t) {
                    Rn(64 === t.length, `Public key must be 64 bytes but received ${t.length} bytes`);
                    try {
                        return o.Buffer.from(Ve(vn(t))).slice(-20)
                    } catch (t) {
                        throw new Error(`Error constructing Ethereum address: ${t}`)
                    }
                }
                static createInstructionWithPublicKey(t) {
                    const {publicKey: e, message: n, signature: r, recoveryId: o, instructionIndex: i} = t;
                    return oo.createInstructionWithEthAddress({
                        ethAddress: oo.publicKeyToEthAddress(e),
                        message: n,
                        signature: r,
                        recoveryId: o,
                        instructionIndex: i
                    })
                }
                static createInstructionWithEthAddress(t) {
                    const {ethAddress: e, message: n, signature: r, recoveryId: i, instructionIndex: s=0} = t;
                    let a;
                    a = "string" == typeof e ? e.startsWith("0x") ? o.Buffer.from(e.substr(2), "hex") : o.Buffer.from(e, "hex") : e,
                    Rn(20 === a.length, `Address must be 20 bytes but received ${a.length} bytes`);
                    const u = 12 + a.length
                      , c = u + r.length + 1
                      , l = o.Buffer.alloc(ro.span + n.length);
                    return ro.encode({
                        numSignatures: 1,
                        signatureOffset: u,
                        signatureInstructionIndex: s,
                        ethAddressOffset: 12,
                        ethAddressInstructionIndex: s,
                        messageDataOffset: c,
                        messageDataSize: n.length,
                        messageInstructionIndex: s,
                        signature: vn(r),
                        ethAddress: vn(a),
                        recoveryId: i
                    }, l),
                    l.fill(vn(n), ro.span),
                    new $n({
                        keys: [],
                        programId: oo.programId,
                        data: l
                    })
                }
                static createInstructionWithPrivateKey(t) {
                    const {privateKey: e, message: n, instructionIndex: r} = t;
                    Rn(32 === e.length, `Private key must be 32 bytes but received ${e.length} bytes`);
                    try {
                        const t = vn(e)
                          , i = no(t, !1).slice(1)
                          , s = o.Buffer.from(Ve(vn(n)))
                          , [a,u] = ((t,e)=>{
                            const n = dn.sign(t, e);
                            return [n.toCompactRawBytes(), n.recovery]
                        }
                        )(s, t);
                        return this.createInstructionWithPublicKey({
                            publicKey: i,
                            message: n,
                            signature: a,
                            recoveryId: u,
                            instructionIndex: r
                        })
                    } catch (t) {
                        throw new Error(`Error creating instruction; ${t}`)
                    }
                }
            }
            var io;
            oo.programId = new _n("KeccakSecp256k11111111111111111111111111111");
            const so = new _n("StakeConfig11111111111111111111111111111111");
            class ao {
                constructor(t, e, n) {
                    this.unixTimestamp = void 0,
                    this.epoch = void 0,
                    this.custodian = void 0,
                    this.unixTimestamp = t,
                    this.epoch = e,
                    this.custodian = n
                }
            }
            io = ao,
            ao.default = new io(0,0,_n.default);
            const uo = Object.freeze({
                Initialize: {
                    index: 0,
                    layout: ue.n_([ue.Jq("instruction"), ((t="authorized")=>ue.n_([Bn("staker"), Bn("withdrawer")], t))(), ((t="lockup")=>ue.n_([ue.gM("unixTimestamp"), ue.gM("epoch"), Bn("custodian")], t))()])
                },
                Authorize: {
                    index: 1,
                    layout: ue.n_([ue.Jq("instruction"), Bn("newAuthorized"), ue.Jq("stakeAuthorizationType")])
                },
                Delegate: {
                    index: 2,
                    layout: ue.n_([ue.Jq("instruction")])
                },
                Split: {
                    index: 3,
                    layout: ue.n_([ue.Jq("instruction"), ue.gM("lamports")])
                },
                Withdraw: {
                    index: 4,
                    layout: ue.n_([ue.Jq("instruction"), ue.gM("lamports")])
                },
                Deactivate: {
                    index: 5,
                    layout: ue.n_([ue.Jq("instruction")])
                },
                Merge: {
                    index: 7,
                    layout: ue.n_([ue.Jq("instruction")])
                },
                AuthorizeWithSeed: {
                    index: 8,
                    layout: ue.n_([ue.Jq("instruction"), Bn("newAuthorized"), ue.Jq("stakeAuthorizationType"), Pn("authoritySeed"), Bn("authorityOwner")])
                }
            });
            Object.freeze({
                Staker: {
                    index: 0
                },
                Withdrawer: {
                    index: 1
                }
            });
            class co {
                constructor() {}
                static initialize(t) {
                    const {stakePubkey: e, authorized: n, lockup: r} = t
                      , o = r || ao.default
                      , i = rr(uo.Initialize, {
                        authorized: {
                            staker: vn(n.staker.toBuffer()),
                            withdrawer: vn(n.withdrawer.toBuffer())
                        },
                        lockup: {
                            unixTimestamp: o.unixTimestamp,
                            epoch: o.epoch,
                            custodian: vn(o.custodian.toBuffer())
                        }
                    })
                      , s = {
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Xn,
                            isSigner: !1,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: i
                    };
                    return new $n(s)
                }
                static createAccountWithSeed(t) {
                    const e = new Vn;
                    e.add(ur.createAccountWithSeed({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.stakePubkey,
                        basePubkey: t.basePubkey,
                        seed: t.seed,
                        lamports: t.lamports,
                        space: this.space,
                        programId: this.programId
                    }));
                    const {stakePubkey: n, authorized: r, lockup: o} = t;
                    return e.add(this.initialize({
                        stakePubkey: n,
                        authorized: r,
                        lockup: o
                    }))
                }
                static createAccount(t) {
                    const e = new Vn;
                    e.add(ur.createAccount({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.stakePubkey,
                        lamports: t.lamports,
                        space: this.space,
                        programId: this.programId
                    }));
                    const {stakePubkey: n, authorized: r, lockup: o} = t;
                    return e.add(this.initialize({
                        stakePubkey: n,
                        authorized: r,
                        lockup: o
                    }))
                }
                static delegate(t) {
                    const {stakePubkey: e, authorizedPubkey: n, votePubkey: r} = t
                      , o = rr(uo.Delegate);
                    return (new Vn).add({
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: r,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Jn,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: tr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: so,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: o
                    })
                }
                static authorize(t) {
                    const {stakePubkey: e, authorizedPubkey: n, newAuthorizedPubkey: r, stakeAuthorizationType: o, custodianPubkey: i} = t
                      , s = rr(uo.Authorize, {
                        newAuthorized: vn(r.toBuffer()),
                        stakeAuthorizationType: o.index
                    })
                      , a = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: Jn,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return i && a.push({
                        pubkey: i,
                        isSigner: !0,
                        isWritable: !1
                    }),
                    (new Vn).add({
                        keys: a,
                        programId: this.programId,
                        data: s
                    })
                }
                static authorizeWithSeed(t) {
                    const {stakePubkey: e, authorityBase: n, authoritySeed: r, authorityOwner: o, newAuthorizedPubkey: i, stakeAuthorizationType: s, custodianPubkey: a} = t
                      , u = rr(uo.AuthorizeWithSeed, {
                        newAuthorized: vn(i.toBuffer()),
                        stakeAuthorizationType: s.index,
                        authoritySeed: r,
                        authorityOwner: vn(o.toBuffer())
                    })
                      , c = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }, {
                        pubkey: Jn,
                        isSigner: !1,
                        isWritable: !1
                    }];
                    return a && c.push({
                        pubkey: a,
                        isSigner: !0,
                        isWritable: !1
                    }),
                    (new Vn).add({
                        keys: c,
                        programId: this.programId,
                        data: u
                    })
                }
                static splitInstruction(t) {
                    const {stakePubkey: e, authorizedPubkey: n, splitStakePubkey: r, lamports: o} = t
                      , i = rr(uo.Split, {
                        lamports: o
                    });
                    return new $n({
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: r,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: i
                    })
                }
                static split(t, e) {
                    const n = new Vn;
                    return n.add(ur.createAccount({
                        fromPubkey: t.authorizedPubkey,
                        newAccountPubkey: t.splitStakePubkey,
                        lamports: e,
                        space: this.space,
                        programId: this.programId
                    })),
                    n.add(this.splitInstruction(t))
                }
                static splitWithSeed(t, e) {
                    const {stakePubkey: n, authorizedPubkey: r, splitStakePubkey: o, basePubkey: i, seed: s, lamports: a} = t
                      , u = new Vn;
                    return u.add(ur.allocate({
                        accountPubkey: o,
                        basePubkey: i,
                        seed: s,
                        space: this.space,
                        programId: this.programId
                    })),
                    e && e > 0 && u.add(ur.transfer({
                        fromPubkey: t.authorizedPubkey,
                        toPubkey: o,
                        lamports: e
                    })),
                    u.add(this.splitInstruction({
                        stakePubkey: n,
                        authorizedPubkey: r,
                        splitStakePubkey: o,
                        lamports: a
                    }))
                }
                static merge(t) {
                    const {stakePubkey: e, sourceStakePubKey: n, authorizedPubkey: r} = t
                      , o = rr(uo.Merge);
                    return (new Vn).add({
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: n,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Jn,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: tr,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: r,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: o
                    })
                }
                static withdraw(t) {
                    const {stakePubkey: e, authorizedPubkey: n, toPubkey: r, lamports: o, custodianPubkey: i} = t
                      , s = rr(uo.Withdraw, {
                        lamports: o
                    })
                      , a = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: r,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: Jn,
                        isSigner: !1,
                        isWritable: !1
                    }, {
                        pubkey: tr,
                        isSigner: !1,
                        isWritable: !1
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return i && a.push({
                        pubkey: i,
                        isSigner: !0,
                        isWritable: !1
                    }),
                    (new Vn).add({
                        keys: a,
                        programId: this.programId,
                        data: s
                    })
                }
                static deactivate(t) {
                    const {stakePubkey: e, authorizedPubkey: n} = t
                      , r = rr(uo.Deactivate);
                    return (new Vn).add({
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Jn,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: r
                    })
                }
            }
            co.programId = new _n("Stake11111111111111111111111111111111111111"),
            co.space = 200;
            const lo = Object.freeze({
                InitializeAccount: {
                    index: 0,
                    layout: ue.n_([ue.Jq("instruction"), ((t="voteInit")=>ue.n_([Bn("nodePubkey"), Bn("authorizedVoter"), Bn("authorizedWithdrawer"), ue.u8("commission")], t))()])
                },
                Authorize: {
                    index: 1,
                    layout: ue.n_([ue.Jq("instruction"), Bn("newAuthorized"), ue.Jq("voteAuthorizationType")])
                },
                Withdraw: {
                    index: 3,
                    layout: ue.n_([ue.Jq("instruction"), ue.gM("lamports")])
                },
                UpdateValidatorIdentity: {
                    index: 4,
                    layout: ue.n_([ue.Jq("instruction")])
                },
                AuthorizeWithSeed: {
                    index: 10,
                    layout: ue.n_([ue.Jq("instruction"), ((t="voteAuthorizeWithSeedArgs")=>ue.n_([ue.Jq("voteAuthorizationType"), Bn("currentAuthorityDerivedKeyOwnerPubkey"), Pn("currentAuthorityDerivedKeySeed"), Bn("newAuthorized")], t))()])
                }
            });
            Object.freeze({
                Voter: {
                    index: 0
                },
                Withdrawer: {
                    index: 1
                }
            });
            class fo {
                constructor() {}
                static initializeAccount(t) {
                    const {votePubkey: e, nodePubkey: n, voteInit: r} = t
                      , o = rr(lo.InitializeAccount, {
                        voteInit: {
                            nodePubkey: vn(r.nodePubkey.toBuffer()),
                            authorizedVoter: vn(r.authorizedVoter.toBuffer()),
                            authorizedWithdrawer: vn(r.authorizedWithdrawer.toBuffer()),
                            commission: r.commission
                        }
                    })
                      , i = {
                        keys: [{
                            pubkey: e,
                            isSigner: !1,
                            isWritable: !0
                        }, {
                            pubkey: Xn,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: Jn,
                            isSigner: !1,
                            isWritable: !1
                        }, {
                            pubkey: n,
                            isSigner: !0,
                            isWritable: !1
                        }],
                        programId: this.programId,
                        data: o
                    };
                    return new $n(i)
                }
                static createAccount(t) {
                    const e = new Vn;
                    return e.add(ur.createAccount({
                        fromPubkey: t.fromPubkey,
                        newAccountPubkey: t.votePubkey,
                        lamports: t.lamports,
                        space: this.space,
                        programId: this.programId
                    })),
                    e.add(this.initializeAccount({
                        votePubkey: t.votePubkey,
                        nodePubkey: t.voteInit.nodePubkey,
                        voteInit: t.voteInit
                    }))
                }
                static authorize(t) {
                    const {votePubkey: e, authorizedPubkey: n, newAuthorizedPubkey: r, voteAuthorizationType: o} = t
                      , i = rr(lo.Authorize, {
                        newAuthorized: vn(r.toBuffer()),
                        voteAuthorizationType: o.index
                    })
                      , s = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: Jn,
                        isSigner: !1,
                        isWritable: !1
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return (new Vn).add({
                        keys: s,
                        programId: this.programId,
                        data: i
                    })
                }
                static authorizeWithSeed(t) {
                    const {currentAuthorityDerivedKeyBasePubkey: e, currentAuthorityDerivedKeyOwnerPubkey: n, currentAuthorityDerivedKeySeed: r, newAuthorizedPubkey: o, voteAuthorizationType: i, votePubkey: s} = t
                      , a = rr(lo.AuthorizeWithSeed, {
                        voteAuthorizeWithSeedArgs: {
                            currentAuthorityDerivedKeyOwnerPubkey: vn(n.toBuffer()),
                            currentAuthorityDerivedKeySeed: r,
                            newAuthorized: vn(o.toBuffer()),
                            voteAuthorizationType: i.index
                        }
                    })
                      , u = [{
                        pubkey: s,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: Jn,
                        isSigner: !1,
                        isWritable: !1
                    }, {
                        pubkey: e,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return (new Vn).add({
                        keys: u,
                        programId: this.programId,
                        data: a
                    })
                }
                static withdraw(t) {
                    const {votePubkey: e, authorizedWithdrawerPubkey: n, lamports: r, toPubkey: o} = t
                      , i = rr(lo.Withdraw, {
                        lamports: r
                    })
                      , s = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: o,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return (new Vn).add({
                        keys: s,
                        programId: this.programId,
                        data: i
                    })
                }
                static safeWithdraw(t, e, n) {
                    if (t.lamports > e - n)
                        throw new Error("Withdraw will leave vote account with insufficient funds.");
                    return fo.withdraw(t)
                }
                static updateValidatorIdentity(t) {
                    const {votePubkey: e, authorizedWithdrawerPubkey: n, nodePubkey: r} = t
                      , o = rr(lo.UpdateValidatorIdentity)
                      , i = [{
                        pubkey: e,
                        isSigner: !1,
                        isWritable: !0
                    }, {
                        pubkey: r,
                        isSigner: !0,
                        isWritable: !1
                    }, {
                        pubkey: n,
                        isSigner: !0,
                        isWritable: !1
                    }];
                    return (new Vn).add({
                        keys: i,
                        programId: this.programId,
                        data: o
                    })
                }
            }
            fo.programId = new _n("Vote111111111111111111111111111111111111111"),
            fo.space = 3762,
            new _n("Va1idator1nfo111111111111111111111111111111"),
            Le({
                name: ke(),
                website: _e(ke()),
                details: _e(ke()),
                keybaseUsername: _e(ke())
            }),
            new _n("Vote111111111111111111111111111111111111111"),
            ue.n_([Bn("nodePubkey"), Bn("authorizedWithdrawer"), ue.u8("commission"), ue._O(), ue.A9(ue.n_([ue._O("slot"), ue.Jq("confirmationCount")]), ue.cv(ue.Jq(), -8), "votes"), ue.u8("rootSlotValid"), ue._O("rootSlot"), ue._O(), ue.A9(ue.n_([ue._O("epoch"), Bn("authorizedVoter")]), ue.cv(ue.Jq(), -8), "authorizedVoters"), ue.n_([ue.A9(ue.n_([Bn("authorizedPubkey"), ue._O("epochOfLastAuthorizedSwitch"), ue._O("targetEpoch")]), 32, "buf"), ue._O("idx"), ue.u8("isEmpty")], "priorVoters"), ue._O(), ue.A9(ue.n_([ue._O("epoch"), ue._O("credits"), ue._O("prevCredits")]), ue.cv(ue.Jq(), -8), "epochCredits"), ue.n_([ue._O("slot"), ue._O("timestamp")], "lastTimestamp")])
        }
        ,
        "../../../node_modules/@solflare-wallet/sdk/node_modules/base-x/src/index.js": t=>{
            "use strict";
            t.exports = function(t) {
                if (t.length >= 255)
                    throw new TypeError("Alphabet too long");
                for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
                    e[n] = 255;
                for (var r = 0; r < t.length; r++) {
                    var o = t.charAt(r)
                      , i = o.charCodeAt(0);
                    if (255 !== e[i])
                        throw new TypeError(o + " is ambiguous");
                    e[i] = r
                }
                var s = t.length
                  , a = t.charAt(0)
                  , u = Math.log(s) / Math.log(256)
                  , c = Math.log(256) / Math.log(s);
                function l(t) {
                    if ("string" != typeof t)
                        throw new TypeError("Expected String");
                    if (0 === t.length)
                        return new Uint8Array;
                    for (var n = 0, r = 0, o = 0; t[n] === a; )
                        r++,
                        n++;
                    for (var i = (t.length - n) * u + 1 >>> 0, c = new Uint8Array(i); t[n]; ) {
                        var l = e[t.charCodeAt(n)];
                        if (255 === l)
                            return;
                        for (var f = 0, h = i - 1; (0 !== l || f < o) && -1 !== h; h--,
                        f++)
                            l += s * c[h] >>> 0,
                            c[h] = l % 256 >>> 0,
                            l = l / 256 >>> 0;
                        if (0 !== l)
                            throw new Error("Non-zero carry");
                        o = f,
                        n++
                    }
                    for (var d = i - o; d !== i && 0 === c[d]; )
                        d++;
                    for (var p = new Uint8Array(r + (i - d)), y = r; d !== i; )
                        p[y++] = c[d++];
                    return p
                }
                return {
                    encode: function(e) {
                        if (e instanceof Uint8Array || (ArrayBuffer.isView(e) ? e = new Uint8Array(e.buffer,e.byteOffset,e.byteLength) : Array.isArray(e) && (e = Uint8Array.from(e))),
                        !(e instanceof Uint8Array))
                            throw new TypeError("Expected Uint8Array");
                        if (0 === e.length)
                            return "";
                        for (var n = 0, r = 0, o = 0, i = e.length; o !== i && 0 === e[o]; )
                            o++,
                            n++;
                        for (var u = (i - o) * c + 1 >>> 0, l = new Uint8Array(u); o !== i; ) {
                            for (var f = e[o], h = 0, d = u - 1; (0 !== f || h < r) && -1 !== d; d--,
                            h++)
                                f += 256 * l[d] >>> 0,
                                l[d] = f % s >>> 0,
                                f = f / s >>> 0;
                            if (0 !== f)
                                throw new Error("Non-zero carry");
                            r = h,
                            o++
                        }
                        for (var p = u - r; p !== u && 0 === l[p]; )
                            p++;
                        for (var y = a.repeat(n); p < u; ++p)
                            y += t.charAt(l[p]);
                        return y
                    },
                    decodeUnsafe: l,
                    decode: function(t) {
                        var e = l(t);
                        if (e)
                            return e;
                        throw new Error("Non-base" + s + " character")
                    }
                }
            }
        }
        ,
        "../../../node_modules/@solflare-wallet/sdk/node_modules/bs58/index.js": (t,e,n)=>{
            const r = n("../../../node_modules/@solflare-wallet/sdk/node_modules/base-x/src/index.js");
            t.exports = r("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
        }
        ,
        "../../../node_modules/@solflare-wallet/sdk/node_modules/eventemitter3/index.js": t=>{
            "use strict";
            var e = Object.prototype.hasOwnProperty
              , n = "~";
            function r() {}
            function o(t, e, n) {
                this.fn = t,
                this.context = e,
                this.once = n || !1
            }
            function i(t, e, r, i, s) {
                if ("function" != typeof r)
                    throw new TypeError("The listener must be a function");
                var a = new o(r,i || t,s)
                  , u = n ? n + e : e;
                return t._events[u] ? t._events[u].fn ? t._events[u] = [t._events[u], a] : t._events[u].push(a) : (t._events[u] = a,
                t._eventsCount++),
                t
            }
            function s(t, e) {
                0 == --t._eventsCount ? t._events = new r : delete t._events[e]
            }
            function a() {
                this._events = new r,
                this._eventsCount = 0
            }
            Object.create && (r.prototype = Object.create(null),
            (new r).__proto__ || (n = !1)),
            a.prototype.eventNames = function() {
                var t, r, o = [];
                if (0 === this._eventsCount)
                    return o;
                for (r in t = this._events)
                    e.call(t, r) && o.push(n ? r.slice(1) : r);
                return Object.getOwnPropertySymbols ? o.concat(Object.getOwnPropertySymbols(t)) : o
            }
            ,
            a.prototype.listeners = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                if (!r)
                    return [];
                if (r.fn)
                    return [r.fn];
                for (var o = 0, i = r.length, s = new Array(i); o < i; o++)
                    s[o] = r[o].fn;
                return s
            }
            ,
            a.prototype.listenerCount = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                return r ? r.fn ? 1 : r.length : 0
            }
            ,
            a.prototype.emit = function(t, e, r, o, i, s) {
                var a = n ? n + t : t;
                if (!this._events[a])
                    return !1;
                var u, c, l = this._events[a], f = arguments.length;
                if (l.fn) {
                    switch (l.once && this.removeListener(t, l.fn, void 0, !0),
                    f) {
                    case 1:
                        return l.fn.call(l.context),
                        !0;
                    case 2:
                        return l.fn.call(l.context, e),
                        !0;
                    case 3:
                        return l.fn.call(l.context, e, r),
                        !0;
                    case 4:
                        return l.fn.call(l.context, e, r, o),
                        !0;
                    case 5:
                        return l.fn.call(l.context, e, r, o, i),
                        !0;
                    case 6:
                        return l.fn.call(l.context, e, r, o, i, s),
                        !0
                    }
                    for (c = 1,
                    u = new Array(f - 1); c < f; c++)
                        u[c - 1] = arguments[c];
                    l.fn.apply(l.context, u)
                } else {
                    var h, d = l.length;
                    for (c = 0; c < d; c++)
                        switch (l[c].once && this.removeListener(t, l[c].fn, void 0, !0),
                        f) {
                        case 1:
                            l[c].fn.call(l[c].context);
                            break;
                        case 2:
                            l[c].fn.call(l[c].context, e);
                            break;
                        case 3:
                            l[c].fn.call(l[c].context, e, r);
                            break;
                        case 4:
                            l[c].fn.call(l[c].context, e, r, o);
                            break;
                        default:
                            if (!u)
                                for (h = 1,
                                u = new Array(f - 1); h < f; h++)
                                    u[h - 1] = arguments[h];
                            l[c].fn.apply(l[c].context, u)
                        }
                }
                return !0
            }
            ,
            a.prototype.on = function(t, e, n) {
                return i(this, t, e, n, !1)
            }
            ,
            a.prototype.once = function(t, e, n) {
                return i(this, t, e, n, !0)
            }
            ,
            a.prototype.removeListener = function(t, e, r, o) {
                var i = n ? n + t : t;
                if (!this._events[i])
                    return this;
                if (!e)
                    return s(this, i),
                    this;
                var a = this._events[i];
                if (a.fn)
                    a.fn !== e || o && !a.once || r && a.context !== r || s(this, i);
                else {
                    for (var u = 0, c = [], l = a.length; u < l; u++)
                        (a[u].fn !== e || o && !a[u].once || r && a[u].context !== r) && c.push(a[u]);
                    c.length ? this._events[i] = 1 === c.length ? c[0] : c : s(this, i)
                }
                return this
            }
            ,
            a.prototype.removeAllListeners = function(t) {
                var e;
                return t ? (e = n ? n + t : t,
                this._events[e] && s(this, e)) : (this._events = new r,
                this._eventsCount = 0),
                this
            }
            ,
            a.prototype.off = a.prototype.removeListener,
            a.prototype.addListener = a.prototype.on,
            a.prefixed = n,
            a.EventEmitter = a,
            t.exports = a
        }
        ,
        "../../../node_modules/@solflare-wallet/wallet-adapter/node_modules/base-x/src/index.js": t=>{
            "use strict";
            t.exports = function(t) {
                if (t.length >= 255)
                    throw new TypeError("Alphabet too long");
                for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
                    e[n] = 255;
                for (var r = 0; r < t.length; r++) {
                    var o = t.charAt(r)
                      , i = o.charCodeAt(0);
                    if (255 !== e[i])
                        throw new TypeError(o + " is ambiguous");
                    e[i] = r
                }
                var s = t.length
                  , a = t.charAt(0)
                  , u = Math.log(s) / Math.log(256)
                  , c = Math.log(256) / Math.log(s);
                function l(t) {
                    if ("string" != typeof t)
                        throw new TypeError("Expected String");
                    if (0 === t.length)
                        return new Uint8Array;
                    for (var n = 0, r = 0, o = 0; t[n] === a; )
                        r++,
                        n++;
                    for (var i = (t.length - n) * u + 1 >>> 0, c = new Uint8Array(i); t[n]; ) {
                        var l = e[t.charCodeAt(n)];
                        if (255 === l)
                            return;
                        for (var f = 0, h = i - 1; (0 !== l || f < o) && -1 !== h; h--,
                        f++)
                            l += s * c[h] >>> 0,
                            c[h] = l % 256 >>> 0,
                            l = l / 256 >>> 0;
                        if (0 !== l)
                            throw new Error("Non-zero carry");
                        o = f,
                        n++
                    }
                    for (var d = i - o; d !== i && 0 === c[d]; )
                        d++;
                    for (var p = new Uint8Array(r + (i - d)), y = r; d !== i; )
                        p[y++] = c[d++];
                    return p
                }
                return {
                    encode: function(e) {
                        if (e instanceof Uint8Array || (ArrayBuffer.isView(e) ? e = new Uint8Array(e.buffer,e.byteOffset,e.byteLength) : Array.isArray(e) && (e = Uint8Array.from(e))),
                        !(e instanceof Uint8Array))
                            throw new TypeError("Expected Uint8Array");
                        if (0 === e.length)
                            return "";
                        for (var n = 0, r = 0, o = 0, i = e.length; o !== i && 0 === e[o]; )
                            o++,
                            n++;
                        for (var u = (i - o) * c + 1 >>> 0, l = new Uint8Array(u); o !== i; ) {
                            for (var f = e[o], h = 0, d = u - 1; (0 !== f || h < r) && -1 !== d; d--,
                            h++)
                                f += 256 * l[d] >>> 0,
                                l[d] = f % s >>> 0,
                                f = f / s >>> 0;
                            if (0 !== f)
                                throw new Error("Non-zero carry");
                            r = h,
                            o++
                        }
                        for (var p = u - r; p !== u && 0 === l[p]; )
                            p++;
                        for (var y = a.repeat(n); p < u; ++p)
                            y += t.charAt(l[p]);
                        return y
                    },
                    decodeUnsafe: l,
                    decode: function(t) {
                        var e = l(t);
                        if (e)
                            return e;
                        throw new Error("Non-base" + s + " character")
                    }
                }
            }
        }
        ,
        "../../../node_modules/@solflare-wallet/wallet-adapter/node_modules/bs58/index.js": (t,e,n)=>{
            const r = n("../../../node_modules/@solflare-wallet/wallet-adapter/node_modules/base-x/src/index.js");
            t.exports = r("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
        }
        ,
        "../../../node_modules/assert/build/assert.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/process/browser.js")
              , o = n("../../../node_modules/console-browserify/index.js");
            function i(t) {
                return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                i(t)
            }
            var s, a, u = n("../../../node_modules/assert/build/internal/errors.js").codes, c = u.ERR_AMBIGUOUS_ARGUMENT, l = u.ERR_INVALID_ARG_TYPE, f = u.ERR_INVALID_ARG_VALUE, h = u.ERR_INVALID_RETURN_VALUE, d = u.ERR_MISSING_ARGS, p = n("../../../node_modules/assert/build/internal/assert/assertion_error.js"), y = n("../../../node_modules/util/util.js").inspect, g = n("../../../node_modules/util/util.js").types, m = g.isPromise, b = g.isRegExp, w = Object.assign ? Object.assign : n("../../../node_modules/es6-object-assign/index.js").assign, v = Object.is ? Object.is : n("../../../node_modules/object-is/index.js");
            function M() {
                var t = n("../../../node_modules/assert/build/internal/util/comparisons.js");
                s = t.isDeepEqual,
                a = t.isDeepStrictEqual
            }
            new Map;
            var x = !1
              , j = t.exports = _
              , I = {};
            function A(t) {
                if (t.message instanceof Error)
                    throw t.message;
                throw new p(t)
            }
            function S(t, e, n, r) {
                if (!n) {
                    var o = !1;
                    if (0 === e)
                        o = !0,
                        r = "No value argument passed to `assert.ok()`";
                    else if (r instanceof Error)
                        throw r;
                    var i = new p({
                        actual: n,
                        expected: !0,
                        message: r,
                        operator: "==",
                        stackStartFn: t
                    });
                    throw i.generatedMessage = o,
                    i
                }
            }
            function _() {
                for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
                    e[n] = arguments[n];
                S.apply(void 0, [_, e.length].concat(e))
            }
            j.fail = function t(e, n, i, s, a) {
                var u, c = arguments.length;
                if (0 === c ? u = "Failed" : 1 === c ? (i = e,
                e = void 0) : (!1 === x && (x = !0,
                (r.emitWarning ? r.emitWarning : o.warn.bind(o))("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094")),
                2 === c && (s = "!=")),
                i instanceof Error)
                    throw i;
                var l = {
                    actual: e,
                    expected: n,
                    operator: void 0 === s ? "fail" : s,
                    stackStartFn: a || t
                };
                void 0 !== i && (l.message = i);
                var f = new p(l);
                throw u && (f.message = u,
                f.generatedMessage = !0),
                f
            }
            ,
            j.AssertionError = p,
            j.ok = _,
            j.equal = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                e != n && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "==",
                    stackStartFn: t
                })
            }
            ,
            j.notEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                e == n && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "!=",
                    stackStartFn: t
                })
            }
            ,
            j.deepEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                void 0 === s && M(),
                s(e, n) || A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "deepEqual",
                    stackStartFn: t
                })
            }
            ,
            j.notDeepEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                void 0 === s && M(),
                s(e, n) && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "notDeepEqual",
                    stackStartFn: t
                })
            }
            ,
            j.deepStrictEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                void 0 === s && M(),
                a(e, n) || A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "deepStrictEqual",
                    stackStartFn: t
                })
            }
            ,
            j.notDeepStrictEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                void 0 === s && M(),
                a(e, n) && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "notDeepStrictEqual",
                    stackStartFn: t
                })
            }
            ,
            j.strictEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                v(e, n) || A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "strictEqual",
                    stackStartFn: t
                })
            }
            ,
            j.notStrictEqual = function t(e, n, r) {
                if (arguments.length < 2)
                    throw new d("actual","expected");
                v(e, n) && A({
                    actual: e,
                    expected: n,
                    message: r,
                    operator: "notStrictEqual",
                    stackStartFn: t
                })
            }
            ;
            var E = function t(e, n, r) {
                var o = this;
                !function(t, e) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                n.forEach((function(t) {
                    t in e && (void 0 !== r && "string" == typeof r[t] && b(e[t]) && e[t].test(r[t]) ? o[t] = r[t] : o[t] = e[t])
                }
                ))
            };
            function k(t, e, n, r) {
                if ("function" != typeof e) {
                    if (b(e))
                        return e.test(t);
                    if (2 === arguments.length)
                        throw new l("expected",["Function", "RegExp"],e);
                    if ("object" !== i(t) || null === t) {
                        var o = new p({
                            actual: t,
                            expected: e,
                            message: n,
                            operator: "deepStrictEqual",
                            stackStartFn: r
                        });
                        throw o.operator = r.name,
                        o
                    }
                    var u = Object.keys(e);
                    if (e instanceof Error)
                        u.push("name", "message");
                    else if (0 === u.length)
                        throw new f("error",e,"may not be an empty object");
                    return void 0 === s && M(),
                    u.forEach((function(o) {
                        "string" == typeof t[o] && b(e[o]) && e[o].test(t[o]) || function(t, e, n, r, o, i) {
                            if (!(n in t) || !a(t[n], e[n])) {
                                if (!r) {
                                    var s = new E(t,o)
                                      , u = new E(e,o,t)
                                      , c = new p({
                                        actual: s,
                                        expected: u,
                                        operator: "deepStrictEqual",
                                        stackStartFn: i
                                    });
                                    throw c.actual = t,
                                    c.expected = e,
                                    c.operator = i.name,
                                    c
                                }
                                A({
                                    actual: t,
                                    expected: e,
                                    message: r,
                                    operator: i.name,
                                    stackStartFn: i
                                })
                            }
                        }(t, e, o, n, u, r)
                    }
                    )),
                    !0
                }
                return void 0 !== e.prototype && t instanceof e || !Error.isPrototypeOf(e) && !0 === e.call({}, t)
            }
            function O(t) {
                if ("function" != typeof t)
                    throw new l("fn","Function",t);
                try {
                    t()
                } catch (t) {
                    return t
                }
                return I
            }
            function L(t) {
                return m(t) || null !== t && "object" === i(t) && "function" == typeof t.then && "function" == typeof t.catch
            }
            function T(t) {
                return Promise.resolve().then((function() {
                    var e;
                    if ("function" == typeof t) {
                        if (!L(e = t()))
                            throw new h("instance of Promise","promiseFn",e)
                    } else {
                        if (!L(t))
                            throw new l("promiseFn",["Function", "Promise"],t);
                        e = t
                    }
                    return Promise.resolve().then((function() {
                        return e
                    }
                    )).then((function() {
                        return I
                    }
                    )).catch((function(t) {
                        return t
                    }
                    ))
                }
                ))
            }
            function B(t, e, n, r) {
                if ("string" == typeof n) {
                    if (4 === arguments.length)
                        throw new l("error",["Object", "Error", "Function", "RegExp"],n);
                    if ("object" === i(e) && null !== e) {
                        if (e.message === n)
                            throw new c("error/message",'The error message "'.concat(e.message, '" is identical to the message.'))
                    } else if (e === n)
                        throw new c("error/message",'The error "'.concat(e, '" is identical to the message.'));
                    r = n,
                    n = void 0
                } else if (null != n && "object" !== i(n) && "function" != typeof n)
                    throw new l("error",["Object", "Error", "Function", "RegExp"],n);
                if (e === I) {
                    var o = "";
                    n && n.name && (o += " (".concat(n.name, ")")),
                    o += r ? ": ".concat(r) : ".";
                    var s = "rejects" === t.name ? "rejection" : "exception";
                    A({
                        actual: void 0,
                        expected: n,
                        operator: t.name,
                        message: "Missing expected ".concat(s).concat(o),
                        stackStartFn: t
                    })
                }
                if (n && !k(e, n, r, t))
                    throw e
            }
            function N(t, e, n, r) {
                if (e !== I) {
                    if ("string" == typeof n && (r = n,
                    n = void 0),
                    !n || k(e, n)) {
                        var o = r ? ": ".concat(r) : "."
                          , i = "doesNotReject" === t.name ? "rejection" : "exception";
                        A({
                            actual: e,
                            expected: n,
                            operator: t.name,
                            message: "Got unwanted ".concat(i).concat(o, "\n") + 'Actual message: "'.concat(e && e.message, '"'),
                            stackStartFn: t
                        })
                    }
                    throw e
                }
            }
            function P() {
                for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++)
                    e[n] = arguments[n];
                S.apply(void 0, [P, e.length].concat(e))
            }
            j.throws = function t(e) {
                for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
                    r[o - 1] = arguments[o];
                B.apply(void 0, [t, O(e)].concat(r))
            }
            ,
            j.rejects = function t(e) {
                for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
                    r[o - 1] = arguments[o];
                return T(e).then((function(e) {
                    return B.apply(void 0, [t, e].concat(r))
                }
                ))
            }
            ,
            j.doesNotThrow = function t(e) {
                for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
                    r[o - 1] = arguments[o];
                N.apply(void 0, [t, O(e)].concat(r))
            }
            ,
            j.doesNotReject = function t(e) {
                for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
                    r[o - 1] = arguments[o];
                return T(e).then((function(e) {
                    return N.apply(void 0, [t, e].concat(r))
                }
                ))
            }
            ,
            j.ifError = function t(e) {
                if (null != e) {
                    var n = "ifError got unwanted exception: ";
                    "object" === i(e) && "string" == typeof e.message ? 0 === e.message.length && e.constructor ? n += e.constructor.name : n += e.message : n += y(e);
                    var r = new p({
                        actual: e,
                        expected: null,
                        operator: "ifError",
                        message: n,
                        stackStartFn: t
                    })
                      , o = e.stack;
                    if ("string" == typeof o) {
                        var s = o.split("\n");
                        s.shift();
                        for (var a = r.stack.split("\n"), u = 0; u < s.length; u++) {
                            var c = a.indexOf(s[u]);
                            if (-1 !== c) {
                                a = a.slice(0, c);
                                break
                            }
                        }
                        r.stack = "".concat(a.join("\n"), "\n").concat(s.join("\n"))
                    }
                    throw r
                }
            }
            ,
            j.strict = w(P, j, {
                equal: j.strictEqual,
                deepEqual: j.deepStrictEqual,
                notEqual: j.notStrictEqual,
                notDeepEqual: j.notDeepStrictEqual
            }),
            j.strict.strict = j.strict
        }
        ,
        "../../../node_modules/assert/build/internal/assert/assertion_error.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/process/browser.js");
            function o(t, e, n) {
                return e in t ? Object.defineProperty(t, e, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : t[e] = n,
                t
            }
            function i(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(t, r.key, r)
                }
            }
            function s(t, e) {
                return !e || "object" !== h(e) && "function" != typeof e ? a(t) : e
            }
            function a(t) {
                if (void 0 === t)
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }
            function u(t) {
                var e = "function" == typeof Map ? new Map : void 0;
                return u = function(t) {
                    if (null === t || (n = t,
                    -1 === Function.toString.call(n).indexOf("[native code]")))
                        return t;
                    var n;
                    if ("function" != typeof t)
                        throw new TypeError("Super expression must either be null or a function");
                    if (void 0 !== e) {
                        if (e.has(t))
                            return e.get(t);
                        e.set(t, r)
                    }
                    function r() {
                        return c(t, arguments, f(this).constructor)
                    }
                    return r.prototype = Object.create(t.prototype, {
                        constructor: {
                            value: r,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    l(r, t)
                }
                ,
                u(t)
            }
            function c(t, e, n) {
                return c = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct)
                        return !1;
                    if (Reflect.construct.sham)
                        return !1;
                    if ("function" == typeof Proxy)
                        return !0;
                    try {
                        return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}
                        ))),
                        !0
                    } catch (t) {
                        return !1
                    }
                }() ? Reflect.construct : function(t, e, n) {
                    var r = [null];
                    r.push.apply(r, e);
                    var o = new (Function.bind.apply(t, r));
                    return n && l(o, n.prototype),
                    o
                }
                ,
                c.apply(null, arguments)
            }
            function l(t, e) {
                return l = Object.setPrototypeOf || function(t, e) {
                    return t.__proto__ = e,
                    t
                }
                ,
                l(t, e)
            }
            function f(t) {
                return f = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }
                ,
                f(t)
            }
            function h(t) {
                return h = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                h(t)
            }
            var d = n("../../../node_modules/util/util.js").inspect
              , p = n("../../../node_modules/assert/build/internal/errors.js").codes.ERR_INVALID_ARG_TYPE;
            function y(t, e, n) {
                return (void 0 === n || n > t.length) && (n = t.length),
                t.substring(n - e.length, n) === e
            }
            var g = ""
              , m = ""
              , b = ""
              , w = ""
              , v = {
                deepStrictEqual: "Expected values to be strictly deep-equal:",
                strictEqual: "Expected values to be strictly equal:",
                strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
                deepEqual: "Expected values to be loosely deep-equal:",
                equal: "Expected values to be loosely equal:",
                notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
                notStrictEqual: 'Expected "actual" to be strictly unequal to:',
                notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
                notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
                notEqual: 'Expected "actual" to be loosely unequal to:',
                notIdentical: "Values identical but not reference-equal:"
            };
            function M(t) {
                var e = Object.keys(t)
                  , n = Object.create(Object.getPrototypeOf(t));
                return e.forEach((function(e) {
                    n[e] = t[e]
                }
                )),
                Object.defineProperty(n, "message", {
                    value: t.message
                }),
                n
            }
            function x(t) {
                return d(t, {
                    compact: !1,
                    customInspect: !1,
                    depth: 1e3,
                    maxArrayLength: 1 / 0,
                    showHidden: !1,
                    breakLength: 1 / 0,
                    showProxy: !1,
                    sorted: !0,
                    getters: !0
                })
            }
            var j = function(t) {
                function e(t) {
                    var n;
                    if (function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, e),
                    "object" !== h(t) || null === t)
                        throw new p("options","Object",t);
                    var o = t.message
                      , i = t.operator
                      , u = t.stackStartFn
                      , c = t.actual
                      , l = t.expected
                      , d = Error.stackTraceLimit;
                    if (Error.stackTraceLimit = 0,
                    null != o)
                        n = s(this, f(e).call(this, String(o)));
                    else if (r.stderr && r.stderr.isTTY && (r.stderr && r.stderr.getColorDepth && 1 !== r.stderr.getColorDepth() ? (g = "[34m",
                    m = "[32m",
                    w = "[39m",
                    b = "[31m") : (g = "",
                    m = "",
                    w = "",
                    b = "")),
                    "object" === h(c) && null !== c && "object" === h(l) && null !== l && "stack"in c && c instanceof Error && "stack"in l && l instanceof Error && (c = M(c),
                    l = M(l)),
                    "deepStrictEqual" === i || "strictEqual" === i)
                        n = s(this, f(e).call(this, function(t, e, n) {
                            var o = ""
                              , i = ""
                              , s = 0
                              , a = ""
                              , u = !1
                              , c = x(t)
                              , l = c.split("\n")
                              , f = x(e).split("\n")
                              , d = 0
                              , p = "";
                            if ("strictEqual" === n && "object" === h(t) && "object" === h(e) && null !== t && null !== e && (n = "strictEqualObject"),
                            1 === l.length && 1 === f.length && l[0] !== f[0]) {
                                var M = l[0].length + f[0].length;
                                if (M <= 10) {
                                    if (!("object" === h(t) && null !== t || "object" === h(e) && null !== e || 0 === t && 0 === e))
                                        return "".concat(v[n], "\n\n") + "".concat(l[0], " !== ").concat(f[0], "\n")
                                } else if ("strictEqualObject" !== n && M < (r.stderr && r.stderr.isTTY ? r.stderr.columns : 80)) {
                                    for (; l[0][d] === f[0][d]; )
                                        d++;
                                    d > 2 && (p = "\n  ".concat(function(t, e) {
                                        if (e = Math.floor(e),
                                        0 == t.length || 0 == e)
                                            return "";
                                        var n = t.length * e;
                                        for (e = Math.floor(Math.log(e) / Math.log(2)); e; )
                                            t += t,
                                            e--;
                                        return t + t.substring(0, n - t.length)
                                    }(" ", d), "^"),
                                    d = 0)
                                }
                            }
                            for (var j = l[l.length - 1], I = f[f.length - 1]; j === I && (d++ < 2 ? a = "\n  ".concat(j).concat(a) : o = j,
                            l.pop(),
                            f.pop(),
                            0 !== l.length && 0 !== f.length); )
                                j = l[l.length - 1],
                                I = f[f.length - 1];
                            var A = Math.max(l.length, f.length);
                            if (0 === A) {
                                var S = c.split("\n");
                                if (S.length > 30)
                                    for (S[26] = "".concat(g, "...").concat(w); S.length > 27; )
                                        S.pop();
                                return "".concat(v.notIdentical, "\n\n").concat(S.join("\n"), "\n")
                            }
                            d > 3 && (a = "\n".concat(g, "...").concat(w).concat(a),
                            u = !0),
                            "" !== o && (a = "\n  ".concat(o).concat(a),
                            o = "");
                            var _ = 0
                              , E = v[n] + "\n".concat(m, "+ actual").concat(w, " ").concat(b, "- expected").concat(w)
                              , k = " ".concat(g, "...").concat(w, " Lines skipped");
                            for (d = 0; d < A; d++) {
                                var O = d - s;
                                if (l.length < d + 1)
                                    O > 1 && d > 2 && (O > 4 ? (i += "\n".concat(g, "...").concat(w),
                                    u = !0) : O > 3 && (i += "\n  ".concat(f[d - 2]),
                                    _++),
                                    i += "\n  ".concat(f[d - 1]),
                                    _++),
                                    s = d,
                                    o += "\n".concat(b, "-").concat(w, " ").concat(f[d]),
                                    _++;
                                else if (f.length < d + 1)
                                    O > 1 && d > 2 && (O > 4 ? (i += "\n".concat(g, "...").concat(w),
                                    u = !0) : O > 3 && (i += "\n  ".concat(l[d - 2]),
                                    _++),
                                    i += "\n  ".concat(l[d - 1]),
                                    _++),
                                    s = d,
                                    i += "\n".concat(m, "+").concat(w, " ").concat(l[d]),
                                    _++;
                                else {
                                    var L = f[d]
                                      , T = l[d]
                                      , B = T !== L && (!y(T, ",") || T.slice(0, -1) !== L);
                                    B && y(L, ",") && L.slice(0, -1) === T && (B = !1,
                                    T += ","),
                                    B ? (O > 1 && d > 2 && (O > 4 ? (i += "\n".concat(g, "...").concat(w),
                                    u = !0) : O > 3 && (i += "\n  ".concat(l[d - 2]),
                                    _++),
                                    i += "\n  ".concat(l[d - 1]),
                                    _++),
                                    s = d,
                                    i += "\n".concat(m, "+").concat(w, " ").concat(T),
                                    o += "\n".concat(b, "-").concat(w, " ").concat(L),
                                    _ += 2) : (i += o,
                                    o = "",
                                    1 !== O && 0 !== d || (i += "\n  ".concat(T),
                                    _++))
                                }
                                if (_ > 20 && d < A - 2)
                                    return "".concat(E).concat(k, "\n").concat(i, "\n").concat(g, "...").concat(w).concat(o, "\n") + "".concat(g, "...").concat(w)
                            }
                            return "".concat(E).concat(u ? k : "", "\n").concat(i).concat(o).concat(a).concat(p)
                        }(c, l, i)));
                    else if ("notDeepStrictEqual" === i || "notStrictEqual" === i) {
                        var j = v[i]
                          , I = x(c).split("\n");
                        if ("notStrictEqual" === i && "object" === h(c) && null !== c && (j = v.notStrictEqualObject),
                        I.length > 30)
                            for (I[26] = "".concat(g, "...").concat(w); I.length > 27; )
                                I.pop();
                        n = 1 === I.length ? s(this, f(e).call(this, "".concat(j, " ").concat(I[0]))) : s(this, f(e).call(this, "".concat(j, "\n\n").concat(I.join("\n"), "\n")))
                    } else {
                        var A = x(c)
                          , S = ""
                          , _ = v[i];
                        "notDeepEqual" === i || "notEqual" === i ? (A = "".concat(v[i], "\n\n").concat(A)).length > 1024 && (A = "".concat(A.slice(0, 1021), "...")) : (S = "".concat(x(l)),
                        A.length > 512 && (A = "".concat(A.slice(0, 509), "...")),
                        S.length > 512 && (S = "".concat(S.slice(0, 509), "...")),
                        "deepEqual" === i || "equal" === i ? A = "".concat(_, "\n\n").concat(A, "\n\nshould equal\n\n") : S = " ".concat(i, " ").concat(S)),
                        n = s(this, f(e).call(this, "".concat(A).concat(S)))
                    }
                    return Error.stackTraceLimit = d,
                    n.generatedMessage = !o,
                    Object.defineProperty(a(n), "name", {
                        value: "AssertionError [ERR_ASSERTION]",
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }),
                    n.code = "ERR_ASSERTION",
                    n.actual = c,
                    n.expected = l,
                    n.operator = i,
                    Error.captureStackTrace && Error.captureStackTrace(a(n), u),
                    n.stack,
                    n.name = "AssertionError",
                    s(n)
                }
                var n, u;
                return function(t, e) {
                    if ("function" != typeof e && null !== e)
                        throw new TypeError("Super expression must either be null or a function");
                    t.prototype = Object.create(e && e.prototype, {
                        constructor: {
                            value: t,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    e && l(t, e)
                }(e, t),
                n = e,
                u = [{
                    key: "toString",
                    value: function() {
                        return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message)
                    }
                }, {
                    key: d.custom,
                    value: function(t, e) {
                        return d(this, function(t) {
                            for (var e = 1; e < arguments.length; e++) {
                                var n = null != arguments[e] ? arguments[e] : {}
                                  , r = Object.keys(n);
                                "function" == typeof Object.getOwnPropertySymbols && (r = r.concat(Object.getOwnPropertySymbols(n).filter((function(t) {
                                    return Object.getOwnPropertyDescriptor(n, t).enumerable
                                }
                                )))),
                                r.forEach((function(e) {
                                    o(t, e, n[e])
                                }
                                ))
                            }
                            return t
                        }({}, e, {
                            customInspect: !1,
                            depth: 0
                        }))
                    }
                }],
                u && i(n.prototype, u),
                e
            }(u(Error));
            t.exports = j
        }
        ,
        "../../../node_modules/assert/build/internal/errors.js": (t,e,n)=>{
            "use strict";
            function r(t) {
                return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                r(t)
            }
            function o(t) {
                return o = Object.setPrototypeOf ? Object.getPrototypeOf : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }
                ,
                o(t)
            }
            function i(t, e) {
                return i = Object.setPrototypeOf || function(t, e) {
                    return t.__proto__ = e,
                    t
                }
                ,
                i(t, e)
            }
            var s, a, u = {};
            function c(t, e, n) {
                n || (n = Error);
                var s = function(n) {
                    function s(n, i, a) {
                        var u;
                        return function(t, e) {
                            if (!(t instanceof e))
                                throw new TypeError("Cannot call a class as a function")
                        }(this, s),
                        u = function(t, e) {
                            return !e || "object" !== r(e) && "function" != typeof e ? function(t) {
                                if (void 0 === t)
                                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                                return t
                            }(t) : e
                        }(this, o(s).call(this, function(t, n, r) {
                            return "string" == typeof e ? e : e(t, n, r)
                        }(n, i, a))),
                        u.code = t,
                        u
                    }
                    return function(t, e) {
                        if ("function" != typeof e && null !== e)
                            throw new TypeError("Super expression must either be null or a function");
                        t.prototype = Object.create(e && e.prototype, {
                            constructor: {
                                value: t,
                                writable: !0,
                                configurable: !0
                            }
                        }),
                        e && i(t, e)
                    }(s, n),
                    s
                }(n);
                u[t] = s
            }
            function l(t, e) {
                if (Array.isArray(t)) {
                    var n = t.length;
                    return t = t.map((function(t) {
                        return String(t)
                    }
                    )),
                    n > 2 ? "one of ".concat(e, " ").concat(t.slice(0, n - 1).join(", "), ", or ") + t[n - 1] : 2 === n ? "one of ".concat(e, " ").concat(t[0], " or ").concat(t[1]) : "of ".concat(e, " ").concat(t[0])
                }
                return "of ".concat(e, " ").concat(String(t))
            }
            c("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError),
            c("ERR_INVALID_ARG_TYPE", (function(t, e, o) {
                var i, a, u, c, f;
                if (void 0 === s && (s = n("../../../node_modules/assert/build/assert.js")),
                s("string" == typeof t, "'name' must be a string"),
                "string" == typeof e && (a = "not ",
                e.substr(0, 4) === a) ? (i = "must not be",
                e = e.replace(/^not /, "")) : i = "must be",
                function(t, e, n) {
                    return (void 0 === n || n > t.length) && (n = t.length),
                    t.substring(n - 9, n) === e
                }(t, " argument"))
                    u = "The ".concat(t, " ").concat(i, " ").concat(l(e, "type"));
                else {
                    var h = ("number" != typeof f && (f = 0),
                    f + 1 > (c = t).length || -1 === c.indexOf(".", f) ? "argument" : "property");
                    u = 'The "'.concat(t, '" ').concat(h, " ").concat(i, " ").concat(l(e, "type"))
                }
                return u + ". Received type ".concat(r(o))
            }
            ), TypeError),
            c("ERR_INVALID_ARG_VALUE", (function(t, e) {
                var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "is invalid";
                void 0 === a && (a = n("../../../node_modules/util/util.js"));
                var o = a.inspect(e);
                return o.length > 128 && (o = "".concat(o.slice(0, 128), "...")),
                "The argument '".concat(t, "' ").concat(r, ". Received ").concat(o)
            }
            ), TypeError, RangeError),
            c("ERR_INVALID_RETURN_VALUE", (function(t, e, n) {
                var o;
                return o = n && n.constructor && n.constructor.name ? "instance of ".concat(n.constructor.name) : "type ".concat(r(n)),
                "Expected ".concat(t, ' to be returned from the "').concat(e, '"') + " function but got ".concat(o, ".")
            }
            ), TypeError),
            c("ERR_MISSING_ARGS", (function() {
                for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
                    e[r] = arguments[r];
                void 0 === s && (s = n("../../../node_modules/assert/build/assert.js")),
                s(e.length > 0, "At least one arg needs to be specified");
                var o = "The "
                  , i = e.length;
                switch (e = e.map((function(t) {
                    return '"'.concat(t, '"')
                }
                )),
                i) {
                case 1:
                    o += "".concat(e[0], " argument");
                    break;
                case 2:
                    o += "".concat(e[0], " and ").concat(e[1], " arguments");
                    break;
                default:
                    o += e.slice(0, i - 1).join(", "),
                    o += ", and ".concat(e[i - 1], " arguments")
                }
                return "".concat(o, " must be specified")
            }
            ), TypeError),
            t.exports.codes = u
        }
        ,
        "../../../node_modules/assert/build/internal/util/comparisons.js": (t,e,n)=>{
            "use strict";
            function r(t, e) {
                return function(t) {
                    if (Array.isArray(t))
                        return t
                }(t) || function(t, e) {
                    var n = []
                      , r = !0
                      , o = !1
                      , i = void 0;
                    try {
                        for (var s, a = t[Symbol.iterator](); !(r = (s = a.next()).done) && (n.push(s.value),
                        !e || n.length !== e); r = !0)
                            ;
                    } catch (t) {
                        o = !0,
                        i = t
                    } finally {
                        try {
                            r || null == a.return || a.return()
                        } finally {
                            if (o)
                                throw i
                        }
                    }
                    return n
                }(t, e) || function() {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }()
            }
            function o(t) {
                return o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                o(t)
            }
            var i = void 0 !== /a/g.flags
              , s = function(t) {
                var e = [];
                return t.forEach((function(t) {
                    return e.push(t)
                }
                )),
                e
            }
              , a = function(t) {
                var e = [];
                return t.forEach((function(t, n) {
                    return e.push([n, t])
                }
                )),
                e
            }
              , u = Object.is ? Object.is : n("../../../node_modules/object-is/index.js")
              , c = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
                return []
            }
              , l = Number.isNaN ? Number.isNaN : n("../../../node_modules/is-nan/index.js");
            function f(t) {
                return t.call.bind(t)
            }
            var h = f(Object.prototype.hasOwnProperty)
              , d = f(Object.prototype.propertyIsEnumerable)
              , p = f(Object.prototype.toString)
              , y = n("../../../node_modules/util/util.js").types
              , g = y.isAnyArrayBuffer
              , m = y.isArrayBufferView
              , b = y.isDate
              , w = y.isMap
              , v = y.isRegExp
              , M = y.isSet
              , x = y.isNativeError
              , j = y.isBoxedPrimitive
              , I = y.isNumberObject
              , A = y.isStringObject
              , S = y.isBooleanObject
              , _ = y.isBigIntObject
              , E = y.isSymbolObject
              , k = y.isFloat32Array
              , O = y.isFloat64Array;
            function L(t) {
                if (0 === t.length || t.length > 10)
                    return !0;
                for (var e = 0; e < t.length; e++) {
                    var n = t.charCodeAt(e);
                    if (n < 48 || n > 57)
                        return !0
                }
                return 10 === t.length && t >= Math.pow(2, 32)
            }
            function T(t) {
                return Object.keys(t).filter(L).concat(c(t).filter(Object.prototype.propertyIsEnumerable.bind(t)))
            }
            function B(t, e) {
                if (t === e)
                    return 0;
                for (var n = t.length, r = e.length, o = 0, i = Math.min(n, r); o < i; ++o)
                    if (t[o] !== e[o]) {
                        n = t[o],
                        r = e[o];
                        break
                    }
                return n < r ? -1 : r < n ? 1 : 0
            }
            var N = 0
              , P = 1
              , z = 2
              , U = 3;
            function D(t, e, n, r) {
                if (t === e)
                    return 0 !== t || !n || u(t, e);
                if (n) {
                    if ("object" !== o(t))
                        return "number" == typeof t && l(t) && l(e);
                    if ("object" !== o(e) || null === t || null === e)
                        return !1;
                    if (Object.getPrototypeOf(t) !== Object.getPrototypeOf(e))
                        return !1
                } else {
                    if (null === t || "object" !== o(t))
                        return (null === e || "object" !== o(e)) && t == e;
                    if (null === e || "object" !== o(e))
                        return !1
                }
                var s, a, c, f, h = p(t);
                if (h !== p(e))
                    return !1;
                if (Array.isArray(t)) {
                    if (t.length !== e.length)
                        return !1;
                    var d = T(t)
                      , y = T(e);
                    return d.length === y.length && C(t, e, n, r, P, d)
                }
                if ("[object Object]" === h && (!w(t) && w(e) || !M(t) && M(e)))
                    return !1;
                if (b(t)) {
                    if (!b(e) || Date.prototype.getTime.call(t) !== Date.prototype.getTime.call(e))
                        return !1
                } else if (v(t)) {
                    if (!v(e) || (c = t,
                    f = e,
                    !(i ? c.source === f.source && c.flags === f.flags : RegExp.prototype.toString.call(c) === RegExp.prototype.toString.call(f))))
                        return !1
                } else if (x(t) || t instanceof Error) {
                    if (t.message !== e.message || t.name !== e.name)
                        return !1
                } else {
                    if (m(t)) {
                        if (n || !k(t) && !O(t)) {
                            if (!function(t, e) {
                                return t.byteLength === e.byteLength && 0 === B(new Uint8Array(t.buffer,t.byteOffset,t.byteLength), new Uint8Array(e.buffer,e.byteOffset,e.byteLength))
                            }(t, e))
                                return !1
                        } else if (!function(t, e) {
                            if (t.byteLength !== e.byteLength)
                                return !1;
                            for (var n = 0; n < t.byteLength; n++)
                                if (t[n] !== e[n])
                                    return !1;
                            return !0
                        }(t, e))
                            return !1;
                        var L = T(t)
                          , D = T(e);
                        return L.length === D.length && C(t, e, n, r, N, L)
                    }
                    if (M(t))
                        return !(!M(e) || t.size !== e.size) && C(t, e, n, r, z);
                    if (w(t))
                        return !(!w(e) || t.size !== e.size) && C(t, e, n, r, U);
                    if (g(t)) {
                        if (a = e,
                        (s = t).byteLength !== a.byteLength || 0 !== B(new Uint8Array(s), new Uint8Array(a)))
                            return !1
                    } else if (j(t) && !function(t, e) {
                        return I(t) ? I(e) && u(Number.prototype.valueOf.call(t), Number.prototype.valueOf.call(e)) : A(t) ? A(e) && String.prototype.valueOf.call(t) === String.prototype.valueOf.call(e) : S(t) ? S(e) && Boolean.prototype.valueOf.call(t) === Boolean.prototype.valueOf.call(e) : _(t) ? _(e) && BigInt.prototype.valueOf.call(t) === BigInt.prototype.valueOf.call(e) : E(e) && Symbol.prototype.valueOf.call(t) === Symbol.prototype.valueOf.call(e)
                    }(t, e))
                        return !1
                }
                return C(t, e, n, r, N)
            }
            function R(t, e) {
                return e.filter((function(e) {
                    return d(t, e)
                }
                ))
            }
            function C(t, e, n, i, u, l) {
                if (5 === arguments.length) {
                    l = Object.keys(t);
                    var f = Object.keys(e);
                    if (l.length !== f.length)
                        return !1
                }
                for (var p = 0; p < l.length; p++)
                    if (!h(e, l[p]))
                        return !1;
                if (n && 5 === arguments.length) {
                    var y = c(t);
                    if (0 !== y.length) {
                        var g = 0;
                        for (p = 0; p < y.length; p++) {
                            var m = y[p];
                            if (d(t, m)) {
                                if (!d(e, m))
                                    return !1;
                                l.push(m),
                                g++
                            } else if (d(e, m))
                                return !1
                        }
                        var b = c(e);
                        if (y.length !== b.length && R(e, b).length !== g)
                            return !1
                    } else {
                        var w = c(e);
                        if (0 !== w.length && 0 !== R(e, w).length)
                            return !1
                    }
                }
                if (0 === l.length && (u === N || u === P && 0 === t.length || 0 === t.size))
                    return !0;
                if (void 0 === i)
                    i = {
                        val1: new Map,
                        val2: new Map,
                        position: 0
                    };
                else {
                    var v = i.val1.get(t);
                    if (void 0 !== v) {
                        var M = i.val2.get(e);
                        if (void 0 !== M)
                            return v === M
                    }
                    i.position++
                }
                i.val1.set(t, i.position),
                i.val2.set(e, i.position);
                var x = function(t, e, n, i, u, c) {
                    var l = 0;
                    if (c === z) {
                        if (!function(t, e, n, r) {
                            for (var i = null, a = s(t), u = 0; u < a.length; u++) {
                                var c = a[u];
                                if ("object" === o(c) && null !== c)
                                    null === i && (i = new Set),
                                    i.add(c);
                                else if (!e.has(c)) {
                                    if (n)
                                        return !1;
                                    if (!F(t, e, c))
                                        return !1;
                                    null === i && (i = new Set),
                                    i.add(c)
                                }
                            }
                            if (null !== i) {
                                for (var l = s(e), f = 0; f < l.length; f++) {
                                    var h = l[f];
                                    if ("object" === o(h) && null !== h) {
                                        if (!W(i, h, n, r))
                                            return !1
                                    } else if (!n && !t.has(h) && !W(i, h, n, r))
                                        return !1
                                }
                                return 0 === i.size
                            }
                            return !0
                        }(t, e, n, u))
                            return !1
                    } else if (c === U) {
                        if (!function(t, e, n, i) {
                            for (var s = null, u = a(t), c = 0; c < u.length; c++) {
                                var l = r(u[c], 2)
                                  , f = l[0]
                                  , h = l[1];
                                if ("object" === o(f) && null !== f)
                                    null === s && (s = new Set),
                                    s.add(f);
                                else {
                                    var d = e.get(f);
                                    if (void 0 === d && !e.has(f) || !D(h, d, n, i)) {
                                        if (n)
                                            return !1;
                                        if (!K(t, e, f, h, i))
                                            return !1;
                                        null === s && (s = new Set),
                                        s.add(f)
                                    }
                                }
                            }
                            if (null !== s) {
                                for (var p = a(e), y = 0; y < p.length; y++) {
                                    var g = r(p[y], 2)
                                      , m = (f = g[0],
                                    g[1]);
                                    if ("object" === o(f) && null !== f) {
                                        if (!H(s, t, f, m, n, i))
                                            return !1
                                    } else if (!(n || t.has(f) && D(t.get(f), m, !1, i) || H(s, t, f, m, !1, i)))
                                        return !1
                                }
                                return 0 === s.size
                            }
                            return !0
                        }(t, e, n, u))
                            return !1
                    } else if (c === P)
                        for (; l < t.length; l++) {
                            if (!h(t, l)) {
                                if (h(e, l))
                                    return !1;
                                for (var f = Object.keys(t); l < f.length; l++) {
                                    var d = f[l];
                                    if (!h(e, d) || !D(t[d], e[d], n, u))
                                        return !1
                                }
                                return f.length === Object.keys(e).length
                            }
                            if (!h(e, l) || !D(t[l], e[l], n, u))
                                return !1
                        }
                    for (l = 0; l < i.length; l++) {
                        var p = i[l];
                        if (!D(t[p], e[p], n, u))
                            return !1
                    }
                    return !0
                }(t, e, n, l, i, u);
                return i.val1.delete(t),
                i.val2.delete(e),
                x
            }
            function W(t, e, n, r) {
                for (var o = s(t), i = 0; i < o.length; i++) {
                    var a = o[i];
                    if (D(e, a, n, r))
                        return t.delete(a),
                        !0
                }
                return !1
            }
            function q(t) {
                switch (o(t)) {
                case "undefined":
                    return null;
                case "object":
                    return;
                case "symbol":
                    return !1;
                case "string":
                    t = +t;
                case "number":
                    if (l(t))
                        return !1
                }
                return !0
            }
            function F(t, e, n) {
                var r = q(n);
                return null != r ? r : e.has(r) && !t.has(r)
            }
            function K(t, e, n, r, o) {
                var i = q(n);
                if (null != i)
                    return i;
                var s = e.get(i);
                return !(void 0 === s && !e.has(i) || !D(r, s, !1, o)) && !t.has(i) && D(r, s, !1, o)
            }
            function H(t, e, n, r, o, i) {
                for (var a = s(t), u = 0; u < a.length; u++) {
                    var c = a[u];
                    if (D(n, c, o, i) && D(r, e.get(c), o, i))
                        return t.delete(c),
                        !0
                }
                return !1
            }
            t.exports = {
                isDeepEqual: function(t, e) {
                    return D(t, e, !1)
                },
                isDeepStrictEqual: function(t, e) {
                    return D(t, e, !0)
                }
            }
        }
        ,
        "../../../node_modules/base-x/src/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/safe-buffer/index.js").Buffer;
            t.exports = function(t) {
                if (t.length >= 255)
                    throw new TypeError("Alphabet too long");
                for (var e = new Uint8Array(256), n = 0; n < e.length; n++)
                    e[n] = 255;
                for (var o = 0; o < t.length; o++) {
                    var i = t.charAt(o)
                      , s = i.charCodeAt(0);
                    if (255 !== e[s])
                        throw new TypeError(i + " is ambiguous");
                    e[s] = o
                }
                var a = t.length
                  , u = t.charAt(0)
                  , c = Math.log(a) / Math.log(256)
                  , l = Math.log(256) / Math.log(a);
                function f(t) {
                    if ("string" != typeof t)
                        throw new TypeError("Expected String");
                    if (0 === t.length)
                        return r.alloc(0);
                    for (var n = 0, o = 0, i = 0; t[n] === u; )
                        o++,
                        n++;
                    for (var s = (t.length - n) * c + 1 >>> 0, l = new Uint8Array(s); t[n]; ) {
                        var f = e[t.charCodeAt(n)];
                        if (255 === f)
                            return;
                        for (var h = 0, d = s - 1; (0 !== f || h < i) && -1 !== d; d--,
                        h++)
                            f += a * l[d] >>> 0,
                            l[d] = f % 256 >>> 0,
                            f = f / 256 >>> 0;
                        if (0 !== f)
                            throw new Error("Non-zero carry");
                        i = h,
                        n++
                    }
                    for (var p = s - i; p !== s && 0 === l[p]; )
                        p++;
                    var y = r.allocUnsafe(o + (s - p));
                    y.fill(0, 0, o);
                    for (var g = o; p !== s; )
                        y[g++] = l[p++];
                    return y
                }
                return {
                    encode: function(e) {
                        if ((Array.isArray(e) || e instanceof Uint8Array) && (e = r.from(e)),
                        !r.isBuffer(e))
                            throw new TypeError("Expected Buffer");
                        if (0 === e.length)
                            return "";
                        for (var n = 0, o = 0, i = 0, s = e.length; i !== s && 0 === e[i]; )
                            i++,
                            n++;
                        for (var c = (s - i) * l + 1 >>> 0, f = new Uint8Array(c); i !== s; ) {
                            for (var h = e[i], d = 0, p = c - 1; (0 !== h || d < o) && -1 !== p; p--,
                            d++)
                                h += 256 * f[p] >>> 0,
                                f[p] = h % a >>> 0,
                                h = h / a >>> 0;
                            if (0 !== h)
                                throw new Error("Non-zero carry");
                            o = d,
                            i++
                        }
                        for (var y = c - o; y !== c && 0 === f[y]; )
                            y++;
                        for (var g = u.repeat(n); y < c; ++y)
                            g += t.charAt(f[y]);
                        return g
                    },
                    decodeUnsafe: f,
                    decode: function(t) {
                        var e = f(t);
                        if (e)
                            return e;
                        throw new Error("Non-base" + a + " character")
                    }
                }
            }
        }
        ,
        "../../../node_modules/base64-js/index.js": (t,e)=>{
            "use strict";
            e.byteLength = function(t) {
                var e = a(t)
                  , n = e[0]
                  , r = e[1];
                return 3 * (n + r) / 4 - r
            }
            ,
            e.toByteArray = function(t) {
                var e, n, i = a(t), s = i[0], u = i[1], c = new o(function(t, e, n) {
                    return 3 * (e + n) / 4 - n
                }(0, s, u)), l = 0, f = u > 0 ? s - 4 : s;
                for (n = 0; n < f; n += 4)
                    e = r[t.charCodeAt(n)] << 18 | r[t.charCodeAt(n + 1)] << 12 | r[t.charCodeAt(n + 2)] << 6 | r[t.charCodeAt(n + 3)],
                    c[l++] = e >> 16 & 255,
                    c[l++] = e >> 8 & 255,
                    c[l++] = 255 & e;
                return 2 === u && (e = r[t.charCodeAt(n)] << 2 | r[t.charCodeAt(n + 1)] >> 4,
                c[l++] = 255 & e),
                1 === u && (e = r[t.charCodeAt(n)] << 10 | r[t.charCodeAt(n + 1)] << 4 | r[t.charCodeAt(n + 2)] >> 2,
                c[l++] = e >> 8 & 255,
                c[l++] = 255 & e),
                c
            }
            ,
            e.fromByteArray = function(t) {
                for (var e, r = t.length, o = r % 3, i = [], s = 16383, a = 0, c = r - o; a < c; a += s)
                    i.push(u(t, a, a + s > c ? c : a + s));
                return 1 === o ? (e = t[r - 1],
                i.push(n[e >> 2] + n[e << 4 & 63] + "==")) : 2 === o && (e = (t[r - 2] << 8) + t[r - 1],
                i.push(n[e >> 10] + n[e >> 4 & 63] + n[e << 2 & 63] + "=")),
                i.join("")
            }
            ;
            for (var n = [], r = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0; s < 64; ++s)
                n[s] = i[s],
                r[i.charCodeAt(s)] = s;
            function a(t) {
                var e = t.length;
                if (e % 4 > 0)
                    throw new Error("Invalid string. Length must be a multiple of 4");
                var n = t.indexOf("=");
                return -1 === n && (n = e),
                [n, n === e ? 0 : 4 - n % 4]
            }
            function u(t, e, r) {
                for (var o, i, s = [], a = e; a < r; a += 3)
                    o = (t[a] << 16 & 16711680) + (t[a + 1] << 8 & 65280) + (255 & t[a + 2]),
                    s.push(n[(i = o) >> 18 & 63] + n[i >> 12 & 63] + n[i >> 6 & 63] + n[63 & i]);
                return s.join("")
            }
            r["-".charCodeAt(0)] = 62,
            r["_".charCodeAt(0)] = 63
        }
        ,
        "../../../node_modules/bigint-buffer/dist/browser.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/buffer/index.js").Buffer;
            e.oU = function(t) {
                {
                    const e = r.from(t);
                    e.reverse();
                    const n = e.toString("hex");
                    return 0 === n.length ? BigInt(0) : BigInt(`0x${n}`)
                }
            }
            ,
            e.k$ = function(t, e) {
                {
                    const n = t.toString(16)
                      , o = r.from(n.padStart(2 * e, "0").slice(0, 2 * e), "hex");
                    return o.reverse(),
                    o
                }
            }
        }
        ,
        "../../../node_modules/bn.js/lib/bn.js": function(t, e, n) {
            !function(t, e) {
                "use strict";
                function r(t, e) {
                    if (!t)
                        throw new Error(e || "Assertion failed")
                }
                function o(t, e) {
                    t.super_ = e;
                    var n = function() {};
                    n.prototype = e.prototype,
                    t.prototype = new n,
                    t.prototype.constructor = t
                }
                function i(t, e, n) {
                    if (i.isBN(t))
                        return t;
                    this.negative = 0,
                    this.words = null,
                    this.length = 0,
                    this.red = null,
                    null !== t && ("le" !== e && "be" !== e || (n = e,
                    e = 10),
                    this._init(t || 0, e || 10, n || "be"))
                }
                var s;
                "object" == typeof t ? t.exports = i : e.BN = i,
                i.BN = i,
                i.wordSize = 26;
                try {
                    s = "undefined" != typeof window && void 0 !== window.Buffer ? window.Buffer : n("?6876").Buffer
                } catch (t) {}
                function a(t, e) {
                    var n = t.charCodeAt(e);
                    return n >= 48 && n <= 57 ? n - 48 : n >= 65 && n <= 70 ? n - 55 : n >= 97 && n <= 102 ? n - 87 : void r(!1, "Invalid character in " + t)
                }
                function u(t, e, n) {
                    var r = a(t, n);
                    return n - 1 >= e && (r |= a(t, n - 1) << 4),
                    r
                }
                function c(t, e, n, o) {
                    for (var i = 0, s = 0, a = Math.min(t.length, n), u = e; u < a; u++) {
                        var c = t.charCodeAt(u) - 48;
                        i *= o,
                        s = c >= 49 ? c - 49 + 10 : c >= 17 ? c - 17 + 10 : c,
                        r(c >= 0 && s < o, "Invalid character"),
                        i += s
                    }
                    return i
                }
                function l(t, e) {
                    t.words = e.words,
                    t.length = e.length,
                    t.negative = e.negative,
                    t.red = e.red
                }
                if (i.isBN = function(t) {
                    return t instanceof i || null !== t && "object" == typeof t && t.constructor.wordSize === i.wordSize && Array.isArray(t.words)
                }
                ,
                i.max = function(t, e) {
                    return t.cmp(e) > 0 ? t : e
                }
                ,
                i.min = function(t, e) {
                    return t.cmp(e) < 0 ? t : e
                }
                ,
                i.prototype._init = function(t, e, n) {
                    if ("number" == typeof t)
                        return this._initNumber(t, e, n);
                    if ("object" == typeof t)
                        return this._initArray(t, e, n);
                    "hex" === e && (e = 16),
                    r(e === (0 | e) && e >= 2 && e <= 36);
                    var o = 0;
                    "-" === (t = t.toString().replace(/\s+/g, ""))[0] && (o++,
                    this.negative = 1),
                    o < t.length && (16 === e ? this._parseHex(t, o, n) : (this._parseBase(t, e, o),
                    "le" === n && this._initArray(this.toArray(), e, n)))
                }
                ,
                i.prototype._initNumber = function(t, e, n) {
                    t < 0 && (this.negative = 1,
                    t = -t),
                    t < 67108864 ? (this.words = [67108863 & t],
                    this.length = 1) : t < 4503599627370496 ? (this.words = [67108863 & t, t / 67108864 & 67108863],
                    this.length = 2) : (r(t < 9007199254740992),
                    this.words = [67108863 & t, t / 67108864 & 67108863, 1],
                    this.length = 3),
                    "le" === n && this._initArray(this.toArray(), e, n)
                }
                ,
                i.prototype._initArray = function(t, e, n) {
                    if (r("number" == typeof t.length),
                    t.length <= 0)
                        return this.words = [0],
                        this.length = 1,
                        this;
                    this.length = Math.ceil(t.length / 3),
                    this.words = new Array(this.length);
                    for (var o = 0; o < this.length; o++)
                        this.words[o] = 0;
                    var i, s, a = 0;
                    if ("be" === n)
                        for (o = t.length - 1,
                        i = 0; o >= 0; o -= 3)
                            s = t[o] | t[o - 1] << 8 | t[o - 2] << 16,
                            this.words[i] |= s << a & 67108863,
                            this.words[i + 1] = s >>> 26 - a & 67108863,
                            (a += 24) >= 26 && (a -= 26,
                            i++);
                    else if ("le" === n)
                        for (o = 0,
                        i = 0; o < t.length; o += 3)
                            s = t[o] | t[o + 1] << 8 | t[o + 2] << 16,
                            this.words[i] |= s << a & 67108863,
                            this.words[i + 1] = s >>> 26 - a & 67108863,
                            (a += 24) >= 26 && (a -= 26,
                            i++);
                    return this._strip()
                }
                ,
                i.prototype._parseHex = function(t, e, n) {
                    this.length = Math.ceil((t.length - e) / 6),
                    this.words = new Array(this.length);
                    for (var r = 0; r < this.length; r++)
                        this.words[r] = 0;
                    var o, i = 0, s = 0;
                    if ("be" === n)
                        for (r = t.length - 1; r >= e; r -= 2)
                            o = u(t, e, r) << i,
                            this.words[s] |= 67108863 & o,
                            i >= 18 ? (i -= 18,
                            s += 1,
                            this.words[s] |= o >>> 26) : i += 8;
                    else
                        for (r = (t.length - e) % 2 == 0 ? e + 1 : e; r < t.length; r += 2)
                            o = u(t, e, r) << i,
                            this.words[s] |= 67108863 & o,
                            i >= 18 ? (i -= 18,
                            s += 1,
                            this.words[s] |= o >>> 26) : i += 8;
                    this._strip()
                }
                ,
                i.prototype._parseBase = function(t, e, n) {
                    this.words = [0],
                    this.length = 1;
                    for (var r = 0, o = 1; o <= 67108863; o *= e)
                        r++;
                    r--,
                    o = o / e | 0;
                    for (var i = t.length - n, s = i % r, a = Math.min(i, i - s) + n, u = 0, l = n; l < a; l += r)
                        u = c(t, l, l + r, e),
                        this.imuln(o),
                        this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u);
                    if (0 !== s) {
                        var f = 1;
                        for (u = c(t, l, t.length, e),
                        l = 0; l < s; l++)
                            f *= e;
                        this.imuln(f),
                        this.words[0] + u < 67108864 ? this.words[0] += u : this._iaddn(u)
                    }
                    this._strip()
                }
                ,
                i.prototype.copy = function(t) {
                    t.words = new Array(this.length);
                    for (var e = 0; e < this.length; e++)
                        t.words[e] = this.words[e];
                    t.length = this.length,
                    t.negative = this.negative,
                    t.red = this.red
                }
                ,
                i.prototype._move = function(t) {
                    l(t, this)
                }
                ,
                i.prototype.clone = function() {
                    var t = new i(null);
                    return this.copy(t),
                    t
                }
                ,
                i.prototype._expand = function(t) {
                    for (; this.length < t; )
                        this.words[this.length++] = 0;
                    return this
                }
                ,
                i.prototype._strip = function() {
                    for (; this.length > 1 && 0 === this.words[this.length - 1]; )
                        this.length--;
                    return this._normSign()
                }
                ,
                i.prototype._normSign = function() {
                    return 1 === this.length && 0 === this.words[0] && (this.negative = 0),
                    this
                }
                ,
                "undefined" != typeof Symbol && "function" == typeof Symbol.for)
                    try {
                        i.prototype[Symbol.for("nodejs.util.inspect.custom")] = f
                    } catch (t) {
                        i.prototype.inspect = f
                    }
                else
                    i.prototype.inspect = f;
                function f() {
                    return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"
                }
                var h = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"]
                  , d = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
                  , p = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
                function y(t, e, n) {
                    n.negative = e.negative ^ t.negative;
                    var r = t.length + e.length | 0;
                    n.length = r,
                    r = r - 1 | 0;
                    var o = 0 | t.words[0]
                      , i = 0 | e.words[0]
                      , s = o * i
                      , a = 67108863 & s
                      , u = s / 67108864 | 0;
                    n.words[0] = a;
                    for (var c = 1; c < r; c++) {
                        for (var l = u >>> 26, f = 67108863 & u, h = Math.min(c, e.length - 1), d = Math.max(0, c - t.length + 1); d <= h; d++) {
                            var p = c - d | 0;
                            l += (s = (o = 0 | t.words[p]) * (i = 0 | e.words[d]) + f) / 67108864 | 0,
                            f = 67108863 & s
                        }
                        n.words[c] = 0 | f,
                        u = 0 | l
                    }
                    return 0 !== u ? n.words[c] = 0 | u : n.length--,
                    n._strip()
                }
                i.prototype.toString = function(t, e) {
                    var n;
                    if (e = 0 | e || 1,
                    16 === (t = t || 10) || "hex" === t) {
                        n = "";
                        for (var o = 0, i = 0, s = 0; s < this.length; s++) {
                            var a = this.words[s]
                              , u = (16777215 & (a << o | i)).toString(16);
                            i = a >>> 24 - o & 16777215,
                            (o += 2) >= 26 && (o -= 26,
                            s--),
                            n = 0 !== i || s !== this.length - 1 ? h[6 - u.length] + u + n : u + n
                        }
                        for (0 !== i && (n = i.toString(16) + n); n.length % e != 0; )
                            n = "0" + n;
                        return 0 !== this.negative && (n = "-" + n),
                        n
                    }
                    if (t === (0 | t) && t >= 2 && t <= 36) {
                        var c = d[t]
                          , l = p[t];
                        n = "";
                        var f = this.clone();
                        for (f.negative = 0; !f.isZero(); ) {
                            var y = f.modrn(l).toString(t);
                            n = (f = f.idivn(l)).isZero() ? y + n : h[c - y.length] + y + n
                        }
                        for (this.isZero() && (n = "0" + n); n.length % e != 0; )
                            n = "0" + n;
                        return 0 !== this.negative && (n = "-" + n),
                        n
                    }
                    r(!1, "Base should be between 2 and 36")
                }
                ,
                i.prototype.toNumber = function() {
                    var t = this.words[0];
                    return 2 === this.length ? t += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? t += 4503599627370496 + 67108864 * this.words[1] : this.length > 2 && r(!1, "Number can only safely store up to 53 bits"),
                    0 !== this.negative ? -t : t
                }
                ,
                i.prototype.toJSON = function() {
                    return this.toString(16, 2)
                }
                ,
                s && (i.prototype.toBuffer = function(t, e) {
                    return this.toArrayLike(s, t, e)
                }
                ),
                i.prototype.toArray = function(t, e) {
                    return this.toArrayLike(Array, t, e)
                }
                ,
                i.prototype.toArrayLike = function(t, e, n) {
                    this._strip();
                    var o = this.byteLength()
                      , i = n || Math.max(1, o);
                    r(o <= i, "byte array longer than desired length"),
                    r(i > 0, "Requested array length <= 0");
                    var s = function(t, e) {
                        return t.allocUnsafe ? t.allocUnsafe(e) : new t(e)
                    }(t, i);
                    return this["_toArrayLike" + ("le" === e ? "LE" : "BE")](s, o),
                    s
                }
                ,
                i.prototype._toArrayLikeLE = function(t, e) {
                    for (var n = 0, r = 0, o = 0, i = 0; o < this.length; o++) {
                        var s = this.words[o] << i | r;
                        t[n++] = 255 & s,
                        n < t.length && (t[n++] = s >> 8 & 255),
                        n < t.length && (t[n++] = s >> 16 & 255),
                        6 === i ? (n < t.length && (t[n++] = s >> 24 & 255),
                        r = 0,
                        i = 0) : (r = s >>> 24,
                        i += 2)
                    }
                    if (n < t.length)
                        for (t[n++] = r; n < t.length; )
                            t[n++] = 0
                }
                ,
                i.prototype._toArrayLikeBE = function(t, e) {
                    for (var n = t.length - 1, r = 0, o = 0, i = 0; o < this.length; o++) {
                        var s = this.words[o] << i | r;
                        t[n--] = 255 & s,
                        n >= 0 && (t[n--] = s >> 8 & 255),
                        n >= 0 && (t[n--] = s >> 16 & 255),
                        6 === i ? (n >= 0 && (t[n--] = s >> 24 & 255),
                        r = 0,
                        i = 0) : (r = s >>> 24,
                        i += 2)
                    }
                    if (n >= 0)
                        for (t[n--] = r; n >= 0; )
                            t[n--] = 0
                }
                ,
                Math.clz32 ? i.prototype._countBits = function(t) {
                    return 32 - Math.clz32(t)
                }
                : i.prototype._countBits = function(t) {
                    var e = t
                      , n = 0;
                    return e >= 4096 && (n += 13,
                    e >>>= 13),
                    e >= 64 && (n += 7,
                    e >>>= 7),
                    e >= 8 && (n += 4,
                    e >>>= 4),
                    e >= 2 && (n += 2,
                    e >>>= 2),
                    n + e
                }
                ,
                i.prototype._zeroBits = function(t) {
                    if (0 === t)
                        return 26;
                    var e = t
                      , n = 0;
                    return 8191 & e || (n += 13,
                    e >>>= 13),
                    127 & e || (n += 7,
                    e >>>= 7),
                    15 & e || (n += 4,
                    e >>>= 4),
                    3 & e || (n += 2,
                    e >>>= 2),
                    1 & e || n++,
                    n
                }
                ,
                i.prototype.bitLength = function() {
                    var t = this.words[this.length - 1]
                      , e = this._countBits(t);
                    return 26 * (this.length - 1) + e
                }
                ,
                i.prototype.zeroBits = function() {
                    if (this.isZero())
                        return 0;
                    for (var t = 0, e = 0; e < this.length; e++) {
                        var n = this._zeroBits(this.words[e]);
                        if (t += n,
                        26 !== n)
                            break
                    }
                    return t
                }
                ,
                i.prototype.byteLength = function() {
                    return Math.ceil(this.bitLength() / 8)
                }
                ,
                i.prototype.toTwos = function(t) {
                    return 0 !== this.negative ? this.abs().inotn(t).iaddn(1) : this.clone()
                }
                ,
                i.prototype.fromTwos = function(t) {
                    return this.testn(t - 1) ? this.notn(t).iaddn(1).ineg() : this.clone()
                }
                ,
                i.prototype.isNeg = function() {
                    return 0 !== this.negative
                }
                ,
                i.prototype.neg = function() {
                    return this.clone().ineg()
                }
                ,
                i.prototype.ineg = function() {
                    return this.isZero() || (this.negative ^= 1),
                    this
                }
                ,
                i.prototype.iuor = function(t) {
                    for (; this.length < t.length; )
                        this.words[this.length++] = 0;
                    for (var e = 0; e < t.length; e++)
                        this.words[e] = this.words[e] | t.words[e];
                    return this._strip()
                }
                ,
                i.prototype.ior = function(t) {
                    return r(!(this.negative | t.negative)),
                    this.iuor(t)
                }
                ,
                i.prototype.or = function(t) {
                    return this.length > t.length ? this.clone().ior(t) : t.clone().ior(this)
                }
                ,
                i.prototype.uor = function(t) {
                    return this.length > t.length ? this.clone().iuor(t) : t.clone().iuor(this)
                }
                ,
                i.prototype.iuand = function(t) {
                    var e;
                    e = this.length > t.length ? t : this;
                    for (var n = 0; n < e.length; n++)
                        this.words[n] = this.words[n] & t.words[n];
                    return this.length = e.length,
                    this._strip()
                }
                ,
                i.prototype.iand = function(t) {
                    return r(!(this.negative | t.negative)),
                    this.iuand(t)
                }
                ,
                i.prototype.and = function(t) {
                    return this.length > t.length ? this.clone().iand(t) : t.clone().iand(this)
                }
                ,
                i.prototype.uand = function(t) {
                    return this.length > t.length ? this.clone().iuand(t) : t.clone().iuand(this)
                }
                ,
                i.prototype.iuxor = function(t) {
                    var e, n;
                    this.length > t.length ? (e = this,
                    n = t) : (e = t,
                    n = this);
                    for (var r = 0; r < n.length; r++)
                        this.words[r] = e.words[r] ^ n.words[r];
                    if (this !== e)
                        for (; r < e.length; r++)
                            this.words[r] = e.words[r];
                    return this.length = e.length,
                    this._strip()
                }
                ,
                i.prototype.ixor = function(t) {
                    return r(!(this.negative | t.negative)),
                    this.iuxor(t)
                }
                ,
                i.prototype.xor = function(t) {
                    return this.length > t.length ? this.clone().ixor(t) : t.clone().ixor(this)
                }
                ,
                i.prototype.uxor = function(t) {
                    return this.length > t.length ? this.clone().iuxor(t) : t.clone().iuxor(this)
                }
                ,
                i.prototype.inotn = function(t) {
                    r("number" == typeof t && t >= 0);
                    var e = 0 | Math.ceil(t / 26)
                      , n = t % 26;
                    this._expand(e),
                    n > 0 && e--;
                    for (var o = 0; o < e; o++)
                        this.words[o] = 67108863 & ~this.words[o];
                    return n > 0 && (this.words[o] = ~this.words[o] & 67108863 >> 26 - n),
                    this._strip()
                }
                ,
                i.prototype.notn = function(t) {
                    return this.clone().inotn(t)
                }
                ,
                i.prototype.setn = function(t, e) {
                    r("number" == typeof t && t >= 0);
                    var n = t / 26 | 0
                      , o = t % 26;
                    return this._expand(n + 1),
                    this.words[n] = e ? this.words[n] | 1 << o : this.words[n] & ~(1 << o),
                    this._strip()
                }
                ,
                i.prototype.iadd = function(t) {
                    var e, n, r;
                    if (0 !== this.negative && 0 === t.negative)
                        return this.negative = 0,
                        e = this.isub(t),
                        this.negative ^= 1,
                        this._normSign();
                    if (0 === this.negative && 0 !== t.negative)
                        return t.negative = 0,
                        e = this.isub(t),
                        t.negative = 1,
                        e._normSign();
                    this.length > t.length ? (n = this,
                    r = t) : (n = t,
                    r = this);
                    for (var o = 0, i = 0; i < r.length; i++)
                        e = (0 | n.words[i]) + (0 | r.words[i]) + o,
                        this.words[i] = 67108863 & e,
                        o = e >>> 26;
                    for (; 0 !== o && i < n.length; i++)
                        e = (0 | n.words[i]) + o,
                        this.words[i] = 67108863 & e,
                        o = e >>> 26;
                    if (this.length = n.length,
                    0 !== o)
                        this.words[this.length] = o,
                        this.length++;
                    else if (n !== this)
                        for (; i < n.length; i++)
                            this.words[i] = n.words[i];
                    return this
                }
                ,
                i.prototype.add = function(t) {
                    var e;
                    return 0 !== t.negative && 0 === this.negative ? (t.negative = 0,
                    e = this.sub(t),
                    t.negative ^= 1,
                    e) : 0 === t.negative && 0 !== this.negative ? (this.negative = 0,
                    e = t.sub(this),
                    this.negative = 1,
                    e) : this.length > t.length ? this.clone().iadd(t) : t.clone().iadd(this)
                }
                ,
                i.prototype.isub = function(t) {
                    if (0 !== t.negative) {
                        t.negative = 0;
                        var e = this.iadd(t);
                        return t.negative = 1,
                        e._normSign()
                    }
                    if (0 !== this.negative)
                        return this.negative = 0,
                        this.iadd(t),
                        this.negative = 1,
                        this._normSign();
                    var n, r, o = this.cmp(t);
                    if (0 === o)
                        return this.negative = 0,
                        this.length = 1,
                        this.words[0] = 0,
                        this;
                    o > 0 ? (n = this,
                    r = t) : (n = t,
                    r = this);
                    for (var i = 0, s = 0; s < r.length; s++)
                        i = (e = (0 | n.words[s]) - (0 | r.words[s]) + i) >> 26,
                        this.words[s] = 67108863 & e;
                    for (; 0 !== i && s < n.length; s++)
                        i = (e = (0 | n.words[s]) + i) >> 26,
                        this.words[s] = 67108863 & e;
                    if (0 === i && s < n.length && n !== this)
                        for (; s < n.length; s++)
                            this.words[s] = n.words[s];
                    return this.length = Math.max(this.length, s),
                    n !== this && (this.negative = 1),
                    this._strip()
                }
                ,
                i.prototype.sub = function(t) {
                    return this.clone().isub(t)
                }
                ;
                var g = function(t, e, n) {
                    var r, o, i, s = t.words, a = e.words, u = n.words, c = 0, l = 0 | s[0], f = 8191 & l, h = l >>> 13, d = 0 | s[1], p = 8191 & d, y = d >>> 13, g = 0 | s[2], m = 8191 & g, b = g >>> 13, w = 0 | s[3], v = 8191 & w, M = w >>> 13, x = 0 | s[4], j = 8191 & x, I = x >>> 13, A = 0 | s[5], S = 8191 & A, _ = A >>> 13, E = 0 | s[6], k = 8191 & E, O = E >>> 13, L = 0 | s[7], T = 8191 & L, B = L >>> 13, N = 0 | s[8], P = 8191 & N, z = N >>> 13, U = 0 | s[9], D = 8191 & U, R = U >>> 13, C = 0 | a[0], W = 8191 & C, q = C >>> 13, F = 0 | a[1], K = 8191 & F, H = F >>> 13, Y = 0 | a[2], G = 8191 & Y, $ = Y >>> 13, V = 0 | a[3], Z = 8191 & V, J = V >>> 13, Q = 0 | a[4], X = 8191 & Q, tt = Q >>> 13, et = 0 | a[5], nt = 8191 & et, rt = et >>> 13, ot = 0 | a[6], it = 8191 & ot, st = ot >>> 13, at = 0 | a[7], ut = 8191 & at, ct = at >>> 13, lt = 0 | a[8], ft = 8191 & lt, ht = lt >>> 13, dt = 0 | a[9], pt = 8191 & dt, yt = dt >>> 13;
                    n.negative = t.negative ^ e.negative,
                    n.length = 19;
                    var gt = (c + (r = Math.imul(f, W)) | 0) + ((8191 & (o = (o = Math.imul(f, q)) + Math.imul(h, W) | 0)) << 13) | 0;
                    c = ((i = Math.imul(h, q)) + (o >>> 13) | 0) + (gt >>> 26) | 0,
                    gt &= 67108863,
                    r = Math.imul(p, W),
                    o = (o = Math.imul(p, q)) + Math.imul(y, W) | 0,
                    i = Math.imul(y, q);
                    var mt = (c + (r = r + Math.imul(f, K) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(f, H) | 0) + Math.imul(h, K) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(h, H) | 0) + (o >>> 13) | 0) + (mt >>> 26) | 0,
                    mt &= 67108863,
                    r = Math.imul(m, W),
                    o = (o = Math.imul(m, q)) + Math.imul(b, W) | 0,
                    i = Math.imul(b, q),
                    r = r + Math.imul(p, K) | 0,
                    o = (o = o + Math.imul(p, H) | 0) + Math.imul(y, K) | 0,
                    i = i + Math.imul(y, H) | 0;
                    var bt = (c + (r = r + Math.imul(f, G) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(f, $) | 0) + Math.imul(h, G) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(h, $) | 0) + (o >>> 13) | 0) + (bt >>> 26) | 0,
                    bt &= 67108863,
                    r = Math.imul(v, W),
                    o = (o = Math.imul(v, q)) + Math.imul(M, W) | 0,
                    i = Math.imul(M, q),
                    r = r + Math.imul(m, K) | 0,
                    o = (o = o + Math.imul(m, H) | 0) + Math.imul(b, K) | 0,
                    i = i + Math.imul(b, H) | 0,
                    r = r + Math.imul(p, G) | 0,
                    o = (o = o + Math.imul(p, $) | 0) + Math.imul(y, G) | 0,
                    i = i + Math.imul(y, $) | 0;
                    var wt = (c + (r = r + Math.imul(f, Z) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(f, J) | 0) + Math.imul(h, Z) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(h, J) | 0) + (o >>> 13) | 0) + (wt >>> 26) | 0,
                    wt &= 67108863,
                    r = Math.imul(j, W),
                    o = (o = Math.imul(j, q)) + Math.imul(I, W) | 0,
                    i = Math.imul(I, q),
                    r = r + Math.imul(v, K) | 0,
                    o = (o = o + Math.imul(v, H) | 0) + Math.imul(M, K) | 0,
                    i = i + Math.imul(M, H) | 0,
                    r = r + Math.imul(m, G) | 0,
                    o = (o = o + Math.imul(m, $) | 0) + Math.imul(b, G) | 0,
                    i = i + Math.imul(b, $) | 0,
                    r = r + Math.imul(p, Z) | 0,
                    o = (o = o + Math.imul(p, J) | 0) + Math.imul(y, Z) | 0,
                    i = i + Math.imul(y, J) | 0;
                    var vt = (c + (r = r + Math.imul(f, X) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(f, tt) | 0) + Math.imul(h, X) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(h, tt) | 0) + (o >>> 13) | 0) + (vt >>> 26) | 0,
                    vt &= 67108863,
                    r = Math.imul(S, W),
                    o = (o = Math.imul(S, q)) + Math.imul(_, W) | 0,
                    i = Math.imul(_, q),
                    r = r + Math.imul(j, K) | 0,
                    o = (o = o + Math.imul(j, H) | 0) + Math.imul(I, K) | 0,
                    i = i + Math.imul(I, H) | 0,
                    r = r + Math.imul(v, G) | 0,
                    o = (o = o + Math.imul(v, $) | 0) + Math.imul(M, G) | 0,
                    i = i + Math.imul(M, $) | 0,
                    r = r + Math.imul(m, Z) | 0,
                    o = (o = o + Math.imul(m, J) | 0) + Math.imul(b, Z) | 0,
                    i = i + Math.imul(b, J) | 0,
                    r = r + Math.imul(p, X) | 0,
                    o = (o = o + Math.imul(p, tt) | 0) + Math.imul(y, X) | 0,
                    i = i + Math.imul(y, tt) | 0;
                    var Mt = (c + (r = r + Math.imul(f, nt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(f, rt) | 0) + Math.imul(h, nt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(h, rt) | 0) + (o >>> 13) | 0) + (Mt >>> 26) | 0,
                    Mt &= 67108863,
                    r = Math.imul(k, W),
                    o = (o = Math.imul(k, q)) + Math.imul(O, W) | 0,
                    i = Math.imul(O, q),
                    r = r + Math.imul(S, K) | 0,
                    o = (o = o + Math.imul(S, H) | 0) + Math.imul(_, K) | 0,
                    i = i + Math.imul(_, H) | 0,
                    r = r + Math.imul(j, G) | 0,
                    o = (o = o + Math.imul(j, $) | 0) + Math.imul(I, G) | 0,
                    i = i + Math.imul(I, $) | 0,
                    r = r + Math.imul(v, Z) | 0,
                    o = (o = o + Math.imul(v, J) | 0) + Math.imul(M, Z) | 0,
                    i = i + Math.imul(M, J) | 0,
                    r = r + Math.imul(m, X) | 0,
                    o = (o = o + Math.imul(m, tt) | 0) + Math.imul(b, X) | 0,
                    i = i + Math.imul(b, tt) | 0,
                    r = r + Math.imul(p, nt) | 0,
                    o = (o = o + Math.imul(p, rt) | 0) + Math.imul(y, nt) | 0,
                    i = i + Math.imul(y, rt) | 0;
                    var xt = (c + (r = r + Math.imul(f, it) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(f, st) | 0) + Math.imul(h, it) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(h, st) | 0) + (o >>> 13) | 0) + (xt >>> 26) | 0,
                    xt &= 67108863,
                    r = Math.imul(T, W),
                    o = (o = Math.imul(T, q)) + Math.imul(B, W) | 0,
                    i = Math.imul(B, q),
                    r = r + Math.imul(k, K) | 0,
                    o = (o = o + Math.imul(k, H) | 0) + Math.imul(O, K) | 0,
                    i = i + Math.imul(O, H) | 0,
                    r = r + Math.imul(S, G) | 0,
                    o = (o = o + Math.imul(S, $) | 0) + Math.imul(_, G) | 0,
                    i = i + Math.imul(_, $) | 0,
                    r = r + Math.imul(j, Z) | 0,
                    o = (o = o + Math.imul(j, J) | 0) + Math.imul(I, Z) | 0,
                    i = i + Math.imul(I, J) | 0,
                    r = r + Math.imul(v, X) | 0,
                    o = (o = o + Math.imul(v, tt) | 0) + Math.imul(M, X) | 0,
                    i = i + Math.imul(M, tt) | 0,
                    r = r + Math.imul(m, nt) | 0,
                    o = (o = o + Math.imul(m, rt) | 0) + Math.imul(b, nt) | 0,
                    i = i + Math.imul(b, rt) | 0,
                    r = r + Math.imul(p, it) | 0,
                    o = (o = o + Math.imul(p, st) | 0) + Math.imul(y, it) | 0,
                    i = i + Math.imul(y, st) | 0;
                    var jt = (c + (r = r + Math.imul(f, ut) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(f, ct) | 0) + Math.imul(h, ut) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(h, ct) | 0) + (o >>> 13) | 0) + (jt >>> 26) | 0,
                    jt &= 67108863,
                    r = Math.imul(P, W),
                    o = (o = Math.imul(P, q)) + Math.imul(z, W) | 0,
                    i = Math.imul(z, q),
                    r = r + Math.imul(T, K) | 0,
                    o = (o = o + Math.imul(T, H) | 0) + Math.imul(B, K) | 0,
                    i = i + Math.imul(B, H) | 0,
                    r = r + Math.imul(k, G) | 0,
                    o = (o = o + Math.imul(k, $) | 0) + Math.imul(O, G) | 0,
                    i = i + Math.imul(O, $) | 0,
                    r = r + Math.imul(S, Z) | 0,
                    o = (o = o + Math.imul(S, J) | 0) + Math.imul(_, Z) | 0,
                    i = i + Math.imul(_, J) | 0,
                    r = r + Math.imul(j, X) | 0,
                    o = (o = o + Math.imul(j, tt) | 0) + Math.imul(I, X) | 0,
                    i = i + Math.imul(I, tt) | 0,
                    r = r + Math.imul(v, nt) | 0,
                    o = (o = o + Math.imul(v, rt) | 0) + Math.imul(M, nt) | 0,
                    i = i + Math.imul(M, rt) | 0,
                    r = r + Math.imul(m, it) | 0,
                    o = (o = o + Math.imul(m, st) | 0) + Math.imul(b, it) | 0,
                    i = i + Math.imul(b, st) | 0,
                    r = r + Math.imul(p, ut) | 0,
                    o = (o = o + Math.imul(p, ct) | 0) + Math.imul(y, ut) | 0,
                    i = i + Math.imul(y, ct) | 0;
                    var It = (c + (r = r + Math.imul(f, ft) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(f, ht) | 0) + Math.imul(h, ft) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(h, ht) | 0) + (o >>> 13) | 0) + (It >>> 26) | 0,
                    It &= 67108863,
                    r = Math.imul(D, W),
                    o = (o = Math.imul(D, q)) + Math.imul(R, W) | 0,
                    i = Math.imul(R, q),
                    r = r + Math.imul(P, K) | 0,
                    o = (o = o + Math.imul(P, H) | 0) + Math.imul(z, K) | 0,
                    i = i + Math.imul(z, H) | 0,
                    r = r + Math.imul(T, G) | 0,
                    o = (o = o + Math.imul(T, $) | 0) + Math.imul(B, G) | 0,
                    i = i + Math.imul(B, $) | 0,
                    r = r + Math.imul(k, Z) | 0,
                    o = (o = o + Math.imul(k, J) | 0) + Math.imul(O, Z) | 0,
                    i = i + Math.imul(O, J) | 0,
                    r = r + Math.imul(S, X) | 0,
                    o = (o = o + Math.imul(S, tt) | 0) + Math.imul(_, X) | 0,
                    i = i + Math.imul(_, tt) | 0,
                    r = r + Math.imul(j, nt) | 0,
                    o = (o = o + Math.imul(j, rt) | 0) + Math.imul(I, nt) | 0,
                    i = i + Math.imul(I, rt) | 0,
                    r = r + Math.imul(v, it) | 0,
                    o = (o = o + Math.imul(v, st) | 0) + Math.imul(M, it) | 0,
                    i = i + Math.imul(M, st) | 0,
                    r = r + Math.imul(m, ut) | 0,
                    o = (o = o + Math.imul(m, ct) | 0) + Math.imul(b, ut) | 0,
                    i = i + Math.imul(b, ct) | 0,
                    r = r + Math.imul(p, ft) | 0,
                    o = (o = o + Math.imul(p, ht) | 0) + Math.imul(y, ft) | 0,
                    i = i + Math.imul(y, ht) | 0;
                    var At = (c + (r = r + Math.imul(f, pt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(f, yt) | 0) + Math.imul(h, pt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(h, yt) | 0) + (o >>> 13) | 0) + (At >>> 26) | 0,
                    At &= 67108863,
                    r = Math.imul(D, K),
                    o = (o = Math.imul(D, H)) + Math.imul(R, K) | 0,
                    i = Math.imul(R, H),
                    r = r + Math.imul(P, G) | 0,
                    o = (o = o + Math.imul(P, $) | 0) + Math.imul(z, G) | 0,
                    i = i + Math.imul(z, $) | 0,
                    r = r + Math.imul(T, Z) | 0,
                    o = (o = o + Math.imul(T, J) | 0) + Math.imul(B, Z) | 0,
                    i = i + Math.imul(B, J) | 0,
                    r = r + Math.imul(k, X) | 0,
                    o = (o = o + Math.imul(k, tt) | 0) + Math.imul(O, X) | 0,
                    i = i + Math.imul(O, tt) | 0,
                    r = r + Math.imul(S, nt) | 0,
                    o = (o = o + Math.imul(S, rt) | 0) + Math.imul(_, nt) | 0,
                    i = i + Math.imul(_, rt) | 0,
                    r = r + Math.imul(j, it) | 0,
                    o = (o = o + Math.imul(j, st) | 0) + Math.imul(I, it) | 0,
                    i = i + Math.imul(I, st) | 0,
                    r = r + Math.imul(v, ut) | 0,
                    o = (o = o + Math.imul(v, ct) | 0) + Math.imul(M, ut) | 0,
                    i = i + Math.imul(M, ct) | 0,
                    r = r + Math.imul(m, ft) | 0,
                    o = (o = o + Math.imul(m, ht) | 0) + Math.imul(b, ft) | 0,
                    i = i + Math.imul(b, ht) | 0;
                    var St = (c + (r = r + Math.imul(p, pt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(p, yt) | 0) + Math.imul(y, pt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(y, yt) | 0) + (o >>> 13) | 0) + (St >>> 26) | 0,
                    St &= 67108863,
                    r = Math.imul(D, G),
                    o = (o = Math.imul(D, $)) + Math.imul(R, G) | 0,
                    i = Math.imul(R, $),
                    r = r + Math.imul(P, Z) | 0,
                    o = (o = o + Math.imul(P, J) | 0) + Math.imul(z, Z) | 0,
                    i = i + Math.imul(z, J) | 0,
                    r = r + Math.imul(T, X) | 0,
                    o = (o = o + Math.imul(T, tt) | 0) + Math.imul(B, X) | 0,
                    i = i + Math.imul(B, tt) | 0,
                    r = r + Math.imul(k, nt) | 0,
                    o = (o = o + Math.imul(k, rt) | 0) + Math.imul(O, nt) | 0,
                    i = i + Math.imul(O, rt) | 0,
                    r = r + Math.imul(S, it) | 0,
                    o = (o = o + Math.imul(S, st) | 0) + Math.imul(_, it) | 0,
                    i = i + Math.imul(_, st) | 0,
                    r = r + Math.imul(j, ut) | 0,
                    o = (o = o + Math.imul(j, ct) | 0) + Math.imul(I, ut) | 0,
                    i = i + Math.imul(I, ct) | 0,
                    r = r + Math.imul(v, ft) | 0,
                    o = (o = o + Math.imul(v, ht) | 0) + Math.imul(M, ft) | 0,
                    i = i + Math.imul(M, ht) | 0;
                    var _t = (c + (r = r + Math.imul(m, pt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(m, yt) | 0) + Math.imul(b, pt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(b, yt) | 0) + (o >>> 13) | 0) + (_t >>> 26) | 0,
                    _t &= 67108863,
                    r = Math.imul(D, Z),
                    o = (o = Math.imul(D, J)) + Math.imul(R, Z) | 0,
                    i = Math.imul(R, J),
                    r = r + Math.imul(P, X) | 0,
                    o = (o = o + Math.imul(P, tt) | 0) + Math.imul(z, X) | 0,
                    i = i + Math.imul(z, tt) | 0,
                    r = r + Math.imul(T, nt) | 0,
                    o = (o = o + Math.imul(T, rt) | 0) + Math.imul(B, nt) | 0,
                    i = i + Math.imul(B, rt) | 0,
                    r = r + Math.imul(k, it) | 0,
                    o = (o = o + Math.imul(k, st) | 0) + Math.imul(O, it) | 0,
                    i = i + Math.imul(O, st) | 0,
                    r = r + Math.imul(S, ut) | 0,
                    o = (o = o + Math.imul(S, ct) | 0) + Math.imul(_, ut) | 0,
                    i = i + Math.imul(_, ct) | 0,
                    r = r + Math.imul(j, ft) | 0,
                    o = (o = o + Math.imul(j, ht) | 0) + Math.imul(I, ft) | 0,
                    i = i + Math.imul(I, ht) | 0;
                    var Et = (c + (r = r + Math.imul(v, pt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(v, yt) | 0) + Math.imul(M, pt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(M, yt) | 0) + (o >>> 13) | 0) + (Et >>> 26) | 0,
                    Et &= 67108863,
                    r = Math.imul(D, X),
                    o = (o = Math.imul(D, tt)) + Math.imul(R, X) | 0,
                    i = Math.imul(R, tt),
                    r = r + Math.imul(P, nt) | 0,
                    o = (o = o + Math.imul(P, rt) | 0) + Math.imul(z, nt) | 0,
                    i = i + Math.imul(z, rt) | 0,
                    r = r + Math.imul(T, it) | 0,
                    o = (o = o + Math.imul(T, st) | 0) + Math.imul(B, it) | 0,
                    i = i + Math.imul(B, st) | 0,
                    r = r + Math.imul(k, ut) | 0,
                    o = (o = o + Math.imul(k, ct) | 0) + Math.imul(O, ut) | 0,
                    i = i + Math.imul(O, ct) | 0,
                    r = r + Math.imul(S, ft) | 0,
                    o = (o = o + Math.imul(S, ht) | 0) + Math.imul(_, ft) | 0,
                    i = i + Math.imul(_, ht) | 0;
                    var kt = (c + (r = r + Math.imul(j, pt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(j, yt) | 0) + Math.imul(I, pt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(I, yt) | 0) + (o >>> 13) | 0) + (kt >>> 26) | 0,
                    kt &= 67108863,
                    r = Math.imul(D, nt),
                    o = (o = Math.imul(D, rt)) + Math.imul(R, nt) | 0,
                    i = Math.imul(R, rt),
                    r = r + Math.imul(P, it) | 0,
                    o = (o = o + Math.imul(P, st) | 0) + Math.imul(z, it) | 0,
                    i = i + Math.imul(z, st) | 0,
                    r = r + Math.imul(T, ut) | 0,
                    o = (o = o + Math.imul(T, ct) | 0) + Math.imul(B, ut) | 0,
                    i = i + Math.imul(B, ct) | 0,
                    r = r + Math.imul(k, ft) | 0,
                    o = (o = o + Math.imul(k, ht) | 0) + Math.imul(O, ft) | 0,
                    i = i + Math.imul(O, ht) | 0;
                    var Ot = (c + (r = r + Math.imul(S, pt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(S, yt) | 0) + Math.imul(_, pt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(_, yt) | 0) + (o >>> 13) | 0) + (Ot >>> 26) | 0,
                    Ot &= 67108863,
                    r = Math.imul(D, it),
                    o = (o = Math.imul(D, st)) + Math.imul(R, it) | 0,
                    i = Math.imul(R, st),
                    r = r + Math.imul(P, ut) | 0,
                    o = (o = o + Math.imul(P, ct) | 0) + Math.imul(z, ut) | 0,
                    i = i + Math.imul(z, ct) | 0,
                    r = r + Math.imul(T, ft) | 0,
                    o = (o = o + Math.imul(T, ht) | 0) + Math.imul(B, ft) | 0,
                    i = i + Math.imul(B, ht) | 0;
                    var Lt = (c + (r = r + Math.imul(k, pt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(k, yt) | 0) + Math.imul(O, pt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(O, yt) | 0) + (o >>> 13) | 0) + (Lt >>> 26) | 0,
                    Lt &= 67108863,
                    r = Math.imul(D, ut),
                    o = (o = Math.imul(D, ct)) + Math.imul(R, ut) | 0,
                    i = Math.imul(R, ct),
                    r = r + Math.imul(P, ft) | 0,
                    o = (o = o + Math.imul(P, ht) | 0) + Math.imul(z, ft) | 0,
                    i = i + Math.imul(z, ht) | 0;
                    var Tt = (c + (r = r + Math.imul(T, pt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(T, yt) | 0) + Math.imul(B, pt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(B, yt) | 0) + (o >>> 13) | 0) + (Tt >>> 26) | 0,
                    Tt &= 67108863,
                    r = Math.imul(D, ft),
                    o = (o = Math.imul(D, ht)) + Math.imul(R, ft) | 0,
                    i = Math.imul(R, ht);
                    var Bt = (c + (r = r + Math.imul(P, pt) | 0) | 0) + ((8191 & (o = (o = o + Math.imul(P, yt) | 0) + Math.imul(z, pt) | 0)) << 13) | 0;
                    c = ((i = i + Math.imul(z, yt) | 0) + (o >>> 13) | 0) + (Bt >>> 26) | 0,
                    Bt &= 67108863;
                    var Nt = (c + (r = Math.imul(D, pt)) | 0) + ((8191 & (o = (o = Math.imul(D, yt)) + Math.imul(R, pt) | 0)) << 13) | 0;
                    return c = ((i = Math.imul(R, yt)) + (o >>> 13) | 0) + (Nt >>> 26) | 0,
                    Nt &= 67108863,
                    u[0] = gt,
                    u[1] = mt,
                    u[2] = bt,
                    u[3] = wt,
                    u[4] = vt,
                    u[5] = Mt,
                    u[6] = xt,
                    u[7] = jt,
                    u[8] = It,
                    u[9] = At,
                    u[10] = St,
                    u[11] = _t,
                    u[12] = Et,
                    u[13] = kt,
                    u[14] = Ot,
                    u[15] = Lt,
                    u[16] = Tt,
                    u[17] = Bt,
                    u[18] = Nt,
                    0 !== c && (u[19] = c,
                    n.length++),
                    n
                };
                function m(t, e, n) {
                    n.negative = e.negative ^ t.negative,
                    n.length = t.length + e.length;
                    for (var r = 0, o = 0, i = 0; i < n.length - 1; i++) {
                        var s = o;
                        o = 0;
                        for (var a = 67108863 & r, u = Math.min(i, e.length - 1), c = Math.max(0, i - t.length + 1); c <= u; c++) {
                            var l = i - c
                              , f = (0 | t.words[l]) * (0 | e.words[c])
                              , h = 67108863 & f;
                            a = 67108863 & (h = h + a | 0),
                            o += (s = (s = s + (f / 67108864 | 0) | 0) + (h >>> 26) | 0) >>> 26,
                            s &= 67108863
                        }
                        n.words[i] = a,
                        r = s,
                        s = o
                    }
                    return 0 !== r ? n.words[i] = r : n.length--,
                    n._strip()
                }
                function b(t, e, n) {
                    return m(t, e, n)
                }
                function w(t, e) {
                    this.x = t,
                    this.y = e
                }
                Math.imul || (g = y),
                i.prototype.mulTo = function(t, e) {
                    var n = this.length + t.length;
                    return 10 === this.length && 10 === t.length ? g(this, t, e) : n < 63 ? y(this, t, e) : n < 1024 ? m(this, t, e) : b(this, t, e)
                }
                ,
                w.prototype.makeRBT = function(t) {
                    for (var e = new Array(t), n = i.prototype._countBits(t) - 1, r = 0; r < t; r++)
                        e[r] = this.revBin(r, n, t);
                    return e
                }
                ,
                w.prototype.revBin = function(t, e, n) {
                    if (0 === t || t === n - 1)
                        return t;
                    for (var r = 0, o = 0; o < e; o++)
                        r |= (1 & t) << e - o - 1,
                        t >>= 1;
                    return r
                }
                ,
                w.prototype.permute = function(t, e, n, r, o, i) {
                    for (var s = 0; s < i; s++)
                        r[s] = e[t[s]],
                        o[s] = n[t[s]]
                }
                ,
                w.prototype.transform = function(t, e, n, r, o, i) {
                    this.permute(i, t, e, n, r, o);
                    for (var s = 1; s < o; s <<= 1)
                        for (var a = s << 1, u = Math.cos(2 * Math.PI / a), c = Math.sin(2 * Math.PI / a), l = 0; l < o; l += a)
                            for (var f = u, h = c, d = 0; d < s; d++) {
                                var p = n[l + d]
                                  , y = r[l + d]
                                  , g = n[l + d + s]
                                  , m = r[l + d + s]
                                  , b = f * g - h * m;
                                m = f * m + h * g,
                                g = b,
                                n[l + d] = p + g,
                                r[l + d] = y + m,
                                n[l + d + s] = p - g,
                                r[l + d + s] = y - m,
                                d !== a && (b = u * f - c * h,
                                h = u * h + c * f,
                                f = b)
                            }
                }
                ,
                w.prototype.guessLen13b = function(t, e) {
                    var n = 1 | Math.max(e, t)
                      , r = 1 & n
                      , o = 0;
                    for (n = n / 2 | 0; n; n >>>= 1)
                        o++;
                    return 1 << o + 1 + r
                }
                ,
                w.prototype.conjugate = function(t, e, n) {
                    if (!(n <= 1))
                        for (var r = 0; r < n / 2; r++) {
                            var o = t[r];
                            t[r] = t[n - r - 1],
                            t[n - r - 1] = o,
                            o = e[r],
                            e[r] = -e[n - r - 1],
                            e[n - r - 1] = -o
                        }
                }
                ,
                w.prototype.normalize13b = function(t, e) {
                    for (var n = 0, r = 0; r < e / 2; r++) {
                        var o = 8192 * Math.round(t[2 * r + 1] / e) + Math.round(t[2 * r] / e) + n;
                        t[r] = 67108863 & o,
                        n = o < 67108864 ? 0 : o / 67108864 | 0
                    }
                    return t
                }
                ,
                w.prototype.convert13b = function(t, e, n, o) {
                    for (var i = 0, s = 0; s < e; s++)
                        i += 0 | t[s],
                        n[2 * s] = 8191 & i,
                        i >>>= 13,
                        n[2 * s + 1] = 8191 & i,
                        i >>>= 13;
                    for (s = 2 * e; s < o; ++s)
                        n[s] = 0;
                    r(0 === i),
                    r(!(-8192 & i))
                }
                ,
                w.prototype.stub = function(t) {
                    for (var e = new Array(t), n = 0; n < t; n++)
                        e[n] = 0;
                    return e
                }
                ,
                w.prototype.mulp = function(t, e, n) {
                    var r = 2 * this.guessLen13b(t.length, e.length)
                      , o = this.makeRBT(r)
                      , i = this.stub(r)
                      , s = new Array(r)
                      , a = new Array(r)
                      , u = new Array(r)
                      , c = new Array(r)
                      , l = new Array(r)
                      , f = new Array(r)
                      , h = n.words;
                    h.length = r,
                    this.convert13b(t.words, t.length, s, r),
                    this.convert13b(e.words, e.length, c, r),
                    this.transform(s, i, a, u, r, o),
                    this.transform(c, i, l, f, r, o);
                    for (var d = 0; d < r; d++) {
                        var p = a[d] * l[d] - u[d] * f[d];
                        u[d] = a[d] * f[d] + u[d] * l[d],
                        a[d] = p
                    }
                    return this.conjugate(a, u, r),
                    this.transform(a, u, h, i, r, o),
                    this.conjugate(h, i, r),
                    this.normalize13b(h, r),
                    n.negative = t.negative ^ e.negative,
                    n.length = t.length + e.length,
                    n._strip()
                }
                ,
                i.prototype.mul = function(t) {
                    var e = new i(null);
                    return e.words = new Array(this.length + t.length),
                    this.mulTo(t, e)
                }
                ,
                i.prototype.mulf = function(t) {
                    var e = new i(null);
                    return e.words = new Array(this.length + t.length),
                    b(this, t, e)
                }
                ,
                i.prototype.imul = function(t) {
                    return this.clone().mulTo(t, this)
                }
                ,
                i.prototype.imuln = function(t) {
                    var e = t < 0;
                    e && (t = -t),
                    r("number" == typeof t),
                    r(t < 67108864);
                    for (var n = 0, o = 0; o < this.length; o++) {
                        var i = (0 | this.words[o]) * t
                          , s = (67108863 & i) + (67108863 & n);
                        n >>= 26,
                        n += i / 67108864 | 0,
                        n += s >>> 26,
                        this.words[o] = 67108863 & s
                    }
                    return 0 !== n && (this.words[o] = n,
                    this.length++),
                    e ? this.ineg() : this
                }
                ,
                i.prototype.muln = function(t) {
                    return this.clone().imuln(t)
                }
                ,
                i.prototype.sqr = function() {
                    return this.mul(this)
                }
                ,
                i.prototype.isqr = function() {
                    return this.imul(this.clone())
                }
                ,
                i.prototype.pow = function(t) {
                    var e = function(t) {
                        for (var e = new Array(t.bitLength()), n = 0; n < e.length; n++) {
                            var r = n / 26 | 0
                              , o = n % 26;
                            e[n] = t.words[r] >>> o & 1
                        }
                        return e
                    }(t);
                    if (0 === e.length)
                        return new i(1);
                    for (var n = this, r = 0; r < e.length && 0 === e[r]; r++,
                    n = n.sqr())
                        ;
                    if (++r < e.length)
                        for (var o = n.sqr(); r < e.length; r++,
                        o = o.sqr())
                            0 !== e[r] && (n = n.mul(o));
                    return n
                }
                ,
                i.prototype.iushln = function(t) {
                    r("number" == typeof t && t >= 0);
                    var e, n = t % 26, o = (t - n) / 26, i = 67108863 >>> 26 - n << 26 - n;
                    if (0 !== n) {
                        var s = 0;
                        for (e = 0; e < this.length; e++) {
                            var a = this.words[e] & i
                              , u = (0 | this.words[e]) - a << n;
                            this.words[e] = u | s,
                            s = a >>> 26 - n
                        }
                        s && (this.words[e] = s,
                        this.length++)
                    }
                    if (0 !== o) {
                        for (e = this.length - 1; e >= 0; e--)
                            this.words[e + o] = this.words[e];
                        for (e = 0; e < o; e++)
                            this.words[e] = 0;
                        this.length += o
                    }
                    return this._strip()
                }
                ,
                i.prototype.ishln = function(t) {
                    return r(0 === this.negative),
                    this.iushln(t)
                }
                ,
                i.prototype.iushrn = function(t, e, n) {
                    var o;
                    r("number" == typeof t && t >= 0),
                    o = e ? (e - e % 26) / 26 : 0;
                    var i = t % 26
                      , s = Math.min((t - i) / 26, this.length)
                      , a = 67108863 ^ 67108863 >>> i << i
                      , u = n;
                    if (o -= s,
                    o = Math.max(0, o),
                    u) {
                        for (var c = 0; c < s; c++)
                            u.words[c] = this.words[c];
                        u.length = s
                    }
                    if (0 === s)
                        ;
                    else if (this.length > s)
                        for (this.length -= s,
                        c = 0; c < this.length; c++)
                            this.words[c] = this.words[c + s];
                    else
                        this.words[0] = 0,
                        this.length = 1;
                    var l = 0;
                    for (c = this.length - 1; c >= 0 && (0 !== l || c >= o); c--) {
                        var f = 0 | this.words[c];
                        this.words[c] = l << 26 - i | f >>> i,
                        l = f & a
                    }
                    return u && 0 !== l && (u.words[u.length++] = l),
                    0 === this.length && (this.words[0] = 0,
                    this.length = 1),
                    this._strip()
                }
                ,
                i.prototype.ishrn = function(t, e, n) {
                    return r(0 === this.negative),
                    this.iushrn(t, e, n)
                }
                ,
                i.prototype.shln = function(t) {
                    return this.clone().ishln(t)
                }
                ,
                i.prototype.ushln = function(t) {
                    return this.clone().iushln(t)
                }
                ,
                i.prototype.shrn = function(t) {
                    return this.clone().ishrn(t)
                }
                ,
                i.prototype.ushrn = function(t) {
                    return this.clone().iushrn(t)
                }
                ,
                i.prototype.testn = function(t) {
                    r("number" == typeof t && t >= 0);
                    var e = t % 26
                      , n = (t - e) / 26
                      , o = 1 << e;
                    return !(this.length <= n || !(this.words[n] & o))
                }
                ,
                i.prototype.imaskn = function(t) {
                    r("number" == typeof t && t >= 0);
                    var e = t % 26
                      , n = (t - e) / 26;
                    if (r(0 === this.negative, "imaskn works only with positive numbers"),
                    this.length <= n)
                        return this;
                    if (0 !== e && n++,
                    this.length = Math.min(n, this.length),
                    0 !== e) {
                        var o = 67108863 ^ 67108863 >>> e << e;
                        this.words[this.length - 1] &= o
                    }
                    return this._strip()
                }
                ,
                i.prototype.maskn = function(t) {
                    return this.clone().imaskn(t)
                }
                ,
                i.prototype.iaddn = function(t) {
                    return r("number" == typeof t),
                    r(t < 67108864),
                    t < 0 ? this.isubn(-t) : 0 !== this.negative ? 1 === this.length && (0 | this.words[0]) <= t ? (this.words[0] = t - (0 | this.words[0]),
                    this.negative = 0,
                    this) : (this.negative = 0,
                    this.isubn(t),
                    this.negative = 1,
                    this) : this._iaddn(t)
                }
                ,
                i.prototype._iaddn = function(t) {
                    this.words[0] += t;
                    for (var e = 0; e < this.length && this.words[e] >= 67108864; e++)
                        this.words[e] -= 67108864,
                        e === this.length - 1 ? this.words[e + 1] = 1 : this.words[e + 1]++;
                    return this.length = Math.max(this.length, e + 1),
                    this
                }
                ,
                i.prototype.isubn = function(t) {
                    if (r("number" == typeof t),
                    r(t < 67108864),
                    t < 0)
                        return this.iaddn(-t);
                    if (0 !== this.negative)
                        return this.negative = 0,
                        this.iaddn(t),
                        this.negative = 1,
                        this;
                    if (this.words[0] -= t,
                    1 === this.length && this.words[0] < 0)
                        this.words[0] = -this.words[0],
                        this.negative = 1;
                    else
                        for (var e = 0; e < this.length && this.words[e] < 0; e++)
                            this.words[e] += 67108864,
                            this.words[e + 1] -= 1;
                    return this._strip()
                }
                ,
                i.prototype.addn = function(t) {
                    return this.clone().iaddn(t)
                }
                ,
                i.prototype.subn = function(t) {
                    return this.clone().isubn(t)
                }
                ,
                i.prototype.iabs = function() {
                    return this.negative = 0,
                    this
                }
                ,
                i.prototype.abs = function() {
                    return this.clone().iabs()
                }
                ,
                i.prototype._ishlnsubmul = function(t, e, n) {
                    var o, i, s = t.length + n;
                    this._expand(s);
                    var a = 0;
                    for (o = 0; o < t.length; o++) {
                        i = (0 | this.words[o + n]) + a;
                        var u = (0 | t.words[o]) * e;
                        a = ((i -= 67108863 & u) >> 26) - (u / 67108864 | 0),
                        this.words[o + n] = 67108863 & i
                    }
                    for (; o < this.length - n; o++)
                        a = (i = (0 | this.words[o + n]) + a) >> 26,
                        this.words[o + n] = 67108863 & i;
                    if (0 === a)
                        return this._strip();
                    for (r(-1 === a),
                    a = 0,
                    o = 0; o < this.length; o++)
                        a = (i = -(0 | this.words[o]) + a) >> 26,
                        this.words[o] = 67108863 & i;
                    return this.negative = 1,
                    this._strip()
                }
                ,
                i.prototype._wordDiv = function(t, e) {
                    var n = (this.length,
                    t.length)
                      , r = this.clone()
                      , o = t
                      , s = 0 | o.words[o.length - 1];
                    0 != (n = 26 - this._countBits(s)) && (o = o.ushln(n),
                    r.iushln(n),
                    s = 0 | o.words[o.length - 1]);
                    var a, u = r.length - o.length;
                    if ("mod" !== e) {
                        (a = new i(null)).length = u + 1,
                        a.words = new Array(a.length);
                        for (var c = 0; c < a.length; c++)
                            a.words[c] = 0
                    }
                    var l = r.clone()._ishlnsubmul(o, 1, u);
                    0 === l.negative && (r = l,
                    a && (a.words[u] = 1));
                    for (var f = u - 1; f >= 0; f--) {
                        var h = 67108864 * (0 | r.words[o.length + f]) + (0 | r.words[o.length + f - 1]);
                        for (h = Math.min(h / s | 0, 67108863),
                        r._ishlnsubmul(o, h, f); 0 !== r.negative; )
                            h--,
                            r.negative = 0,
                            r._ishlnsubmul(o, 1, f),
                            r.isZero() || (r.negative ^= 1);
                        a && (a.words[f] = h)
                    }
                    return a && a._strip(),
                    r._strip(),
                    "div" !== e && 0 !== n && r.iushrn(n),
                    {
                        div: a || null,
                        mod: r
                    }
                }
                ,
                i.prototype.divmod = function(t, e, n) {
                    return r(!t.isZero()),
                    this.isZero() ? {
                        div: new i(0),
                        mod: new i(0)
                    } : 0 !== this.negative && 0 === t.negative ? (a = this.neg().divmod(t, e),
                    "mod" !== e && (o = a.div.neg()),
                    "div" !== e && (s = a.mod.neg(),
                    n && 0 !== s.negative && s.iadd(t)),
                    {
                        div: o,
                        mod: s
                    }) : 0 === this.negative && 0 !== t.negative ? (a = this.divmod(t.neg(), e),
                    "mod" !== e && (o = a.div.neg()),
                    {
                        div: o,
                        mod: a.mod
                    }) : this.negative & t.negative ? (a = this.neg().divmod(t.neg(), e),
                    "div" !== e && (s = a.mod.neg(),
                    n && 0 !== s.negative && s.isub(t)),
                    {
                        div: a.div,
                        mod: s
                    }) : t.length > this.length || this.cmp(t) < 0 ? {
                        div: new i(0),
                        mod: this
                    } : 1 === t.length ? "div" === e ? {
                        div: this.divn(t.words[0]),
                        mod: null
                    } : "mod" === e ? {
                        div: null,
                        mod: new i(this.modrn(t.words[0]))
                    } : {
                        div: this.divn(t.words[0]),
                        mod: new i(this.modrn(t.words[0]))
                    } : this._wordDiv(t, e);
                    var o, s, a
                }
                ,
                i.prototype.div = function(t) {
                    return this.divmod(t, "div", !1).div
                }
                ,
                i.prototype.mod = function(t) {
                    return this.divmod(t, "mod", !1).mod
                }
                ,
                i.prototype.umod = function(t) {
                    return this.divmod(t, "mod", !0).mod
                }
                ,
                i.prototype.divRound = function(t) {
                    var e = this.divmod(t);
                    if (e.mod.isZero())
                        return e.div;
                    var n = 0 !== e.div.negative ? e.mod.isub(t) : e.mod
                      , r = t.ushrn(1)
                      , o = t.andln(1)
                      , i = n.cmp(r);
                    return i < 0 || 1 === o && 0 === i ? e.div : 0 !== e.div.negative ? e.div.isubn(1) : e.div.iaddn(1)
                }
                ,
                i.prototype.modrn = function(t) {
                    var e = t < 0;
                    e && (t = -t),
                    r(t <= 67108863);
                    for (var n = (1 << 26) % t, o = 0, i = this.length - 1; i >= 0; i--)
                        o = (n * o + (0 | this.words[i])) % t;
                    return e ? -o : o
                }
                ,
                i.prototype.modn = function(t) {
                    return this.modrn(t)
                }
                ,
                i.prototype.idivn = function(t) {
                    var e = t < 0;
                    e && (t = -t),
                    r(t <= 67108863);
                    for (var n = 0, o = this.length - 1; o >= 0; o--) {
                        var i = (0 | this.words[o]) + 67108864 * n;
                        this.words[o] = i / t | 0,
                        n = i % t
                    }
                    return this._strip(),
                    e ? this.ineg() : this
                }
                ,
                i.prototype.divn = function(t) {
                    return this.clone().idivn(t)
                }
                ,
                i.prototype.egcd = function(t) {
                    r(0 === t.negative),
                    r(!t.isZero());
                    var e = this
                      , n = t.clone();
                    e = 0 !== e.negative ? e.umod(t) : e.clone();
                    for (var o = new i(1), s = new i(0), a = new i(0), u = new i(1), c = 0; e.isEven() && n.isEven(); )
                        e.iushrn(1),
                        n.iushrn(1),
                        ++c;
                    for (var l = n.clone(), f = e.clone(); !e.isZero(); ) {
                        for (var h = 0, d = 1; !(e.words[0] & d) && h < 26; ++h,
                        d <<= 1)
                            ;
                        if (h > 0)
                            for (e.iushrn(h); h-- > 0; )
                                (o.isOdd() || s.isOdd()) && (o.iadd(l),
                                s.isub(f)),
                                o.iushrn(1),
                                s.iushrn(1);
                        for (var p = 0, y = 1; !(n.words[0] & y) && p < 26; ++p,
                        y <<= 1)
                            ;
                        if (p > 0)
                            for (n.iushrn(p); p-- > 0; )
                                (a.isOdd() || u.isOdd()) && (a.iadd(l),
                                u.isub(f)),
                                a.iushrn(1),
                                u.iushrn(1);
                        e.cmp(n) >= 0 ? (e.isub(n),
                        o.isub(a),
                        s.isub(u)) : (n.isub(e),
                        a.isub(o),
                        u.isub(s))
                    }
                    return {
                        a,
                        b: u,
                        gcd: n.iushln(c)
                    }
                }
                ,
                i.prototype._invmp = function(t) {
                    r(0 === t.negative),
                    r(!t.isZero());
                    var e = this
                      , n = t.clone();
                    e = 0 !== e.negative ? e.umod(t) : e.clone();
                    for (var o, s = new i(1), a = new i(0), u = n.clone(); e.cmpn(1) > 0 && n.cmpn(1) > 0; ) {
                        for (var c = 0, l = 1; !(e.words[0] & l) && c < 26; ++c,
                        l <<= 1)
                            ;
                        if (c > 0)
                            for (e.iushrn(c); c-- > 0; )
                                s.isOdd() && s.iadd(u),
                                s.iushrn(1);
                        for (var f = 0, h = 1; !(n.words[0] & h) && f < 26; ++f,
                        h <<= 1)
                            ;
                        if (f > 0)
                            for (n.iushrn(f); f-- > 0; )
                                a.isOdd() && a.iadd(u),
                                a.iushrn(1);
                        e.cmp(n) >= 0 ? (e.isub(n),
                        s.isub(a)) : (n.isub(e),
                        a.isub(s))
                    }
                    return (o = 0 === e.cmpn(1) ? s : a).cmpn(0) < 0 && o.iadd(t),
                    o
                }
                ,
                i.prototype.gcd = function(t) {
                    if (this.isZero())
                        return t.abs();
                    if (t.isZero())
                        return this.abs();
                    var e = this.clone()
                      , n = t.clone();
                    e.negative = 0,
                    n.negative = 0;
                    for (var r = 0; e.isEven() && n.isEven(); r++)
                        e.iushrn(1),
                        n.iushrn(1);
                    for (; ; ) {
                        for (; e.isEven(); )
                            e.iushrn(1);
                        for (; n.isEven(); )
                            n.iushrn(1);
                        var o = e.cmp(n);
                        if (o < 0) {
                            var i = e;
                            e = n,
                            n = i
                        } else if (0 === o || 0 === n.cmpn(1))
                            break;
                        e.isub(n)
                    }
                    return n.iushln(r)
                }
                ,
                i.prototype.invm = function(t) {
                    return this.egcd(t).a.umod(t)
                }
                ,
                i.prototype.isEven = function() {
                    return !(1 & this.words[0])
                }
                ,
                i.prototype.isOdd = function() {
                    return !(1 & ~this.words[0])
                }
                ,
                i.prototype.andln = function(t) {
                    return this.words[0] & t
                }
                ,
                i.prototype.bincn = function(t) {
                    r("number" == typeof t);
                    var e = t % 26
                      , n = (t - e) / 26
                      , o = 1 << e;
                    if (this.length <= n)
                        return this._expand(n + 1),
                        this.words[n] |= o,
                        this;
                    for (var i = o, s = n; 0 !== i && s < this.length; s++) {
                        var a = 0 | this.words[s];
                        i = (a += i) >>> 26,
                        a &= 67108863,
                        this.words[s] = a
                    }
                    return 0 !== i && (this.words[s] = i,
                    this.length++),
                    this
                }
                ,
                i.prototype.isZero = function() {
                    return 1 === this.length && 0 === this.words[0]
                }
                ,
                i.prototype.cmpn = function(t) {
                    var e, n = t < 0;
                    if (0 !== this.negative && !n)
                        return -1;
                    if (0 === this.negative && n)
                        return 1;
                    if (this._strip(),
                    this.length > 1)
                        e = 1;
                    else {
                        n && (t = -t),
                        r(t <= 67108863, "Number is too big");
                        var o = 0 | this.words[0];
                        e = o === t ? 0 : o < t ? -1 : 1
                    }
                    return 0 !== this.negative ? 0 | -e : e
                }
                ,
                i.prototype.cmp = function(t) {
                    if (0 !== this.negative && 0 === t.negative)
                        return -1;
                    if (0 === this.negative && 0 !== t.negative)
                        return 1;
                    var e = this.ucmp(t);
                    return 0 !== this.negative ? 0 | -e : e
                }
                ,
                i.prototype.ucmp = function(t) {
                    if (this.length > t.length)
                        return 1;
                    if (this.length < t.length)
                        return -1;
                    for (var e = 0, n = this.length - 1; n >= 0; n--) {
                        var r = 0 | this.words[n]
                          , o = 0 | t.words[n];
                        if (r !== o) {
                            r < o ? e = -1 : r > o && (e = 1);
                            break
                        }
                    }
                    return e
                }
                ,
                i.prototype.gtn = function(t) {
                    return 1 === this.cmpn(t)
                }
                ,
                i.prototype.gt = function(t) {
                    return 1 === this.cmp(t)
                }
                ,
                i.prototype.gten = function(t) {
                    return this.cmpn(t) >= 0
                }
                ,
                i.prototype.gte = function(t) {
                    return this.cmp(t) >= 0
                }
                ,
                i.prototype.ltn = function(t) {
                    return -1 === this.cmpn(t)
                }
                ,
                i.prototype.lt = function(t) {
                    return -1 === this.cmp(t)
                }
                ,
                i.prototype.lten = function(t) {
                    return this.cmpn(t) <= 0
                }
                ,
                i.prototype.lte = function(t) {
                    return this.cmp(t) <= 0
                }
                ,
                i.prototype.eqn = function(t) {
                    return 0 === this.cmpn(t)
                }
                ,
                i.prototype.eq = function(t) {
                    return 0 === this.cmp(t)
                }
                ,
                i.red = function(t) {
                    return new S(t)
                }
                ,
                i.prototype.toRed = function(t) {
                    return r(!this.red, "Already a number in reduction context"),
                    r(0 === this.negative, "red works only with positives"),
                    t.convertTo(this)._forceRed(t)
                }
                ,
                i.prototype.fromRed = function() {
                    return r(this.red, "fromRed works only with numbers in reduction context"),
                    this.red.convertFrom(this)
                }
                ,
                i.prototype._forceRed = function(t) {
                    return this.red = t,
                    this
                }
                ,
                i.prototype.forceRed = function(t) {
                    return r(!this.red, "Already a number in reduction context"),
                    this._forceRed(t)
                }
                ,
                i.prototype.redAdd = function(t) {
                    return r(this.red, "redAdd works only with red numbers"),
                    this.red.add(this, t)
                }
                ,
                i.prototype.redIAdd = function(t) {
                    return r(this.red, "redIAdd works only with red numbers"),
                    this.red.iadd(this, t)
                }
                ,
                i.prototype.redSub = function(t) {
                    return r(this.red, "redSub works only with red numbers"),
                    this.red.sub(this, t)
                }
                ,
                i.prototype.redISub = function(t) {
                    return r(this.red, "redISub works only with red numbers"),
                    this.red.isub(this, t)
                }
                ,
                i.prototype.redShl = function(t) {
                    return r(this.red, "redShl works only with red numbers"),
                    this.red.shl(this, t)
                }
                ,
                i.prototype.redMul = function(t) {
                    return r(this.red, "redMul works only with red numbers"),
                    this.red._verify2(this, t),
                    this.red.mul(this, t)
                }
                ,
                i.prototype.redIMul = function(t) {
                    return r(this.red, "redMul works only with red numbers"),
                    this.red._verify2(this, t),
                    this.red.imul(this, t)
                }
                ,
                i.prototype.redSqr = function() {
                    return r(this.red, "redSqr works only with red numbers"),
                    this.red._verify1(this),
                    this.red.sqr(this)
                }
                ,
                i.prototype.redISqr = function() {
                    return r(this.red, "redISqr works only with red numbers"),
                    this.red._verify1(this),
                    this.red.isqr(this)
                }
                ,
                i.prototype.redSqrt = function() {
                    return r(this.red, "redSqrt works only with red numbers"),
                    this.red._verify1(this),
                    this.red.sqrt(this)
                }
                ,
                i.prototype.redInvm = function() {
                    return r(this.red, "redInvm works only with red numbers"),
                    this.red._verify1(this),
                    this.red.invm(this)
                }
                ,
                i.prototype.redNeg = function() {
                    return r(this.red, "redNeg works only with red numbers"),
                    this.red._verify1(this),
                    this.red.neg(this)
                }
                ,
                i.prototype.redPow = function(t) {
                    return r(this.red && !t.red, "redPow(normalNum)"),
                    this.red._verify1(this),
                    this.red.pow(this, t)
                }
                ;
                var v = {
                    k256: null,
                    p224: null,
                    p192: null,
                    p25519: null
                };
                function M(t, e) {
                    this.name = t,
                    this.p = new i(e,16),
                    this.n = this.p.bitLength(),
                    this.k = new i(1).iushln(this.n).isub(this.p),
                    this.tmp = this._tmp()
                }
                function x() {
                    M.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")
                }
                function j() {
                    M.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")
                }
                function I() {
                    M.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")
                }
                function A() {
                    M.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")
                }
                function S(t) {
                    if ("string" == typeof t) {
                        var e = i._prime(t);
                        this.m = e.p,
                        this.prime = e
                    } else
                        r(t.gtn(1), "modulus must be greater than 1"),
                        this.m = t,
                        this.prime = null
                }
                function _(t) {
                    S.call(this, t),
                    this.shift = this.m.bitLength(),
                    this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26),
                    this.r = new i(1).iushln(this.shift),
                    this.r2 = this.imod(this.r.sqr()),
                    this.rinv = this.r._invmp(this.m),
                    this.minv = this.rinv.mul(this.r).isubn(1).div(this.m),
                    this.minv = this.minv.umod(this.r),
                    this.minv = this.r.sub(this.minv)
                }
                M.prototype._tmp = function() {
                    var t = new i(null);
                    return t.words = new Array(Math.ceil(this.n / 13)),
                    t
                }
                ,
                M.prototype.ireduce = function(t) {
                    var e, n = t;
                    do {
                        this.split(n, this.tmp),
                        e = (n = (n = this.imulK(n)).iadd(this.tmp)).bitLength()
                    } while (e > this.n);
                    var r = e < this.n ? -1 : n.ucmp(this.p);
                    return 0 === r ? (n.words[0] = 0,
                    n.length = 1) : r > 0 ? n.isub(this.p) : void 0 !== n.strip ? n.strip() : n._strip(),
                    n
                }
                ,
                M.prototype.split = function(t, e) {
                    t.iushrn(this.n, 0, e)
                }
                ,
                M.prototype.imulK = function(t) {
                    return t.imul(this.k)
                }
                ,
                o(x, M),
                x.prototype.split = function(t, e) {
                    for (var n = 4194303, r = Math.min(t.length, 9), o = 0; o < r; o++)
                        e.words[o] = t.words[o];
                    if (e.length = r,
                    t.length <= 9)
                        return t.words[0] = 0,
                        void (t.length = 1);
                    var i = t.words[9];
                    for (e.words[e.length++] = i & n,
                    o = 10; o < t.length; o++) {
                        var s = 0 | t.words[o];
                        t.words[o - 10] = (s & n) << 4 | i >>> 22,
                        i = s
                    }
                    i >>>= 22,
                    t.words[o - 10] = i,
                    0 === i && t.length > 10 ? t.length -= 10 : t.length -= 9
                }
                ,
                x.prototype.imulK = function(t) {
                    t.words[t.length] = 0,
                    t.words[t.length + 1] = 0,
                    t.length += 2;
                    for (var e = 0, n = 0; n < t.length; n++) {
                        var r = 0 | t.words[n];
                        e += 977 * r,
                        t.words[n] = 67108863 & e,
                        e = 64 * r + (e / 67108864 | 0)
                    }
                    return 0 === t.words[t.length - 1] && (t.length--,
                    0 === t.words[t.length - 1] && t.length--),
                    t
                }
                ,
                o(j, M),
                o(I, M),
                o(A, M),
                A.prototype.imulK = function(t) {
                    for (var e = 0, n = 0; n < t.length; n++) {
                        var r = 19 * (0 | t.words[n]) + e
                          , o = 67108863 & r;
                        r >>>= 26,
                        t.words[n] = o,
                        e = r
                    }
                    return 0 !== e && (t.words[t.length++] = e),
                    t
                }
                ,
                i._prime = function(t) {
                    if (v[t])
                        return v[t];
                    var e;
                    if ("k256" === t)
                        e = new x;
                    else if ("p224" === t)
                        e = new j;
                    else if ("p192" === t)
                        e = new I;
                    else {
                        if ("p25519" !== t)
                            throw new Error("Unknown prime " + t);
                        e = new A
                    }
                    return v[t] = e,
                    e
                }
                ,
                S.prototype._verify1 = function(t) {
                    r(0 === t.negative, "red works only with positives"),
                    r(t.red, "red works only with red numbers")
                }
                ,
                S.prototype._verify2 = function(t, e) {
                    r(!(t.negative | e.negative), "red works only with positives"),
                    r(t.red && t.red === e.red, "red works only with red numbers")
                }
                ,
                S.prototype.imod = function(t) {
                    return this.prime ? this.prime.ireduce(t)._forceRed(this) : (l(t, t.umod(this.m)._forceRed(this)),
                    t)
                }
                ,
                S.prototype.neg = function(t) {
                    return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this)
                }
                ,
                S.prototype.add = function(t, e) {
                    this._verify2(t, e);
                    var n = t.add(e);
                    return n.cmp(this.m) >= 0 && n.isub(this.m),
                    n._forceRed(this)
                }
                ,
                S.prototype.iadd = function(t, e) {
                    this._verify2(t, e);
                    var n = t.iadd(e);
                    return n.cmp(this.m) >= 0 && n.isub(this.m),
                    n
                }
                ,
                S.prototype.sub = function(t, e) {
                    this._verify2(t, e);
                    var n = t.sub(e);
                    return n.cmpn(0) < 0 && n.iadd(this.m),
                    n._forceRed(this)
                }
                ,
                S.prototype.isub = function(t, e) {
                    this._verify2(t, e);
                    var n = t.isub(e);
                    return n.cmpn(0) < 0 && n.iadd(this.m),
                    n
                }
                ,
                S.prototype.shl = function(t, e) {
                    return this._verify1(t),
                    this.imod(t.ushln(e))
                }
                ,
                S.prototype.imul = function(t, e) {
                    return this._verify2(t, e),
                    this.imod(t.imul(e))
                }
                ,
                S.prototype.mul = function(t, e) {
                    return this._verify2(t, e),
                    this.imod(t.mul(e))
                }
                ,
                S.prototype.isqr = function(t) {
                    return this.imul(t, t.clone())
                }
                ,
                S.prototype.sqr = function(t) {
                    return this.mul(t, t)
                }
                ,
                S.prototype.sqrt = function(t) {
                    if (t.isZero())
                        return t.clone();
                    var e = this.m.andln(3);
                    if (r(e % 2 == 1),
                    3 === e) {
                        var n = this.m.add(new i(1)).iushrn(2);
                        return this.pow(t, n)
                    }
                    for (var o = this.m.subn(1), s = 0; !o.isZero() && 0 === o.andln(1); )
                        s++,
                        o.iushrn(1);
                    r(!o.isZero());
                    var a = new i(1).toRed(this)
                      , u = a.redNeg()
                      , c = this.m.subn(1).iushrn(1)
                      , l = this.m.bitLength();
                    for (l = new i(2 * l * l).toRed(this); 0 !== this.pow(l, c).cmp(u); )
                        l.redIAdd(u);
                    for (var f = this.pow(l, o), h = this.pow(t, o.addn(1).iushrn(1)), d = this.pow(t, o), p = s; 0 !== d.cmp(a); ) {
                        for (var y = d, g = 0; 0 !== y.cmp(a); g++)
                            y = y.redSqr();
                        r(g < p);
                        var m = this.pow(f, new i(1).iushln(p - g - 1));
                        h = h.redMul(m),
                        f = m.redSqr(),
                        d = d.redMul(f),
                        p = g
                    }
                    return h
                }
                ,
                S.prototype.invm = function(t) {
                    var e = t._invmp(this.m);
                    return 0 !== e.negative ? (e.negative = 0,
                    this.imod(e).redNeg()) : this.imod(e)
                }
                ,
                S.prototype.pow = function(t, e) {
                    if (e.isZero())
                        return new i(1).toRed(this);
                    if (0 === e.cmpn(1))
                        return t.clone();
                    var n = new Array(16);
                    n[0] = new i(1).toRed(this),
                    n[1] = t;
                    for (var r = 2; r < n.length; r++)
                        n[r] = this.mul(n[r - 1], t);
                    var o = n[0]
                      , s = 0
                      , a = 0
                      , u = e.bitLength() % 26;
                    for (0 === u && (u = 26),
                    r = e.length - 1; r >= 0; r--) {
                        for (var c = e.words[r], l = u - 1; l >= 0; l--) {
                            var f = c >> l & 1;
                            o !== n[0] && (o = this.sqr(o)),
                            0 !== f || 0 !== s ? (s <<= 1,
                            s |= f,
                            (4 == ++a || 0 === r && 0 === l) && (o = this.mul(o, n[s]),
                            a = 0,
                            s = 0)) : a = 0
                        }
                        u = 26
                    }
                    return o
                }
                ,
                S.prototype.convertTo = function(t) {
                    var e = t.umod(this.m);
                    return e === t ? e.clone() : e
                }
                ,
                S.prototype.convertFrom = function(t) {
                    var e = t.clone();
                    return e.red = null,
                    e
                }
                ,
                i.mont = function(t) {
                    return new _(t)
                }
                ,
                o(_, S),
                _.prototype.convertTo = function(t) {
                    return this.imod(t.ushln(this.shift))
                }
                ,
                _.prototype.convertFrom = function(t) {
                    var e = this.imod(t.mul(this.rinv));
                    return e.red = null,
                    e
                }
                ,
                _.prototype.imul = function(t, e) {
                    if (t.isZero() || e.isZero())
                        return t.words[0] = 0,
                        t.length = 1,
                        t;
                    var n = t.imul(e)
                      , r = n.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m)
                      , o = n.isub(r).iushrn(this.shift)
                      , i = o;
                    return o.cmp(this.m) >= 0 ? i = o.isub(this.m) : o.cmpn(0) < 0 && (i = o.iadd(this.m)),
                    i._forceRed(this)
                }
                ,
                _.prototype.mul = function(t, e) {
                    if (t.isZero() || e.isZero())
                        return new i(0)._forceRed(this);
                    var n = t.mul(e)
                      , r = n.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m)
                      , o = n.isub(r).iushrn(this.shift)
                      , s = o;
                    return o.cmp(this.m) >= 0 ? s = o.isub(this.m) : o.cmpn(0) < 0 && (s = o.iadd(this.m)),
                    s._forceRed(this)
                }
                ,
                _.prototype.invm = function(t) {
                    return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this)
                }
            }(t = n.nmd(t), this)
        },
        "../../../node_modules/borsh/lib/index.js": function(t, e, n) {
            "use strict";
            var r = n("../../../node_modules/buffer/index.js").Buffer
              , o = this && this.__createBinding || (Object.create ? function(t, e, n, r) {
                void 0 === r && (r = n),
                Object.defineProperty(t, r, {
                    enumerable: !0,
                    get: function() {
                        return e[n]
                    }
                })
            }
            : function(t, e, n, r) {
                void 0 === r && (r = n),
                t[r] = e[n]
            }
            )
              , i = this && this.__setModuleDefault || (Object.create ? function(t, e) {
                Object.defineProperty(t, "default", {
                    enumerable: !0,
                    value: e
                })
            }
            : function(t, e) {
                t.default = e
            }
            )
              , s = this && this.__decorate || function(t, e, n, r) {
                var o, i = arguments.length, s = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, n) : r;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                    s = Reflect.decorate(t, e, n, r);
                else
                    for (var a = t.length - 1; a >= 0; a--)
                        (o = t[a]) && (s = (i < 3 ? o(s) : i > 3 ? o(e, n, s) : o(e, n)) || s);
                return i > 3 && s && Object.defineProperty(e, n, s),
                s
            }
              , a = this && this.__importStar || function(t) {
                if (t && t.__esModule)
                    return t;
                var e = {};
                if (null != t)
                    for (var n in t)
                        "default" !== n && Object.hasOwnProperty.call(t, n) && o(e, t, n);
                return i(e, t),
                e
            }
              , u = this && this.__importDefault || function(t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            }
            ;
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.deserializeUnchecked = e.deserialize = e.serialize = e.BinaryReader = e.BinaryWriter = e.BorshError = e.baseDecode = e.baseEncode = void 0;
            const c = u(n("../../../node_modules/bn.js/lib/bn.js"))
              , l = u(n("../../../node_modules/bs58/index.js"))
              , f = a(n("../../../node_modules/text-encoding-utf-8/lib/encoding.lib.js"))
              , h = new ("function" != typeof TextDecoder ? f.TextDecoder : TextDecoder)("utf-8",{
                fatal: !0
            });
            e.baseEncode = function(t) {
                return "string" == typeof t && (t = r.from(t, "utf8")),
                l.default.encode(r.from(t))
            }
            ,
            e.baseDecode = function(t) {
                return r.from(l.default.decode(t))
            }
            ;
            const d = 1024;
            class p extends Error {
                constructor(t) {
                    super(t),
                    this.fieldPath = [],
                    this.originalMessage = t
                }
                addToFieldPath(t) {
                    this.fieldPath.splice(0, 0, t),
                    this.message = this.originalMessage + ": " + this.fieldPath.join(".")
                }
            }
            e.BorshError = p;
            class y {
                constructor() {
                    this.buf = r.alloc(d),
                    this.length = 0
                }
                maybeResize() {
                    this.buf.length < 16 + this.length && (this.buf = r.concat([this.buf, r.alloc(d)]))
                }
                writeU8(t) {
                    this.maybeResize(),
                    this.buf.writeUInt8(t, this.length),
                    this.length += 1
                }
                writeU16(t) {
                    this.maybeResize(),
                    this.buf.writeUInt16LE(t, this.length),
                    this.length += 2
                }
                writeU32(t) {
                    this.maybeResize(),
                    this.buf.writeUInt32LE(t, this.length),
                    this.length += 4
                }
                writeU64(t) {
                    this.maybeResize(),
                    this.writeBuffer(r.from(new c.default(t).toArray("le", 8)))
                }
                writeU128(t) {
                    this.maybeResize(),
                    this.writeBuffer(r.from(new c.default(t).toArray("le", 16)))
                }
                writeU256(t) {
                    this.maybeResize(),
                    this.writeBuffer(r.from(new c.default(t).toArray("le", 32)))
                }
                writeU512(t) {
                    this.maybeResize(),
                    this.writeBuffer(r.from(new c.default(t).toArray("le", 64)))
                }
                writeBuffer(t) {
                    this.buf = r.concat([r.from(this.buf.subarray(0, this.length)), t, r.alloc(d)]),
                    this.length += t.length
                }
                writeString(t) {
                    this.maybeResize();
                    const e = r.from(t, "utf8");
                    this.writeU32(e.length),
                    this.writeBuffer(e)
                }
                writeFixedArray(t) {
                    this.writeBuffer(r.from(t))
                }
                writeArray(t, e) {
                    this.maybeResize(),
                    this.writeU32(t.length);
                    for (const n of t)
                        this.maybeResize(),
                        e(n)
                }
                toArray() {
                    return this.buf.subarray(0, this.length)
                }
            }
            function g(t, e, n) {
                const r = n.value;
                n.value = function(...t) {
                    try {
                        return r.apply(this, t)
                    } catch (t) {
                        if (t instanceof RangeError) {
                            const e = t.code;
                            if (["ERR_BUFFER_OUT_OF_BOUNDS", "ERR_OUT_OF_RANGE"].indexOf(e) >= 0)
                                throw new p("Reached the end of buffer when deserializing")
                        }
                        throw t
                    }
                }
            }
            e.BinaryWriter = y;
            class m {
                constructor(t) {
                    this.buf = t,
                    this.offset = 0
                }
                readU8() {
                    const t = this.buf.readUInt8(this.offset);
                    return this.offset += 1,
                    t
                }
                readU16() {
                    const t = this.buf.readUInt16LE(this.offset);
                    return this.offset += 2,
                    t
                }
                readU32() {
                    const t = this.buf.readUInt32LE(this.offset);
                    return this.offset += 4,
                    t
                }
                readU64() {
                    const t = this.readBuffer(8);
                    return new c.default(t,"le")
                }
                readU128() {
                    const t = this.readBuffer(16);
                    return new c.default(t,"le")
                }
                readU256() {
                    const t = this.readBuffer(32);
                    return new c.default(t,"le")
                }
                readU512() {
                    const t = this.readBuffer(64);
                    return new c.default(t,"le")
                }
                readBuffer(t) {
                    if (this.offset + t > this.buf.length)
                        throw new p(`Expected buffer length ${t} isn't within bounds`);
                    const e = this.buf.slice(this.offset, this.offset + t);
                    return this.offset += t,
                    e
                }
                readString() {
                    const t = this.readU32()
                      , e = this.readBuffer(t);
                    try {
                        return h.decode(e)
                    } catch (t) {
                        throw new p(`Error decoding UTF-8 string: ${t}`)
                    }
                }
                readFixedArray(t) {
                    return new Uint8Array(this.readBuffer(t))
                }
                readArray(t) {
                    const e = this.readU32()
                      , n = Array();
                    for (let r = 0; r < e; ++r)
                        n.push(t());
                    return n
                }
            }
            function b(t) {
                return t.charAt(0).toUpperCase() + t.slice(1)
            }
            function w(t, e, n, r, o) {
                try {
                    if ("string" == typeof r)
                        o[`write${b(r)}`](n);
                    else if (r instanceof Array)
                        if ("number" == typeof r[0]) {
                            if (n.length !== r[0])
                                throw new p(`Expecting byte array of length ${r[0]}, but got ${n.length} bytes`);
                            o.writeFixedArray(n)
                        } else if (2 === r.length && "number" == typeof r[1]) {
                            if (n.length !== r[1])
                                throw new p(`Expecting byte array of length ${r[1]}, but got ${n.length} bytes`);
                            for (let e = 0; e < r[1]; e++)
                                w(t, null, n[e], r[0], o)
                        } else
                            o.writeArray(n, (n=>{
                                w(t, e, n, r[0], o)
                            }
                            ));
                    else if (void 0 !== r.kind)
                        switch (r.kind) {
                        case "option":
                            null == n ? o.writeU8(0) : (o.writeU8(1),
                            w(t, e, n, r.type, o));
                            break;
                        case "map":
                            o.writeU32(n.size),
                            n.forEach(((n,i)=>{
                                w(t, e, i, r.key, o),
                                w(t, e, n, r.value, o)
                            }
                            ));
                            break;
                        default:
                            throw new p(`FieldType ${r} unrecognized`)
                        }
                    else
                        v(t, n, o)
                } catch (t) {
                    throw t instanceof p && t.addToFieldPath(e),
                    t
                }
            }
            function v(t, e, n) {
                if ("function" == typeof e.borshSerialize)
                    return void e.borshSerialize(n);
                const r = t.get(e.constructor);
                if (!r)
                    throw new p(`Class ${e.constructor.name} is missing in schema`);
                if ("struct" === r.kind)
                    r.fields.map((([r,o])=>{
                        w(t, r, e[r], o, n)
                    }
                    ));
                else {
                    if ("enum" !== r.kind)
                        throw new p(`Unexpected schema kind: ${r.kind} for ${e.constructor.name}`);
                    {
                        const o = e[r.field];
                        for (let i = 0; i < r.values.length; ++i) {
                            const [s,a] = r.values[i];
                            if (s === o) {
                                n.writeU8(i),
                                w(t, s, e[s], a, n);
                                break
                            }
                        }
                    }
                }
            }
            function M(t, e, n, r) {
                try {
                    if ("string" == typeof n)
                        return r[`read${b(n)}`]();
                    if (n instanceof Array) {
                        if ("number" == typeof n[0])
                            return r.readFixedArray(n[0]);
                        if ("number" == typeof n[1]) {
                            const e = [];
                            for (let o = 0; o < n[1]; o++)
                                e.push(M(t, null, n[0], r));
                            return e
                        }
                        return r.readArray((()=>M(t, e, n[0], r)))
                    }
                    if ("option" === n.kind)
                        return r.readU8() ? M(t, e, n.type, r) : void 0;
                    if ("map" === n.kind) {
                        let o = new Map;
                        const i = r.readU32();
                        for (let s = 0; s < i; s++) {
                            const i = M(t, e, n.key, r)
                              , s = M(t, e, n.value, r);
                            o.set(i, s)
                        }
                        return o
                    }
                    return x(t, n, r)
                } catch (t) {
                    throw t instanceof p && t.addToFieldPath(e),
                    t
                }
            }
            function x(t, e, n) {
                if ("function" == typeof e.borshDeserialize)
                    return e.borshDeserialize(n);
                const r = t.get(e);
                if (!r)
                    throw new p(`Class ${e.name} is missing in schema`);
                if ("struct" === r.kind) {
                    const r = {};
                    for (const [o,i] of t.get(e).fields)
                        r[o] = M(t, o, i, n);
                    return new e(r)
                }
                if ("enum" === r.kind) {
                    const o = n.readU8();
                    if (o >= r.values.length)
                        throw new p(`Enum index: ${o} is out of range`);
                    const [i,s] = r.values[o]
                      , a = M(t, i, s, n);
                    return new e({
                        [i]: a
                    })
                }
                throw new p(`Unexpected schema kind: ${r.kind} for ${e.constructor.name}`)
            }
            s([g], m.prototype, "readU8", null),
            s([g], m.prototype, "readU16", null),
            s([g], m.prototype, "readU32", null),
            s([g], m.prototype, "readU64", null),
            s([g], m.prototype, "readU128", null),
            s([g], m.prototype, "readU256", null),
            s([g], m.prototype, "readU512", null),
            s([g], m.prototype, "readString", null),
            s([g], m.prototype, "readFixedArray", null),
            s([g], m.prototype, "readArray", null),
            e.BinaryReader = m,
            e.serialize = function(t, e, n=y) {
                const r = new n;
                return v(t, e, r),
                r.toArray()
            }
            ,
            e.deserialize = function(t, e, n, r=m) {
                const o = new r(n)
                  , i = x(t, e, o);
                if (o.offset < n.length)
                    throw new p(`Unexpected ${n.length - o.offset} bytes after deserialized data`);
                return i
            }
            ,
            e.deserializeUnchecked = function(t, e, n, r=m) {
                return x(t, e, new r(n))
            }
        },
        "../../../node_modules/bs58/index.js": (t,e,n)=>{
            var r = n("../../../node_modules/base-x/src/index.js");
            t.exports = r("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
        }
        ,
        "../../../node_modules/buffer/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/console-browserify/index.js");
            const o = n("../../../node_modules/base64-js/index.js")
              , i = n("../../../node_modules/ieee754/index.js")
              , s = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;
            e.Buffer = c,
            e.SlowBuffer = function(t) {
                return +t != t && (t = 0),
                c.alloc(+t)
            }
            ,
            e.INSPECT_MAX_BYTES = 50;
            const a = 2147483647;
            function u(t) {
                if (t > a)
                    throw new RangeError('The value "' + t + '" is invalid for option "size"');
                const e = new Uint8Array(t);
                return Object.setPrototypeOf(e, c.prototype),
                e
            }
            function c(t, e, n) {
                if ("number" == typeof t) {
                    if ("string" == typeof e)
                        throw new TypeError('The "string" argument must be of type string. Received type number');
                    return h(t)
                }
                return l(t, e, n)
            }
            function l(t, e, n) {
                if ("string" == typeof t)
                    return function(t, e) {
                        if ("string" == typeof e && "" !== e || (e = "utf8"),
                        !c.isEncoding(e))
                            throw new TypeError("Unknown encoding: " + e);
                        const n = 0 | g(t, e);
                        let r = u(n);
                        const o = r.write(t, e);
                        return o !== n && (r = r.slice(0, o)),
                        r
                    }(t, e);
                if (ArrayBuffer.isView(t))
                    return function(t) {
                        if (Z(t, Uint8Array)) {
                            const e = new Uint8Array(t);
                            return p(e.buffer, e.byteOffset, e.byteLength)
                        }
                        return d(t)
                    }(t);
                if (null == t)
                    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t);
                if (Z(t, ArrayBuffer) || t && Z(t.buffer, ArrayBuffer))
                    return p(t, e, n);
                if ("undefined" != typeof SharedArrayBuffer && (Z(t, SharedArrayBuffer) || t && Z(t.buffer, SharedArrayBuffer)))
                    return p(t, e, n);
                if ("number" == typeof t)
                    throw new TypeError('The "value" argument must not be of type number. Received type number');
                const r = t.valueOf && t.valueOf();
                if (null != r && r !== t)
                    return c.from(r, e, n);
                const o = function(t) {
                    if (c.isBuffer(t)) {
                        const e = 0 | y(t.length)
                          , n = u(e);
                        return 0 === n.length || t.copy(n, 0, 0, e),
                        n
                    }
                    return void 0 !== t.length ? "number" != typeof t.length || J(t.length) ? u(0) : d(t) : "Buffer" === t.type && Array.isArray(t.data) ? d(t.data) : void 0
                }(t);
                if (o)
                    return o;
                if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof t[Symbol.toPrimitive])
                    return c.from(t[Symbol.toPrimitive]("string"), e, n);
                throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof t)
            }
            function f(t) {
                if ("number" != typeof t)
                    throw new TypeError('"size" argument must be of type number');
                if (t < 0)
                    throw new RangeError('The value "' + t + '" is invalid for option "size"')
            }
            function h(t) {
                return f(t),
                u(t < 0 ? 0 : 0 | y(t))
            }
            function d(t) {
                const e = t.length < 0 ? 0 : 0 | y(t.length)
                  , n = u(e);
                for (let r = 0; r < e; r += 1)
                    n[r] = 255 & t[r];
                return n
            }
            function p(t, e, n) {
                if (e < 0 || t.byteLength < e)
                    throw new RangeError('"offset" is outside of buffer bounds');
                if (t.byteLength < e + (n || 0))
                    throw new RangeError('"length" is outside of buffer bounds');
                let r;
                return r = void 0 === e && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t,e) : new Uint8Array(t,e,n),
                Object.setPrototypeOf(r, c.prototype),
                r
            }
            function y(t) {
                if (t >= a)
                    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a.toString(16) + " bytes");
                return 0 | t
            }
            function g(t, e) {
                if (c.isBuffer(t))
                    return t.length;
                if (ArrayBuffer.isView(t) || Z(t, ArrayBuffer))
                    return t.byteLength;
                if ("string" != typeof t)
                    throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof t);
                const n = t.length
                  , r = arguments.length > 2 && !0 === arguments[2];
                if (!r && 0 === n)
                    return 0;
                let o = !1;
                for (; ; )
                    switch (e) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return n;
                    case "utf8":
                    case "utf-8":
                        return G(t).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * n;
                    case "hex":
                        return n >>> 1;
                    case "base64":
                        return $(t).length;
                    default:
                        if (o)
                            return r ? -1 : G(t).length;
                        e = ("" + e).toLowerCase(),
                        o = !0
                    }
            }
            function m(t, e, n) {
                let r = !1;
                if ((void 0 === e || e < 0) && (e = 0),
                e > this.length)
                    return "";
                if ((void 0 === n || n > this.length) && (n = this.length),
                n <= 0)
                    return "";
                if ((n >>>= 0) <= (e >>>= 0))
                    return "";
                for (t || (t = "utf8"); ; )
                    switch (t) {
                    case "hex":
                        return L(this, e, n);
                    case "utf8":
                    case "utf-8":
                        return _(this, e, n);
                    case "ascii":
                        return k(this, e, n);
                    case "latin1":
                    case "binary":
                        return O(this, e, n);
                    case "base64":
                        return S(this, e, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return T(this, e, n);
                    default:
                        if (r)
                            throw new TypeError("Unknown encoding: " + t);
                        t = (t + "").toLowerCase(),
                        r = !0
                    }
            }
            function b(t, e, n) {
                const r = t[e];
                t[e] = t[n],
                t[n] = r
            }
            function w(t, e, n, r, o) {
                if (0 === t.length)
                    return -1;
                if ("string" == typeof n ? (r = n,
                n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648),
                J(n = +n) && (n = o ? 0 : t.length - 1),
                n < 0 && (n = t.length + n),
                n >= t.length) {
                    if (o)
                        return -1;
                    n = t.length - 1
                } else if (n < 0) {
                    if (!o)
                        return -1;
                    n = 0
                }
                if ("string" == typeof e && (e = c.from(e, r)),
                c.isBuffer(e))
                    return 0 === e.length ? -1 : v(t, e, n, r, o);
                if ("number" == typeof e)
                    return e &= 255,
                    "function" == typeof Uint8Array.prototype.indexOf ? o ? Uint8Array.prototype.indexOf.call(t, e, n) : Uint8Array.prototype.lastIndexOf.call(t, e, n) : v(t, [e], n, r, o);
                throw new TypeError("val must be string, number or Buffer")
            }
            function v(t, e, n, r, o) {
                let i, s = 1, a = t.length, u = e.length;
                if (void 0 !== r && ("ucs2" === (r = String(r).toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
                    if (t.length < 2 || e.length < 2)
                        return -1;
                    s = 2,
                    a /= 2,
                    u /= 2,
                    n /= 2
                }
                function c(t, e) {
                    return 1 === s ? t[e] : t.readUInt16BE(e * s)
                }
                if (o) {
                    let r = -1;
                    for (i = n; i < a; i++)
                        if (c(t, i) === c(e, -1 === r ? 0 : i - r)) {
                            if (-1 === r && (r = i),
                            i - r + 1 === u)
                                return r * s
                        } else
                            -1 !== r && (i -= i - r),
                            r = -1
                } else
                    for (n + u > a && (n = a - u),
                    i = n; i >= 0; i--) {
                        let n = !0;
                        for (let r = 0; r < u; r++)
                            if (c(t, i + r) !== c(e, r)) {
                                n = !1;
                                break
                            }
                        if (n)
                            return i
                    }
                return -1
            }
            function M(t, e, n, r) {
                n = Number(n) || 0;
                const o = t.length - n;
                r ? (r = Number(r)) > o && (r = o) : r = o;
                const i = e.length;
                let s;
                for (r > i / 2 && (r = i / 2),
                s = 0; s < r; ++s) {
                    const r = parseInt(e.substr(2 * s, 2), 16);
                    if (J(r))
                        return s;
                    t[n + s] = r
                }
                return s
            }
            function x(t, e, n, r) {
                return V(G(e, t.length - n), t, n, r)
            }
            function j(t, e, n, r) {
                return V(function(t) {
                    const e = [];
                    for (let n = 0; n < t.length; ++n)
                        e.push(255 & t.charCodeAt(n));
                    return e
                }(e), t, n, r)
            }
            function I(t, e, n, r) {
                return V($(e), t, n, r)
            }
            function A(t, e, n, r) {
                return V(function(t, e) {
                    let n, r, o;
                    const i = [];
                    for (let s = 0; s < t.length && !((e -= 2) < 0); ++s)
                        n = t.charCodeAt(s),
                        r = n >> 8,
                        o = n % 256,
                        i.push(o),
                        i.push(r);
                    return i
                }(e, t.length - n), t, n, r)
            }
            function S(t, e, n) {
                return 0 === e && n === t.length ? o.fromByteArray(t) : o.fromByteArray(t.slice(e, n))
            }
            function _(t, e, n) {
                n = Math.min(t.length, n);
                const r = [];
                let o = e;
                for (; o < n; ) {
                    const e = t[o];
                    let i = null
                      , s = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
                    if (o + s <= n) {
                        let n, r, a, u;
                        switch (s) {
                        case 1:
                            e < 128 && (i = e);
                            break;
                        case 2:
                            n = t[o + 1],
                            128 == (192 & n) && (u = (31 & e) << 6 | 63 & n,
                            u > 127 && (i = u));
                            break;
                        case 3:
                            n = t[o + 1],
                            r = t[o + 2],
                            128 == (192 & n) && 128 == (192 & r) && (u = (15 & e) << 12 | (63 & n) << 6 | 63 & r,
                            u > 2047 && (u < 55296 || u > 57343) && (i = u));
                            break;
                        case 4:
                            n = t[o + 1],
                            r = t[o + 2],
                            a = t[o + 3],
                            128 == (192 & n) && 128 == (192 & r) && 128 == (192 & a) && (u = (15 & e) << 18 | (63 & n) << 12 | (63 & r) << 6 | 63 & a,
                            u > 65535 && u < 1114112 && (i = u))
                        }
                    }
                    null === i ? (i = 65533,
                    s = 1) : i > 65535 && (i -= 65536,
                    r.push(i >>> 10 & 1023 | 55296),
                    i = 56320 | 1023 & i),
                    r.push(i),
                    o += s
                }
                return function(t) {
                    const e = t.length;
                    if (e <= E)
                        return String.fromCharCode.apply(String, t);
                    let n = ""
                      , r = 0;
                    for (; r < e; )
                        n += String.fromCharCode.apply(String, t.slice(r, r += E));
                    return n
                }(r)
            }
            e.kMaxLength = a,
            c.TYPED_ARRAY_SUPPORT = function() {
                try {
                    const t = new Uint8Array(1)
                      , e = {
                        foo: function() {
                            return 42
                        }
                    };
                    return Object.setPrototypeOf(e, Uint8Array.prototype),
                    Object.setPrototypeOf(t, e),
                    42 === t.foo()
                } catch (t) {
                    return !1
                }
            }(),
            c.TYPED_ARRAY_SUPPORT || void 0 === r || "function" != typeof r.error || r.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),
            Object.defineProperty(c.prototype, "parent", {
                enumerable: !0,
                get: function() {
                    if (c.isBuffer(this))
                        return this.buffer
                }
            }),
            Object.defineProperty(c.prototype, "offset", {
                enumerable: !0,
                get: function() {
                    if (c.isBuffer(this))
                        return this.byteOffset
                }
            }),
            c.poolSize = 8192,
            c.from = function(t, e, n) {
                return l(t, e, n)
            }
            ,
            Object.setPrototypeOf(c.prototype, Uint8Array.prototype),
            Object.setPrototypeOf(c, Uint8Array),
            c.alloc = function(t, e, n) {
                return function(t, e, n) {
                    return f(t),
                    t <= 0 ? u(t) : void 0 !== e ? "string" == typeof n ? u(t).fill(e, n) : u(t).fill(e) : u(t)
                }(t, e, n)
            }
            ,
            c.allocUnsafe = function(t) {
                return h(t)
            }
            ,
            c.allocUnsafeSlow = function(t) {
                return h(t)
            }
            ,
            c.isBuffer = function(t) {
                return null != t && !0 === t._isBuffer && t !== c.prototype
            }
            ,
            c.compare = function(t, e) {
                if (Z(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)),
                Z(e, Uint8Array) && (e = c.from(e, e.offset, e.byteLength)),
                !c.isBuffer(t) || !c.isBuffer(e))
                    throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                if (t === e)
                    return 0;
                let n = t.length
                  , r = e.length;
                for (let o = 0, i = Math.min(n, r); o < i; ++o)
                    if (t[o] !== e[o]) {
                        n = t[o],
                        r = e[o];
                        break
                    }
                return n < r ? -1 : r < n ? 1 : 0
            }
            ,
            c.isEncoding = function(t) {
                switch (String(t).toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "latin1":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                    return !0;
                default:
                    return !1
                }
            }
            ,
            c.concat = function(t, e) {
                if (!Array.isArray(t))
                    throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === t.length)
                    return c.alloc(0);
                let n;
                if (void 0 === e)
                    for (e = 0,
                    n = 0; n < t.length; ++n)
                        e += t[n].length;
                const r = c.allocUnsafe(e);
                let o = 0;
                for (n = 0; n < t.length; ++n) {
                    let e = t[n];
                    if (Z(e, Uint8Array))
                        o + e.length > r.length ? (c.isBuffer(e) || (e = c.from(e)),
                        e.copy(r, o)) : Uint8Array.prototype.set.call(r, e, o);
                    else {
                        if (!c.isBuffer(e))
                            throw new TypeError('"list" argument must be an Array of Buffers');
                        e.copy(r, o)
                    }
                    o += e.length
                }
                return r
            }
            ,
            c.byteLength = g,
            c.prototype._isBuffer = !0,
            c.prototype.swap16 = function() {
                const t = this.length;
                if (t % 2 != 0)
                    throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (let e = 0; e < t; e += 2)
                    b(this, e, e + 1);
                return this
            }
            ,
            c.prototype.swap32 = function() {
                const t = this.length;
                if (t % 4 != 0)
                    throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (let e = 0; e < t; e += 4)
                    b(this, e, e + 3),
                    b(this, e + 1, e + 2);
                return this
            }
            ,
            c.prototype.swap64 = function() {
                const t = this.length;
                if (t % 8 != 0)
                    throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (let e = 0; e < t; e += 8)
                    b(this, e, e + 7),
                    b(this, e + 1, e + 6),
                    b(this, e + 2, e + 5),
                    b(this, e + 3, e + 4);
                return this
            }
            ,
            c.prototype.toString = function() {
                const t = this.length;
                return 0 === t ? "" : 0 === arguments.length ? _(this, 0, t) : m.apply(this, arguments)
            }
            ,
            c.prototype.toLocaleString = c.prototype.toString,
            c.prototype.equals = function(t) {
                if (!c.isBuffer(t))
                    throw new TypeError("Argument must be a Buffer");
                return this === t || 0 === c.compare(this, t)
            }
            ,
            c.prototype.inspect = function() {
                let t = "";
                const n = e.INSPECT_MAX_BYTES;
                return t = this.toString("hex", 0, n).replace(/(.{2})/g, "$1 ").trim(),
                this.length > n && (t += " ... "),
                "<Buffer " + t + ">"
            }
            ,
            s && (c.prototype[s] = c.prototype.inspect),
            c.prototype.compare = function(t, e, n, r, o) {
                if (Z(t, Uint8Array) && (t = c.from(t, t.offset, t.byteLength)),
                !c.isBuffer(t))
                    throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof t);
                if (void 0 === e && (e = 0),
                void 0 === n && (n = t ? t.length : 0),
                void 0 === r && (r = 0),
                void 0 === o && (o = this.length),
                e < 0 || n > t.length || r < 0 || o > this.length)
                    throw new RangeError("out of range index");
                if (r >= o && e >= n)
                    return 0;
                if (r >= o)
                    return -1;
                if (e >= n)
                    return 1;
                if (this === t)
                    return 0;
                let i = (o >>>= 0) - (r >>>= 0)
                  , s = (n >>>= 0) - (e >>>= 0);
                const a = Math.min(i, s)
                  , u = this.slice(r, o)
                  , l = t.slice(e, n);
                for (let t = 0; t < a; ++t)
                    if (u[t] !== l[t]) {
                        i = u[t],
                        s = l[t];
                        break
                    }
                return i < s ? -1 : s < i ? 1 : 0
            }
            ,
            c.prototype.includes = function(t, e, n) {
                return -1 !== this.indexOf(t, e, n)
            }
            ,
            c.prototype.indexOf = function(t, e, n) {
                return w(this, t, e, n, !0)
            }
            ,
            c.prototype.lastIndexOf = function(t, e, n) {
                return w(this, t, e, n, !1)
            }
            ,
            c.prototype.write = function(t, e, n, r) {
                if (void 0 === e)
                    r = "utf8",
                    n = this.length,
                    e = 0;
                else if (void 0 === n && "string" == typeof e)
                    r = e,
                    n = this.length,
                    e = 0;
                else {
                    if (!isFinite(e))
                        throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    e >>>= 0,
                    isFinite(n) ? (n >>>= 0,
                    void 0 === r && (r = "utf8")) : (r = n,
                    n = void 0)
                }
                const o = this.length - e;
                if ((void 0 === n || n > o) && (n = o),
                t.length > 0 && (n < 0 || e < 0) || e > this.length)
                    throw new RangeError("Attempt to write outside buffer bounds");
                r || (r = "utf8");
                let i = !1;
                for (; ; )
                    switch (r) {
                    case "hex":
                        return M(this, t, e, n);
                    case "utf8":
                    case "utf-8":
                        return x(this, t, e, n);
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return j(this, t, e, n);
                    case "base64":
                        return I(this, t, e, n);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return A(this, t, e, n);
                    default:
                        if (i)
                            throw new TypeError("Unknown encoding: " + r);
                        r = ("" + r).toLowerCase(),
                        i = !0
                    }
            }
            ,
            c.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            }
            ;
            const E = 4096;
            function k(t, e, n) {
                let r = "";
                n = Math.min(t.length, n);
                for (let o = e; o < n; ++o)
                    r += String.fromCharCode(127 & t[o]);
                return r
            }
            function O(t, e, n) {
                let r = "";
                n = Math.min(t.length, n);
                for (let o = e; o < n; ++o)
                    r += String.fromCharCode(t[o]);
                return r
            }
            function L(t, e, n) {
                const r = t.length;
                (!e || e < 0) && (e = 0),
                (!n || n < 0 || n > r) && (n = r);
                let o = "";
                for (let r = e; r < n; ++r)
                    o += Q[t[r]];
                return o
            }
            function T(t, e, n) {
                const r = t.slice(e, n);
                let o = "";
                for (let t = 0; t < r.length - 1; t += 2)
                    o += String.fromCharCode(r[t] + 256 * r[t + 1]);
                return o
            }
            function B(t, e, n) {
                if (t % 1 != 0 || t < 0)
                    throw new RangeError("offset is not uint");
                if (t + e > n)
                    throw new RangeError("Trying to access beyond buffer length")
            }
            function N(t, e, n, r, o, i) {
                if (!c.isBuffer(t))
                    throw new TypeError('"buffer" argument must be a Buffer instance');
                if (e > o || e < i)
                    throw new RangeError('"value" argument is out of bounds');
                if (n + r > t.length)
                    throw new RangeError("Index out of range")
            }
            function P(t, e, n, r, o) {
                F(e, r, o, t, n, 7);
                let i = Number(e & BigInt(4294967295));
                t[n++] = i,
                i >>= 8,
                t[n++] = i,
                i >>= 8,
                t[n++] = i,
                i >>= 8,
                t[n++] = i;
                let s = Number(e >> BigInt(32) & BigInt(4294967295));
                return t[n++] = s,
                s >>= 8,
                t[n++] = s,
                s >>= 8,
                t[n++] = s,
                s >>= 8,
                t[n++] = s,
                n
            }
            function z(t, e, n, r, o) {
                F(e, r, o, t, n, 7);
                let i = Number(e & BigInt(4294967295));
                t[n + 7] = i,
                i >>= 8,
                t[n + 6] = i,
                i >>= 8,
                t[n + 5] = i,
                i >>= 8,
                t[n + 4] = i;
                let s = Number(e >> BigInt(32) & BigInt(4294967295));
                return t[n + 3] = s,
                s >>= 8,
                t[n + 2] = s,
                s >>= 8,
                t[n + 1] = s,
                s >>= 8,
                t[n] = s,
                n + 8
            }
            function U(t, e, n, r, o, i) {
                if (n + r > t.length)
                    throw new RangeError("Index out of range");
                if (n < 0)
                    throw new RangeError("Index out of range")
            }
            function D(t, e, n, r, o) {
                return e = +e,
                n >>>= 0,
                o || U(t, 0, n, 4),
                i.write(t, e, n, r, 23, 4),
                n + 4
            }
            function R(t, e, n, r, o) {
                return e = +e,
                n >>>= 0,
                o || U(t, 0, n, 8),
                i.write(t, e, n, r, 52, 8),
                n + 8
            }
            c.prototype.slice = function(t, e) {
                const n = this.length;
                (t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
                (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
                e < t && (e = t);
                const r = this.subarray(t, e);
                return Object.setPrototypeOf(r, c.prototype),
                r
            }
            ,
            c.prototype.readUintLE = c.prototype.readUIntLE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || B(t, e, this.length);
                let r = this[t]
                  , o = 1
                  , i = 0;
                for (; ++i < e && (o *= 256); )
                    r += this[t + i] * o;
                return r
            }
            ,
            c.prototype.readUintBE = c.prototype.readUIntBE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || B(t, e, this.length);
                let r = this[t + --e]
                  , o = 1;
                for (; e > 0 && (o *= 256); )
                    r += this[t + --e] * o;
                return r
            }
            ,
            c.prototype.readUint8 = c.prototype.readUInt8 = function(t, e) {
                return t >>>= 0,
                e || B(t, 1, this.length),
                this[t]
            }
            ,
            c.prototype.readUint16LE = c.prototype.readUInt16LE = function(t, e) {
                return t >>>= 0,
                e || B(t, 2, this.length),
                this[t] | this[t + 1] << 8
            }
            ,
            c.prototype.readUint16BE = c.prototype.readUInt16BE = function(t, e) {
                return t >>>= 0,
                e || B(t, 2, this.length),
                this[t] << 8 | this[t + 1]
            }
            ,
            c.prototype.readUint32LE = c.prototype.readUInt32LE = function(t, e) {
                return t >>>= 0,
                e || B(t, 4, this.length),
                (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
            }
            ,
            c.prototype.readUint32BE = c.prototype.readUInt32BE = function(t, e) {
                return t >>>= 0,
                e || B(t, 4, this.length),
                16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3])
            }
            ,
            c.prototype.readBigUInt64LE = X((function(t) {
                K(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || H(t, this.length - 8);
                const r = e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24
                  , o = this[++t] + 256 * this[++t] + 65536 * this[++t] + n * 2 ** 24;
                return BigInt(r) + (BigInt(o) << BigInt(32))
            }
            )),
            c.prototype.readBigUInt64BE = X((function(t) {
                K(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || H(t, this.length - 8);
                const r = e * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + this[++t]
                  , o = this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + n;
                return (BigInt(r) << BigInt(32)) + BigInt(o)
            }
            )),
            c.prototype.readIntLE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || B(t, e, this.length);
                let r = this[t]
                  , o = 1
                  , i = 0;
                for (; ++i < e && (o *= 256); )
                    r += this[t + i] * o;
                return o *= 128,
                r >= o && (r -= Math.pow(2, 8 * e)),
                r
            }
            ,
            c.prototype.readIntBE = function(t, e, n) {
                t >>>= 0,
                e >>>= 0,
                n || B(t, e, this.length);
                let r = e
                  , o = 1
                  , i = this[t + --r];
                for (; r > 0 && (o *= 256); )
                    i += this[t + --r] * o;
                return o *= 128,
                i >= o && (i -= Math.pow(2, 8 * e)),
                i
            }
            ,
            c.prototype.readInt8 = function(t, e) {
                return t >>>= 0,
                e || B(t, 1, this.length),
                128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            }
            ,
            c.prototype.readInt16LE = function(t, e) {
                t >>>= 0,
                e || B(t, 2, this.length);
                const n = this[t] | this[t + 1] << 8;
                return 32768 & n ? 4294901760 | n : n
            }
            ,
            c.prototype.readInt16BE = function(t, e) {
                t >>>= 0,
                e || B(t, 2, this.length);
                const n = this[t + 1] | this[t] << 8;
                return 32768 & n ? 4294901760 | n : n
            }
            ,
            c.prototype.readInt32LE = function(t, e) {
                return t >>>= 0,
                e || B(t, 4, this.length),
                this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24
            }
            ,
            c.prototype.readInt32BE = function(t, e) {
                return t >>>= 0,
                e || B(t, 4, this.length),
                this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]
            }
            ,
            c.prototype.readBigInt64LE = X((function(t) {
                K(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || H(t, this.length - 8);
                const r = this[t + 4] + 256 * this[t + 5] + 65536 * this[t + 6] + (n << 24);
                return (BigInt(r) << BigInt(32)) + BigInt(e + 256 * this[++t] + 65536 * this[++t] + this[++t] * 2 ** 24)
            }
            )),
            c.prototype.readBigInt64BE = X((function(t) {
                K(t >>>= 0, "offset");
                const e = this[t]
                  , n = this[t + 7];
                void 0 !== e && void 0 !== n || H(t, this.length - 8);
                const r = (e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t];
                return (BigInt(r) << BigInt(32)) + BigInt(this[++t] * 2 ** 24 + 65536 * this[++t] + 256 * this[++t] + n)
            }
            )),
            c.prototype.readFloatLE = function(t, e) {
                return t >>>= 0,
                e || B(t, 4, this.length),
                i.read(this, t, !0, 23, 4)
            }
            ,
            c.prototype.readFloatBE = function(t, e) {
                return t >>>= 0,
                e || B(t, 4, this.length),
                i.read(this, t, !1, 23, 4)
            }
            ,
            c.prototype.readDoubleLE = function(t, e) {
                return t >>>= 0,
                e || B(t, 8, this.length),
                i.read(this, t, !0, 52, 8)
            }
            ,
            c.prototype.readDoubleBE = function(t, e) {
                return t >>>= 0,
                e || B(t, 8, this.length),
                i.read(this, t, !1, 52, 8)
            }
            ,
            c.prototype.writeUintLE = c.prototype.writeUIntLE = function(t, e, n, r) {
                t = +t,
                e >>>= 0,
                n >>>= 0,
                r || N(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
                let o = 1
                  , i = 0;
                for (this[e] = 255 & t; ++i < n && (o *= 256); )
                    this[e + i] = t / o & 255;
                return e + n
            }
            ,
            c.prototype.writeUintBE = c.prototype.writeUIntBE = function(t, e, n, r) {
                t = +t,
                e >>>= 0,
                n >>>= 0,
                r || N(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
                let o = n - 1
                  , i = 1;
                for (this[e + o] = 255 & t; --o >= 0 && (i *= 256); )
                    this[e + o] = t / i & 255;
                return e + n
            }
            ,
            c.prototype.writeUint8 = c.prototype.writeUInt8 = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 1, 255, 0),
                this[e] = 255 & t,
                e + 1
            }
            ,
            c.prototype.writeUint16LE = c.prototype.writeUInt16LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 2, 65535, 0),
                this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                e + 2
            }
            ,
            c.prototype.writeUint16BE = c.prototype.writeUInt16BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 2, 65535, 0),
                this[e] = t >>> 8,
                this[e + 1] = 255 & t,
                e + 2
            }
            ,
            c.prototype.writeUint32LE = c.prototype.writeUInt32LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 4, 4294967295, 0),
                this[e + 3] = t >>> 24,
                this[e + 2] = t >>> 16,
                this[e + 1] = t >>> 8,
                this[e] = 255 & t,
                e + 4
            }
            ,
            c.prototype.writeUint32BE = c.prototype.writeUInt32BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 4, 4294967295, 0),
                this[e] = t >>> 24,
                this[e + 1] = t >>> 16,
                this[e + 2] = t >>> 8,
                this[e + 3] = 255 & t,
                e + 4
            }
            ,
            c.prototype.writeBigUInt64LE = X((function(t, e=0) {
                return P(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
            }
            )),
            c.prototype.writeBigUInt64BE = X((function(t, e=0) {
                return z(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"))
            }
            )),
            c.prototype.writeIntLE = function(t, e, n, r) {
                if (t = +t,
                e >>>= 0,
                !r) {
                    const r = Math.pow(2, 8 * n - 1);
                    N(this, t, e, n, r - 1, -r)
                }
                let o = 0
                  , i = 1
                  , s = 0;
                for (this[e] = 255 & t; ++o < n && (i *= 256); )
                    t < 0 && 0 === s && 0 !== this[e + o - 1] && (s = 1),
                    this[e + o] = (t / i | 0) - s & 255;
                return e + n
            }
            ,
            c.prototype.writeIntBE = function(t, e, n, r) {
                if (t = +t,
                e >>>= 0,
                !r) {
                    const r = Math.pow(2, 8 * n - 1);
                    N(this, t, e, n, r - 1, -r)
                }
                let o = n - 1
                  , i = 1
                  , s = 0;
                for (this[e + o] = 255 & t; --o >= 0 && (i *= 256); )
                    t < 0 && 0 === s && 0 !== this[e + o + 1] && (s = 1),
                    this[e + o] = (t / i | 0) - s & 255;
                return e + n
            }
            ,
            c.prototype.writeInt8 = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 1, 127, -128),
                t < 0 && (t = 255 + t + 1),
                this[e] = 255 & t,
                e + 1
            }
            ,
            c.prototype.writeInt16LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 2, 32767, -32768),
                this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                e + 2
            }
            ,
            c.prototype.writeInt16BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 2, 32767, -32768),
                this[e] = t >>> 8,
                this[e + 1] = 255 & t,
                e + 2
            }
            ,
            c.prototype.writeInt32LE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 4, 2147483647, -2147483648),
                this[e] = 255 & t,
                this[e + 1] = t >>> 8,
                this[e + 2] = t >>> 16,
                this[e + 3] = t >>> 24,
                e + 4
            }
            ,
            c.prototype.writeInt32BE = function(t, e, n) {
                return t = +t,
                e >>>= 0,
                n || N(this, t, e, 4, 2147483647, -2147483648),
                t < 0 && (t = 4294967295 + t + 1),
                this[e] = t >>> 24,
                this[e + 1] = t >>> 16,
                this[e + 2] = t >>> 8,
                this[e + 3] = 255 & t,
                e + 4
            }
            ,
            c.prototype.writeBigInt64LE = X((function(t, e=0) {
                return P(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            }
            )),
            c.prototype.writeBigInt64BE = X((function(t, e=0) {
                return z(this, t, e, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"))
            }
            )),
            c.prototype.writeFloatLE = function(t, e, n) {
                return D(this, t, e, !0, n)
            }
            ,
            c.prototype.writeFloatBE = function(t, e, n) {
                return D(this, t, e, !1, n)
            }
            ,
            c.prototype.writeDoubleLE = function(t, e, n) {
                return R(this, t, e, !0, n)
            }
            ,
            c.prototype.writeDoubleBE = function(t, e, n) {
                return R(this, t, e, !1, n)
            }
            ,
            c.prototype.copy = function(t, e, n, r) {
                if (!c.isBuffer(t))
                    throw new TypeError("argument should be a Buffer");
                if (n || (n = 0),
                r || 0 === r || (r = this.length),
                e >= t.length && (e = t.length),
                e || (e = 0),
                r > 0 && r < n && (r = n),
                r === n)
                    return 0;
                if (0 === t.length || 0 === this.length)
                    return 0;
                if (e < 0)
                    throw new RangeError("targetStart out of bounds");
                if (n < 0 || n >= this.length)
                    throw new RangeError("Index out of range");
                if (r < 0)
                    throw new RangeError("sourceEnd out of bounds");
                r > this.length && (r = this.length),
                t.length - e < r - n && (r = t.length - e + n);
                const o = r - n;
                return this === t && "function" == typeof Uint8Array.prototype.copyWithin ? this.copyWithin(e, n, r) : Uint8Array.prototype.set.call(t, this.subarray(n, r), e),
                o
            }
            ,
            c.prototype.fill = function(t, e, n, r) {
                if ("string" == typeof t) {
                    if ("string" == typeof e ? (r = e,
                    e = 0,
                    n = this.length) : "string" == typeof n && (r = n,
                    n = this.length),
                    void 0 !== r && "string" != typeof r)
                        throw new TypeError("encoding must be a string");
                    if ("string" == typeof r && !c.isEncoding(r))
                        throw new TypeError("Unknown encoding: " + r);
                    if (1 === t.length) {
                        const e = t.charCodeAt(0);
                        ("utf8" === r && e < 128 || "latin1" === r) && (t = e)
                    }
                } else
                    "number" == typeof t ? t &= 255 : "boolean" == typeof t && (t = Number(t));
                if (e < 0 || this.length < e || this.length < n)
                    throw new RangeError("Out of range index");
                if (n <= e)
                    return this;
                let o;
                if (e >>>= 0,
                n = void 0 === n ? this.length : n >>> 0,
                t || (t = 0),
                "number" == typeof t)
                    for (o = e; o < n; ++o)
                        this[o] = t;
                else {
                    const i = c.isBuffer(t) ? t : c.from(t, r)
                      , s = i.length;
                    if (0 === s)
                        throw new TypeError('The value "' + t + '" is invalid for argument "value"');
                    for (o = 0; o < n - e; ++o)
                        this[o + e] = i[o % s]
                }
                return this
            }
            ;
            const C = {};
            function W(t, e, n) {
                C[t] = class extends n {
                    constructor() {
                        super(),
                        Object.defineProperty(this, "message", {
                            value: e.apply(this, arguments),
                            writable: !0,
                            configurable: !0
                        }),
                        this.name = `${this.name} [${t}]`,
                        this.stack,
                        delete this.name
                    }
                    get code() {
                        return t
                    }
                    set code(t) {
                        Object.defineProperty(this, "code", {
                            configurable: !0,
                            enumerable: !0,
                            value: t,
                            writable: !0
                        })
                    }
                    toString() {
                        return `${this.name} [${t}]: ${this.message}`
                    }
                }
            }
            function q(t) {
                let e = ""
                  , n = t.length;
                const r = "-" === t[0] ? 1 : 0;
                for (; n >= r + 4; n -= 3)
                    e = `_${t.slice(n - 3, n)}${e}`;
                return `${t.slice(0, n)}${e}`
            }
            function F(t, e, n, r, o, i) {
                if (t > n || t < e) {
                    const r = "bigint" == typeof e ? "n" : "";
                    let o;
                    throw o = i > 3 ? 0 === e || e === BigInt(0) ? `>= 0${r} and < 2${r} ** ${8 * (i + 1)}${r}` : `>= -(2${r} ** ${8 * (i + 1) - 1}${r}) and < 2 ** ${8 * (i + 1) - 1}${r}` : `>= ${e}${r} and <= ${n}${r}`,
                    new C.ERR_OUT_OF_RANGE("value",o,t)
                }
                !function(t, e, n) {
                    K(e, "offset"),
                    void 0 !== t[e] && void 0 !== t[e + n] || H(e, t.length - (n + 1))
                }(r, o, i)
            }
            function K(t, e) {
                if ("number" != typeof t)
                    throw new C.ERR_INVALID_ARG_TYPE(e,"number",t)
            }
            function H(t, e, n) {
                if (Math.floor(t) !== t)
                    throw K(t, n),
                    new C.ERR_OUT_OF_RANGE(n || "offset","an integer",t);
                if (e < 0)
                    throw new C.ERR_BUFFER_OUT_OF_BOUNDS;
                throw new C.ERR_OUT_OF_RANGE(n || "offset",`>= ${n ? 1 : 0} and <= ${e}`,t)
            }
            W("ERR_BUFFER_OUT_OF_BOUNDS", (function(t) {
                return t ? `${t} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds"
            }
            ), RangeError),
            W("ERR_INVALID_ARG_TYPE", (function(t, e) {
                return `The "${t}" argument must be of type number. Received type ${typeof e}`
            }
            ), TypeError),
            W("ERR_OUT_OF_RANGE", (function(t, e, n) {
                let r = `The value of "${t}" is out of range.`
                  , o = n;
                return Number.isInteger(n) && Math.abs(n) > 2 ** 32 ? o = q(String(n)) : "bigint" == typeof n && (o = String(n),
                (n > BigInt(2) ** BigInt(32) || n < -(BigInt(2) ** BigInt(32))) && (o = q(o)),
                o += "n"),
                r += ` It must be ${e}. Received ${o}`,
                r
            }
            ), RangeError);
            const Y = /[^+/0-9A-Za-z-_]/g;
            function G(t, e) {
                let n;
                e = e || 1 / 0;
                const r = t.length;
                let o = null;
                const i = [];
                for (let s = 0; s < r; ++s) {
                    if (n = t.charCodeAt(s),
                    n > 55295 && n < 57344) {
                        if (!o) {
                            if (n > 56319) {
                                (e -= 3) > -1 && i.push(239, 191, 189);
                                continue
                            }
                            if (s + 1 === r) {
                                (e -= 3) > -1 && i.push(239, 191, 189);
                                continue
                            }
                            o = n;
                            continue
                        }
                        if (n < 56320) {
                            (e -= 3) > -1 && i.push(239, 191, 189),
                            o = n;
                            continue
                        }
                        n = 65536 + (o - 55296 << 10 | n - 56320)
                    } else
                        o && (e -= 3) > -1 && i.push(239, 191, 189);
                    if (o = null,
                    n < 128) {
                        if ((e -= 1) < 0)
                            break;
                        i.push(n)
                    } else if (n < 2048) {
                        if ((e -= 2) < 0)
                            break;
                        i.push(n >> 6 | 192, 63 & n | 128)
                    } else if (n < 65536) {
                        if ((e -= 3) < 0)
                            break;
                        i.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
                    } else {
                        if (!(n < 1114112))
                            throw new Error("Invalid code point");
                        if ((e -= 4) < 0)
                            break;
                        i.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
                    }
                }
                return i
            }
            function $(t) {
                return o.toByteArray(function(t) {
                    if ((t = (t = t.split("=")[0]).trim().replace(Y, "")).length < 2)
                        return "";
                    for (; t.length % 4 != 0; )
                        t += "=";
                    return t
                }(t))
            }
            function V(t, e, n, r) {
                let o;
                for (o = 0; o < r && !(o + n >= e.length || o >= t.length); ++o)
                    e[o + n] = t[o];
                return o
            }
            function Z(t, e) {
                return t instanceof e || null != t && null != t.constructor && null != t.constructor.name && t.constructor.name === e.name
            }
            function J(t) {
                return t != t
            }
            const Q = function() {
                const t = "0123456789abcdef"
                  , e = new Array(256);
                for (let n = 0; n < 16; ++n) {
                    const r = 16 * n;
                    for (let o = 0; o < 16; ++o)
                        e[r + o] = t[n] + t[o]
                }
                return e
            }();
            function X(t) {
                return "undefined" == typeof BigInt ? tt : t
            }
            function tt() {
                throw new Error("BigInt not supported")
            }
        }
        ,
        "../../../node_modules/call-bind/callBound.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/get-intrinsic/index.js")
              , o = n("../../../node_modules/call-bind/index.js")
              , i = o(r("String.prototype.indexOf"));
            t.exports = function(t, e) {
                var n = r(t, !!e);
                return "function" == typeof n && i(t, ".prototype.") > -1 ? o(n) : n
            }
        }
        ,
        "../../../node_modules/call-bind/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/function-bind/index.js")
              , o = n("../../../node_modules/get-intrinsic/index.js")
              , i = n("../../../node_modules/set-function-length/index.js")
              , s = n("../../../node_modules/es-errors/type.js")
              , a = o("%Function.prototype.apply%")
              , u = o("%Function.prototype.call%")
              , c = o("%Reflect.apply%", !0) || r.call(u, a)
              , l = n("../../../node_modules/es-define-property/index.js")
              , f = o("%Math.max%");
            t.exports = function(t) {
                if ("function" != typeof t)
                    throw new s("a function is required");
                var e = c(r, u, arguments);
                return i(e, 1 + f(0, t.length - (arguments.length - 1)), !0)
            }
            ;
            var h = function() {
                return c(r, a, arguments)
            };
            l ? l(t.exports, "apply", {
                value: h
            }) : t.exports.apply = h
        }
        ,
        "../../../node_modules/console-browserify/index.js": (t,e,n)=>{
            var r = n("../../../node_modules/util/util.js")
              , o = n("../../../node_modules/assert/build/assert.js");
            function i() {
                return (new Date).getTime()
            }
            var s, a = Array.prototype.slice, u = {};
            s = void 0 !== n.g && n.g.console ? n.g.console : "undefined" != typeof window && window.console ? window.console : {};
            for (var c = [[function() {}
            , "log"], [function() {
                s.log.apply(s, arguments)
            }
            , "info"], [function() {
                s.log.apply(s, arguments)
            }
            , "warn"], [function() {
                s.warn.apply(s, arguments)
            }
            , "error"], [function(t) {
                u[t] = i()
            }
            , "time"], [function(t) {
                var e = u[t];
                if (!e)
                    throw new Error("No such label: " + t);
                delete u[t];
                var n = i() - e;
                s.log(t + ": " + n + "ms")
            }
            , "timeEnd"], [function() {
                var t = new Error;
                t.name = "Trace",
                t.message = r.format.apply(null, arguments),
                s.error(t.stack)
            }
            , "trace"], [function(t) {
                s.log(r.inspect(t) + "\n")
            }
            , "dir"], [function(t) {
                if (!t) {
                    var e = a.call(arguments, 1);
                    o.ok(!1, r.format.apply(null, e))
                }
            }
            , "assert"]], l = 0; l < c.length; l++) {
                var f = c[l]
                  , h = f[0]
                  , d = f[1];
                s[d] || (s[d] = h)
            }
            t.exports = s
        }
        ,
        "../../../node_modules/define-data-property/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/es-define-property/index.js")
              , o = n("../../../node_modules/es-errors/syntax.js")
              , i = n("../../../node_modules/es-errors/type.js")
              , s = n("../../../node_modules/gopd/index.js");
            t.exports = function(t, e, n) {
                if (!t || "object" != typeof t && "function" != typeof t)
                    throw new i("`obj` must be an object or a function`");
                if ("string" != typeof e && "symbol" != typeof e)
                    throw new i("`property` must be a string or a symbol`");
                if (arguments.length > 3 && "boolean" != typeof arguments[3] && null !== arguments[3])
                    throw new i("`nonEnumerable`, if provided, must be a boolean or null");
                if (arguments.length > 4 && "boolean" != typeof arguments[4] && null !== arguments[4])
                    throw new i("`nonWritable`, if provided, must be a boolean or null");
                if (arguments.length > 5 && "boolean" != typeof arguments[5] && null !== arguments[5])
                    throw new i("`nonConfigurable`, if provided, must be a boolean or null");
                if (arguments.length > 6 && "boolean" != typeof arguments[6])
                    throw new i("`loose`, if provided, must be a boolean");
                var a = arguments.length > 3 ? arguments[3] : null
                  , u = arguments.length > 4 ? arguments[4] : null
                  , c = arguments.length > 5 ? arguments[5] : null
                  , l = arguments.length > 6 && arguments[6]
                  , f = !!s && s(t, e);
                if (r)
                    r(t, e, {
                        configurable: null === c && f ? f.configurable : !c,
                        enumerable: null === a && f ? f.enumerable : !a,
                        value: n,
                        writable: null === u && f ? f.writable : !u
                    });
                else {
                    if (!l && (a || u || c))
                        throw new o("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
                    t[e] = n
                }
            }
        }
        ,
        "../../../node_modules/define-properties/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/object-keys/index.js")
              , o = "function" == typeof Symbol && "symbol" == typeof Symbol("foo")
              , i = Object.prototype.toString
              , s = Array.prototype.concat
              , a = n("../../../node_modules/define-data-property/index.js")
              , u = n("../../../node_modules/has-property-descriptors/index.js")()
              , c = function(t, e, n, r) {
                if (e in t)
                    if (!0 === r) {
                        if (t[e] === n)
                            return
                    } else if ("function" != typeof (o = r) || "[object Function]" !== i.call(o) || !r())
                        return;
                var o;
                u ? a(t, e, n, !0) : a(t, e, n)
            }
              , l = function(t, e) {
                var n = arguments.length > 2 ? arguments[2] : {}
                  , i = r(e);
                o && (i = s.call(i, Object.getOwnPropertySymbols(e)));
                for (var a = 0; a < i.length; a += 1)
                    c(t, i[a], e[i[a]], n[i[a]])
            };
            l.supportsDescriptors = !!u,
            t.exports = l
        }
        ,
        "../../../node_modules/es-define-property/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/get-intrinsic/index.js")("%Object.defineProperty%", !0) || !1;
            if (r)
                try {
                    r({}, "a", {
                        value: 1
                    })
                } catch (t) {
                    r = !1
                }
            t.exports = r
        }
        ,
        "../../../node_modules/es-errors/eval.js": t=>{
            "use strict";
            t.exports = EvalError
        }
        ,
        "../../../node_modules/es-errors/index.js": t=>{
            "use strict";
            t.exports = Error
        }
        ,
        "../../../node_modules/es-errors/range.js": t=>{
            "use strict";
            t.exports = RangeError
        }
        ,
        "../../../node_modules/es-errors/ref.js": t=>{
            "use strict";
            t.exports = ReferenceError
        }
        ,
        "../../../node_modules/es-errors/syntax.js": t=>{
            "use strict";
            t.exports = SyntaxError
        }
        ,
        "../../../node_modules/es-errors/type.js": t=>{
            "use strict";
            t.exports = TypeError
        }
        ,
        "../../../node_modules/es-errors/uri.js": t=>{
            "use strict";
            t.exports = URIError
        }
        ,
        "../../../node_modules/es6-object-assign/index.js": t=>{
            "use strict";
            function e(t, e) {
                if (null == t)
                    throw new TypeError("Cannot convert first argument to object");
                for (var n = Object(t), r = 1; r < arguments.length; r++) {
                    var o = arguments[r];
                    if (null != o)
                        for (var i = Object.keys(Object(o)), s = 0, a = i.length; s < a; s++) {
                            var u = i[s]
                              , c = Object.getOwnPropertyDescriptor(o, u);
                            void 0 !== c && c.enumerable && (n[u] = o[u])
                        }
                }
                return n
            }
            t.exports = {
                assign: e,
                polyfill: function() {
                    Object.assign || Object.defineProperty(Object, "assign", {
                        enumerable: !1,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            }
        }
        ,
        "../../../node_modules/eventemitter3/index.js": t=>{
            "use strict";
            var e = Object.prototype.hasOwnProperty
              , n = "~";
            function r() {}
            function o(t, e, n) {
                this.fn = t,
                this.context = e,
                this.once = n || !1
            }
            function i(t, e, r, i, s) {
                if ("function" != typeof r)
                    throw new TypeError("The listener must be a function");
                var a = new o(r,i || t,s)
                  , u = n ? n + e : e;
                return t._events[u] ? t._events[u].fn ? t._events[u] = [t._events[u], a] : t._events[u].push(a) : (t._events[u] = a,
                t._eventsCount++),
                t
            }
            function s(t, e) {
                0 == --t._eventsCount ? t._events = new r : delete t._events[e]
            }
            function a() {
                this._events = new r,
                this._eventsCount = 0
            }
            Object.create && (r.prototype = Object.create(null),
            (new r).__proto__ || (n = !1)),
            a.prototype.eventNames = function() {
                var t, r, o = [];
                if (0 === this._eventsCount)
                    return o;
                for (r in t = this._events)
                    e.call(t, r) && o.push(n ? r.slice(1) : r);
                return Object.getOwnPropertySymbols ? o.concat(Object.getOwnPropertySymbols(t)) : o
            }
            ,
            a.prototype.listeners = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                if (!r)
                    return [];
                if (r.fn)
                    return [r.fn];
                for (var o = 0, i = r.length, s = new Array(i); o < i; o++)
                    s[o] = r[o].fn;
                return s
            }
            ,
            a.prototype.listenerCount = function(t) {
                var e = n ? n + t : t
                  , r = this._events[e];
                return r ? r.fn ? 1 : r.length : 0
            }
            ,
            a.prototype.emit = function(t, e, r, o, i, s) {
                var a = n ? n + t : t;
                if (!this._events[a])
                    return !1;
                var u, c, l = this._events[a], f = arguments.length;
                if (l.fn) {
                    switch (l.once && this.removeListener(t, l.fn, void 0, !0),
                    f) {
                    case 1:
                        return l.fn.call(l.context),
                        !0;
                    case 2:
                        return l.fn.call(l.context, e),
                        !0;
                    case 3:
                        return l.fn.call(l.context, e, r),
                        !0;
                    case 4:
                        return l.fn.call(l.context, e, r, o),
                        !0;
                    case 5:
                        return l.fn.call(l.context, e, r, o, i),
                        !0;
                    case 6:
                        return l.fn.call(l.context, e, r, o, i, s),
                        !0
                    }
                    for (c = 1,
                    u = new Array(f - 1); c < f; c++)
                        u[c - 1] = arguments[c];
                    l.fn.apply(l.context, u)
                } else {
                    var h, d = l.length;
                    for (c = 0; c < d; c++)
                        switch (l[c].once && this.removeListener(t, l[c].fn, void 0, !0),
                        f) {
                        case 1:
                            l[c].fn.call(l[c].context);
                            break;
                        case 2:
                            l[c].fn.call(l[c].context, e);
                            break;
                        case 3:
                            l[c].fn.call(l[c].context, e, r);
                            break;
                        case 4:
                            l[c].fn.call(l[c].context, e, r, o);
                            break;
                        default:
                            if (!u)
                                for (h = 1,
                                u = new Array(f - 1); h < f; h++)
                                    u[h - 1] = arguments[h];
                            l[c].fn.apply(l[c].context, u)
                        }
                }
                return !0
            }
            ,
            a.prototype.on = function(t, e, n) {
                return i(this, t, e, n, !1)
            }
            ,
            a.prototype.once = function(t, e, n) {
                return i(this, t, e, n, !0)
            }
            ,
            a.prototype.removeListener = function(t, e, r, o) {
                var i = n ? n + t : t;
                if (!this._events[i])
                    return this;
                if (!e)
                    return s(this, i),
                    this;
                var a = this._events[i];
                if (a.fn)
                    a.fn !== e || o && !a.once || r && a.context !== r || s(this, i);
                else {
                    for (var u = 0, c = [], l = a.length; u < l; u++)
                        (a[u].fn !== e || o && !a[u].once || r && a[u].context !== r) && c.push(a[u]);
                    c.length ? this._events[i] = 1 === c.length ? c[0] : c : s(this, i)
                }
                return this
            }
            ,
            a.prototype.removeAllListeners = function(t) {
                var e;
                return t ? (e = n ? n + t : t,
                this._events[e] && s(this, e)) : (this._events = new r,
                this._eventsCount = 0),
                this
            }
            ,
            a.prototype.off = a.prototype.removeListener,
            a.prototype.addListener = a.prototype.on,
            a.prefixed = n,
            a.EventEmitter = a,
            t.exports = a
        }
        ,
        "../../../node_modules/for-each/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/is-callable/index.js")
              , o = Object.prototype.toString
              , i = Object.prototype.hasOwnProperty;
            t.exports = function(t, e, n) {
                if (!r(e))
                    throw new TypeError("iterator must be a function");
                var s;
                arguments.length >= 3 && (s = n),
                "[object Array]" === o.call(t) ? function(t, e, n) {
                    for (var r = 0, o = t.length; r < o; r++)
                        i.call(t, r) && (null == n ? e(t[r], r, t) : e.call(n, t[r], r, t))
                }(t, e, s) : "string" == typeof t ? function(t, e, n) {
                    for (var r = 0, o = t.length; r < o; r++)
                        null == n ? e(t.charAt(r), r, t) : e.call(n, t.charAt(r), r, t)
                }(t, e, s) : function(t, e, n) {
                    for (var r in t)
                        i.call(t, r) && (null == n ? e(t[r], r, t) : e.call(n, t[r], r, t))
                }(t, e, s)
            }
        }
        ,
        "../../../node_modules/function-bind/implementation.js": t=>{
            "use strict";
            var e = Object.prototype.toString
              , n = Math.max
              , r = function(t, e) {
                for (var n = [], r = 0; r < t.length; r += 1)
                    n[r] = t[r];
                for (var o = 0; o < e.length; o += 1)
                    n[o + t.length] = e[o];
                return n
            };
            t.exports = function(t) {
                var o = this;
                if ("function" != typeof o || "[object Function]" !== e.apply(o))
                    throw new TypeError("Function.prototype.bind called on incompatible " + o);
                for (var i, s = function(t, e) {
                    for (var n = [], r = 1, o = 0; r < t.length; r += 1,
                    o += 1)
                        n[o] = t[r];
                    return n
                }(arguments), a = n(0, o.length - s.length), u = [], c = 0; c < a; c++)
                    u[c] = "$" + c;
                if (i = Function("binder", "return function (" + function(t, e) {
                    for (var n = "", r = 0; r < t.length; r += 1)
                        n += t[r],
                        r + 1 < t.length && (n += ",");
                    return n
                }(u) + "){ return binder.apply(this,arguments); }")((function() {
                    if (this instanceof i) {
                        var e = o.apply(this, r(s, arguments));
                        return Object(e) === e ? e : this
                    }
                    return o.apply(t, r(s, arguments))
                }
                )),
                o.prototype) {
                    var l = function() {};
                    l.prototype = o.prototype,
                    i.prototype = new l,
                    l.prototype = null
                }
                return i
            }
        }
        ,
        "../../../node_modules/function-bind/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/function-bind/implementation.js");
            t.exports = Function.prototype.bind || r
        }
        ,
        "../../../node_modules/get-intrinsic/index.js": (t,e,n)=>{
            "use strict";
            var r, o = n("../../../node_modules/es-errors/index.js"), i = n("../../../node_modules/es-errors/eval.js"), s = n("../../../node_modules/es-errors/range.js"), a = n("../../../node_modules/es-errors/ref.js"), u = n("../../../node_modules/es-errors/syntax.js"), c = n("../../../node_modules/es-errors/type.js"), l = n("../../../node_modules/es-errors/uri.js"), f = Function, h = function(t) {
                try {
                    return f('"use strict"; return (' + t + ").constructor;")()
                } catch (t) {}
            }, d = Object.getOwnPropertyDescriptor;
            if (d)
                try {
                    d({}, "")
                } catch (t) {
                    d = null
                }
            var p = function() {
                throw new c
            }
              , y = d ? function() {
                try {
                    return p
                } catch (t) {
                    try {
                        return d(arguments, "callee").get
                    } catch (t) {
                        return p
                    }
                }
            }() : p
              , g = n("../../../node_modules/has-symbols/index.js")()
              , m = n("../../../node_modules/has-proto/index.js")()
              , b = Object.getPrototypeOf || (m ? function(t) {
                return t.__proto__
            }
            : null)
              , w = {}
              , v = "undefined" != typeof Uint8Array && b ? b(Uint8Array) : r
              , M = {
                __proto__: null,
                "%AggregateError%": "undefined" == typeof AggregateError ? r : AggregateError,
                "%Array%": Array,
                "%ArrayBuffer%": "undefined" == typeof ArrayBuffer ? r : ArrayBuffer,
                "%ArrayIteratorPrototype%": g && b ? b([][Symbol.iterator]()) : r,
                "%AsyncFromSyncIteratorPrototype%": r,
                "%AsyncFunction%": w,
                "%AsyncGenerator%": w,
                "%AsyncGeneratorFunction%": w,
                "%AsyncIteratorPrototype%": w,
                "%Atomics%": "undefined" == typeof Atomics ? r : Atomics,
                "%BigInt%": "undefined" == typeof BigInt ? r : BigInt,
                "%BigInt64Array%": "undefined" == typeof BigInt64Array ? r : BigInt64Array,
                "%BigUint64Array%": "undefined" == typeof BigUint64Array ? r : BigUint64Array,
                "%Boolean%": Boolean,
                "%DataView%": "undefined" == typeof DataView ? r : DataView,
                "%Date%": Date,
                "%decodeURI%": decodeURI,
                "%decodeURIComponent%": decodeURIComponent,
                "%encodeURI%": encodeURI,
                "%encodeURIComponent%": encodeURIComponent,
                "%Error%": o,
                "%eval%": eval,
                "%EvalError%": i,
                "%Float32Array%": "undefined" == typeof Float32Array ? r : Float32Array,
                "%Float64Array%": "undefined" == typeof Float64Array ? r : Float64Array,
                "%FinalizationRegistry%": "undefined" == typeof FinalizationRegistry ? r : FinalizationRegistry,
                "%Function%": f,
                "%GeneratorFunction%": w,
                "%Int8Array%": "undefined" == typeof Int8Array ? r : Int8Array,
                "%Int16Array%": "undefined" == typeof Int16Array ? r : Int16Array,
                "%Int32Array%": "undefined" == typeof Int32Array ? r : Int32Array,
                "%isFinite%": isFinite,
                "%isNaN%": isNaN,
                "%IteratorPrototype%": g && b ? b(b([][Symbol.iterator]())) : r,
                "%JSON%": "object" == typeof JSON ? JSON : r,
                "%Map%": "undefined" == typeof Map ? r : Map,
                "%MapIteratorPrototype%": "undefined" != typeof Map && g && b ? b((new Map)[Symbol.iterator]()) : r,
                "%Math%": Math,
                "%Number%": Number,
                "%Object%": Object,
                "%parseFloat%": parseFloat,
                "%parseInt%": parseInt,
                "%Promise%": "undefined" == typeof Promise ? r : Promise,
                "%Proxy%": "undefined" == typeof Proxy ? r : Proxy,
                "%RangeError%": s,
                "%ReferenceError%": a,
                "%Reflect%": "undefined" == typeof Reflect ? r : Reflect,
                "%RegExp%": RegExp,
                "%Set%": "undefined" == typeof Set ? r : Set,
                "%SetIteratorPrototype%": "undefined" != typeof Set && g && b ? b((new Set)[Symbol.iterator]()) : r,
                "%SharedArrayBuffer%": "undefined" == typeof SharedArrayBuffer ? r : SharedArrayBuffer,
                "%String%": String,
                "%StringIteratorPrototype%": g && b ? b(""[Symbol.iterator]()) : r,
                "%Symbol%": g ? Symbol : r,
                "%SyntaxError%": u,
                "%ThrowTypeError%": y,
                "%TypedArray%": v,
                "%TypeError%": c,
                "%Uint8Array%": "undefined" == typeof Uint8Array ? r : Uint8Array,
                "%Uint8ClampedArray%": "undefined" == typeof Uint8ClampedArray ? r : Uint8ClampedArray,
                "%Uint16Array%": "undefined" == typeof Uint16Array ? r : Uint16Array,
                "%Uint32Array%": "undefined" == typeof Uint32Array ? r : Uint32Array,
                "%URIError%": l,
                "%WeakMap%": "undefined" == typeof WeakMap ? r : WeakMap,
                "%WeakRef%": "undefined" == typeof WeakRef ? r : WeakRef,
                "%WeakSet%": "undefined" == typeof WeakSet ? r : WeakSet
            };
            if (b)
                try {
                    null.error
                } catch (t) {
                    var x = b(b(t));
                    M["%Error.prototype%"] = x
                }
            var j = function t(e) {
                var n;
                if ("%AsyncFunction%" === e)
                    n = h("async function () {}");
                else if ("%GeneratorFunction%" === e)
                    n = h("function* () {}");
                else if ("%AsyncGeneratorFunction%" === e)
                    n = h("async function* () {}");
                else if ("%AsyncGenerator%" === e) {
                    var r = t("%AsyncGeneratorFunction%");
                    r && (n = r.prototype)
                } else if ("%AsyncIteratorPrototype%" === e) {
                    var o = t("%AsyncGenerator%");
                    o && b && (n = b(o.prototype))
                }
                return M[e] = n,
                n
            }
              , I = {
                __proto__: null,
                "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
                "%ArrayPrototype%": ["Array", "prototype"],
                "%ArrayProto_entries%": ["Array", "prototype", "entries"],
                "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
                "%ArrayProto_keys%": ["Array", "prototype", "keys"],
                "%ArrayProto_values%": ["Array", "prototype", "values"],
                "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
                "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
                "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
                "%BooleanPrototype%": ["Boolean", "prototype"],
                "%DataViewPrototype%": ["DataView", "prototype"],
                "%DatePrototype%": ["Date", "prototype"],
                "%ErrorPrototype%": ["Error", "prototype"],
                "%EvalErrorPrototype%": ["EvalError", "prototype"],
                "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
                "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
                "%FunctionPrototype%": ["Function", "prototype"],
                "%Generator%": ["GeneratorFunction", "prototype"],
                "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
                "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
                "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
                "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
                "%JSONParse%": ["JSON", "parse"],
                "%JSONStringify%": ["JSON", "stringify"],
                "%MapPrototype%": ["Map", "prototype"],
                "%NumberPrototype%": ["Number", "prototype"],
                "%ObjectPrototype%": ["Object", "prototype"],
                "%ObjProto_toString%": ["Object", "prototype", "toString"],
                "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
                "%PromisePrototype%": ["Promise", "prototype"],
                "%PromiseProto_then%": ["Promise", "prototype", "then"],
                "%Promise_all%": ["Promise", "all"],
                "%Promise_reject%": ["Promise", "reject"],
                "%Promise_resolve%": ["Promise", "resolve"],
                "%RangeErrorPrototype%": ["RangeError", "prototype"],
                "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
                "%RegExpPrototype%": ["RegExp", "prototype"],
                "%SetPrototype%": ["Set", "prototype"],
                "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
                "%StringPrototype%": ["String", "prototype"],
                "%SymbolPrototype%": ["Symbol", "prototype"],
                "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
                "%TypedArrayPrototype%": ["TypedArray", "prototype"],
                "%TypeErrorPrototype%": ["TypeError", "prototype"],
                "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
                "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
                "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
                "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
                "%URIErrorPrototype%": ["URIError", "prototype"],
                "%WeakMapPrototype%": ["WeakMap", "prototype"],
                "%WeakSetPrototype%": ["WeakSet", "prototype"]
            }
              , A = n("../../../node_modules/function-bind/index.js")
              , S = n("../../../node_modules/hasown/index.js")
              , _ = A.call(Function.call, Array.prototype.concat)
              , E = A.call(Function.apply, Array.prototype.splice)
              , k = A.call(Function.call, String.prototype.replace)
              , O = A.call(Function.call, String.prototype.slice)
              , L = A.call(Function.call, RegExp.prototype.exec)
              , T = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g
              , B = /\\(\\)?/g
              , N = function(t, e) {
                var n, r = t;
                if (S(I, r) && (r = "%" + (n = I[r])[0] + "%"),
                S(M, r)) {
                    var o = M[r];
                    if (o === w && (o = j(r)),
                    void 0 === o && !e)
                        throw new c("intrinsic " + t + " exists, but is not available. Please file an issue!");
                    return {
                        alias: n,
                        name: r,
                        value: o
                    }
                }
                throw new u("intrinsic " + t + " does not exist!")
            };
            t.exports = function(t, e) {
                if ("string" != typeof t || 0 === t.length)
                    throw new c("intrinsic name must be a non-empty string");
                if (arguments.length > 1 && "boolean" != typeof e)
                    throw new c('"allowMissing" argument must be a boolean');
                if (null === L(/^%?[^%]*%?$/, t))
                    throw new u("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
                var n = function(t) {
                    var e = O(t, 0, 1)
                      , n = O(t, -1);
                    if ("%" === e && "%" !== n)
                        throw new u("invalid intrinsic syntax, expected closing `%`");
                    if ("%" === n && "%" !== e)
                        throw new u("invalid intrinsic syntax, expected opening `%`");
                    var r = [];
                    return k(t, T, (function(t, e, n, o) {
                        r[r.length] = n ? k(o, B, "$1") : e || t
                    }
                    )),
                    r
                }(t)
                  , r = n.length > 0 ? n[0] : ""
                  , o = N("%" + r + "%", e)
                  , i = o.name
                  , s = o.value
                  , a = !1
                  , l = o.alias;
                l && (r = l[0],
                E(n, _([0, 1], l)));
                for (var f = 1, h = !0; f < n.length; f += 1) {
                    var p = n[f]
                      , y = O(p, 0, 1)
                      , g = O(p, -1);
                    if (('"' === y || "'" === y || "`" === y || '"' === g || "'" === g || "`" === g) && y !== g)
                        throw new u("property names with quotes must have matching quotes");
                    if ("constructor" !== p && h || (a = !0),
                    S(M, i = "%" + (r += "." + p) + "%"))
                        s = M[i];
                    else if (null != s) {
                        if (!(p in s)) {
                            if (!e)
                                throw new c("base intrinsic for " + t + " exists, but the property is not available.");
                            return
                        }
                        if (d && f + 1 >= n.length) {
                            var m = d(s, p);
                            s = (h = !!m) && "get"in m && !("originalValue"in m.get) ? m.get : s[p]
                        } else
                            h = S(s, p),
                            s = s[p];
                        h && !a && (M[i] = s)
                    }
                }
                return s
            }
        }
        ,
        "../../../node_modules/gopd/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/get-intrinsic/index.js")("%Object.getOwnPropertyDescriptor%", !0);
            if (r)
                try {
                    r([], "length")
                } catch (t) {
                    r = null
                }
            t.exports = r
        }
        ,
        "../../../node_modules/has-property-descriptors/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/es-define-property/index.js")
              , o = function() {
                return !!r
            };
            o.hasArrayLengthDefineBug = function() {
                if (!r)
                    return null;
                try {
                    return 1 !== r([], "length", {
                        value: 1
                    }).length
                } catch (t) {
                    return !0
                }
            }
            ,
            t.exports = o
        }
        ,
        "../../../node_modules/has-proto/index.js": t=>{
            "use strict";
            var e = {
                __proto__: null,
                foo: {}
            }
              , n = Object;
            t.exports = function() {
                return {
                    __proto__: e
                }.foo === e.foo && !(e instanceof n)
            }
        }
        ,
        "../../../node_modules/has-symbols/index.js": (t,e,n)=>{
            "use strict";
            var r = "undefined" != typeof Symbol && Symbol
              , o = n("../../../node_modules/has-symbols/shams.js");
            t.exports = function() {
                return "function" == typeof r && "function" == typeof Symbol && "symbol" == typeof r("foo") && "symbol" == typeof Symbol("bar") && o()
            }
        }
        ,
        "../../../node_modules/has-symbols/shams.js": t=>{
            "use strict";
            t.exports = function() {
                if ("function" != typeof Symbol || "function" != typeof Object.getOwnPropertySymbols)
                    return !1;
                if ("symbol" == typeof Symbol.iterator)
                    return !0;
                var t = {}
                  , e = Symbol("test")
                  , n = Object(e);
                if ("string" == typeof e)
                    return !1;
                if ("[object Symbol]" !== Object.prototype.toString.call(e))
                    return !1;
                if ("[object Symbol]" !== Object.prototype.toString.call(n))
                    return !1;
                for (e in t[e] = 42,
                t)
                    return !1;
                if ("function" == typeof Object.keys && 0 !== Object.keys(t).length)
                    return !1;
                if ("function" == typeof Object.getOwnPropertyNames && 0 !== Object.getOwnPropertyNames(t).length)
                    return !1;
                var r = Object.getOwnPropertySymbols(t);
                if (1 !== r.length || r[0] !== e)
                    return !1;
                if (!Object.prototype.propertyIsEnumerable.call(t, e))
                    return !1;
                if ("function" == typeof Object.getOwnPropertyDescriptor) {
                    var o = Object.getOwnPropertyDescriptor(t, e);
                    if (42 !== o.value || !0 !== o.enumerable)
                        return !1
                }
                return !0
            }
        }
        ,
        "../../../node_modules/has-tostringtag/shams.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/has-symbols/shams.js");
            t.exports = function() {
                return r() && !!Symbol.toStringTag
            }
        }
        ,
        "../../../node_modules/hasown/index.js": (t,e,n)=>{
            "use strict";
            var r = Function.prototype.call
              , o = Object.prototype.hasOwnProperty
              , i = n("../../../node_modules/function-bind/index.js");
            t.exports = i.call(r, o)
        }
        ,
        "../../../node_modules/ieee754/index.js": (t,e)=>{
            e.read = function(t, e, n, r, o) {
                var i, s, a = 8 * o - r - 1, u = (1 << a) - 1, c = u >> 1, l = -7, f = n ? o - 1 : 0, h = n ? -1 : 1, d = t[e + f];
                for (f += h,
                i = d & (1 << -l) - 1,
                d >>= -l,
                l += a; l > 0; i = 256 * i + t[e + f],
                f += h,
                l -= 8)
                    ;
                for (s = i & (1 << -l) - 1,
                i >>= -l,
                l += r; l > 0; s = 256 * s + t[e + f],
                f += h,
                l -= 8)
                    ;
                if (0 === i)
                    i = 1 - c;
                else {
                    if (i === u)
                        return s ? NaN : 1 / 0 * (d ? -1 : 1);
                    s += Math.pow(2, r),
                    i -= c
                }
                return (d ? -1 : 1) * s * Math.pow(2, i - r)
            }
            ,
            e.write = function(t, e, n, r, o, i) {
                var s, a, u, c = 8 * i - o - 1, l = (1 << c) - 1, f = l >> 1, h = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d = r ? 0 : i - 1, p = r ? 1 : -1, y = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
                for (e = Math.abs(e),
                isNaN(e) || e === 1 / 0 ? (a = isNaN(e) ? 1 : 0,
                s = l) : (s = Math.floor(Math.log(e) / Math.LN2),
                e * (u = Math.pow(2, -s)) < 1 && (s--,
                u *= 2),
                (e += s + f >= 1 ? h / u : h * Math.pow(2, 1 - f)) * u >= 2 && (s++,
                u /= 2),
                s + f >= l ? (a = 0,
                s = l) : s + f >= 1 ? (a = (e * u - 1) * Math.pow(2, o),
                s += f) : (a = e * Math.pow(2, f - 1) * Math.pow(2, o),
                s = 0)); o >= 8; t[n + d] = 255 & a,
                d += p,
                a /= 256,
                o -= 8)
                    ;
                for (s = s << o | a,
                c += o; c > 0; t[n + d] = 255 & s,
                d += p,
                s /= 256,
                c -= 8)
                    ;
                t[n + d - p] |= 128 * y
            }
        }
        ,
        "../../../node_modules/inherits/inherits_browser.js": t=>{
            "function" == typeof Object.create ? t.exports = function(t, e) {
                e && (t.super_ = e,
                t.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }))
            }
            : t.exports = function(t, e) {
                if (e) {
                    t.super_ = e;
                    var n = function() {};
                    n.prototype = e.prototype,
                    t.prototype = new n,
                    t.prototype.constructor = t
                }
            }
        }
        ,
        "../../../node_modules/is-arguments/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/has-tostringtag/shams.js")()
              , o = n("../../../node_modules/call-bind/callBound.js")("Object.prototype.toString")
              , i = function(t) {
                return !(r && t && "object" == typeof t && Symbol.toStringTag in t) && "[object Arguments]" === o(t)
            }
              , s = function(t) {
                return !!i(t) || null !== t && "object" == typeof t && "number" == typeof t.length && t.length >= 0 && "[object Array]" !== o(t) && "[object Function]" === o(t.callee)
            }
              , a = function() {
                return i(arguments)
            }();
            i.isLegacyArguments = s,
            t.exports = a ? i : s
        }
        ,
        "../../../node_modules/is-callable/index.js": t=>{
            "use strict";
            var e, n, r = Function.prototype.toString, o = "object" == typeof Reflect && null !== Reflect && Reflect.apply;
            if ("function" == typeof o && "function" == typeof Object.defineProperty)
                try {
                    e = Object.defineProperty({}, "length", {
                        get: function() {
                            throw n
                        }
                    }),
                    n = {},
                    o((function() {
                        throw 42
                    }
                    ), null, e)
                } catch (t) {
                    t !== n && (o = null)
                }
            else
                o = null;
            var i = /^\s*class\b/
              , s = function(t) {
                try {
                    var e = r.call(t);
                    return i.test(e)
                } catch (t) {
                    return !1
                }
            }
              , a = function(t) {
                try {
                    return !s(t) && (r.call(t),
                    !0)
                } catch (t) {
                    return !1
                }
            }
              , u = Object.prototype.toString
              , c = "function" == typeof Symbol && !!Symbol.toStringTag
              , l = !(0 in [, ])
              , f = function() {
                return !1
            };
            if ("object" == typeof document) {
                var h = document.all;
                u.call(h) === u.call(document.all) && (f = function(t) {
                    if ((l || !t) && (void 0 === t || "object" == typeof t))
                        try {
                            var e = u.call(t);
                            return ("[object HTMLAllCollection]" === e || "[object HTML document.all class]" === e || "[object HTMLCollection]" === e || "[object Object]" === e) && null == t("")
                        } catch (t) {}
                    return !1
                }
                )
            }
            t.exports = o ? function(t) {
                if (f(t))
                    return !0;
                if (!t)
                    return !1;
                if ("function" != typeof t && "object" != typeof t)
                    return !1;
                try {
                    o(t, null, e)
                } catch (t) {
                    if (t !== n)
                        return !1
                }
                return !s(t) && a(t)
            }
            : function(t) {
                if (f(t))
                    return !0;
                if (!t)
                    return !1;
                if ("function" != typeof t && "object" != typeof t)
                    return !1;
                if (c)
                    return a(t);
                if (s(t))
                    return !1;
                var e = u.call(t);
                return !("[object Function]" !== e && "[object GeneratorFunction]" !== e && !/^\[object HTML/.test(e)) && a(t)
            }
        }
        ,
        "../../../node_modules/is-generator-function/index.js": (t,e,n)=>{
            "use strict";
            var r, o = Object.prototype.toString, i = Function.prototype.toString, s = /^\s*(?:function)?\*/, a = n("../../../node_modules/has-tostringtag/shams.js")(), u = Object.getPrototypeOf;
            t.exports = function(t) {
                if ("function" != typeof t)
                    return !1;
                if (s.test(i.call(t)))
                    return !0;
                if (!a)
                    return "[object GeneratorFunction]" === o.call(t);
                if (!u)
                    return !1;
                if (void 0 === r) {
                    var e = function() {
                        if (!a)
                            return !1;
                        try {
                            return Function("return function*() {}")()
                        } catch (t) {}
                    }();
                    r = !!e && u(e)
                }
                return u(t) === r
            }
        }
        ,
        "../../../node_modules/is-nan/implementation.js": t=>{
            "use strict";
            t.exports = function(t) {
                return t != t
            }
        }
        ,
        "../../../node_modules/is-nan/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/call-bind/index.js")
              , o = n("../../../node_modules/define-properties/index.js")
              , i = n("../../../node_modules/is-nan/implementation.js")
              , s = n("../../../node_modules/is-nan/polyfill.js")
              , a = n("../../../node_modules/is-nan/shim.js")
              , u = r(s(), Number);
            o(u, {
                getPolyfill: s,
                implementation: i,
                shim: a
            }),
            t.exports = u
        }
        ,
        "../../../node_modules/is-nan/polyfill.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/is-nan/implementation.js");
            t.exports = function() {
                return Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a") ? Number.isNaN : r
            }
        }
        ,
        "../../../node_modules/is-nan/shim.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/define-properties/index.js")
              , o = n("../../../node_modules/is-nan/polyfill.js");
            t.exports = function() {
                var t = o();
                return r(Number, {
                    isNaN: t
                }, {
                    isNaN: function() {
                        return Number.isNaN !== t
                    }
                }),
                t
            }
        }
        ,
        "../../../node_modules/is-typed-array/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/which-typed-array/index.js");
            t.exports = function(t) {
                return !!r(t)
            }
        }
        ,
        "../../../node_modules/jayson/lib/client/browser/index.js": (t,e,n)=>{
            "use strict";
            const r = n("../../../node_modules/uuid/dist/esm-browser/index.js").v4
              , o = n("../../../node_modules/jayson/lib/generateRequest.js")
              , i = function(t, e) {
                if (!(this instanceof i))
                    return new i(t,e);
                e || (e = {}),
                this.options = {
                    reviver: void 0 !== e.reviver ? e.reviver : null,
                    replacer: void 0 !== e.replacer ? e.replacer : null,
                    generator: void 0 !== e.generator ? e.generator : function() {
                        return r()
                    }
                    ,
                    version: void 0 !== e.version ? e.version : 2,
                    notificationIdNull: "boolean" == typeof e.notificationIdNull && e.notificationIdNull
                },
                this.callServer = t
            };
            t.exports = i,
            i.prototype.request = function(t, e, n, r) {
                const i = this;
                let s = null;
                const a = Array.isArray(t) && "function" == typeof e;
                if (1 === this.options.version && a)
                    throw new TypeError("JSON-RPC 1.0 does not support batching");
                if (a || !a && t && "object" == typeof t && "function" == typeof e)
                    r = e,
                    s = t;
                else {
                    "function" == typeof n && (r = n,
                    n = void 0);
                    const i = "function" == typeof r;
                    try {
                        s = o(t, e, n, {
                            generator: this.options.generator,
                            version: this.options.version,
                            notificationIdNull: this.options.notificationIdNull
                        })
                    } catch (t) {
                        if (i)
                            return r(t);
                        throw t
                    }
                    if (!i)
                        return s
                }
                let u;
                try {
                    u = JSON.stringify(s, this.options.replacer)
                } catch (t) {
                    return r(t)
                }
                return this.callServer(u, (function(t, e) {
                    i._parseResponse(t, e, r)
                }
                )),
                s
            }
            ,
            i.prototype._parseResponse = function(t, e, n) {
                if (t)
                    return void n(t);
                if (!e)
                    return n();
                let r;
                try {
                    r = JSON.parse(e, this.options.reviver)
                } catch (t) {
                    return n(t)
                }
                if (3 === n.length) {
                    if (Array.isArray(r)) {
                        const t = function(t) {
                            return void 0 !== t.error
                        }
                          , e = function(e) {
                            return !t(e)
                        };
                        return n(null, r.filter(t), r.filter(e))
                    }
                    return n(null, r.error, r.result)
                }
                n(null, r)
            }
        }
        ,
        "../../../node_modules/jayson/lib/generateRequest.js": (t,e,n)=>{
            "use strict";
            const r = n("../../../node_modules/uuid/dist/esm-browser/index.js").v4;
            t.exports = function(t, e, n, o) {
                if ("string" != typeof t)
                    throw new TypeError(t + " must be a string");
                const i = "number" == typeof (o = o || {}).version ? o.version : 2;
                if (1 !== i && 2 !== i)
                    throw new TypeError(i + " must be 1 or 2");
                const s = {
                    method: t
                };
                if (2 === i && (s.jsonrpc = "2.0"),
                e) {
                    if ("object" != typeof e && !Array.isArray(e))
                        throw new TypeError(e + " must be an object, array or omitted");
                    s.params = e
                }
                if (void 0 === n) {
                    const t = "function" == typeof o.generator ? o.generator : function() {
                        return r()
                    }
                    ;
                    s.id = t(s, o)
                } else
                    2 === i && null === n ? o.notificationIdNull && (s.id = null) : s.id = n;
                return s
            }
        }
        ,
        "../../../node_modules/object-is/implementation.js": t=>{
            "use strict";
            var e = function(t) {
                return t != t
            };
            t.exports = function(t, n) {
                return 0 === t && 0 === n ? 1 / t == 1 / n : t === n || !(!e(t) || !e(n))
            }
        }
        ,
        "../../../node_modules/object-is/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/define-properties/index.js")
              , o = n("../../../node_modules/call-bind/index.js")
              , i = n("../../../node_modules/object-is/implementation.js")
              , s = n("../../../node_modules/object-is/polyfill.js")
              , a = n("../../../node_modules/object-is/shim.js")
              , u = o(s(), Object);
            r(u, {
                getPolyfill: s,
                implementation: i,
                shim: a
            }),
            t.exports = u
        }
        ,
        "../../../node_modules/object-is/polyfill.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/object-is/implementation.js");
            t.exports = function() {
                return "function" == typeof Object.is ? Object.is : r
            }
        }
        ,
        "../../../node_modules/object-is/shim.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/object-is/polyfill.js")
              , o = n("../../../node_modules/define-properties/index.js");
            t.exports = function() {
                var t = r();
                return o(Object, {
                    is: t
                }, {
                    is: function() {
                        return Object.is !== t
                    }
                }),
                t
            }
        }
        ,
        "../../../node_modules/object-keys/implementation.js": (t,e,n)=>{
            "use strict";
            var r;
            if (!Object.keys) {
                var o = Object.prototype.hasOwnProperty
                  , i = Object.prototype.toString
                  , s = n("../../../node_modules/object-keys/isArguments.js")
                  , a = Object.prototype.propertyIsEnumerable
                  , u = !a.call({
                    toString: null
                }, "toString")
                  , c = a.call((function() {}
                ), "prototype")
                  , l = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"]
                  , f = function(t) {
                    var e = t.constructor;
                    return e && e.prototype === t
                }
                  , h = {
                    $applicationCache: !0,
                    $console: !0,
                    $external: !0,
                    $frame: !0,
                    $frameElement: !0,
                    $frames: !0,
                    $innerHeight: !0,
                    $innerWidth: !0,
                    $onmozfullscreenchange: !0,
                    $onmozfullscreenerror: !0,
                    $outerHeight: !0,
                    $outerWidth: !0,
                    $pageXOffset: !0,
                    $pageYOffset: !0,
                    $parent: !0,
                    $scrollLeft: !0,
                    $scrollTop: !0,
                    $scrollX: !0,
                    $scrollY: !0,
                    $self: !0,
                    $webkitIndexedDB: !0,
                    $webkitStorageInfo: !0,
                    $window: !0
                }
                  , d = function() {
                    if ("undefined" == typeof window)
                        return !1;
                    for (var t in window)
                        try {
                            if (!h["$" + t] && o.call(window, t) && null !== window[t] && "object" == typeof window[t])
                                try {
                                    f(window[t])
                                } catch (t) {
                                    return !0
                                }
                        } catch (t) {
                            return !0
                        }
                    return !1
                }();
                r = function(t) {
                    var e = null !== t && "object" == typeof t
                      , n = "[object Function]" === i.call(t)
                      , r = s(t)
                      , a = e && "[object String]" === i.call(t)
                      , h = [];
                    if (!e && !n && !r)
                        throw new TypeError("Object.keys called on a non-object");
                    var p = c && n;
                    if (a && t.length > 0 && !o.call(t, 0))
                        for (var y = 0; y < t.length; ++y)
                            h.push(String(y));
                    if (r && t.length > 0)
                        for (var g = 0; g < t.length; ++g)
                            h.push(String(g));
                    else
                        for (var m in t)
                            p && "prototype" === m || !o.call(t, m) || h.push(String(m));
                    if (u)
                        for (var b = function(t) {
                            if ("undefined" == typeof window || !d)
                                return f(t);
                            try {
                                return f(t)
                            } catch (t) {
                                return !1
                            }
                        }(t), w = 0; w < l.length; ++w)
                            b && "constructor" === l[w] || !o.call(t, l[w]) || h.push(l[w]);
                    return h
                }
            }
            t.exports = r
        }
        ,
        "../../../node_modules/object-keys/index.js": (t,e,n)=>{
            "use strict";
            var r = Array.prototype.slice
              , o = n("../../../node_modules/object-keys/isArguments.js")
              , i = Object.keys
              , s = i ? function(t) {
                return i(t)
            }
            : n("../../../node_modules/object-keys/implementation.js")
              , a = Object.keys;
            s.shim = function() {
                if (Object.keys) {
                    var t = function() {
                        var t = Object.keys(arguments);
                        return t && t.length === arguments.length
                    }(1, 2);
                    t || (Object.keys = function(t) {
                        return o(t) ? a(r.call(t)) : a(t)
                    }
                    )
                } else
                    Object.keys = s;
                return Object.keys || s
            }
            ,
            t.exports = s
        }
        ,
        "../../../node_modules/object-keys/isArguments.js": t=>{
            "use strict";
            var e = Object.prototype.toString;
            t.exports = function(t) {
                var n = e.call(t)
                  , r = "[object Arguments]" === n;
                return r || (r = "[object Array]" !== n && null !== t && "object" == typeof t && "number" == typeof t.length && t.length >= 0 && "[object Function]" === e.call(t.callee)),
                r
            }
        }
        ,
        "../../../node_modules/possible-typed-array-names/index.js": t=>{
            "use strict";
            t.exports = ["Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array"]
        }
        ,
        "../../../node_modules/process/browser.js": t=>{
            var e, n, r = t.exports = {};
            function o() {
                throw new Error("setTimeout has not been defined")
            }
            function i() {
                throw new Error("clearTimeout has not been defined")
            }
            function s(t) {
                if (e === setTimeout)
                    return setTimeout(t, 0);
                if ((e === o || !e) && setTimeout)
                    return e = setTimeout,
                    setTimeout(t, 0);
                try {
                    return e(t, 0)
                } catch (n) {
                    try {
                        return e.call(null, t, 0)
                    } catch (n) {
                        return e.call(this, t, 0)
                    }
                }
            }
            !function() {
                try {
                    e = "function" == typeof setTimeout ? setTimeout : o
                } catch (t) {
                    e = o
                }
                try {
                    n = "function" == typeof clearTimeout ? clearTimeout : i
                } catch (t) {
                    n = i
                }
            }();
            var a, u = [], c = !1, l = -1;
            function f() {
                c && a && (c = !1,
                a.length ? u = a.concat(u) : l = -1,
                u.length && h())
            }
            function h() {
                if (!c) {
                    var t = s(f);
                    c = !0;
                    for (var e = u.length; e; ) {
                        for (a = u,
                        u = []; ++l < e; )
                            a && a[l].run();
                        l = -1,
                        e = u.length
                    }
                    a = null,
                    c = !1,
                    function(t) {
                        if (n === clearTimeout)
                            return clearTimeout(t);
                        if ((n === i || !n) && clearTimeout)
                            return n = clearTimeout,
                            clearTimeout(t);
                        try {
                            return n(t)
                        } catch (e) {
                            try {
                                return n.call(null, t)
                            } catch (e) {
                                return n.call(this, t)
                            }
                        }
                    }(t)
                }
            }
            function d(t, e) {
                this.fun = t,
                this.array = e
            }
            function p() {}
            r.nextTick = function(t) {
                var e = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var n = 1; n < arguments.length; n++)
                        e[n - 1] = arguments[n];
                u.push(new d(t,e)),
                1 !== u.length || c || s(h)
            }
            ,
            d.prototype.run = function() {
                this.fun.apply(null, this.array)
            }
            ,
            r.title = "browser",
            r.browser = !0,
            r.env = {},
            r.argv = [],
            r.version = "",
            r.versions = {},
            r.on = p,
            r.addListener = p,
            r.once = p,
            r.off = p,
            r.removeListener = p,
            r.removeAllListeners = p,
            r.emit = p,
            r.prependListener = p,
            r.prependOnceListener = p,
            r.listeners = function(t) {
                return []
            }
            ,
            r.binding = function(t) {
                throw new Error("process.binding is not supported")
            }
            ,
            r.cwd = function() {
                return "/"
            }
            ,
            r.chdir = function(t) {
                throw new Error("process.chdir is not supported")
            }
            ,
            r.umask = function() {
                return 0
            }
        }
        ,
        "../../../node_modules/regenerator-runtime/runtime.js": t=>{
            var e = function(t) {
                "use strict";
                var e, n = Object.prototype, r = n.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", s = o.asyncIterator || "@@asyncIterator", a = o.toStringTag || "@@toStringTag";
                function u(t, e, n) {
                    return Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }),
                    t[e]
                }
                try {
                    u({}, "")
                } catch (t) {
                    u = function(t, e, n) {
                        return t[e] = n
                    }
                }
                function c(t, e, n, r) {
                    var o = e && e.prototype instanceof g ? e : g
                      , i = Object.create(o.prototype)
                      , s = new E(r || []);
                    return i._invoke = function(t, e, n) {
                        var r = f;
                        return function(o, i) {
                            if (r === d)
                                throw new Error("Generator is already running");
                            if (r === p) {
                                if ("throw" === o)
                                    throw i;
                                return O()
                            }
                            for (n.method = o,
                            n.arg = i; ; ) {
                                var s = n.delegate;
                                if (s) {
                                    var a = A(s, n);
                                    if (a) {
                                        if (a === y)
                                            continue;
                                        return a
                                    }
                                }
                                if ("next" === n.method)
                                    n.sent = n._sent = n.arg;
                                else if ("throw" === n.method) {
                                    if (r === f)
                                        throw r = p,
                                        n.arg;
                                    n.dispatchException(n.arg)
                                } else
                                    "return" === n.method && n.abrupt("return", n.arg);
                                r = d;
                                var u = l(t, e, n);
                                if ("normal" === u.type) {
                                    if (r = n.done ? p : h,
                                    u.arg === y)
                                        continue;
                                    return {
                                        value: u.arg,
                                        done: n.done
                                    }
                                }
                                "throw" === u.type && (r = p,
                                n.method = "throw",
                                n.arg = u.arg)
                            }
                        }
                    }(t, n, s),
                    i
                }
                function l(t, e, n) {
                    try {
                        return {
                            type: "normal",
                            arg: t.call(e, n)
                        }
                    } catch (t) {
                        return {
                            type: "throw",
                            arg: t
                        }
                    }
                }
                t.wrap = c;
                var f = "suspendedStart"
                  , h = "suspendedYield"
                  , d = "executing"
                  , p = "completed"
                  , y = {};
                function g() {}
                function m() {}
                function b() {}
                var w = {};
                u(w, i, (function() {
                    return this
                }
                ));
                var v = Object.getPrototypeOf
                  , M = v && v(v(k([])));
                M && M !== n && r.call(M, i) && (w = M);
                var x = b.prototype = g.prototype = Object.create(w);
                function j(t) {
                    ["next", "throw", "return"].forEach((function(e) {
                        u(t, e, (function(t) {
                            return this._invoke(e, t)
                        }
                        ))
                    }
                    ))
                }
                function I(t, e) {
                    function n(o, i, s, a) {
                        var u = l(t[o], t, i);
                        if ("throw" !== u.type) {
                            var c = u.arg
                              , f = c.value;
                            return f && "object" == typeof f && r.call(f, "__await") ? e.resolve(f.__await).then((function(t) {
                                n("next", t, s, a)
                            }
                            ), (function(t) {
                                n("throw", t, s, a)
                            }
                            )) : e.resolve(f).then((function(t) {
                                c.value = t,
                                s(c)
                            }
                            ), (function(t) {
                                return n("throw", t, s, a)
                            }
                            ))
                        }
                        a(u.arg)
                    }
                    var o;
                    this._invoke = function(t, r) {
                        function i() {
                            return new e((function(e, o) {
                                n(t, r, e, o)
                            }
                            ))
                        }
                        return o = o ? o.then(i, i) : i()
                    }
                }
                function A(t, n) {
                    var r = t.iterator[n.method];
                    if (r === e) {
                        if (n.delegate = null,
                        "throw" === n.method) {
                            if (t.iterator.return && (n.method = "return",
                            n.arg = e,
                            A(t, n),
                            "throw" === n.method))
                                return y;
                            n.method = "throw",
                            n.arg = new TypeError("The iterator does not provide a 'throw' method")
                        }
                        return y
                    }
                    var o = l(r, t.iterator, n.arg);
                    if ("throw" === o.type)
                        return n.method = "throw",
                        n.arg = o.arg,
                        n.delegate = null,
                        y;
                    var i = o.arg;
                    return i ? i.done ? (n[t.resultName] = i.value,
                    n.next = t.nextLoc,
                    "return" !== n.method && (n.method = "next",
                    n.arg = e),
                    n.delegate = null,
                    y) : i : (n.method = "throw",
                    n.arg = new TypeError("iterator result is not an object"),
                    n.delegate = null,
                    y)
                }
                function S(t) {
                    var e = {
                        tryLoc: t[0]
                    };
                    1 in t && (e.catchLoc = t[1]),
                    2 in t && (e.finallyLoc = t[2],
                    e.afterLoc = t[3]),
                    this.tryEntries.push(e)
                }
                function _(t) {
                    var e = t.completion || {};
                    e.type = "normal",
                    delete e.arg,
                    t.completion = e
                }
                function E(t) {
                    this.tryEntries = [{
                        tryLoc: "root"
                    }],
                    t.forEach(S, this),
                    this.reset(!0)
                }
                function k(t) {
                    if (t) {
                        var n = t[i];
                        if (n)
                            return n.call(t);
                        if ("function" == typeof t.next)
                            return t;
                        if (!isNaN(t.length)) {
                            var o = -1
                              , s = function n() {
                                for (; ++o < t.length; )
                                    if (r.call(t, o))
                                        return n.value = t[o],
                                        n.done = !1,
                                        n;
                                return n.value = e,
                                n.done = !0,
                                n
                            };
                            return s.next = s
                        }
                    }
                    return {
                        next: O
                    }
                }
                function O() {
                    return {
                        value: e,
                        done: !0
                    }
                }
                return m.prototype = b,
                u(x, "constructor", b),
                u(b, "constructor", m),
                m.displayName = u(b, a, "GeneratorFunction"),
                t.isGeneratorFunction = function(t) {
                    var e = "function" == typeof t && t.constructor;
                    return !!e && (e === m || "GeneratorFunction" === (e.displayName || e.name))
                }
                ,
                t.mark = function(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, b) : (t.__proto__ = b,
                    u(t, a, "GeneratorFunction")),
                    t.prototype = Object.create(x),
                    t
                }
                ,
                t.awrap = function(t) {
                    return {
                        __await: t
                    }
                }
                ,
                j(I.prototype),
                u(I.prototype, s, (function() {
                    return this
                }
                )),
                t.AsyncIterator = I,
                t.async = function(e, n, r, o, i) {
                    void 0 === i && (i = Promise);
                    var s = new I(c(e, n, r, o),i);
                    return t.isGeneratorFunction(n) ? s : s.next().then((function(t) {
                        return t.done ? t.value : s.next()
                    }
                    ))
                }
                ,
                j(x),
                u(x, a, "Generator"),
                u(x, i, (function() {
                    return this
                }
                )),
                u(x, "toString", (function() {
                    return "[object Generator]"
                }
                )),
                t.keys = function(t) {
                    var e = [];
                    for (var n in t)
                        e.push(n);
                    return e.reverse(),
                    function n() {
                        for (; e.length; ) {
                            var r = e.pop();
                            if (r in t)
                                return n.value = r,
                                n.done = !1,
                                n
                        }
                        return n.done = !0,
                        n
                    }
                }
                ,
                t.values = k,
                E.prototype = {
                    constructor: E,
                    reset: function(t) {
                        if (this.prev = 0,
                        this.next = 0,
                        this.sent = this._sent = e,
                        this.done = !1,
                        this.delegate = null,
                        this.method = "next",
                        this.arg = e,
                        this.tryEntries.forEach(_),
                        !t)
                            for (var n in this)
                                "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = e)
                    },
                    stop: function() {
                        this.done = !0;
                        var t = this.tryEntries[0].completion;
                        if ("throw" === t.type)
                            throw t.arg;
                        return this.rval
                    },
                    dispatchException: function(t) {
                        if (this.done)
                            throw t;
                        var n = this;
                        function o(r, o) {
                            return a.type = "throw",
                            a.arg = t,
                            n.next = r,
                            o && (n.method = "next",
                            n.arg = e),
                            !!o
                        }
                        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                            var s = this.tryEntries[i]
                              , a = s.completion;
                            if ("root" === s.tryLoc)
                                return o("end");
                            if (s.tryLoc <= this.prev) {
                                var u = r.call(s, "catchLoc")
                                  , c = r.call(s, "finallyLoc");
                                if (u && c) {
                                    if (this.prev < s.catchLoc)
                                        return o(s.catchLoc, !0);
                                    if (this.prev < s.finallyLoc)
                                        return o(s.finallyLoc)
                                } else if (u) {
                                    if (this.prev < s.catchLoc)
                                        return o(s.catchLoc, !0)
                                } else {
                                    if (!c)
                                        throw new Error("try statement without catch or finally");
                                    if (this.prev < s.finallyLoc)
                                        return o(s.finallyLoc)
                                }
                            }
                        }
                    },
                    abrupt: function(t, e) {
                        for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                            var o = this.tryEntries[n];
                            if (o.tryLoc <= this.prev && r.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                                var i = o;
                                break
                            }
                        }
                        i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
                        var s = i ? i.completion : {};
                        return s.type = t,
                        s.arg = e,
                        i ? (this.method = "next",
                        this.next = i.finallyLoc,
                        y) : this.complete(s)
                    },
                    complete: function(t, e) {
                        if ("throw" === t.type)
                            throw t.arg;
                        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg,
                        this.method = "return",
                        this.next = "end") : "normal" === t.type && e && (this.next = e),
                        y
                    },
                    finish: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var n = this.tryEntries[e];
                            if (n.finallyLoc === t)
                                return this.complete(n.completion, n.afterLoc),
                                _(n),
                                y
                        }
                    },
                    catch: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var n = this.tryEntries[e];
                            if (n.tryLoc === t) {
                                var r = n.completion;
                                if ("throw" === r.type) {
                                    var o = r.arg;
                                    _(n)
                                }
                                return o
                            }
                        }
                        throw new Error("illegal catch attempt")
                    },
                    delegateYield: function(t, n, r) {
                        return this.delegate = {
                            iterator: k(t),
                            resultName: n,
                            nextLoc: r
                        },
                        "next" === this.method && (this.arg = e),
                        y
                    }
                },
                t
            }(t.exports);
            try {
                regeneratorRuntime = e
            } catch (t) {
                "object" == typeof globalThis ? globalThis.regeneratorRuntime = e : Function("r", "regeneratorRuntime = r")(e)
            }
        }
        ,
        "../../../node_modules/rpc-websockets/dist/lib/client.js": (t,e,n)=>{
            "use strict";
            n("../../../node_modules/buffer/index.js").Buffer;
            var r = n("../../../node_modules/@babel/runtime/helpers/interopRequireDefault.js")
              , o = (r(n("../../../node_modules/@babel/runtime/regenerator/index.js")),
            r(n("../../../node_modules/@babel/runtime/helpers/asyncToGenerator.js")),
            r(n("../../../node_modules/@babel/runtime/helpers/typeof.js")),
            r(n("../../../node_modules/@babel/runtime/helpers/classCallCheck.js")),
            r(n("../../../node_modules/@babel/runtime/helpers/createClass.js")),
            r(n("../../../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js")),
            r(n("../../../node_modules/@babel/runtime/helpers/getPrototypeOf.js")),
            r(n("../../../node_modules/@babel/runtime/helpers/inherits.js")),
            n("../../../node_modules/eventemitter3/index.js"));
            n("../../../node_modules/rpc-websockets/dist/lib/utils.js");
            o.EventEmitter
        }
        ,
        "../../../node_modules/rpc-websockets/dist/lib/client/websocket.browser.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/@babel/runtime/helpers/interopRequireDefault.js")
              , o = r(n("../../../node_modules/@babel/runtime/helpers/classCallCheck.js"))
              , i = r(n("../../../node_modules/@babel/runtime/helpers/createClass.js"))
              , s = r(n("../../../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js"))
              , a = r(n("../../../node_modules/@babel/runtime/helpers/getPrototypeOf.js"))
              , u = r(n("../../../node_modules/@babel/runtime/helpers/inherits.js"));
            function c(t, e, n) {
                return e = (0,
                a.default)(e),
                (0,
                s.default)(t, l() ? Reflect.construct(e, n || [], (0,
                a.default)(t).constructor) : e.apply(t, n))
            }
            function l() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}
                    )))
                } catch (t) {}
                return (l = function() {
                    return !!t
                }
                )()
            }
            n("../../../node_modules/eventemitter3/index.js").EventEmitter
        }
        ,
        "../../../node_modules/rpc-websockets/dist/lib/utils.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/@babel/runtime/helpers/interopRequireDefault.js");
            Object.defineProperty(e, "__esModule", {
                value: !0
            }),
            e.DefaultDataPack = void 0,
            e.createError = function(t, e) {
                var n = {
                    code: t,
                    message: s.get(t) || "Internal Server Error"
                };
                return e && (n.data = e),
                n
            }
            ;
            var o = r(n("../../../node_modules/@babel/runtime/helpers/classCallCheck.js"))
              , i = r(n("../../../node_modules/@babel/runtime/helpers/createClass.js"))
              , s = new Map([[-32e3, "Event not provided"], [-32600, "Invalid Request"], [-32601, "Method not found"], [-32602, "Invalid params"], [-32603, "Internal error"], [-32604, "Params not found"], [-32605, "Method forbidden"], [-32606, "Event forbidden"], [-32700, "Parse error"]]);
            e.DefaultDataPack = function() {
                return (0,
                i.default)((function t() {
                    (0,
                    o.default)(this, t)
                }
                ), [{
                    key: "encode",
                    value: function(t) {
                        return JSON.stringify(t)
                    }
                }, {
                    key: "decode",
                    value: function(t) {
                        return JSON.parse(t)
                    }
                }])
            }()
        }
        ,
        "../../../node_modules/safe-buffer/index.js": (t,e,n)=>{
            var r = n("../../../node_modules/buffer/index.js")
              , o = r.Buffer;
            function i(t, e) {
                for (var n in t)
                    e[n] = t[n]
            }
            function s(t, e, n) {
                return o(t, e, n)
            }
            o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ? t.exports = r : (i(r, e),
            e.Buffer = s),
            i(o, s),
            s.from = function(t, e, n) {
                if ("number" == typeof t)
                    throw new TypeError("Argument must not be a number");
                return o(t, e, n)
            }
            ,
            s.alloc = function(t, e, n) {
                if ("number" != typeof t)
                    throw new TypeError("Argument must be a number");
                var r = o(t);
                return void 0 !== e ? "string" == typeof n ? r.fill(e, n) : r.fill(e) : r.fill(0),
                r
            }
            ,
            s.allocUnsafe = function(t) {
                if ("number" != typeof t)
                    throw new TypeError("Argument must be a number");
                return o(t)
            }
            ,
            s.allocUnsafeSlow = function(t) {
                if ("number" != typeof t)
                    throw new TypeError("Argument must be a number");
                return r.SlowBuffer(t)
            }
        }
        ,
        "../../../node_modules/set-function-length/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/get-intrinsic/index.js")
              , o = n("../../../node_modules/define-data-property/index.js")
              , i = n("../../../node_modules/has-property-descriptors/index.js")()
              , s = n("../../../node_modules/gopd/index.js")
              , a = n("../../../node_modules/es-errors/type.js")
              , u = r("%Math.floor%");
            t.exports = function(t, e) {
                if ("function" != typeof t)
                    throw new a("`fn` is not a function");
                if ("number" != typeof e || e < 0 || e > 4294967295 || u(e) !== e)
                    throw new a("`length` must be a positive 32-bit integer");
                var n = arguments.length > 2 && !!arguments[2]
                  , r = !0
                  , c = !0;
                if ("length"in t && s) {
                    var l = s(t, "length");
                    l && !l.configurable && (r = !1),
                    l && !l.writable && (c = !1)
                }
                return (r || c || !n) && (i ? o(t, "length", e, !0, !0) : o(t, "length", e)),
                t
            }
        }
        ,
        "../../../node_modules/text-encoding-utf-8/lib/encoding.lib.js": (t,e)=>{
            "use strict";
            function n(t, e, n) {
                return e <= t && t <= n
            }
            function r(t) {
                if (void 0 === t)
                    return {};
                if (t === Object(t))
                    return t;
                throw TypeError("Could not convert argument to dictionary")
            }
            function o(t) {
                this.tokens = [].slice.call(t)
            }
            o.prototype = {
                endOfStream: function() {
                    return !this.tokens.length
                },
                read: function() {
                    return this.tokens.length ? this.tokens.shift() : -1
                },
                prepend: function(t) {
                    if (Array.isArray(t))
                        for (var e = t; e.length; )
                            this.tokens.unshift(e.pop());
                    else
                        this.tokens.unshift(t)
                },
                push: function(t) {
                    if (Array.isArray(t))
                        for (var e = t; e.length; )
                            this.tokens.push(e.shift());
                    else
                        this.tokens.push(t)
                }
            };
            var i = -1;
            function s(t, e) {
                if (t)
                    throw TypeError("Decoder error");
                return e || 65533
            }
            var a = "utf-8";
            function u(t, e) {
                if (!(this instanceof u))
                    return new u(t,e);
                if ((t = void 0 !== t ? String(t).toLowerCase() : a) !== a)
                    throw new Error("Encoding not supported. Only utf-8 is supported");
                e = r(e),
                this._streaming = !1,
                this._BOMseen = !1,
                this._decoder = null,
                this._fatal = Boolean(e.fatal),
                this._ignoreBOM = Boolean(e.ignoreBOM),
                Object.defineProperty(this, "encoding", {
                    value: "utf-8"
                }),
                Object.defineProperty(this, "fatal", {
                    value: this._fatal
                }),
                Object.defineProperty(this, "ignoreBOM", {
                    value: this._ignoreBOM
                })
            }
            function c(t, e) {
                if (!(this instanceof c))
                    return new c(t,e);
                if ((t = void 0 !== t ? String(t).toLowerCase() : a) !== a)
                    throw new Error("Encoding not supported. Only utf-8 is supported");
                e = r(e),
                this._streaming = !1,
                this._encoder = null,
                this._options = {
                    fatal: Boolean(e.fatal)
                },
                Object.defineProperty(this, "encoding", {
                    value: "utf-8"
                })
            }
            function l(t) {
                var e = t.fatal
                  , r = 0
                  , o = 0
                  , a = 0
                  , u = 128
                  , c = 191;
                this.handler = function(t, l) {
                    if (-1 === l && 0 !== a)
                        return a = 0,
                        s(e);
                    if (-1 === l)
                        return i;
                    if (0 === a) {
                        if (n(l, 0, 127))
                            return l;
                        if (n(l, 194, 223))
                            a = 1,
                            r = l - 192;
                        else if (n(l, 224, 239))
                            224 === l && (u = 160),
                            237 === l && (c = 159),
                            a = 2,
                            r = l - 224;
                        else {
                            if (!n(l, 240, 244))
                                return s(e);
                            240 === l && (u = 144),
                            244 === l && (c = 143),
                            a = 3,
                            r = l - 240
                        }
                        return r <<= 6 * a,
                        null
                    }
                    if (!n(l, u, c))
                        return r = a = o = 0,
                        u = 128,
                        c = 191,
                        t.prepend(l),
                        s(e);
                    if (u = 128,
                    c = 191,
                    r += l - 128 << 6 * (a - (o += 1)),
                    o !== a)
                        return null;
                    var f = r;
                    return r = a = o = 0,
                    f
                }
            }
            function f(t) {
                t.fatal,
                this.handler = function(t, e) {
                    if (-1 === e)
                        return i;
                    if (n(e, 0, 127))
                        return e;
                    var r, o;
                    n(e, 128, 2047) ? (r = 1,
                    o = 192) : n(e, 2048, 65535) ? (r = 2,
                    o = 224) : n(e, 65536, 1114111) && (r = 3,
                    o = 240);
                    for (var s = [(e >> 6 * r) + o]; r > 0; ) {
                        var a = e >> 6 * (r - 1);
                        s.push(128 | 63 & a),
                        r -= 1
                    }
                    return s
                }
            }
            u.prototype = {
                decode: function(t, e) {
                    var n;
                    n = "object" == typeof t && t instanceof ArrayBuffer ? new Uint8Array(t) : "object" == typeof t && "buffer"in t && t.buffer instanceof ArrayBuffer ? new Uint8Array(t.buffer,t.byteOffset,t.byteLength) : new Uint8Array(0),
                    e = r(e),
                    this._streaming || (this._decoder = new l({
                        fatal: this._fatal
                    }),
                    this._BOMseen = !1),
                    this._streaming = Boolean(e.stream);
                    for (var s, a = new o(n), u = []; !a.endOfStream() && (s = this._decoder.handler(a, a.read())) !== i; )
                        null !== s && (Array.isArray(s) ? u.push.apply(u, s) : u.push(s));
                    if (!this._streaming) {
                        do {
                            if ((s = this._decoder.handler(a, a.read())) === i)
                                break;
                            null !== s && (Array.isArray(s) ? u.push.apply(u, s) : u.push(s))
                        } while (!a.endOfStream());
                        this._decoder = null
                    }
                    return u.length && (-1 === ["utf-8"].indexOf(this.encoding) || this._ignoreBOM || this._BOMseen || (65279 === u[0] ? (this._BOMseen = !0,
                    u.shift()) : this._BOMseen = !0)),
                    function(t) {
                        for (var e = "", n = 0; n < t.length; ++n) {
                            var r = t[n];
                            r <= 65535 ? e += String.fromCharCode(r) : (r -= 65536,
                            e += String.fromCharCode(55296 + (r >> 10), 56320 + (1023 & r)))
                        }
                        return e
                    }(u)
                }
            },
            c.prototype = {
                encode: function(t, e) {
                    t = t ? String(t) : "",
                    e = r(e),
                    this._streaming || (this._encoder = new f(this._options)),
                    this._streaming = Boolean(e.stream);
                    for (var n, s = [], a = new o(function(t) {
                        for (var e = String(t), n = e.length, r = 0, o = []; r < n; ) {
                            var i = e.charCodeAt(r);
                            if (i < 55296 || i > 57343)
                                o.push(i);
                            else if (56320 <= i && i <= 57343)
                                o.push(65533);
                            else if (55296 <= i && i <= 56319)
                                if (r === n - 1)
                                    o.push(65533);
                                else {
                                    var s = t.charCodeAt(r + 1);
                                    if (56320 <= s && s <= 57343) {
                                        var a = 1023 & i
                                          , u = 1023 & s;
                                        o.push(65536 + (a << 10) + u),
                                        r += 1
                                    } else
                                        o.push(65533)
                                }
                            r += 1
                        }
                        return o
                    }(t)); !a.endOfStream() && (n = this._encoder.handler(a, a.read())) !== i; )
                        Array.isArray(n) ? s.push.apply(s, n) : s.push(n);
                    if (!this._streaming) {
                        for (; (n = this._encoder.handler(a, a.read())) !== i; )
                            Array.isArray(n) ? s.push.apply(s, n) : s.push(n);
                        this._encoder = null
                    }
                    return new Uint8Array(s)
                }
            },
            e.TextEncoder = c,
            e.TextDecoder = u
        }
        ,
        "./src/inpage.ts": (t,e,n)=>{
            "use strict";
            var r, o = n("../../../node_modules/@solana/web3.js/lib/index.browser.esm.js"), i = n("../../../node_modules/console-browserify/index.js");
            function s(t) {
                const e = ({register: e})=>e(t);
                try {
                    window.dispatchEvent(new a(e))
                } catch (t) {
                    i.error("wallet-standard:register-wallet event could not be dispatched\n", t)
                }
                try {
                    window.addEventListener("wallet-standard:app-ready", (({detail: t})=>e(t)))
                } catch (t) {
                    i.error("wallet-standard:app-ready event listener could not be added\n", t)
                }
            }
            class a extends Event {
                constructor(t) {
                    super("wallet-standard:register-wallet", {
                        bubbles: !1,
                        cancelable: !1,
                        composed: !1
                    }),
                    r.set(this, void 0),
                    function(t, e, n, r, o) {
                        if ("m" === r)
                            throw new TypeError("Private method is not writable");
                        if ("a" === r && !o)
                            throw new TypeError("Private accessor was defined without a setter");
                        if ("function" == typeof e ? t !== e || !o : !e.has(t))
                            throw new TypeError("Cannot write private member to an object whose class did not declare it");
                        "a" === r ? o.call(t, n) : o ? o.value = n : e.set(t, n)
                    }(this, r, t, "f")
                }
                get detail() {
                    return function(t, e, n, r) {
                        if ("a" === n && !r)
                            throw new TypeError("Private accessor was defined without a getter");
                        if ("function" == typeof e ? t !== e || !r : !e.has(t))
                            throw new TypeError("Cannot read private member from an object whose class did not declare it");
                        return "m" === n ? r : "a" === n ? r.call(t) : r ? r.value : e.get(t)
                    }(this, r, "f")
                }
                get type() {
                    return "wallet-standard:register-wallet"
                }
                preventDefault() {
                    throw new Error("preventDefault cannot be called")
                }
                stopImmediatePropagation() {
                    throw new Error("stopImmediatePropagation cannot be called")
                }
                stopPropagation() {
                    throw new Error("stopPropagation cannot be called")
                }
            }
            r = new WeakMap;
            const u = "solana:mainnet"
              , c = "solana:devnet"
              , l = "solana:testnet";
            var f = n("../../../node_modules/@solana/wallet-standard-features/lib/esm/signAndSendTransaction.js")
              , h = n("../../../node_modules/@solana/wallet-standard-features/lib/esm/signTransaction.js")
              , d = n("../../../node_modules/@solana/wallet-standard-features/lib/esm/signMessage.js");
            const p = n("../../../node_modules/@solflare-wallet/sdk/node_modules/eventemitter3/index.js");
            var y, g = (y = function(t, e) {
                return y = Object.setPrototypeOf || {
                    __proto__: []
                }instanceof Array && function(t, e) {
                    t.__proto__ = e
                }
                || function(t, e) {
                    for (var n in e)
                        Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
                }
                ,
                y(t, e)
            }
            ,
            function(t, e) {
                if ("function" != typeof e && null !== e)
                    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
                function n() {
                    this.constructor = t
                }
                y(t, e),
                t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype,
                new n)
            }
            );
            const m = function(t) {
                function e() {
                    return null !== t && t.apply(this, arguments) || this
                }
                return g(e, t),
                e
            }(p);
            var b = n("../../../node_modules/@solflare-wallet/sdk/node_modules/bs58/index.js")
              , w = n.n(b)
              , v = function() {
                var t = function(e, n) {
                    return t = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(t, e) {
                        t.__proto__ = e
                    }
                    || function(t, e) {
                        for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
                    }
                    ,
                    t(e, n)
                };
                return function(e, n) {
                    if ("function" != typeof n && null !== n)
                        throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
                    function r() {
                        this.constructor = e
                    }
                    t(e, n),
                    e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype,
                    new r)
                }
            }()
              , M = function() {
                return M = Object.assign || function(t) {
                    for (var e, n = 1, r = arguments.length; n < r; n++)
                        for (var o in e = arguments[n])
                            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                    return t
                }
                ,
                M.apply(this, arguments)
            }
              , x = function(t, e, n, r) {
                return new (n || (n = Promise))((function(o, i) {
                    function s(t) {
                        try {
                            u(r.next(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function a(t) {
                        try {
                            u(r.throw(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function u(t) {
                        var e;
                        t.done ? o(t.value) : (e = t.value,
                        e instanceof n ? e : new n((function(t) {
                            t(e)
                        }
                        ))).then(s, a)
                    }
                    u((r = r.apply(t, e || [])).next())
                }
                ))
            }
              , j = function(t, e) {
                var n, r, o, i, s = {
                    label: 0,
                    sent: function() {
                        if (1 & o[0])
                            throw o[1];
                        return o[1]
                    },
                    trys: [],
                    ops: []
                };
                return i = {
                    next: a(0),
                    throw: a(1),
                    return: a(2)
                },
                "function" == typeof Symbol && (i[Symbol.iterator] = function() {
                    return this
                }
                ),
                i;
                function a(a) {
                    return function(u) {
                        return function(a) {
                            if (n)
                                throw new TypeError("Generator is already executing.");
                            for (; i && (i = 0,
                            a[0] && (s = 0)),
                            s; )
                                try {
                                    if (n = 1,
                                    r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r),
                                    0) : r.next) && !(o = o.call(r, a[1])).done)
                                        return o;
                                    switch (r = 0,
                                    o && (a = [2 & a[0], o.value]),
                                    a[0]) {
                                    case 0:
                                    case 1:
                                        o = a;
                                        break;
                                    case 4:
                                        return s.label++,
                                        {
                                            value: a[1],
                                            done: !1
                                        };
                                    case 5:
                                        s.label++,
                                        r = a[1],
                                        a = [0];
                                        continue;
                                    case 7:
                                        a = s.ops.pop(),
                                        s.trys.pop();
                                        continue;
                                    default:
                                        if (!((o = (o = s.trys).length > 0 && o[o.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                            s = 0;
                                            continue
                                        }
                                        if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                                            s.label = a[1];
                                            break
                                        }
                                        if (6 === a[0] && s.label < o[1]) {
                                            s.label = o[1],
                                            o = a;
                                            break
                                        }
                                        if (o && s.label < o[2]) {
                                            s.label = o[2],
                                            s.ops.push(a);
                                            break
                                        }
                                        o[2] && s.ops.pop(),
                                        s.trys.pop();
                                        continue
                                    }
                                    a = e.call(t, s)
                                } catch (t) {
                                    a = [6, t],
                                    r = 0
                                } finally {
                                    n = o = 0
                                }
                            if (5 & a[0])
                                throw a[1];
                            return {
                                value: a[0] ? a[1] : void 0,
                                done: !0
                            }
                        }([a, u])
                    }
                }
            }
              , I = function(t, e) {
                var n = "function" == typeof Symbol && t[Symbol.iterator];
                if (!n)
                    return t;
                var r, o, i = n.call(t), s = [];
                try {
                    for (; (void 0 === e || e-- > 0) && !(r = i.next()).done; )
                        s.push(r.value)
                } catch (t) {
                    o = {
                        error: t
                    }
                } finally {
                    try {
                        r && !r.done && (n = i.return) && n.call(i)
                    } finally {
                        if (o)
                            throw o.error
                    }
                }
                return s
            }
              , A = function(t) {
                function e(e, n) {
                    var r, i = t.call(this) || this;
                    if (i._handleMessage = function(t) {
                        if (i._injectedProvider && t.source === window || t.origin === i._providerUrl.origin && t.source === i._popup)
                            if ("connected" === t.data.method) {
                                var e = new o.PublicKey(t.data.params.publicKey);
                                i._publicKey && i._publicKey.equals(e) || (i._publicKey && !i._publicKey.equals(e) && i._handleDisconnect(),
                                i._publicKey = e,
                                i._autoApprove = !!t.data.params.autoApprove,
                                i.emit("connect", i._publicKey))
                            } else if ("disconnected" === t.data.method)
                                i._handleDisconnect();
                            else if ((t.data.result || t.data.error) && i._responsePromises.has(t.data.id)) {
                                var n = I(i._responsePromises.get(t.data.id), 2)
                                  , r = n[0]
                                  , s = n[1];
                                t.data.result ? r(t.data.result) : s(new Error(t.data.error))
                            }
                    }
                    ,
                    i._handleConnect = function() {
                        return i._handlerAdded || (i._handlerAdded = !0,
                        window.addEventListener("message", i._handleMessage),
                        window.addEventListener("beforeunload", i.disconnect)),
                        i._injectedProvider ? new Promise((function(t) {
                            i._sendRequest("connect", {}),
                            t()
                        }
                        )) : (window.name = "parent",
                        i._popup = window.open(i._providerUrl.toString(), "_blank", "location,resizable,width=460,height=675"),
                        new Promise((function(t) {
                            i.once("connect", t)
                        }
                        )))
                    }
                    ,
                    i._handleDisconnect = function() {
                        i._handlerAdded && (i._handlerAdded = !1,
                        window.removeEventListener("message", i._handleMessage),
                        window.removeEventListener("beforeunload", i.disconnect)),
                        i._publicKey && (i._publicKey = null,
                        i.emit("disconnect")),
                        i._responsePromises.forEach((function(t, e) {
                            var n = I(t, 2)
                              , r = (n[0],
                            n[1]);
                            i._responsePromises.delete(e),
                            r("Wallet disconnected")
                        }
                        ))
                    }
                    ,
                    i._sendRequest = function(t, e) {
                        return x(i, void 0, void 0, (function() {
                            var n, r = this;
                            return j(this, (function(o) {
                                if ("connect" !== t && !this.connected)
                                    throw new Error("Wallet not connected");
                                return n = this._nextRequestId,
                                ++this._nextRequestId,
                                [2, new Promise((function(o, i) {
                                    r._responsePromises.set(n, [o, i]),
                                    r._injectedProvider ? r._injectedProvider.postMessage({
                                        jsonrpc: "2.0",
                                        id: n,
                                        method: t,
                                        params: M({
                                            network: r._network
                                        }, e)
                                    }) : (r._popup.postMessage({
                                        jsonrpc: "2.0",
                                        id: n,
                                        method: t,
                                        params: e
                                    }, r._providerUrl.origin),
                                    r.autoApprove || r._popup.focus())
                                }
                                ))]
                            }
                            ))
                        }
                        ))
                    }
                    ,
                    i.connect = function() {
                        return i._popup && i._popup.close(),
                        i._handleConnect()
                    }
                    ,
                    i.disconnect = function() {
                        return x(i, void 0, void 0, (function() {
                            return j(this, (function(t) {
                                switch (t.label) {
                                case 0:
                                    return this._injectedProvider ? [4, this._sendRequest("disconnect", {})] : [3, 2];
                                case 1:
                                    t.sent(),
                                    t.label = 2;
                                case 2:
                                    return this._popup && this._popup.close(),
                                    this._handleDisconnect(),
                                    [2]
                                }
                            }
                            ))
                        }
                        ))
                    }
                    ,
                    i.sign = function(t, e) {
                        return x(i, void 0, void 0, (function() {
                            var n, r, i;
                            return j(this, (function(s) {
                                switch (s.label) {
                                case 0:
                                    if (!(t instanceof Uint8Array))
                                        throw new Error("Data must be an instance of Uint8Array");
                                    return [4, this._sendRequest("sign", {
                                        data: t,
                                        display: e
                                    })];
                                case 1:
                                    return n = s.sent(),
                                    r = w().decode(n.signature),
                                    i = new o.PublicKey(n.publicKey),
                                    [2, {
                                        signature: r,
                                        publicKey: i
                                    }]
                                }
                            }
                            ))
                        }
                        ))
                    }
                    ,
                    function(t) {
                        return "object" == typeof t && null !== t
                    }(r = e) && function(t) {
                        return "function" == typeof t
                    }(r.postMessage))
                        i._injectedProvider = e;
                    else {
                        if (!function(t) {
                            return "string" == typeof t
                        }(e))
                            throw new Error("provider parameter must be an injected provider or a URL string.");
                        i._providerUrl = new URL(e),
                        i._providerUrl.hash = new URLSearchParams({
                            origin: window.location.origin,
                            network: n
                        }).toString()
                    }
                    return i._network = n,
                    i._publicKey = null,
                    i._autoApprove = !1,
                    i._popup = null,
                    i._handlerAdded = !1,
                    i._nextRequestId = 1,
                    i._responsePromises = new Map,
                    i
                }
                return v(e, t),
                Object.defineProperty(e.prototype, "publicKey", {
                    get: function() {
                        return this._publicKey
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "connected", {
                    get: function() {
                        return null !== this._publicKey
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "autoApprove", {
                    get: function() {
                        return this._autoApprove
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                e
            }(p);
            const S = A;
            var _ = function() {
                var t = function(e, n) {
                    return t = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(t, e) {
                        t.__proto__ = e
                    }
                    || function(t, e) {
                        for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
                    }
                    ,
                    t(e, n)
                };
                return function(e, n) {
                    if ("function" != typeof n && null !== n)
                        throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
                    function r() {
                        this.constructor = e
                    }
                    t(e, n),
                    e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype,
                    new r)
                }
            }()
              , E = function(t, e, n, r) {
                return new (n || (n = Promise))((function(o, i) {
                    function s(t) {
                        try {
                            u(r.next(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function a(t) {
                        try {
                            u(r.throw(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function u(t) {
                        var e;
                        t.done ? o(t.value) : (e = t.value,
                        e instanceof n ? e : new n((function(t) {
                            t(e)
                        }
                        ))).then(s, a)
                    }
                    u((r = r.apply(t, e || [])).next())
                }
                ))
            }
              , k = function(t, e) {
                var n, r, o, i, s = {
                    label: 0,
                    sent: function() {
                        if (1 & o[0])
                            throw o[1];
                        return o[1]
                    },
                    trys: [],
                    ops: []
                };
                return i = {
                    next: a(0),
                    throw: a(1),
                    return: a(2)
                },
                "function" == typeof Symbol && (i[Symbol.iterator] = function() {
                    return this
                }
                ),
                i;
                function a(a) {
                    return function(u) {
                        return function(a) {
                            if (n)
                                throw new TypeError("Generator is already executing.");
                            for (; i && (i = 0,
                            a[0] && (s = 0)),
                            s; )
                                try {
                                    if (n = 1,
                                    r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r),
                                    0) : r.next) && !(o = o.call(r, a[1])).done)
                                        return o;
                                    switch (r = 0,
                                    o && (a = [2 & a[0], o.value]),
                                    a[0]) {
                                    case 0:
                                    case 1:
                                        o = a;
                                        break;
                                    case 4:
                                        return s.label++,
                                        {
                                            value: a[1],
                                            done: !1
                                        };
                                    case 5:
                                        s.label++,
                                        r = a[1],
                                        a = [0];
                                        continue;
                                    case 7:
                                        a = s.ops.pop(),
                                        s.trys.pop();
                                        continue;
                                    default:
                                        if (!((o = (o = s.trys).length > 0 && o[o.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                            s = 0;
                                            continue
                                        }
                                        if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                                            s.label = a[1];
                                            break
                                        }
                                        if (6 === a[0] && s.label < o[1]) {
                                            s.label = o[1],
                                            o = a;
                                            break
                                        }
                                        if (o && s.label < o[2]) {
                                            s.label = o[2],
                                            s.ops.push(a);
                                            break
                                        }
                                        o[2] && s.ops.pop(),
                                        s.trys.pop();
                                        continue
                                    }
                                    a = e.call(t, s)
                                } catch (t) {
                                    a = [6, t],
                                    r = 0
                                } finally {
                                    n = o = 0
                                }
                            if (5 & a[0])
                                throw a[1];
                            return {
                                value: a[0] ? a[1] : void 0,
                                done: !0
                            }
                        }([a, u])
                    }
                }
            };
            const O = function(t) {
                function e(e, n, r) {
                    var o = t.call(this) || this;
                    return o._instance = null,
                    o.handleMessage = function(t) {}
                    ,
                    o._sendRequest = function(t, e) {
                        return E(o, void 0, void 0, (function() {
                            var n, r;
                            return k(this, (function(o) {
                                switch (o.label) {
                                case 0:
                                    return (null === (n = this._instance) || void 0 === n ? void 0 : n.sendRequest) ? [4, this._instance.sendRequest(t, e)] : [3, 2];
                                case 1:
                                case 3:
                                    return [2, o.sent()];
                                case 2:
                                    return (null === (r = this._instance) || void 0 === r ? void 0 : r._sendRequest) ? [4, this._instance._sendRequest(t, e)] : [3, 4];
                                case 4:
                                    throw new Error("Unsupported version of `@project-serum/sol-wallet-adapter`")
                                }
                            }
                            ))
                        }
                        ))
                    }
                    ,
                    o._handleConnect = function() {
                        o.emit("connect")
                    }
                    ,
                    o._handleDisconnect = function() {
                        window.clearInterval(o._pollTimer),
                        o.emit("disconnect")
                    }
                    ,
                    o._network = n,
                    o._provider = r,
                    o
                }
                return _(e, t),
                Object.defineProperty(e.prototype, "publicKey", {
                    get: function() {
                        return this._instance.publicKey || null
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "connected", {
                    get: function() {
                        return this._instance.connected || !1
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                e.prototype.connect = function() {
                    return E(this, void 0, void 0, (function() {
                        var t = this;
                        return k(this, (function(e) {
                            switch (e.label) {
                            case 0:
                                return this._instance = new S(this._provider,this._network),
                                this._instance.on("connect", this._handleConnect),
                                this._instance.on("disconnect", this._handleDisconnect),
                                this._pollTimer = window.setInterval((function() {
                                    var e, n;
                                    !1 !== (null === (n = null === (e = t._instance) || void 0 === e ? void 0 : e._popup) || void 0 === n ? void 0 : n.closed) && t._handleDisconnect()
                                }
                                ), 200),
                                [4, this._instance.connect()];
                            case 1:
                                return e.sent(),
                                [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.disconnect = function() {
                    return E(this, void 0, void 0, (function() {
                        return k(this, (function(t) {
                            switch (t.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                return this._instance.removeAllListeners("connect"),
                                this._instance.removeAllListeners("disconnect"),
                                [4, this._instance.disconnect()];
                            case 1:
                                return t.sent(),
                                [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signTransaction = function(t) {
                    return E(this, void 0, void 0, (function() {
                        var e;
                        return k(this, (function(n) {
                            switch (n.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                return [4, this._sendRequest("signTransactionV2", {
                                    transaction: w().encode(t)
                                })];
                            case 1:
                                return e = n.sent().transaction,
                                [2, w().decode(e)]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signAllTransactions = function(t) {
                    return E(this, void 0, void 0, (function() {
                        return k(this, (function(e) {
                            switch (e.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                return [4, this._sendRequest("signAllTransactionsV2", {
                                    transactions: t.map((function(t) {
                                        return w().encode(t)
                                    }
                                    ))
                                })];
                            case 1:
                                return [2, e.sent().transactions.map((function(t) {
                                    return w().decode(t)
                                }
                                ))]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signAndSendTransaction = function(t, e) {
                    return E(this, void 0, void 0, (function() {
                        return k(this, (function(n) {
                            switch (n.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                return [4, this._sendRequest("signAndSendTransaction", {
                                    transaction: w().encode(t),
                                    options: e
                                })];
                            case 1:
                                return [2, n.sent().signature]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signMessage = function(t, e) {
                    return void 0 === e && (e = "hex"),
                    E(this, void 0, void 0, (function() {
                        var n;
                        return k(this, (function(r) {
                            switch (r.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                return [4, this._instance.sign(t, e)];
                            case 1:
                                return n = r.sent().signature,
                                [2, Uint8Array.from(n)]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e
            }(m)
              , L = {
                randomUUID: "undefined" != typeof crypto && crypto.randomUUID && crypto.randomUUID.bind(crypto)
            };
            let T;
            const B = new Uint8Array(16);
            function N() {
                if (!T && (T = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto),
                !T))
                    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
                return T(B)
            }
            const P = [];
            for (let t = 0; t < 256; ++t)
                P.push((t + 256).toString(16).slice(1));
            const z = function(t, e, n) {
                if (L.randomUUID && !e && !t)
                    return L.randomUUID();
                const r = (t = t || {}).random || (t.rng || N)();
                if (r[6] = 15 & r[6] | 64,
                r[8] = 63 & r[8] | 128,
                e) {
                    n = n || 0;
                    for (let t = 0; t < 16; ++t)
                        e[n + t] = r[t];
                    return e
                }
                return function(t, e=0) {
                    return P[t[e + 0]] + P[t[e + 1]] + P[t[e + 2]] + P[t[e + 3]] + "-" + P[t[e + 4]] + P[t[e + 5]] + "-" + P[t[e + 6]] + P[t[e + 7]] + "-" + P[t[e + 8]] + P[t[e + 9]] + "-" + P[t[e + 10]] + P[t[e + 11]] + P[t[e + 12]] + P[t[e + 13]] + P[t[e + 14]] + P[t[e + 15]]
                }(r)
            };
            var U = function() {
                var t = function(e, n) {
                    return t = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(t, e) {
                        t.__proto__ = e
                    }
                    || function(t, e) {
                        for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
                    }
                    ,
                    t(e, n)
                };
                return function(e, n) {
                    if ("function" != typeof n && null !== n)
                        throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
                    function r() {
                        this.constructor = e
                    }
                    t(e, n),
                    e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype,
                    new r)
                }
            }()
              , D = function() {
                return D = Object.assign || function(t) {
                    for (var e, n = 1, r = arguments.length; n < r; n++)
                        for (var o in e = arguments[n])
                            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                    return t
                }
                ,
                D.apply(this, arguments)
            }
              , R = function(t, e, n, r) {
                return new (n || (n = Promise))((function(o, i) {
                    function s(t) {
                        try {
                            u(r.next(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function a(t) {
                        try {
                            u(r.throw(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function u(t) {
                        var e;
                        t.done ? o(t.value) : (e = t.value,
                        e instanceof n ? e : new n((function(t) {
                            t(e)
                        }
                        ))).then(s, a)
                    }
                    u((r = r.apply(t, e || [])).next())
                }
                ))
            }
              , C = function(t, e) {
                var n, r, o, i, s = {
                    label: 0,
                    sent: function() {
                        if (1 & o[0])
                            throw o[1];
                        return o[1]
                    },
                    trys: [],
                    ops: []
                };
                return i = {
                    next: a(0),
                    throw: a(1),
                    return: a(2)
                },
                "function" == typeof Symbol && (i[Symbol.iterator] = function() {
                    return this
                }
                ),
                i;
                function a(a) {
                    return function(u) {
                        return function(a) {
                            if (n)
                                throw new TypeError("Generator is already executing.");
                            for (; i && (i = 0,
                            a[0] && (s = 0)),
                            s; )
                                try {
                                    if (n = 1,
                                    r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r),
                                    0) : r.next) && !(o = o.call(r, a[1])).done)
                                        return o;
                                    switch (r = 0,
                                    o && (a = [2 & a[0], o.value]),
                                    a[0]) {
                                    case 0:
                                    case 1:
                                        o = a;
                                        break;
                                    case 4:
                                        return s.label++,
                                        {
                                            value: a[1],
                                            done: !1
                                        };
                                    case 5:
                                        s.label++,
                                        r = a[1],
                                        a = [0];
                                        continue;
                                    case 7:
                                        a = s.ops.pop(),
                                        s.trys.pop();
                                        continue;
                                    default:
                                        if (!((o = (o = s.trys).length > 0 && o[o.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                            s = 0;
                                            continue
                                        }
                                        if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                                            s.label = a[1];
                                            break
                                        }
                                        if (6 === a[0] && s.label < o[1]) {
                                            s.label = o[1],
                                            o = a;
                                            break
                                        }
                                        if (o && s.label < o[2]) {
                                            s.label = o[2],
                                            s.ops.push(a);
                                            break
                                        }
                                        o[2] && s.ops.pop(),
                                        s.trys.pop();
                                        continue
                                    }
                                    a = e.call(t, s)
                                } catch (t) {
                                    a = [6, t],
                                    r = 0
                                } finally {
                                    n = o = 0
                                }
                            if (5 & a[0])
                                throw a[1];
                            return {
                                value: a[0] ? a[1] : void 0,
                                done: !0
                            }
                        }([a, u])
                    }
                }
            }
              , W = function(t) {
                function e(e, n) {
                    var r, i = this;
                    return (i = t.call(this) || this)._publicKey = null,
                    i._messageHandlers = {},
                    i.handleMessage = function(t) {
                        if (i._messageHandlers[t.id]) {
                            var e = i._messageHandlers[t.id]
                              , n = e.resolve
                              , r = e.reject;
                            delete i._messageHandlers[t.id],
                            t.error ? r(t.error) : n(t.result)
                        }
                    }
                    ,
                    i._sendMessage = function(t) {
                        if (!i.connected)
                            throw new Error("Wallet not connected");
                        return new Promise((function(e, n) {
                            var r, o, s = z();
                            i._messageHandlers[s] = {
                                resolve: e,
                                reject: n
                            },
                            null === (o = null === (r = i._iframe) || void 0 === r ? void 0 : r.contentWindow) || void 0 === o || o.postMessage({
                                channel: "solflareWalletAdapterToIframe",
                                data: D({
                                    id: s
                                }, t)
                            }, "*")
                        }
                        ))
                    }
                    ,
                    i._iframe = e,
                    i._publicKey = new o.PublicKey(null === (r = null == n ? void 0 : n.toString) || void 0 === r ? void 0 : r.call(n)),
                    i
                }
                return U(e, t),
                Object.defineProperty(e.prototype, "publicKey", {
                    get: function() {
                        return this._publicKey || null
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "connected", {
                    get: function() {
                        return !0
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                e.prototype.connect = function() {
                    return R(this, void 0, void 0, (function() {
                        return C(this, (function(t) {
                            return [2]
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.disconnect = function() {
                    return R(this, void 0, void 0, (function() {
                        return C(this, (function(t) {
                            switch (t.label) {
                            case 0:
                                return [4, this._sendMessage({
                                    method: "disconnect"
                                })];
                            case 1:
                                return t.sent(),
                                [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signTransaction = function(t) {
                    var e;
                    return R(this, void 0, void 0, (function() {
                        var n, r;
                        return C(this, (function(o) {
                            switch (o.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                o.label = 1;
                            case 1:
                                return o.trys.push([1, 3, , 4]),
                                [4, this._sendMessage({
                                    method: "signTransaction",
                                    params: {
                                        transaction: w().encode(t)
                                    }
                                })];
                            case 2:
                                return n = o.sent(),
                                [2, w().decode(n)];
                            case 3:
                                throw r = o.sent(),
                                new Error((null === (e = null == r ? void 0 : r.toString) || void 0 === e ? void 0 : e.call(r)) || "Failed to sign transaction");
                            case 4:
                                return [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signAllTransactions = function(t) {
                    var e;
                    return R(this, void 0, void 0, (function() {
                        var n;
                        return C(this, (function(r) {
                            switch (r.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                r.label = 1;
                            case 1:
                                return r.trys.push([1, 3, , 4]),
                                [4, this._sendMessage({
                                    method: "signAllTransactions",
                                    params: {
                                        transactions: t.map((function(t) {
                                            return w().encode(t)
                                        }
                                        ))
                                    }
                                })];
                            case 2:
                                return [2, r.sent().map((function(t) {
                                    return w().decode(t)
                                }
                                ))];
                            case 3:
                                throw n = r.sent(),
                                new Error((null === (e = null == n ? void 0 : n.toString) || void 0 === e ? void 0 : e.call(n)) || "Failed to sign transactions");
                            case 4:
                                return [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signAndSendTransaction = function(t, e) {
                    var n;
                    return R(this, void 0, void 0, (function() {
                        var r;
                        return C(this, (function(o) {
                            switch (o.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                o.label = 1;
                            case 1:
                                return o.trys.push([1, 3, , 4]),
                                [4, this._sendMessage({
                                    method: "signAndSendTransaction",
                                    params: {
                                        transaction: w().encode(t),
                                        options: e
                                    }
                                })];
                            case 2:
                                return [2, o.sent()];
                            case 3:
                                throw r = o.sent(),
                                new Error((null === (n = null == r ? void 0 : r.toString) || void 0 === n ? void 0 : n.call(r)) || "Failed to sign and send transaction");
                            case 4:
                                return [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signMessage = function(t, e) {
                    var n;
                    return void 0 === e && (e = "hex"),
                    R(this, void 0, void 0, (function() {
                        var r, o;
                        return C(this, (function(i) {
                            switch (i.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                i.label = 1;
                            case 1:
                                return i.trys.push([1, 3, , 4]),
                                [4, this._sendMessage({
                                    method: "signMessage",
                                    params: {
                                        data: t,
                                        display: e
                                    }
                                })];
                            case 2:
                                return r = i.sent(),
                                [2, Uint8Array.from(w().decode(r))];
                            case 3:
                                throw o = i.sent(),
                                new Error((null === (n = null == o ? void 0 : o.toString) || void 0 === n ? void 0 : n.call(o)) || "Failed to sign message");
                            case 4:
                                return [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e
            }(m);
            const q = W;
            function F(t) {
                return void 0 === t.version
            }
            var K = function() {
                var t = function(e, n) {
                    return t = Object.setPrototypeOf || {
                        __proto__: []
                    }instanceof Array && function(t, e) {
                        t.__proto__ = e
                    }
                    || function(t, e) {
                        for (var n in e)
                            Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n])
                    }
                    ,
                    t(e, n)
                };
                return function(e, n) {
                    if ("function" != typeof n && null !== n)
                        throw new TypeError("Class extends value " + String(n) + " is not a constructor or null");
                    function r() {
                        this.constructor = e
                    }
                    t(e, n),
                    e.prototype = null === n ? Object.create(n) : (r.prototype = n.prototype,
                    new r)
                }
            }()
              , H = function() {
                return H = Object.assign || function(t) {
                    for (var e, n = 1, r = arguments.length; n < r; n++)
                        for (var o in e = arguments[n])
                            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
                    return t
                }
                ,
                H.apply(this, arguments)
            }
              , Y = function(t, e, n, r) {
                return new (n || (n = Promise))((function(o, i) {
                    function s(t) {
                        try {
                            u(r.next(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function a(t) {
                        try {
                            u(r.throw(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function u(t) {
                        var e;
                        t.done ? o(t.value) : (e = t.value,
                        e instanceof n ? e : new n((function(t) {
                            t(e)
                        }
                        ))).then(s, a)
                    }
                    u((r = r.apply(t, e || [])).next())
                }
                ))
            }
              , G = function(t, e) {
                var n, r, o, i, s = {
                    label: 0,
                    sent: function() {
                        if (1 & o[0])
                            throw o[1];
                        return o[1]
                    },
                    trys: [],
                    ops: []
                };
                return i = {
                    next: a(0),
                    throw: a(1),
                    return: a(2)
                },
                "function" == typeof Symbol && (i[Symbol.iterator] = function() {
                    return this
                }
                ),
                i;
                function a(a) {
                    return function(u) {
                        return function(a) {
                            if (n)
                                throw new TypeError("Generator is already executing.");
                            for (; i && (i = 0,
                            a[0] && (s = 0)),
                            s; )
                                try {
                                    if (n = 1,
                                    r && (o = 2 & a[0] ? r.return : a[0] ? r.throw || ((o = r.return) && o.call(r),
                                    0) : r.next) && !(o = o.call(r, a[1])).done)
                                        return o;
                                    switch (r = 0,
                                    o && (a = [2 & a[0], o.value]),
                                    a[0]) {
                                    case 0:
                                    case 1:
                                        o = a;
                                        break;
                                    case 4:
                                        return s.label++,
                                        {
                                            value: a[1],
                                            done: !1
                                        };
                                    case 5:
                                        s.label++,
                                        r = a[1],
                                        a = [0];
                                        continue;
                                    case 7:
                                        a = s.ops.pop(),
                                        s.trys.pop();
                                        continue;
                                    default:
                                        if (!((o = (o = s.trys).length > 0 && o[o.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                            s = 0;
                                            continue
                                        }
                                        if (3 === a[0] && (!o || a[1] > o[0] && a[1] < o[3])) {
                                            s.label = a[1];
                                            break
                                        }
                                        if (6 === a[0] && s.label < o[1]) {
                                            s.label = o[1],
                                            o = a;
                                            break
                                        }
                                        if (o && s.label < o[2]) {
                                            s.label = o[2],
                                            s.ops.push(a);
                                            break
                                        }
                                        o[2] && s.ops.pop(),
                                        s.trys.pop();
                                        continue
                                    }
                                    a = e.call(t, s)
                                } catch (t) {
                                    a = [6, t],
                                    r = 0
                                } finally {
                                    n = o = 0
                                }
                            if (5 & a[0])
                                throw a[1];
                            return {
                                value: a[0] ? a[1] : void 0,
                                done: !0
                            }
                        }([a, u])
                    }
                }
            };
            const $ = function(t) {
                function e(n) {
                    var r = t.call(this) || this;
                    return r._network = "mainnet-beta",
                    r._provider = null,
                    r._iframeParams = {},
                    r._adapterInstance = null,
                    r._element = null,
                    r._iframe = null,
                    r._connectHandler = null,
                    r._flutterHandlerInterval = null,
                    r._handleEvent = function(t) {
                        var e, n, o, i;
                        switch (t.type) {
                        case "connect_native_web":
                            return r._collapseIframe(),
                            r._adapterInstance = new O(r._iframe,r._network,(null === (e = t.data) || void 0 === e ? void 0 : e.provider) || r._provider || "https://solflare.com/provider"),
                            r._adapterInstance.on("connect", r._webConnected),
                            r._adapterInstance.on("disconnect", r._webDisconnected),
                            r._adapterInstance.connect(),
                            void r._setPreferredAdapter("native_web");
                        case "connect":
                            return r._collapseIframe(),
                            r._adapterInstance = new q(r._iframe,(null === (n = t.data) || void 0 === n ? void 0 : n.publicKey) || ""),
                            r._adapterInstance.connect(),
                            r._setPreferredAdapter(null === (o = t.data) || void 0 === o ? void 0 : o.adapter),
                            r._connectHandler && (r._connectHandler.resolve(),
                            r._connectHandler = null),
                            void r.emit("connect", r.publicKey);
                        case "disconnect":
                            return r._connectHandler && (r._connectHandler.reject(),
                            r._connectHandler = null),
                            r._disconnected(),
                            void r.emit("disconnect");
                        case "accountChanged":
                            return void ((null === (i = t.data) || void 0 === i ? void 0 : i.publicKey) ? (r._adapterInstance = new q(r._iframe,t.data.publicKey),
                            r._adapterInstance.connect(),
                            r.emit("accountChanged", r.publicKey)) : r.emit("accountChanged", void 0));
                        case "collapse":
                            return void r._collapseIframe();
                        default:
                            return
                        }
                    }
                    ,
                    r._handleResize = function(t) {
                        "full" === t.resizeMode ? "fullscreen" === t.params.mode ? r._expandIframe() : "hide" === t.params.mode && r._collapseIframe() : "coordinates" === t.resizeMode && r._iframe && (r._iframe.style.top = isFinite(t.params.top) ? "".concat(t.params.top, "px") : "",
                        r._iframe.style.bottom = isFinite(t.params.bottom) ? "".concat(t.params.bottom, "px") : "",
                        r._iframe.style.left = isFinite(t.params.left) ? "".concat(t.params.left, "px") : "",
                        r._iframe.style.right = isFinite(t.params.right) ? "".concat(t.params.right, "px") : "",
                        r._iframe.style.width = isFinite(t.params.width) ? "".concat(t.params.width, "px") : t.params.width,
                        r._iframe.style.height = isFinite(t.params.height) ? "".concat(t.params.height, "px") : t.params.height)
                    }
                    ,
                    r._handleMessage = function(t) {
                        var e;
                        if ("solflareIframeToWalletAdapter" === (null === (e = t.data) || void 0 === e ? void 0 : e.channel)) {
                            var n = t.data.data || {};
                            "event" === n.type ? r._handleEvent(n.event) : "resize" === n.type ? r._handleResize(n) : "response" === n.type && r._adapterInstance && r._adapterInstance.handleMessage(n)
                        }
                    }
                    ,
                    r._removeElement = function() {
                        null !== r._flutterHandlerInterval && (clearInterval(r._flutterHandlerInterval),
                        r._flutterHandlerInterval = null),
                        r._element && (r._element.remove(),
                        r._element = null)
                    }
                    ,
                    r._removeDanglingElements = function() {
                        var t, e, n = document.getElementsByClassName("solflare-wallet-adapter-iframe");
                        try {
                            for (var r = function(t) {
                                var e = "function" == typeof Symbol && Symbol.iterator
                                  , n = e && t[e]
                                  , r = 0;
                                if (n)
                                    return n.call(t);
                                if (t && "number" == typeof t.length)
                                    return {
                                        next: function() {
                                            return t && r >= t.length && (t = void 0),
                                            {
                                                value: t && t[r++],
                                                done: !t
                                            }
                                        }
                                    };
                                throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.")
                            }(n), o = r.next(); !o.done; o = r.next()) {
                                var i = o.value;
                                i.parentElement && i.remove()
                            }
                        } catch (e) {
                            t = {
                                error: e
                            }
                        } finally {
                            try {
                                o && !o.done && (e = r.return) && e.call(r)
                            } finally {
                                if (t)
                                    throw t.error
                            }
                        }
                    }
                    ,
                    r._injectElement = function() {
                        r._removeElement(),
                        r._removeDanglingElements();
                        var t = H(H({}, r._iframeParams), {
                            cluster: r._network || "mainnet-beta",
                            origin: window.location.origin || "",
                            title: document.title || "",
                            version: 1,
                            sdkVersion: "1.4.2"
                        })
                          , n = r._getPreferredAdapter();
                        n && (t.adapter = n),
                        r._provider && (t.provider = r._provider);
                        var o = Object.keys(t).map((function(e) {
                            return "".concat(e, "=").concat(encodeURIComponent(t[e]))
                        }
                        )).join("&")
                          , i = "".concat(e.IFRAME_URL, "?").concat(o);
                        r._element = document.createElement("div"),
                        r._element.className = "solflare-wallet-adapter-iframe",
                        r._element.innerHTML = "\n      <iframe src='".concat(i, "' referrerPolicy='strict-origin-when-cross-origin' style='position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%; border: none; border-radius: 0; z-index: 99999; color-scheme: auto;' allowtransparency='true'></iframe>\n    "),
                        document.body.appendChild(r._element),
                        r._iframe = r._element.querySelector("iframe"),
                        window.fromFlutter = r._handleMobileMessage,
                        r._flutterHandlerInterval = setInterval((function() {
                            window.fromFlutter = r._handleMobileMessage
                        }
                        ), 100),
                        window.addEventListener("message", r._handleMessage, !1)
                    }
                    ,
                    r._collapseIframe = function() {
                        r._iframe && (r._iframe.style.top = "",
                        r._iframe.style.right = "",
                        r._iframe.style.height = "2px",
                        r._iframe.style.width = "2px")
                    }
                    ,
                    r._expandIframe = function() {
                        r._iframe && (r._iframe.style.top = "0px",
                        r._iframe.style.bottom = "0px",
                        r._iframe.style.left = "0px",
                        r._iframe.style.right = "0px",
                        r._iframe.style.width = "100%",
                        r._iframe.style.height = "100%")
                    }
                    ,
                    r._getPreferredAdapter = function() {
                        return localStorage && localStorage.getItem("solflarePreferredWalletAdapter") || null
                    }
                    ,
                    r._setPreferredAdapter = function(t) {
                        localStorage && t && localStorage.setItem("solflarePreferredWalletAdapter", t)
                    }
                    ,
                    r._clearPreferredAdapter = function() {
                        localStorage && localStorage.removeItem("solflarePreferredWalletAdapter")
                    }
                    ,
                    r._webConnected = function() {
                        r._connectHandler && (r._connectHandler.resolve(),
                        r._connectHandler = null),
                        r.emit("connect", r.publicKey)
                    }
                    ,
                    r._webDisconnected = function() {
                        r._connectHandler && (r._connectHandler.reject(),
                        r._connectHandler = null),
                        r._disconnected(),
                        r.emit("disconnect")
                    }
                    ,
                    r._disconnected = function() {
                        window.removeEventListener("message", r._handleMessage, !1),
                        r._removeElement(),
                        r._clearPreferredAdapter(),
                        r._adapterInstance = null
                    }
                    ,
                    r._handleMobileMessage = function(t) {
                        var e, n;
                        null === (n = null === (e = r._iframe) || void 0 === e ? void 0 : e.contentWindow) || void 0 === n || n.postMessage({
                            channel: "solflareMobileToIframe",
                            data: t
                        }, "*")
                    }
                    ,
                    (null == n ? void 0 : n.network) && (r._network = null == n ? void 0 : n.network),
                    (null == n ? void 0 : n.provider) && (r._provider = null == n ? void 0 : n.provider),
                    (null == n ? void 0 : n.params) && (r._iframeParams = H({}, null == n ? void 0 : n.params)),
                    r
                }
                return K(e, t),
                Object.defineProperty(e.prototype, "publicKey", {
                    get: function() {
                        var t;
                        return (null === (t = this._adapterInstance) || void 0 === t ? void 0 : t.publicKey) || null
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "isConnected", {
                    get: function() {
                        var t;
                        return !!(null === (t = this._adapterInstance) || void 0 === t ? void 0 : t.connected)
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "connected", {
                    get: function() {
                        return this.isConnected
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                Object.defineProperty(e.prototype, "autoApprove", {
                    get: function() {
                        return !1
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                e.prototype.connect = function() {
                    return Y(this, void 0, void 0, (function() {
                        var t = this;
                        return G(this, (function(e) {
                            switch (e.label) {
                            case 0:
                                return this.connected ? [2] : (this._injectElement(),
                                [4, new Promise((function(e, n) {
                                    t._connectHandler = {
                                        resolve: e,
                                        reject: n
                                    }
                                }
                                ))]);
                            case 1:
                                return e.sent(),
                                [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.disconnect = function() {
                    return Y(this, void 0, void 0, (function() {
                        return G(this, (function(t) {
                            switch (t.label) {
                            case 0:
                                return this._adapterInstance ? [4, this._adapterInstance.disconnect()] : [2];
                            case 1:
                                return t.sent(),
                                this._disconnected(),
                                this.emit("disconnect"),
                                [2]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signTransaction = function(t) {
                    return Y(this, void 0, void 0, (function() {
                        var e, n;
                        return G(this, (function(r) {
                            switch (r.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                return e = F(t) ? Uint8Array.from(t.serialize({
                                    verifySignatures: !1,
                                    requireAllSignatures: !1
                                })) : t.serialize(),
                                [4, this._adapterInstance.signTransaction(e)];
                            case 1:
                                return n = r.sent(),
                                [2, F(t) ? o.Transaction.from(n) : o.VersionedTransaction.deserialize(n)]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signAllTransactions = function(t) {
                    return Y(this, void 0, void 0, (function() {
                        var e, n;
                        return G(this, (function(r) {
                            switch (r.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                return e = t.map((function(t) {
                                    return F(t) ? Uint8Array.from(t.serialize({
                                        verifySignatures: !1,
                                        requireAllSignatures: !1
                                    })) : t.serialize()
                                }
                                )),
                                [4, this._adapterInstance.signAllTransactions(e)];
                            case 1:
                                if ((n = r.sent()).length !== t.length)
                                    throw new Error("Failed to sign all transactions");
                                return [2, n.map((function(e, n) {
                                    return F(t[n]) ? o.Transaction.from(e) : o.VersionedTransaction.deserialize(e)
                                }
                                ))]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signAndSendTransaction = function(t, e) {
                    return Y(this, void 0, void 0, (function() {
                        var n;
                        return G(this, (function(r) {
                            switch (r.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                return n = F(t) ? t.serialize({
                                    verifySignatures: !1,
                                    requireAllSignatures: !1
                                }) : t.serialize(),
                                [4, this._adapterInstance.signAndSendTransaction(n, e)];
                            case 1:
                                return [2, r.sent()]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.signMessage = function(t, e) {
                    return void 0 === e && (e = "utf8"),
                    Y(this, void 0, void 0, (function() {
                        return G(this, (function(n) {
                            switch (n.label) {
                            case 0:
                                if (!this.connected)
                                    throw new Error("Wallet not connected");
                                return [4, this._adapterInstance.signMessage(t, e)];
                            case 1:
                                return [2, n.sent()]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.sign = function(t, e) {
                    return void 0 === e && (e = "utf8"),
                    Y(this, void 0, void 0, (function() {
                        return G(this, (function(n) {
                            switch (n.label) {
                            case 0:
                                return [4, this.signMessage(t, e)];
                            case 1:
                                return [2, n.sent()]
                            }
                        }
                        ))
                    }
                    ))
                }
                ,
                e.prototype.detectWallet = function(t) {
                    var e;
                    return void 0 === t && (t = 10),
                    Y(this, void 0, void 0, (function() {
                        return G(this, (function(n) {
                            return window.SolflareApp || (null === (e = window.solflare) || void 0 === e ? void 0 : e.isSolflare) ? [2, !0] : [2, new Promise((function(e) {
                                var n, r;
                                n = setInterval((function() {
                                    var t;
                                    (window.SolflareApp || (null === (t = window.solflare) || void 0 === t ? void 0 : t.isSolflare)) && (clearInterval(n),
                                    clearTimeout(r),
                                    e(!0))
                                }
                                ), 500),
                                r = setTimeout((function() {
                                    clearInterval(n),
                                    e(!1)
                                }
                                ), 1e3 * t)
                            }
                            ))]
                        }
                        ))
                    }
                    ))
                }
                ,
                e.IFRAME_URL = "https://connect.solflare.com/",
                e
            }(p)
              , V = "standard:connect"
              , Z = "standard:disconnect"
              , J = "standard:events"
              , Q = ["solana:mainnet", "solana:devnet", "solana:testnet", "solana:localnet"];
            function X(t) {
                return Q.includes(t)
            }
            var tt, et, nt, rt, ot, it, st = function(t, e, n, r) {
                if ("a" === n && !r)
                    throw new TypeError("Private accessor was defined without a getter");
                if ("function" == typeof e ? t !== e || !r : !e.has(t))
                    throw new TypeError("Cannot read private member from an object whose class did not declare it");
                return "m" === n ? r : "a" === n ? r.call(t) : r ? r.value : e.get(t)
            }, at = function(t, e, n, r, o) {
                if ("m" === r)
                    throw new TypeError("Private method is not writable");
                if ("a" === r && !o)
                    throw new TypeError("Private accessor was defined without a setter");
                if ("function" == typeof e ? t !== e || !o : !e.has(t))
                    throw new TypeError("Cannot write private member to an object whose class did not declare it");
                return "a" === r ? o.call(t, n) : o ? o.value = n : e.set(t, n),
                n
            };
            const ut = Q
              , ct = [f.G, h.R, d.g];
            class lt {
                get address() {
                    return st(this, tt, "f")
                }
                get publicKey() {
                    return st(this, et, "f").slice()
                }
                get chains() {
                    return st(this, nt, "f").slice()
                }
                get features() {
                    return st(this, rt, "f").slice()
                }
                get label() {
                    return st(this, ot, "f")
                }
                get icon() {
                    return st(this, it, "f")
                }
                constructor({address: t, publicKey: e, label: n, icon: r}) {
                    tt.set(this, void 0),
                    et.set(this, void 0),
                    nt.set(this, void 0),
                    rt.set(this, void 0),
                    ot.set(this, void 0),
                    it.set(this, void 0),
                    new.target === lt && Object.freeze(this),
                    at(this, tt, t, "f"),
                    at(this, et, e, "f"),
                    at(this, nt, ut, "f"),
                    at(this, rt, ct, "f"),
                    at(this, ot, n, "f"),
                    at(this, it, r, "f")
                }
            }
            tt = new WeakMap,
            et = new WeakMap,
            nt = new WeakMap,
            rt = new WeakMap,
            ot = new WeakMap,
            it = new WeakMap;
            var ft, ht, dt, pt, yt, gt, mt, bt, wt, vt, Mt, xt, jt, It, At, St, _t, Et, kt = n("../../../node_modules/@solflare-wallet/wallet-adapter/node_modules/bs58/index.js"), Ot = n.n(kt), Lt = function(t, e, n, r) {
                return new (n || (n = Promise))((function(o, i) {
                    function s(t) {
                        try {
                            u(r.next(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function a(t) {
                        try {
                            u(r.throw(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function u(t) {
                        var e;
                        t.done ? o(t.value) : (e = t.value,
                        e instanceof n ? e : new n((function(t) {
                            t(e)
                        }
                        ))).then(s, a)
                    }
                    u((r = r.apply(t, e || [])).next())
                }
                ))
            }, Tt = function(t, e, n, r) {
                if ("a" === n && !r)
                    throw new TypeError("Private accessor was defined without a getter");
                if ("function" == typeof e ? t !== e || !r : !e.has(t))
                    throw new TypeError("Cannot read private member from an object whose class did not declare it");
                return "m" === n ? r : "a" === n ? r.call(t) : r ? r.value : e.get(t)
            }, Bt = function(t, e, n, r, o) {
                if ("m" === r)
                    throw new TypeError("Private method is not writable");
                if ("a" === r && !o)
                    throw new TypeError("Private accessor was defined without a setter");
                if ("function" == typeof e ? t !== e || !o : !e.has(t))
                    throw new TypeError("Cannot write private member to an object whose class did not declare it");
                return "a" === r ? o.call(t, n) : o ? o.value = n : e.set(t, n),
                n
            };
            class Nt {
                get version() {
                    return Tt(this, dt, "f")
                }
                get name() {
                    return Tt(this, pt, "f")
                }
                get icon() {
                    return Tt(this, yt, "f")
                }
                get chains() {
                    return [u, c, l]
                }
                get features() {
                    return {
                        [V]: {
                            version: "1.0.0",
                            connect: Tt(this, It, "f")
                        },
                        [Z]: {
                            version: "1.0.0",
                            disconnect: Tt(this, At, "f")
                        },
                        [J]: {
                            version: "1.0.0",
                            on: Tt(this, bt, "f")
                        },
                        [f.G]: {
                            version: "1.0.0",
                            supportedTransactionVersions: ["legacy", 0],
                            signAndSendTransaction: Tt(this, St, "f")
                        },
                        [h.R]: {
                            version: "1.0.0",
                            supportedTransactionVersions: ["legacy", 0],
                            signTransaction: Tt(this, _t, "f")
                        },
                        [d.g]: {
                            version: "1.0.0",
                            signMessage: Tt(this, Et, "f")
                        }
                    }
                }
                get accounts() {
                    return Tt(this, mt, "f") ? [Tt(this, mt, "f")] : []
                }
                constructor() {
                    ft.add(this),
                    ht.set(this, {}),
                    dt.set(this, "1.0.0"),
                    pt.set(this, "Solflare"),
                    yt.set(this, "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgNTAgNTAiIHdpZHRoPSI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZmMxMGIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYjNmMmUiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI2LjQ3ODM1IiB4Mj0iMzQuOTEwNyIgeGxpbms6aHJlZj0iI2EiIHkxPSI3LjkyIiB5Mj0iMzMuNjU5MyIvPjxyYWRpYWxHcmFkaWVudCBpZD0iYyIgY3g9IjAiIGN5PSIwIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDQuOTkyMTg4MzIgMTIuMDYzODc5NjMgLTEyLjE4MTEzNjU1IDUuMDQwNzEwNzQgMjIuNTIwMiAyMC42MTgzKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHI9IjEiIHhsaW5rOmhyZWY9IiNhIi8+PHBhdGggZD0ibTI1LjE3MDggNDcuOTEwNGMuNTI1IDAgLjk1MDcuNDIxLjk1MDcuOTQwM3MtLjQyNTcuOTQwMi0uOTUwNy45NDAyLS45NTA3LS40MjA5LS45NTA3LS45NDAyLjQyNTctLjk0MDMuOTUwNy0uOTQwM3ptLTEuMDMyOC00NC45MTU2NWMuNDY0Ni4wMzgzNi44Mzk4LjM5MDQuOTAyNy44NDY4MWwxLjEzMDcgOC4yMTU3NGMuMzc5OCAyLjcxNDMgMy42NTM1IDMuODkwNCA1LjY3NDMgMi4wNDU5bDExLjMyOTEtMTAuMzExNThjLjI3MzMtLjI0ODczLjY5ODktLjIzMTQ5Ljk1MDcuMDM4NTEuMjMwOS4yNDc3Mi4yMzc5LjYyNjk3LjAxNjEuODgyNzdsLTkuODc5MSAxMS4zOTU4Yy0xLjgxODcgMi4wOTQyLS40NzY4IDUuMzY0MyAyLjI5NTYgNS41OTc4bDguNzE2OC44NDAzYy40MzQxLjA0MTguNzUxNy40MjM0LjcwOTMuODUyNC0uMDM0OS4zNTM3LS4zMDc0LjYzOTUtLjY2MjguNjk0OWwtOS4xNTk0IDEuNDMwMmMtMi42NTkzLjM2MjUtMy44NjM2IDMuNTExNy0yLjEzMzkgNS41NTc2bDMuMjIgMy43OTYxYy4yNTk0LjMwNTguMjE4OC43NjE1LS4wOTA4IDEuMDE3OC0uMjYyMi4yMTcyLS42NDE5LjIyNTYtLjkxMzguMDIwM2wtMy45Njk0LTIuOTk3OGMtMi4xNDIxLTEuNjEwOS01LjIyOTctLjI0MTctNS40NTYxIDIuNDI0M2wtLjg3NDcgMTAuMzk3NmMtLjAzNjIuNDI5NS0uNDE3OC43NDg3LS44NTI1LjcxMy0uMzY5LS4wMzAzLS42NjcxLS4zMDk3LS43MTcxLS42NzIxbC0xLjM4NzEtMTAuMDQzN2MtLjM3MTctMi43MTQ0LTMuNjQ1NC0zLjg5MDQtNS42NzQzLTIuMDQ1OWwtMTIuMDUxOTUgMTAuOTc0Yy0uMjQ5NDcuMjI3MS0uNjM4MDkuMjExNC0uODY4LS4wMzUtLjIxMDk0LS4yMjYyLS4yMTczNS0uNTcyNC0uMDE0OTMtLjgwNmwxMC41MTgxOC0xMi4xMzg1YzEuODE4Ny0yLjA5NDIuNDg0OS01LjM2NDQtMi4yODc2LTUuNTk3OGwtOC43MTg3Mi0uODQwNWMtLjQzNDEzLS4wNDE4LS43NTE3Mi0uNDIzNS0uNzA5MzYtLjg1MjQuMDM0OTMtLjM1MzcuMzA3MzktLjYzOTQuNjYyNy0uNjk1bDkuMTUzMzgtMS40Mjk5YzIuNjU5NC0uMzYyNSAzLjg3MTgtMy41MTE3IDIuMTQyMS01LjU1NzZsLTIuMTkyLTIuNTg0MWMtLjMyMTctLjM3OTItLjI3MTMtLjk0NDMuMTEyNi0xLjI2MjEuMzI1My0uMjY5NC43OTYzLS4yNzk3IDEuMTMzNC0uMDI0OWwyLjY5MTggMi4wMzQ3YzIuMTQyMSAxLjYxMDkgNS4yMjk3LjI0MTcgNS40NTYxLTIuNDI0M2wuNzI0MS04LjU1OTk4Yy4wNDU3LS41NDA4LjUyNjUtLjk0MjU3IDEuMDczOS0uODk3Mzd6bS0yMy4xODczMyAyMC40Mzk2NWMuNTI1MDQgMCAuOTUwNjcuNDIxLjk1MDY3Ljk0MDNzLS40MjU2My45NDAzLS45NTA2Ny45NDAzYy0uNTI1MDQxIDAtLjk1MDY3LS40MjEtLjk1MDY3LS45NDAzcy40MjU2MjktLjk0MDMuOTUwNjctLjk0MDN6bTQ3LjY3OTczLS45NTQ3Yy41MjUgMCAuOTUwNy40MjEuOTUwNy45NDAzcy0uNDI1Ny45NDAyLS45NTA3Ljk0MDItLjk1MDctLjQyMDktLjk1MDctLjk0MDIuNDI1Ny0uOTQwMy45NTA3LS45NDAzem0tMjQuNjI5Ni0yMi40Nzk3Yy41MjUgMCAuOTUwNi40MjA5NzMuOTUwNi45NDAyNyAwIC41MTkzLS40MjU2Ljk0MDI3LS45NTA2Ljk0MDI3LS41MjUxIDAtLjk1MDctLjQyMDk3LS45NTA3LS45NDAyNyAwLS41MTkyOTcuNDI1Ni0uOTQwMjcuOTUwNy0uOTQwMjd6IiBmaWxsPSJ1cmwoI2IpIi8+PHBhdGggZD0ibTI0LjU3MSAzMi43NzkyYzQuOTU5NiAwIDguOTgwMi0zLjk3NjUgOC45ODAyLTguODgxOSAwLTQuOTA1My00LjAyMDYtOC44ODE5LTguOTgwMi04Ljg4MTlzLTguOTgwMiAzLjk3NjYtOC45ODAyIDguODgxOWMwIDQuOTA1NCA0LjAyMDYgOC44ODE5IDguOTgwMiA4Ljg4MTl6IiBmaWxsPSJ1cmwoI2MpIi8+PC9zdmc+"),
                    gt.set(this, void 0),
                    mt.set(this, null),
                    bt.set(this, ((t,e)=>{
                        var n;
                        return (null === (n = Tt(this, ht, "f")[t]) || void 0 === n ? void 0 : n.push(e)) || (Tt(this, ht, "f")[t] = [e]),
                        ()=>Tt(this, ft, "m", vt).call(this, t, e)
                    }
                    )),
                    Mt.set(this, (()=>{
                        if (Tt(this, gt, "f").publicKey) {
                            const t = Tt(this, mt, "f")
                              , e = Tt(this, gt, "f").publicKey;
                            t && t.address === e.toString() && t.publicKey.toString() === e.toString() || (Bt(this, mt, new lt({
                                address: e.toString(),
                                publicKey: e.toBytes()
                            }), "f"),
                            Tt(this, ft, "m", wt).call(this, "change", {
                                accounts: this.accounts
                            }))
                        }
                    }
                    )),
                    xt.set(this, (()=>{
                        Tt(this, mt, "f") && (Bt(this, mt, null, "f"),
                        Tt(this, ft, "m", wt).call(this, "change", {
                            accounts: this.accounts
                        }))
                    }
                    )),
                    jt.set(this, (()=>{
                        Tt(this, gt, "f").publicKey ? Tt(this, Mt, "f").call(this) : Tt(this, xt, "f").call(this)
                    }
                    )),
                    It.set(this, (()=>Lt(this, void 0, void 0, (function*() {
                        var t, e;
                        if (!Tt(this, mt, "f")) {
                            if (!(null === window || void 0 === window ? void 0 : window.solflare) && !(null === window || void 0 === window ? void 0 : window.SolflareApp)) {
                                const n = (null === (e = null === (t = null === navigator || void 0 === navigator ? void 0 : navigator.userAgent) || void 0 === t ? void 0 : t.toLowerCase) || void 0 === e ? void 0 : e.call(t)) || "";
                                if (n.includes("iphone") || n.includes("ipad")) {
                                    const t = encodeURIComponent(window.location.href)
                                      , e = encodeURIComponent(window.location.origin);
                                    throw window.location.href = `https://solflare.com/ul/v1/browse/${t}?ref=${e}`,
                                    new Error("redirected to Solflare")
                                }
                            }
                            yield Tt(this, gt, "f").connect()
                        }
                        return Tt(this, Mt, "f").call(this),
                        {
                            accounts: this.accounts
                        }
                    }
                    )))),
                    At.set(this, (()=>Lt(this, void 0, void 0, (function*() {
                        yield Tt(this, gt, "f").disconnect()
                    }
                    )))),
                    St.set(this, ((...t)=>Lt(this, void 0, void 0, (function*() {
                        if (!Tt(this, mt, "f"))
                            throw new Error("not connected");
                        const e = [];
                        if (1 === t.length) {
                            const {transaction: n, account: r, chain: i, options: s} = t[0]
                              , {minContextSlot: a, preflightCommitment: u, skipPreflight: c, maxRetries: l} = s || {};
                            if (r !== Tt(this, mt, "f"))
                                throw new Error("invalid account");
                            if (!X(i))
                                throw new Error("invalid chain");
                            const f = yield Tt(this, gt, "f").signAndSendTransaction(o.VersionedTransaction.deserialize(n), {
                                preflightCommitment: u,
                                minContextSlot: a,
                                maxRetries: l,
                                skipPreflight: c
                            });
                            e.push({
                                signature: Ot().decode(f)
                            })
                        } else if (t.length > 1)
                            for (const n of t)
                                e.push(...yield Tt(this, St, "f").call(this, n));
                        return e
                    }
                    )))),
                    _t.set(this, ((...t)=>Lt(this, void 0, void 0, (function*() {
                        if (!Tt(this, mt, "f"))
                            throw new Error("not connected");
                        const e = [];
                        if (1 === t.length) {
                            const {transaction: n, account: r, chain: i} = t[0];
                            if (r !== Tt(this, mt, "f"))
                                throw new Error("invalid account");
                            if (i && !X(i))
                                throw new Error("invalid chain");
                            const s = yield Tt(this, gt, "f").signTransaction(o.VersionedTransaction.deserialize(n));
                            e.push({
                                signedTransaction: s.serialize()
                            })
                        } else if (t.length > 1) {
                            let n;
                            for (const e of t) {
                                if (e.account !== Tt(this, mt, "f"))
                                    throw new Error("invalid account");
                                if (e.chain) {
                                    if (!X(e.chain))
                                        throw new Error("invalid chain");
                                    if (n) {
                                        if (e.chain !== n)
                                            throw new Error("conflicting chain")
                                    } else
                                        n = e.chain
                                }
                            }
                            const r = t.map((({transaction: t})=>o.VersionedTransaction.deserialize(t)))
                              , i = yield Tt(this, gt, "f").signAllTransactions(r);
                            e.push(...i.map((t=>({
                                signedTransaction: t.serialize()
                            }))))
                        }
                        return e
                    }
                    )))),
                    Et.set(this, ((...t)=>Lt(this, void 0, void 0, (function*() {
                        if (!Tt(this, mt, "f"))
                            throw new Error("not connected");
                        const e = [];
                        if (1 === t.length) {
                            const {message: n, account: r} = t[0];
                            if (r !== Tt(this, mt, "f"))
                                throw new Error("invalid account");
                            const o = yield Tt(this, gt, "f").signMessage(n);
                            e.push({
                                signedMessage: n,
                                signature: o
                            })
                        } else if (t.length > 1)
                            for (const n of t)
                                e.push(...yield Tt(this, Et, "f").call(this, n));
                        return e
                    }
                    )))),
                    Bt(this, gt, new $({
                        params: {
                            adapterVersion: "1.0.3"
                        }
                    }), "f"),
                    Tt(this, gt, "f").on("connect", Tt(this, Mt, "f"), this),
                    Tt(this, gt, "f").on("disconnect", Tt(this, xt, "f"), this),
                    Tt(this, gt, "f").on("accountChanged", Tt(this, jt, "f"), this),
                    Tt(this, Mt, "f").call(this)
                }
            }
            ht = new WeakMap,
            dt = new WeakMap,
            pt = new WeakMap,
            yt = new WeakMap,
            gt = new WeakMap,
            mt = new WeakMap,
            bt = new WeakMap,
            Mt = new WeakMap,
            xt = new WeakMap,
            jt = new WeakMap,
            It = new WeakMap,
            At = new WeakMap,
            St = new WeakMap,
            _t = new WeakMap,
            Et = new WeakMap,
            ft = new WeakSet,
            wt = function(t, ...e) {
                var n;
                null === (n = Tt(this, ht, "f")[t]) || void 0 === n || n.forEach((t=>t.apply(null, e)))
            }
            ,
            vt = function(t, e) {
                var n;
                Tt(this, ht, "f")[t] = null === (n = Tt(this, ht, "f")[t]) || void 0 === n ? void 0 : n.filter((t=>e !== t))
            }
            ;
            class Pt extends Error {
                constructor(t, e) {
                    super(t),
                    this.error = e
                }
            }
            class zt extends Pt {
                constructor() {
                    super(...arguments),
                    this.name = "WalletNotConnectedError"
                }
            }
            var Ut, Dt, Rt, Ct, Wt, qt, Ft, Kt, Ht, Yt, Gt, $t, Vt, Zt, Jt = function(t, e, n, r) {
                return new (n || (n = Promise))((function(o, i) {
                    function s(t) {
                        try {
                            u(r.next(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function a(t) {
                        try {
                            u(r.throw(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function u(t) {
                        var e;
                        t.done ? o(t.value) : (e = t.value,
                        e instanceof n ? e : new n((function(t) {
                            t(e)
                        }
                        ))).then(s, a)
                    }
                    u((r = r.apply(t, e || [])).next())
                }
                ))
            }, Qt = function(t, e, n, r) {
                if ("a" === n && !r)
                    throw new TypeError("Private accessor was defined without a getter");
                if ("function" == typeof e ? t !== e || !r : !e.has(t))
                    throw new TypeError("Cannot read private member from an object whose class did not declare it");
                return "m" === n ? r : "a" === n ? r.call(t) : r ? r.value : e.get(t)
            };
            class Xt {
                constructor() {
                    Ut.add(this),
                    Dt.set(this, {}),
                    Rt.set(this, "1.0.0"),
                    Ct.set(this, "MetaMask"),
                    Wt.set(this, "data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjMxIiB2aWV3Qm94PSIwIDAgMzEgMzEiIHdpZHRoPSIzMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGxpbmVhckdyYWRpZW50IGlkPSJhIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjIwLjI1IiB4Mj0iMjYuNTcxIiB5MT0iMjcuMTczIiB5Mj0iMTkuODU4Ij48c3RvcCBvZmZzZXQ9Ii4wOCIgc3RvcC1jb2xvcj0iIzk5NDVmZiIvPjxzdG9wIG9mZnNldD0iLjMiIHN0b3AtY29sb3I9IiM4NzUyZjMiLz48c3RvcCBvZmZzZXQ9Ii41IiBzdG9wLWNvbG9yPSIjNTQ5N2Q1Ii8+PHN0b3Agb2Zmc2V0PSIuNiIgc3RvcC1jb2xvcj0iIzQzYjRjYSIvPjxzdG9wIG9mZnNldD0iLjcyIiBzdG9wLWNvbG9yPSIjMjhlMGI5Ii8+PHN0b3Agb2Zmc2V0PSIuOTciIHN0b3AtY29sb3I9IiMxOWZiOWIiLz48L2xpbmVhckdyYWRpZW50PjxnIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iLjA5NCI+PHBhdGggZD0ibTI2LjEwOSAzLjY0My05LjM2OSA2Ljk1OSAxLjczMy00LjEwNSA3LjYzNy0yLjg1M3oiIGZpbGw9IiNlMjc2MWIiIHN0cm9rZT0iI2UyNzYxYiIvPjxnIGZpbGw9IiNlNDc2MWIiIHN0cm9rZT0iI2U0NzYxYiI+PHBhdGggZD0ibTQuNDgxIDMuNjQzIDkuMjk0IDcuMDI0LTEuNjQ4LTQuMTcxem0xOC4yNTggMTYuMTMtMi40OTUgMy44MjMgNS4zMzkgMS40NjkgMS41MzUtNS4yMDctNC4zNzgtLjA4NXptLTE5LjI0Ny4wODUgMS41MjUgNS4yMDcgNS4zMzktMS40NjktMi40OTUtMy44MjN6Ii8+PHBhdGggZD0ibTEwLjA1NSAxMy4zMTMtMS40ODggMi4yNTEgNS4zMDEuMjM1LS4xODgtNS42OTd6bTEwLjQ4IDAtMy42NzItMy4yNzctLjEyMiA1Ljc2MyA1LjI5Mi0uMjM1LTEuNDk3LTIuMjUxem0tMTAuMTc4IDEwLjI4MyAzLjE4My0xLjU1NC0yLjc0OS0yLjE0Ny0uNDMzIDMuNzAxem02LjY5NS0xLjU1NCAzLjE5MiAxLjU1NC0uNDQzLTMuNzAxeiIvPjwvZz48cGF0aCBkPSJtMjAuMjQ0IDIzLjU5Ni0zLjE5Mi0xLjU1NC4yNTQgMi4wODEtLjAyOC44NzZ6bS05Ljg4NyAwIDIuOTY2IDEuNDAzLS4wMTktLjg3Ni4yMzUtMi4wODEtMy4xODMgMS41NTR6IiBmaWxsPSIjZDdjMWIzIiBzdHJva2U9IiNkN2MxYjMiLz48cGF0aCBkPSJtMTMuMzY5IDE4LjUyMS0yLjY1NS0uNzgxIDEuODc0LS44NTd6bTMuODUxIDAgLjc4MS0xLjYzOCAxLjg4My44NTctMi42NjUuNzgxeiIgZmlsbD0iIzIzMzQ0NyIgc3Ryb2tlPSIjMjMzNDQ3Ii8+PHBhdGggZD0ibTEwLjM1NyAyMy41OTYuNDUyLTMuODIzLTIuOTQ3LjA4NXptOS40MzUtMy44MjMuNDUyIDMuODIzIDIuNDk1LTMuNzM4em0yLjI0MS00LjIwOS01LjI5Mi4yMzUuNDkgMi43MjEuNzgyLTEuNjM4IDEuODgzLjg1N3ptLTExLjMxOCAyLjE3NSAxLjg4My0uODU3Ljc3MiAxLjYzOC40OTktMi43MjEtNS4zMDEtLjIzNXoiIGZpbGw9IiNjZDYxMTYiIHN0cm9rZT0iI2NkNjExNiIvPjxwYXRoIGQ9Im04LjU2NyAxNS41NjQgMi4yMjIgNC4zMzEtLjA3NS0yLjE1NnptMTEuMzI4IDIuMTc1LS4wOTQgMi4xNTYgMi4yMzItNC4zMzEtMi4xMzcgMi4xNzV6bS02LjAyNi0xLjk0LS40OTkgMi43MjEuNjIxIDMuMjExLjE0MS00LjIyOC0uMjY0LTEuNzA0em0yLjg3MiAwLS4yNTQgMS42OTUuMTEzIDQuMjM3LjYzMS0zLjIxMXoiIGZpbGw9IiNlNDc1MWYiIHN0cm9rZT0iI2U0NzUxZiIvPjxwYXRoIGQ9Im0xNy4yMyAxOC41Mi0uNjMxIDMuMjExLjQ1Mi4zMTEgMi43NS0yLjE0Ny4wOTQtMi4xNTZ6bS02LjUxNi0uNzgxLjA3NSAyLjE1NiAyLjc1IDIuMTQ3LjQ1Mi0uMzExLS42MjItMy4yMTF6IiBmaWxsPSIjZjY4NTFiIiBzdHJva2U9IiNmNjg1MWIiLz48cGF0aCBkPSJtMTcuMjc3IDI0Ljk5OS4wMjgtLjg3Ni0uMjM1LS4yMDdoLTMuNTVsLS4yMTcuMjA3LjAxOS44NzYtMi45NjYtMS40MDMgMS4wMzYuODQ4IDIuMSAxLjQ1OWgzLjYwNmwyLjEwOS0xLjQ1OSAxLjAzNi0uODQ4eiIgZmlsbD0iI2MwYWQ5ZSIgc3Ryb2tlPSIjYzBhZDllIi8+PHBhdGggZD0ibTE3LjA1MSAyMi4wNDItLjQ1Mi0uMzExaC0yLjYwOGwtLjQ1Mi4zMTEtLjIzNSAyLjA4MS4yMTctLjIwN2gzLjU1bC4yMzUuMjA3LS4yNTQtMi4wODF6IiBmaWxsPSIjMTYxNjE2IiBzdHJva2U9IiMxNjE2MTYiLz48cGF0aCBkPSJtMjYuNTA1IDExLjA1My44LTMuODQyLTEuMTk2LTMuNTY5LTkuMDU4IDYuNzIzIDMuNDg0IDIuOTQ3IDQuOTI1IDEuNDQxIDEuMDkyLTEuMjcxLS40NzEtLjMzOS43NTMtLjY4Ny0uNTg0LS40NTIuNzUzLS41NzQtLjQ5OS0uMzc3em0tMjMuMjExLTMuODQxLjggMy44NDItLjUwOC4zNzcuNzUzLjU3NC0uNTc0LjQ1Mi43NTMuNjg3LS40NzEuMzM5IDEuMDgzIDEuMjcxIDQuOTI1LTEuNDQxIDMuNDg0LTIuOTQ3LTkuMDU5LTYuNzIzeiIgZmlsbD0iIzc2M2QxNiIgc3Ryb2tlPSIjNzYzZDE2Ii8+PHBhdGggZD0ibTI1LjQ2IDE0Ljc1NC00LjkyNS0xLjQ0MSAxLjQ5NyAyLjI1MS0yLjIzMiA0LjMzMSAyLjkzOC0uMDM4aDQuMzc4bC0xLjY1Ny01LjEwNHptLTE1LjQwNS0xLjQ0MS00LjkyNSAxLjQ0MS0xLjYzOCA1LjEwNGg0LjM2OWwyLjkyOC4wMzgtMi4yMjItNC4zMzEgMS40ODgtMi4yNTF6bTYuNjg1IDIuNDg2LjMxMS01LjQzMyAxLjQzMS0zLjg3aC02LjM1NmwxLjQxMyAzLjg3LjMyOSA1LjQzMy4xMTMgMS43MTQuMDA5IDQuMjE5aDIuNjFsLjAxOS00LjIxOS4xMjItMS43MTR6IiBmaWxsPSIjZjY4NTFiIiBzdHJva2U9IiNmNjg1MWIiLz48L2c+PGNpcmNsZSBjeD0iMjMuNSIgY3k9IjIzLjUiIGZpbGw9IiMwMDAiIHI9IjYuNSIvPjxwYXRoIGQ9Im0yNy40NzMgMjUuNTQ1LTEuMzEgMS4zNjhjLS4wMjkuMDMtLjA2My4wNTMtLjEwMS4wN2EuMzEuMzEgMCAwIDEgLS4xMjEuMDI0aC02LjIwOWMtLjAzIDAtLjA1OS0uMDA4LS4wODMtLjAyNGEuMTUuMTUgMCAwIDEgLS4wNTYtLjA2NWMtLjAxMi0uMDI2LS4wMTUtLjA1Ni0uMDEtLjA4NHMuMDE4LS4wNTUuMDM5LS4wNzZsMS4zMTEtMS4zNjhjLjAyOC0uMDMuMDYzLS4wNTMuMTAxLS4wNjlhLjMxLjMxIDAgMCAxIC4xMjEtLjAyNWg2LjIwOGMuMDMgMCAuMDU5LjAwOC4wODMuMDI0YS4xNS4xNSAwIDAgMSAuMDU2LjA2NWMuMDEyLjAyNi4wMTUuMDU2LjAxLjA4NHMtLjAxOC4wNTUtLjAzOS4wNzZ6bS0xLjMxLTIuNzU2Yy0uMDI5LS4wMy0uMDYzLS4wNTMtLjEwMS0uMDdhLjMxLjMxIDAgMCAwIC0uMTIxLS4wMjRoLTYuMjA5Yy0uMDMgMC0uMDU5LjAwOC0uMDgzLjAyNHMtLjA0NC4wMzgtLjA1Ni4wNjUtLjAxNS4wNTYtLjAxLjA4NC4wMTguMDU1LjAzOS4wNzZsMS4zMTEgMS4zNjhjLjAyOC4wMy4wNjMuMDUzLjEwMS4wNjlhLjMxLjMxIDAgMCAwIC4xMjEuMDI1aDYuMjA4Yy4wMyAwIC4wNTktLjAwOC4wODMtLjAyNGEuMTUuMTUgMCAwIDAgLjA1Ni0uMDY1Yy4wMTItLjAyNi4wMTUtLjA1Ni4wMS0uMDg0cy0uMDE4LS4wNTUtLjAzOS0uMDc2em0tNi40MzEtLjk4M2g2LjIwOWEuMzEuMzEgMCAwIDAgLjEyMS0uMDI0Yy4wMzgtLjAxNi4wNzMtLjA0LjEwMS0uMDdsMS4zMS0xLjM2OGMuMDItLjAyMS4wMzQtLjA0Ny4wMzktLjA3NnMuMDAxLS4wNTgtLjAxLS4wODRhLjE1LjE1IDAgMCAwIC0uMDU2LS4wNjVjLS4wMjUtLjAxNi0uMDU0LS4wMjQtLjA4My0uMDI0aC02LjIwOGEuMzEuMzEgMCAwIDAgLS4xMjEuMDI1Yy0uMDM4LjAxNi0uMDcyLjA0LS4xMDEuMDY5bC0xLjMxIDEuMzY4Yy0uMDIuMDIxLS4wMzQuMDQ3LS4wMzkuMDc2cy0uMDAxLjA1OC4wMS4wODQuMDMxLjA0OS4wNTYuMDY1LjA1NC4wMjQuMDgzLjAyNHoiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4="),
                    qt.set(this, null),
                    Ft.set(this, ((t,e)=>{
                        var n;
                        return (null === (n = Qt(this, Dt, "f")[t]) || void 0 === n ? void 0 : n.push(e)) || (Qt(this, Dt, "f")[t] = [e]),
                        ()=>Qt(this, Ut, "m", Ht).call(this, t, e)
                    }
                    )),
                    Yt.set(this, (()=>Jt(this, void 0, void 0, (function*() {
                        if (!Qt(this, qt, "f")) {
                            let t;
                            try {
                                t = (yield n.e("vendors-node_modules_solflare-wallet_metamask-sdk_lib_esm_index_js").then(n.bind(n, "../../../node_modules/@solflare-wallet/metamask-sdk/lib/esm/index.js"))).default
                            } catch (t) {
                                throw new Error("Unable to load Solflare MetaMask SDK")
                            }
                            (function(t, e, n, r, o) {
                                if ("m" === r)
                                    throw new TypeError("Private method is not writable");
                                if ("a" === r && !o)
                                    throw new TypeError("Private accessor was defined without a setter");
                                if ("function" == typeof e ? t !== e || !o : !e.has(t))
                                    throw new TypeError("Cannot write private member to an object whose class did not declare it");
                                "a" === r ? o.call(t, n) : o ? o.value = n : e.set(t, n)
                            }
                            )(this, qt, new t, "f"),
                            Qt(this, qt, "f").on("standard_change", (t=>Qt(this, Ut, "m", Kt).call(this, "change", t)))
                        }
                        return this.accounts.length || (yield Qt(this, qt, "f").connect()),
                        {
                            accounts: this.accounts
                        }
                    }
                    )))),
                    Gt.set(this, (()=>Jt(this, void 0, void 0, (function*() {
                        Qt(this, qt, "f") && (yield Qt(this, qt, "f").disconnect())
                    }
                    )))),
                    $t.set(this, ((...t)=>Jt(this, void 0, void 0, (function*() {
                        if (!Qt(this, qt, "f"))
                            throw new zt;
                        return yield Qt(this, qt, "f").standardSignAndSendTransaction(...t)
                    }
                    )))),
                    Vt.set(this, ((...t)=>Jt(this, void 0, void 0, (function*() {
                        if (!Qt(this, qt, "f"))
                            throw new zt;
                        return yield Qt(this, qt, "f").standardSignTransaction(...t)
                    }
                    )))),
                    Zt.set(this, ((...t)=>Jt(this, void 0, void 0, (function*() {
                        if (!Qt(this, qt, "f"))
                            throw new zt;
                        return yield Qt(this, qt, "f").standardSignMessage(...t)
                    }
                    ))))
                }
                get version() {
                    return Qt(this, Rt, "f")
                }
                get name() {
                    return Qt(this, Ct, "f")
                }
                get icon() {
                    return Qt(this, Wt, "f")
                }
                get chains() {
                    return [u, c, l]
                }
                get features() {
                    return {
                        [V]: {
                            version: "1.0.0",
                            connect: Qt(this, Yt, "f")
                        },
                        [Z]: {
                            version: "1.0.0",
                            disconnect: Qt(this, Gt, "f")
                        },
                        [J]: {
                            version: "1.0.0",
                            on: Qt(this, Ft, "f")
                        },
                        [f.G]: {
                            version: "1.0.0",
                            supportedTransactionVersions: ["legacy", 0],
                            signAndSendTransaction: Qt(this, $t, "f")
                        },
                        [h.R]: {
                            version: "1.0.0",
                            supportedTransactionVersions: ["legacy", 0],
                            signTransaction: Qt(this, Vt, "f")
                        },
                        [d.g]: {
                            version: "1.0.0",
                            signMessage: Qt(this, Zt, "f")
                        }
                    }
                }
                get accounts() {
                    return Qt(this, qt, "f") ? Qt(this, qt, "f").standardAccounts : []
                }
            }
            Dt = new WeakMap,
            Rt = new WeakMap,
            Ct = new WeakMap,
            Wt = new WeakMap,
            qt = new WeakMap,
            Ft = new WeakMap,
            Yt = new WeakMap,
            Gt = new WeakMap,
            $t = new WeakMap,
            Vt = new WeakMap,
            Zt = new WeakMap,
            Ut = new WeakSet,
            Kt = function(t, ...e) {
                var n;
                null === (n = Qt(this, Dt, "f")[t]) || void 0 === n || n.forEach((t=>t.apply(null, e)))
            }
            ,
            Ht = function(t, e) {
                var n;
                Qt(this, Dt, "f")[t] = null === (n = Qt(this, Dt, "f")[t]) || void 0 === n ? void 0 : n.filter((t=>e !== t))
            }
            ;
            var te = function(t, e, n, r) {
                return new (n || (n = Promise))((function(o, i) {
                    function s(t) {
                        try {
                            u(r.next(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function a(t) {
                        try {
                            u(r.throw(t))
                        } catch (t) {
                            i(t)
                        }
                    }
                    function u(t) {
                        var e;
                        t.done ? o(t.value) : (e = t.value,
                        e instanceof n ? e : new n((function(t) {
                            t(e)
                        }
                        ))).then(s, a)
                    }
                    u((r = r.apply(t, e || [])).next())
                }
                ))
            };
            let ee = !1;
            let ne = !1;
            function re({disableMetaMask: t}={}) {
                "undefined" != typeof window && (ne || window && window.solflareWalletStandardInitialized || (ne = !0,
                window && (window.solflareWalletStandardInitialized = !0),
                t || function() {
                    te(this, void 0, void 0, (function*() {
                        if ("undefined" == typeof window)
                            return;
                        if (ee)
                            return;
                        const t = "solflare-detect-metamask";
                        function e() {
                            window.postMessage({
                                target: "metamask-contentscript",
                                data: {
                                    name: "metamask-provider",
                                    data: {
                                        id: t,
                                        jsonrpc: "2.0",
                                        method: "wallet_getSnaps"
                                    }
                                }
                            }, window.location.origin)
                        }
                        function n(r) {
                            var o, i;
                            const a = r.data;
                            "metamask-inpage" === (null == a ? void 0 : a.target) && "metamask-provider" === (null === (o = a.data) || void 0 === o ? void 0 : o.name) && ((null === (i = a.data.data) || void 0 === i ? void 0 : i.id) === t ? (window.removeEventListener("message", n),
                            a.data.data.error || "undefined" != typeof window && (ee || (ee = !0,
                            s(new Xt)))) : e())
                        }
                        window.addEventListener("message", n),
                        window.setTimeout((()=>window.removeEventListener("message", n)), 5e3),
                        e()
                    }
                    ))
                }(),
                s(new Nt)))
            }
            var oe = n("../../../node_modules/bs58/index.js")
              , ie = n.n(oe)
              , se = n("../../../node_modules/eventemitter3/index.js")
              , ae = n.n(se)
              , ue = n("../../../node_modules/uuid/dist/esm-browser/v4.js")
              , ce = n("../../../node_modules/console-browserify/index.js");
            "complete" === document.readyState ? re({
                disableMetaMask: !0
            }) : window.addEventListener("load", (()=>re({
                disableMetaMask: !0
            })));
            const le = new Map
              , fe = new (ae());
            let he = !1
              , de = null;
            function pe(t) {
                return void 0 === t.version
            }
            function ye({method: t, params: e}) {
                return new Promise(((n,r)=>{
                    const o = (0,
                    ue.Z)();
                    le.set(o, {
                        resolve: n,
                        reject: r
                    }),
                    window.postMessage({
                        channel: "solflarePageToContent",
                        data: {
                            id: o,
                            method: t,
                            params: e
                        }
                    })
                }
                ))
            }
            async function ge({method: t, params: e}) {
                if (he)
                    switch (t) {
                    case "connect":
                        return fe.emit("connect", new o.PublicKey(de)),
                        !0;
                    case "disconnect":
                        try {
                            return await ye({
                                method: t,
                                params: e
                            }),
                            he = !1,
                            de = null,
                            fe.emit("disconnect"),
                            !0
                        } catch (t) {
                            return !1
                        }
                    case "signMessage":
                    case "signTransaction":
                    case "signTransactionV2":
                    case "signAllTransactions":
                    case "signAllTransactionsV2":
                    case "signAndSendTransaction":
                        return await ye({
                            method: t,
                            params: e
                        });
                    default:
                        throw new Error("Unsupported method")
                    }
                else
                    switch (t) {
                    case "connect":
                        try {
                            const n = await ye({
                                method: t,
                                params: e
                            });
                            return he = !0,
                            de = n.publicKey,
                            fe.emit("connect", new o.PublicKey(de)),
                            !0
                        } catch (t) {
                            return fe.emit("disconnect"),
                            !1
                        }
                    case "disconnect":
                        return fe.emit("disconnect"),
                        !0;
                    default:
                        throw new Error("Not connected")
                    }
            }
            window.addEventListener("message", (t=>{
                if ("solflareContentToPage" === t.data?.channel)
                    if (t.data?.data?.id && le.has(t.data.data.id)) {
                        const {resolve: e, reject: n} = le.get(t.data.data.id);
                        le.delete(t.data.data.id);
                        const r = t.data.data;
                        r.error ? n(r.error) : e(r.result)
                    } else
                        "accountChanged" === t.data?.data?.method ? he && (t.data?.data?.publicKey ? (de = t.data.data.publicKey,
                        fe.emit("accountChanged", new o.PublicKey(de))) : fe.emit("accountChanged", void 0)) : "disconnect" === t.data?.data?.method && he && (he = !1,
                        de = null,
                        fe.emit("disconnect"))
            }
            ));
            const me = {};
            Object.defineProperty(me, "isSolflare", {
                value: !0
            }),
            Object.defineProperty(me, "isConnected", {
                get: ()=>he
            }),
            Object.defineProperty(me, "publicKey", {
                get: ()=>de ? new o.PublicKey(de) : null
            }),
            Object.defineProperty(me, "priorityFeesSupported", {
                value: !0
            }),
            Object.defineProperty(me, "autoApprove", {
                value: !1
            }),
            Object.defineProperty(me, "request", {
                value: ge
            }),
            Object.defineProperty(me, "on", {
                value: fe.on.bind(fe)
            }),
            Object.defineProperty(me, "addEventListener", {
                value: fe.on.bind(fe)
            }),
            Object.defineProperty(me, "addListener", {
                value: fe.on.bind(fe)
            }),
            Object.defineProperty(me, "once", {
                value: fe.once.bind(fe)
            }),
            Object.defineProperty(me, "off", {
                value: fe.off.bind(fe)
            }),
            Object.defineProperty(me, "removeEventListener", {
                value: fe.off.bind(fe)
            }),
            Object.defineProperty(me, "removeListener", {
                value: fe.off.bind(fe)
            }),
            Object.defineProperty(me, "eventNames", {
                value: fe.eventNames.bind(fe)
            }),
            Object.defineProperty(me, "listenerCount", {
                value: fe.listenerCount.bind(fe)
            }),
            Object.defineProperty(me, "listeners", {
                value: fe.listeners.bind(fe)
            }),
            Object.defineProperty(me, "removeAllListeners", {
                value: fe.removeAllListeners.bind(fe)
            }),
            Object.defineProperty(me, "connect", {
                value: t=>ge({
                    method: "connect",
                    params: t
                })
            }),
            Object.defineProperty(me, "disconnect", {
                value: t=>ge({
                    method: "disconnect",
                    params: t
                })
            }),
            Object.defineProperty(me, "signTransaction", {
                value: async t=>{
                    try {
                        const e = pe(t) ? t.serialize({
                            requireAllSignatures: !1,
                            verifySignatures: !1
                        }) : t.serialize()
                          , {transaction: n} = await ge({
                            method: "signTransactionV2",
                            params: {
                                transaction: ie().encode(e)
                            }
                        });
                        return pe(t) ? o.Transaction.from(ie().decode(n)) : o.VersionedTransaction.deserialize(ie().decode(n))
                    } catch (t) {
                        throw ce.log(t),
                        new Error("Failed to sign transaction")
                    }
                }
            }),
            Object.defineProperty(me, "signMessage", {
                value: async(t,e="utf8")=>{
                    const {signature: n} = await ge({
                        method: "signMessage",
                        params: {
                            message: t,
                            display: e
                        }
                    });
                    return {
                        publicKey: new o.PublicKey(de),
                        signature: ie().decode(n)
                    }
                }
            }),
            Object.defineProperty(me, "signAllTransactions", {
                value: async t=>{
                    try {
                        const e = t.map((t=>pe(t) ? t.serialize({
                            requireAllSignatures: !1,
                            verifySignatures: !1
                        }) : t.serialize()))
                          , {transactions: n} = await ge({
                            method: "signAllTransactionsV2",
                            params: {
                                transactions: e.map((t=>ie().encode(t)))
                            }
                        });
                        return n.map(((e,n)=>pe(t[n]) ? o.Transaction.from(ie().decode(e)) : o.VersionedTransaction.deserialize(ie().decode(e))))
                    } catch (t) {
                        throw new Error("Failed to sign transactions")
                    }
                }
            }),
            Object.defineProperty(me, "signAndSendTransaction", {
                value: async(t,e)=>{
                    try {
                        const n = pe(t) ? t.serialize({
                            requireAllSignatures: !1,
                            verifySignatures: !1
                        }) : t.serialize()
                          , {signature: r} = await ge({
                            method: "signAndSendTransaction",
                            params: {
                                transaction: ie().encode(n),
                                options: e
                            }
                        });
                        return {
                            publicKey: new o.PublicKey(de),
                            signature: r
                        }
                    } catch (t) {
                        throw ce.log("inpage error", t),
                        new Error("Failed to sign transaction")
                    }
                }
            }),
            Object.defineProperty(window, "solflare", {
                value: me,
                enumerable: !0
            })
        }
        ,
        "../../../node_modules/util/support/isBufferBrowser.js": t=>{
            t.exports = function(t) {
                return t && "object" == typeof t && "function" == typeof t.copy && "function" == typeof t.fill && "function" == typeof t.readUInt8
            }
        }
        ,
        "../../../node_modules/util/support/types.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/is-arguments/index.js")
              , o = n("../../../node_modules/is-generator-function/index.js")
              , i = n("../../../node_modules/which-typed-array/index.js")
              , s = n("../../../node_modules/is-typed-array/index.js");
            function a(t) {
                return t.call.bind(t)
            }
            var u = "undefined" != typeof BigInt
              , c = "undefined" != typeof Symbol
              , l = a(Object.prototype.toString)
              , f = a(Number.prototype.valueOf)
              , h = a(String.prototype.valueOf)
              , d = a(Boolean.prototype.valueOf);
            if (u)
                var p = a(BigInt.prototype.valueOf);
            if (c)
                var y = a(Symbol.prototype.valueOf);
            function g(t, e) {
                if ("object" != typeof t)
                    return !1;
                try {
                    return e(t),
                    !0
                } catch (t) {
                    return !1
                }
            }
            function m(t) {
                return "[object Map]" === l(t)
            }
            function b(t) {
                return "[object Set]" === l(t)
            }
            function w(t) {
                return "[object WeakMap]" === l(t)
            }
            function v(t) {
                return "[object WeakSet]" === l(t)
            }
            function M(t) {
                return "[object ArrayBuffer]" === l(t)
            }
            function x(t) {
                return "undefined" != typeof ArrayBuffer && (M.working ? M(t) : t instanceof ArrayBuffer)
            }
            function j(t) {
                return "[object DataView]" === l(t)
            }
            function I(t) {
                return "undefined" != typeof DataView && (j.working ? j(t) : t instanceof DataView)
            }
            e.isArgumentsObject = r,
            e.isGeneratorFunction = o,
            e.isTypedArray = s,
            e.isPromise = function(t) {
                return "undefined" != typeof Promise && t instanceof Promise || null !== t && "object" == typeof t && "function" == typeof t.then && "function" == typeof t.catch
            }
            ,
            e.isArrayBufferView = function(t) {
                return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView ? ArrayBuffer.isView(t) : s(t) || I(t)
            }
            ,
            e.isUint8Array = function(t) {
                return "Uint8Array" === i(t)
            }
            ,
            e.isUint8ClampedArray = function(t) {
                return "Uint8ClampedArray" === i(t)
            }
            ,
            e.isUint16Array = function(t) {
                return "Uint16Array" === i(t)
            }
            ,
            e.isUint32Array = function(t) {
                return "Uint32Array" === i(t)
            }
            ,
            e.isInt8Array = function(t) {
                return "Int8Array" === i(t)
            }
            ,
            e.isInt16Array = function(t) {
                return "Int16Array" === i(t)
            }
            ,
            e.isInt32Array = function(t) {
                return "Int32Array" === i(t)
            }
            ,
            e.isFloat32Array = function(t) {
                return "Float32Array" === i(t)
            }
            ,
            e.isFloat64Array = function(t) {
                return "Float64Array" === i(t)
            }
            ,
            e.isBigInt64Array = function(t) {
                return "BigInt64Array" === i(t)
            }
            ,
            e.isBigUint64Array = function(t) {
                return "BigUint64Array" === i(t)
            }
            ,
            m.working = "undefined" != typeof Map && m(new Map),
            e.isMap = function(t) {
                return "undefined" != typeof Map && (m.working ? m(t) : t instanceof Map)
            }
            ,
            b.working = "undefined" != typeof Set && b(new Set),
            e.isSet = function(t) {
                return "undefined" != typeof Set && (b.working ? b(t) : t instanceof Set)
            }
            ,
            w.working = "undefined" != typeof WeakMap && w(new WeakMap),
            e.isWeakMap = function(t) {
                return "undefined" != typeof WeakMap && (w.working ? w(t) : t instanceof WeakMap)
            }
            ,
            v.working = "undefined" != typeof WeakSet && v(new WeakSet),
            e.isWeakSet = function(t) {
                return v(t)
            }
            ,
            M.working = "undefined" != typeof ArrayBuffer && M(new ArrayBuffer),
            e.isArrayBuffer = x,
            j.working = "undefined" != typeof ArrayBuffer && "undefined" != typeof DataView && j(new DataView(new ArrayBuffer(1),0,1)),
            e.isDataView = I;
            var A = "undefined" != typeof SharedArrayBuffer ? SharedArrayBuffer : void 0;
            function S(t) {
                return "[object SharedArrayBuffer]" === l(t)
            }
            function _(t) {
                return void 0 !== A && (void 0 === S.working && (S.working = S(new A)),
                S.working ? S(t) : t instanceof A)
            }
            function E(t) {
                return g(t, f)
            }
            function k(t) {
                return g(t, h)
            }
            function O(t) {
                return g(t, d)
            }
            function L(t) {
                return u && g(t, p)
            }
            function T(t) {
                return c && g(t, y)
            }
            e.isSharedArrayBuffer = _,
            e.isAsyncFunction = function(t) {
                return "[object AsyncFunction]" === l(t)
            }
            ,
            e.isMapIterator = function(t) {
                return "[object Map Iterator]" === l(t)
            }
            ,
            e.isSetIterator = function(t) {
                return "[object Set Iterator]" === l(t)
            }
            ,
            e.isGeneratorObject = function(t) {
                return "[object Generator]" === l(t)
            }
            ,
            e.isWebAssemblyCompiledModule = function(t) {
                return "[object WebAssembly.Module]" === l(t)
            }
            ,
            e.isNumberObject = E,
            e.isStringObject = k,
            e.isBooleanObject = O,
            e.isBigIntObject = L,
            e.isSymbolObject = T,
            e.isBoxedPrimitive = function(t) {
                return E(t) || k(t) || O(t) || L(t) || T(t)
            }
            ,
            e.isAnyArrayBuffer = function(t) {
                return "undefined" != typeof Uint8Array && (x(t) || _(t))
            }
            ,
            ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach((function(t) {
                Object.defineProperty(e, t, {
                    enumerable: !1,
                    value: function() {
                        throw new Error(t + " is not supported in userland")
                    }
                })
            }
            ))
        }
        ,
        "../../../node_modules/util/util.js": (t,e,n)=>{
            var r = n("../../../node_modules/process/browser.js")
              , o = n("../../../node_modules/console-browserify/index.js")
              , i = Object.getOwnPropertyDescriptors || function(t) {
                for (var e = Object.keys(t), n = {}, r = 0; r < e.length; r++)
                    n[e[r]] = Object.getOwnPropertyDescriptor(t, e[r]);
                return n
            }
              , s = /%[sdj%]/g;
            e.format = function(t) {
                if (!v(t)) {
                    for (var e = [], n = 0; n < arguments.length; n++)
                        e.push(l(arguments[n]));
                    return e.join(" ")
                }
                n = 1;
                for (var r = arguments, o = r.length, i = String(t).replace(s, (function(t) {
                    if ("%%" === t)
                        return "%";
                    if (n >= o)
                        return t;
                    switch (t) {
                    case "%s":
                        return String(r[n++]);
                    case "%d":
                        return Number(r[n++]);
                    case "%j":
                        try {
                            return JSON.stringify(r[n++])
                        } catch (t) {
                            return "[Circular]"
                        }
                    default:
                        return t
                    }
                }
                )), a = r[n]; n < o; a = r[++n])
                    b(a) || !j(a) ? i += " " + a : i += " " + l(a);
                return i
            }
            ,
            e.deprecate = function(t, n) {
                if (void 0 !== r && !0 === r.noDeprecation)
                    return t;
                if (void 0 === r)
                    return function() {
                        return e.deprecate(t, n).apply(this, arguments)
                    }
                    ;
                var i = !1;
                return function() {
                    if (!i) {
                        if (r.throwDeprecation)
                            throw new Error(n);
                        r.traceDeprecation ? o.trace(n) : o.error(n),
                        i = !0
                    }
                    return t.apply(this, arguments)
                }
            }
            ;
            var a = {}
              , u = /^$/;
            if ("MISSING_ENV_VAR".NODE_DEBUG) {
                var c = "MISSING_ENV_VAR".NODE_DEBUG;
                c = c.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(),
                u = new RegExp("^" + c + "$","i")
            }
            function l(t, n) {
                var r = {
                    seen: [],
                    stylize: h
                };
                return arguments.length >= 3 && (r.depth = arguments[2]),
                arguments.length >= 4 && (r.colors = arguments[3]),
                m(n) ? r.showHidden = n : n && e._extend(r, n),
                M(r.showHidden) && (r.showHidden = !1),
                M(r.depth) && (r.depth = 2),
                M(r.colors) && (r.colors = !1),
                M(r.customInspect) && (r.customInspect = !0),
                r.colors && (r.stylize = f),
                d(r, t, r.depth)
            }
            function f(t, e) {
                var n = l.styles[e];
                return n ? "[" + l.colors[n][0] + "m" + t + "[" + l.colors[n][1] + "m" : t
            }
            function h(t, e) {
                return t
            }
            function d(t, n, r) {
                if (t.customInspect && n && S(n.inspect) && n.inspect !== e.inspect && (!n.constructor || n.constructor.prototype !== n)) {
                    var o = n.inspect(r, t);
                    return v(o) || (o = d(t, o, r)),
                    o
                }
                var i = function(t, e) {
                    if (M(e))
                        return t.stylize("undefined", "undefined");
                    if (v(e)) {
                        var n = "'" + JSON.stringify(e).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                        return t.stylize(n, "string")
                    }
                    return w(e) ? t.stylize("" + e, "number") : m(e) ? t.stylize("" + e, "boolean") : b(e) ? t.stylize("null", "null") : void 0
                }(t, n);
                if (i)
                    return i;
                var s = Object.keys(n)
                  , a = function(t) {
                    var e = {};
                    return t.forEach((function(t, n) {
                        e[t] = !0
                    }
                    )),
                    e
                }(s);
                if (t.showHidden && (s = Object.getOwnPropertyNames(n)),
                A(n) && (s.indexOf("message") >= 0 || s.indexOf("description") >= 0))
                    return p(n);
                if (0 === s.length) {
                    if (S(n)) {
                        var u = n.name ? ": " + n.name : "";
                        return t.stylize("[Function" + u + "]", "special")
                    }
                    if (x(n))
                        return t.stylize(RegExp.prototype.toString.call(n), "regexp");
                    if (I(n))
                        return t.stylize(Date.prototype.toString.call(n), "date");
                    if (A(n))
                        return p(n)
                }
                var c, l = "", f = !1, h = ["{", "}"];
                return g(n) && (f = !0,
                h = ["[", "]"]),
                S(n) && (l = " [Function" + (n.name ? ": " + n.name : "") + "]"),
                x(n) && (l = " " + RegExp.prototype.toString.call(n)),
                I(n) && (l = " " + Date.prototype.toUTCString.call(n)),
                A(n) && (l = " " + p(n)),
                0 !== s.length || f && 0 != n.length ? r < 0 ? x(n) ? t.stylize(RegExp.prototype.toString.call(n), "regexp") : t.stylize("[Object]", "special") : (t.seen.push(n),
                c = f ? function(t, e, n, r, o) {
                    for (var i = [], s = 0, a = e.length; s < a; ++s)
                        O(e, String(s)) ? i.push(y(t, e, n, r, String(s), !0)) : i.push("");
                    return o.forEach((function(o) {
                        o.match(/^\d+$/) || i.push(y(t, e, n, r, o, !0))
                    }
                    )),
                    i
                }(t, n, r, a, s) : s.map((function(e) {
                    return y(t, n, r, a, e, f)
                }
                )),
                t.seen.pop(),
                function(t, e, n) {
                    return t.reduce((function(t, e) {
                        return e.indexOf("\n"),
                        t + e.replace(/\u001b\[\d\d?m/g, "").length + 1
                    }
                    ), 0) > 60 ? n[0] + ("" === e ? "" : e + "\n ") + " " + t.join(",\n  ") + " " + n[1] : n[0] + e + " " + t.join(", ") + " " + n[1]
                }(c, l, h)) : h[0] + l + h[1]
            }
            function p(t) {
                return "[" + Error.prototype.toString.call(t) + "]"
            }
            function y(t, e, n, r, o, i) {
                var s, a, u;
                if ((u = Object.getOwnPropertyDescriptor(e, o) || {
                    value: e[o]
                }).get ? a = u.set ? t.stylize("[Getter/Setter]", "special") : t.stylize("[Getter]", "special") : u.set && (a = t.stylize("[Setter]", "special")),
                O(r, o) || (s = "[" + o + "]"),
                a || (t.seen.indexOf(u.value) < 0 ? (a = b(n) ? d(t, u.value, null) : d(t, u.value, n - 1)).indexOf("\n") > -1 && (a = i ? a.split("\n").map((function(t) {
                    return "  " + t
                }
                )).join("\n").slice(2) : "\n" + a.split("\n").map((function(t) {
                    return "   " + t
                }
                )).join("\n")) : a = t.stylize("[Circular]", "special")),
                M(s)) {
                    if (i && o.match(/^\d+$/))
                        return a;
                    (s = JSON.stringify("" + o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.slice(1, -1),
                    s = t.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"),
                    s = t.stylize(s, "string"))
                }
                return s + ": " + a
            }
            function g(t) {
                return Array.isArray(t)
            }
            function m(t) {
                return "boolean" == typeof t
            }
            function b(t) {
                return null === t
            }
            function w(t) {
                return "number" == typeof t
            }
            function v(t) {
                return "string" == typeof t
            }
            function M(t) {
                return void 0 === t
            }
            function x(t) {
                return j(t) && "[object RegExp]" === _(t)
            }
            function j(t) {
                return "object" == typeof t && null !== t
            }
            function I(t) {
                return j(t) && "[object Date]" === _(t)
            }
            function A(t) {
                return j(t) && ("[object Error]" === _(t) || t instanceof Error)
            }
            function S(t) {
                return "function" == typeof t
            }
            function _(t) {
                return Object.prototype.toString.call(t)
            }
            function E(t) {
                return t < 10 ? "0" + t.toString(10) : t.toString(10)
            }
            e.debuglog = function(t) {
                if (t = t.toUpperCase(),
                !a[t])
                    if (u.test(t)) {
                        var n = r.pid;
                        a[t] = function() {
                            var r = e.format.apply(e, arguments);
                            o.error("%s %d: %s", t, n, r)
                        }
                    } else
                        a[t] = function() {}
                        ;
                return a[t]
            }
            ,
            e.inspect = l,
            l.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
            },
            l.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            },
            e.types = n("../../../node_modules/util/support/types.js"),
            e.isArray = g,
            e.isBoolean = m,
            e.isNull = b,
            e.isNullOrUndefined = function(t) {
                return null == t
            }
            ,
            e.isNumber = w,
            e.isString = v,
            e.isSymbol = function(t) {
                return "symbol" == typeof t
            }
            ,
            e.isUndefined = M,
            e.isRegExp = x,
            e.types.isRegExp = x,
            e.isObject = j,
            e.isDate = I,
            e.types.isDate = I,
            e.isError = A,
            e.types.isNativeError = A,
            e.isFunction = S,
            e.isPrimitive = function(t) {
                return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" == typeof t || void 0 === t
            }
            ,
            e.isBuffer = n("../../../node_modules/util/support/isBufferBrowser.js");
            var k = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            function O(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            }
            e.log = function() {
                var t, n;
                o.log("%s - %s", (n = [E((t = new Date).getHours()), E(t.getMinutes()), E(t.getSeconds())].join(":"),
                [t.getDate(), k[t.getMonth()], n].join(" ")), e.format.apply(e, arguments))
            }
            ,
            e.inherits = n("../../../node_modules/inherits/inherits_browser.js"),
            e._extend = function(t, e) {
                if (!e || !j(e))
                    return t;
                for (var n = Object.keys(e), r = n.length; r--; )
                    t[n[r]] = e[n[r]];
                return t
            }
            ;
            var L = "undefined" != typeof Symbol ? Symbol("util.promisify.custom") : void 0;
            function T(t, e) {
                if (!t) {
                    var n = new Error("Promise was rejected with a falsy value");
                    n.reason = t,
                    t = n
                }
                return e(t)
            }
            e.promisify = function(t) {
                if ("function" != typeof t)
                    throw new TypeError('The "original" argument must be of type Function');
                if (L && t[L]) {
                    var e;
                    if ("function" != typeof (e = t[L]))
                        throw new TypeError('The "util.promisify.custom" argument must be of type Function');
                    return Object.defineProperty(e, L, {
                        value: e,
                        enumerable: !1,
                        writable: !1,
                        configurable: !0
                    }),
                    e
                }
                function e() {
                    for (var e, n, r = new Promise((function(t, r) {
                        e = t,
                        n = r
                    }
                    )), o = [], i = 0; i < arguments.length; i++)
                        o.push(arguments[i]);
                    o.push((function(t, r) {
                        t ? n(t) : e(r)
                    }
                    ));
                    try {
                        t.apply(this, o)
                    } catch (t) {
                        n(t)
                    }
                    return r
                }
                return Object.setPrototypeOf(e, Object.getPrototypeOf(t)),
                L && Object.defineProperty(e, L, {
                    value: e,
                    enumerable: !1,
                    writable: !1,
                    configurable: !0
                }),
                Object.defineProperties(e, i(t))
            }
            ,
            e.promisify.custom = L,
            e.callbackify = function(t) {
                if ("function" != typeof t)
                    throw new TypeError('The "original" argument must be of type Function');
                function e() {
                    for (var e = [], n = 0; n < arguments.length; n++)
                        e.push(arguments[n]);
                    var o = e.pop();
                    if ("function" != typeof o)
                        throw new TypeError("The last argument must be of type Function");
                    var i = this
                      , s = function() {
                        return o.apply(i, arguments)
                    };
                    t.apply(this, e).then((function(t) {
                        r.nextTick(s.bind(null, null, t))
                    }
                    ), (function(t) {
                        r.nextTick(T.bind(null, t, s))
                    }
                    ))
                }
                return Object.setPrototypeOf(e, Object.getPrototypeOf(t)),
                Object.defineProperties(e, i(t)),
                e
            }
        }
        ,
        "../../../node_modules/uuid/dist/esm-browser/index.js": (t,e,n)=>{
            "use strict";
            n.d(e, {
                v4: ()=>r.Z
            });
            var r = n("../../../node_modules/uuid/dist/esm-browser/v4.js")
        }
        ,
        "../../../node_modules/uuid/dist/esm-browser/rng.js": (t,e,n)=>{
            "use strict";
            var r;
            n.d(e, {
                Z: ()=>i
            });
            var o = new Uint8Array(16);
            function i() {
                if (!r && !(r = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto)))
                    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
                return r(o)
            }
        }
        ,
        "../../../node_modules/uuid/dist/esm-browser/stringify.js": (t,e,n)=>{
            "use strict";
            n.d(e, {
                Z: ()=>s
            });
            for (var r = n("../../../node_modules/uuid/dist/esm-browser/validate.js"), o = [], i = 0; i < 256; ++i)
                o.push((i + 256).toString(16).substr(1));
            const s = function(t) {
                var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0
                  , n = (o[t[e + 0]] + o[t[e + 1]] + o[t[e + 2]] + o[t[e + 3]] + "-" + o[t[e + 4]] + o[t[e + 5]] + "-" + o[t[e + 6]] + o[t[e + 7]] + "-" + o[t[e + 8]] + o[t[e + 9]] + "-" + o[t[e + 10]] + o[t[e + 11]] + o[t[e + 12]] + o[t[e + 13]] + o[t[e + 14]] + o[t[e + 15]]).toLowerCase();
                if (!(0,
                r.Z)(n))
                    throw TypeError("Stringified UUID is invalid");
                return n
            }
        }
        ,
        "../../../node_modules/uuid/dist/esm-browser/v4.js": (t,e,n)=>{
            "use strict";
            n.d(e, {
                Z: ()=>i
            });
            var r = n("../../../node_modules/uuid/dist/esm-browser/rng.js")
              , o = n("../../../node_modules/uuid/dist/esm-browser/stringify.js");
            const i = function(t, e, n) {
                var i = (t = t || {}).random || (t.rng || r.Z)();
                if (i[6] = 15 & i[6] | 64,
                i[8] = 63 & i[8] | 128,
                e) {
                    n = n || 0;
                    for (var s = 0; s < 16; ++s)
                        e[n + s] = i[s];
                    return e
                }
                return (0,
                o.Z)(i)
            }
        }
        ,
        "../../../node_modules/uuid/dist/esm-browser/validate.js": (t,e,n)=>{
            "use strict";
            n.d(e, {
                Z: ()=>o
            });
            const r = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
              , o = function(t) {
                return "string" == typeof t && r.test(t)
            }
        }
        ,
        "../../../node_modules/which-typed-array/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/for-each/index.js")
              , o = n("../../../node_modules/available-typed-arrays/index.js")
              , i = n("../../../node_modules/call-bind/index.js")
              , s = n("../../../node_modules/call-bind/callBound.js")
              , a = n("../../../node_modules/gopd/index.js")
              , u = s("Object.prototype.toString")
              , c = n("../../../node_modules/has-tostringtag/shams.js")()
              , l = "undefined" == typeof globalThis ? n.g : globalThis
              , f = o()
              , h = s("String.prototype.slice")
              , d = Object.getPrototypeOf
              , p = s("Array.prototype.indexOf", !0) || function(t, e) {
                for (var n = 0; n < t.length; n += 1)
                    if (t[n] === e)
                        return n;
                return -1
            }
              , y = {
                __proto__: null
            };
            r(f, c && a && d ? function(t) {
                var e = new l[t];
                if (Symbol.toStringTag in e) {
                    var n = d(e)
                      , r = a(n, Symbol.toStringTag);
                    if (!r) {
                        var o = d(n);
                        r = a(o, Symbol.toStringTag)
                    }
                    y["$" + t] = i(r.get)
                }
            }
            : function(t) {
                var e = new l[t]
                  , n = e.slice || e.set;
                n && (y["$" + t] = i(n))
            }
            ),
            t.exports = function(t) {
                if (!t || "object" != typeof t)
                    return !1;
                if (!c) {
                    var e = h(u(t), 8, -1);
                    return p(f, e) > -1 ? e : "Object" === e && function(t) {
                        var e = !1;
                        return r(y, (function(n, r) {
                            if (!e)
                                try {
                                    n(t),
                                    e = h(r, 1)
                                } catch (t) {}
                        }
                        )),
                        e
                    }(t)
                }
                return a ? function(t) {
                    var e = !1;
                    return r(y, (function(n, r) {
                        if (!e)
                            try {
                                "$" + n(t) === r && (e = h(r, 1))
                            } catch (t) {}
                    }
                    )),
                    e
                }(t) : null
            }
        }
        ,
        "?6876": ()=>{}
        ,
        "../../../node_modules/@babel/runtime/helpers/assertThisInitialized.js": t=>{
            t.exports = function(t) {
                if (void 0 === t)
                    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return t
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/asyncToGenerator.js": t=>{
            function e(t, e, n, r, o, i, s) {
                try {
                    var a = t[i](s)
                      , u = a.value
                } catch (t) {
                    return void n(t)
                }
                a.done ? e(u) : Promise.resolve(u).then(r, o)
            }
            t.exports = function(t) {
                return function() {
                    var n = this
                      , r = arguments;
                    return new Promise((function(o, i) {
                        var s = t.apply(n, r);
                        function a(t) {
                            e(s, o, i, a, u, "next", t)
                        }
                        function u(t) {
                            e(s, o, i, a, u, "throw", t)
                        }
                        a(void 0)
                    }
                    ))
                }
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/classCallCheck.js": t=>{
            t.exports = function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/createClass.js": (t,e,n)=>{
            var r = n("../../../node_modules/@babel/runtime/helpers/toPropertyKey.js");
            function o(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var o = e[n];
                    o.enumerable = o.enumerable || !1,
                    o.configurable = !0,
                    "value"in o && (o.writable = !0),
                    Object.defineProperty(t, r(o.key), o)
                }
            }
            t.exports = function(t, e, n) {
                return e && o(t.prototype, e),
                n && o(t, n),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/getPrototypeOf.js": t=>{
            function e(n) {
                return t.exports = e = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }
                ,
                t.exports.__esModule = !0,
                t.exports.default = t.exports,
                e(n)
            }
            t.exports = e,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/inherits.js": (t,e,n)=>{
            var r = n("../../../node_modules/@babel/runtime/helpers/setPrototypeOf.js");
            t.exports = function(t, e) {
                if ("function" != typeof e && null !== e)
                    throw new TypeError("Super expression must either be null or a function");
                t.prototype = Object.create(e && e.prototype, {
                    constructor: {
                        value: t,
                        writable: !0,
                        configurable: !0
                    }
                }),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                e && r(t, e)
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/interopRequireDefault.js": t=>{
            t.exports = function(t) {
                return t && t.__esModule ? t : {
                    default: t
                }
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js": (t,e,n)=>{
            var r = n("../../../node_modules/@babel/runtime/helpers/typeof.js").default
              , o = n("../../../node_modules/@babel/runtime/helpers/assertThisInitialized.js");
            t.exports = function(t, e) {
                if (e && ("object" === r(e) || "function" == typeof e))
                    return e;
                if (void 0 !== e)
                    throw new TypeError("Derived constructors may only return object or undefined");
                return o(t)
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/regeneratorRuntime.js": (t,e,n)=>{
            var r = n("../../../node_modules/@babel/runtime/helpers/typeof.js").default;
            function o() {
                "use strict";
                t.exports = o = function() {
                    return n
                }
                ,
                t.exports.__esModule = !0,
                t.exports.default = t.exports;
                var e, n = {}, i = Object.prototype, s = i.hasOwnProperty, a = Object.defineProperty || function(t, e, n) {
                    t[e] = n.value
                }
                , u = "function" == typeof Symbol ? Symbol : {}, c = u.iterator || "@@iterator", l = u.asyncIterator || "@@asyncIterator", f = u.toStringTag || "@@toStringTag";
                function h(t, e, n) {
                    return Object.defineProperty(t, e, {
                        value: n,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }),
                    t[e]
                }
                try {
                    h({}, "")
                } catch (e) {
                    h = function(t, e, n) {
                        return t[e] = n
                    }
                }
                function d(t, e, n, r) {
                    var o = e && e.prototype instanceof v ? e : v
                      , i = Object.create(o.prototype)
                      , s = new B(r || []);
                    return a(i, "_invoke", {
                        value: k(t, n, s)
                    }),
                    i
                }
                function p(t, e, n) {
                    try {
                        return {
                            type: "normal",
                            arg: t.call(e, n)
                        }
                    } catch (t) {
                        return {
                            type: "throw",
                            arg: t
                        }
                    }
                }
                n.wrap = d;
                var y = "suspendedStart"
                  , g = "suspendedYield"
                  , m = "executing"
                  , b = "completed"
                  , w = {};
                function v() {}
                function M() {}
                function x() {}
                var j = {};
                h(j, c, (function() {
                    return this
                }
                ));
                var I = Object.getPrototypeOf
                  , A = I && I(I(N([])));
                A && A !== i && s.call(A, c) && (j = A);
                var S = x.prototype = v.prototype = Object.create(j);
                function _(t) {
                    ["next", "throw", "return"].forEach((function(e) {
                        h(t, e, (function(t) {
                            return this._invoke(e, t)
                        }
                        ))
                    }
                    ))
                }
                function E(t, e) {
                    function n(o, i, a, u) {
                        var c = p(t[o], t, i);
                        if ("throw" !== c.type) {
                            var l = c.arg
                              , f = l.value;
                            return f && "object" == r(f) && s.call(f, "__await") ? e.resolve(f.__await).then((function(t) {
                                n("next", t, a, u)
                            }
                            ), (function(t) {
                                n("throw", t, a, u)
                            }
                            )) : e.resolve(f).then((function(t) {
                                l.value = t,
                                a(l)
                            }
                            ), (function(t) {
                                return n("throw", t, a, u)
                            }
                            ))
                        }
                        u(c.arg)
                    }
                    var o;
                    a(this, "_invoke", {
                        value: function(t, r) {
                            function i() {
                                return new e((function(e, o) {
                                    n(t, r, e, o)
                                }
                                ))
                            }
                            return o = o ? o.then(i, i) : i()
                        }
                    })
                }
                function k(t, n, r) {
                    var o = y;
                    return function(i, s) {
                        if (o === m)
                            throw Error("Generator is already running");
                        if (o === b) {
                            if ("throw" === i)
                                throw s;
                            return {
                                value: e,
                                done: !0
                            }
                        }
                        for (r.method = i,
                        r.arg = s; ; ) {
                            var a = r.delegate;
                            if (a) {
                                var u = O(a, r);
                                if (u) {
                                    if (u === w)
                                        continue;
                                    return u
                                }
                            }
                            if ("next" === r.method)
                                r.sent = r._sent = r.arg;
                            else if ("throw" === r.method) {
                                if (o === y)
                                    throw o = b,
                                    r.arg;
                                r.dispatchException(r.arg)
                            } else
                                "return" === r.method && r.abrupt("return", r.arg);
                            o = m;
                            var c = p(t, n, r);
                            if ("normal" === c.type) {
                                if (o = r.done ? b : g,
                                c.arg === w)
                                    continue;
                                return {
                                    value: c.arg,
                                    done: r.done
                                }
                            }
                            "throw" === c.type && (o = b,
                            r.method = "throw",
                            r.arg = c.arg)
                        }
                    }
                }
                function O(t, n) {
                    var r = n.method
                      , o = t.iterator[r];
                    if (o === e)
                        return n.delegate = null,
                        "throw" === r && t.iterator.return && (n.method = "return",
                        n.arg = e,
                        O(t, n),
                        "throw" === n.method) || "return" !== r && (n.method = "throw",
                        n.arg = new TypeError("The iterator does not provide a '" + r + "' method")),
                        w;
                    var i = p(o, t.iterator, n.arg);
                    if ("throw" === i.type)
                        return n.method = "throw",
                        n.arg = i.arg,
                        n.delegate = null,
                        w;
                    var s = i.arg;
                    return s ? s.done ? (n[t.resultName] = s.value,
                    n.next = t.nextLoc,
                    "return" !== n.method && (n.method = "next",
                    n.arg = e),
                    n.delegate = null,
                    w) : s : (n.method = "throw",
                    n.arg = new TypeError("iterator result is not an object"),
                    n.delegate = null,
                    w)
                }
                function L(t) {
                    var e = {
                        tryLoc: t[0]
                    };
                    1 in t && (e.catchLoc = t[1]),
                    2 in t && (e.finallyLoc = t[2],
                    e.afterLoc = t[3]),
                    this.tryEntries.push(e)
                }
                function T(t) {
                    var e = t.completion || {};
                    e.type = "normal",
                    delete e.arg,
                    t.completion = e
                }
                function B(t) {
                    this.tryEntries = [{
                        tryLoc: "root"
                    }],
                    t.forEach(L, this),
                    this.reset(!0)
                }
                function N(t) {
                    if (t || "" === t) {
                        var n = t[c];
                        if (n)
                            return n.call(t);
                        if ("function" == typeof t.next)
                            return t;
                        if (!isNaN(t.length)) {
                            var o = -1
                              , i = function n() {
                                for (; ++o < t.length; )
                                    if (s.call(t, o))
                                        return n.value = t[o],
                                        n.done = !1,
                                        n;
                                return n.value = e,
                                n.done = !0,
                                n
                            };
                            return i.next = i
                        }
                    }
                    throw new TypeError(r(t) + " is not iterable")
                }
                return M.prototype = x,
                a(S, "constructor", {
                    value: x,
                    configurable: !0
                }),
                a(x, "constructor", {
                    value: M,
                    configurable: !0
                }),
                M.displayName = h(x, f, "GeneratorFunction"),
                n.isGeneratorFunction = function(t) {
                    var e = "function" == typeof t && t.constructor;
                    return !!e && (e === M || "GeneratorFunction" === (e.displayName || e.name))
                }
                ,
                n.mark = function(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, x) : (t.__proto__ = x,
                    h(t, f, "GeneratorFunction")),
                    t.prototype = Object.create(S),
                    t
                }
                ,
                n.awrap = function(t) {
                    return {
                        __await: t
                    }
                }
                ,
                _(E.prototype),
                h(E.prototype, l, (function() {
                    return this
                }
                )),
                n.AsyncIterator = E,
                n.async = function(t, e, r, o, i) {
                    void 0 === i && (i = Promise);
                    var s = new E(d(t, e, r, o),i);
                    return n.isGeneratorFunction(e) ? s : s.next().then((function(t) {
                        return t.done ? t.value : s.next()
                    }
                    ))
                }
                ,
                _(S),
                h(S, f, "Generator"),
                h(S, c, (function() {
                    return this
                }
                )),
                h(S, "toString", (function() {
                    return "[object Generator]"
                }
                )),
                n.keys = function(t) {
                    var e = Object(t)
                      , n = [];
                    for (var r in e)
                        n.push(r);
                    return n.reverse(),
                    function t() {
                        for (; n.length; ) {
                            var r = n.pop();
                            if (r in e)
                                return t.value = r,
                                t.done = !1,
                                t
                        }
                        return t.done = !0,
                        t
                    }
                }
                ,
                n.values = N,
                B.prototype = {
                    constructor: B,
                    reset: function(t) {
                        if (this.prev = 0,
                        this.next = 0,
                        this.sent = this._sent = e,
                        this.done = !1,
                        this.delegate = null,
                        this.method = "next",
                        this.arg = e,
                        this.tryEntries.forEach(T),
                        !t)
                            for (var n in this)
                                "t" === n.charAt(0) && s.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = e)
                    },
                    stop: function() {
                        this.done = !0;
                        var t = this.tryEntries[0].completion;
                        if ("throw" === t.type)
                            throw t.arg;
                        return this.rval
                    },
                    dispatchException: function(t) {
                        if (this.done)
                            throw t;
                        var n = this;
                        function r(r, o) {
                            return a.type = "throw",
                            a.arg = t,
                            n.next = r,
                            o && (n.method = "next",
                            n.arg = e),
                            !!o
                        }
                        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                            var i = this.tryEntries[o]
                              , a = i.completion;
                            if ("root" === i.tryLoc)
                                return r("end");
                            if (i.tryLoc <= this.prev) {
                                var u = s.call(i, "catchLoc")
                                  , c = s.call(i, "finallyLoc");
                                if (u && c) {
                                    if (this.prev < i.catchLoc)
                                        return r(i.catchLoc, !0);
                                    if (this.prev < i.finallyLoc)
                                        return r(i.finallyLoc)
                                } else if (u) {
                                    if (this.prev < i.catchLoc)
                                        return r(i.catchLoc, !0)
                                } else {
                                    if (!c)
                                        throw Error("try statement without catch or finally");
                                    if (this.prev < i.finallyLoc)
                                        return r(i.finallyLoc)
                                }
                            }
                        }
                    },
                    abrupt: function(t, e) {
                        for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                            var r = this.tryEntries[n];
                            if (r.tryLoc <= this.prev && s.call(r, "finallyLoc") && this.prev < r.finallyLoc) {
                                var o = r;
                                break
                            }
                        }
                        o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
                        var i = o ? o.completion : {};
                        return i.type = t,
                        i.arg = e,
                        o ? (this.method = "next",
                        this.next = o.finallyLoc,
                        w) : this.complete(i)
                    },
                    complete: function(t, e) {
                        if ("throw" === t.type)
                            throw t.arg;
                        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg,
                        this.method = "return",
                        this.next = "end") : "normal" === t.type && e && (this.next = e),
                        w
                    },
                    finish: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var n = this.tryEntries[e];
                            if (n.finallyLoc === t)
                                return this.complete(n.completion, n.afterLoc),
                                T(n),
                                w
                        }
                    },
                    catch: function(t) {
                        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                            var n = this.tryEntries[e];
                            if (n.tryLoc === t) {
                                var r = n.completion;
                                if ("throw" === r.type) {
                                    var o = r.arg;
                                    T(n)
                                }
                                return o
                            }
                        }
                        throw Error("illegal catch attempt")
                    },
                    delegateYield: function(t, n, r) {
                        return this.delegate = {
                            iterator: N(t),
                            resultName: n,
                            nextLoc: r
                        },
                        "next" === this.method && (this.arg = e),
                        w
                    }
                },
                n
            }
            t.exports = o,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/setPrototypeOf.js": t=>{
            function e(n, r) {
                return t.exports = e = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
                    return t.__proto__ = e,
                    t
                }
                ,
                t.exports.__esModule = !0,
                t.exports.default = t.exports,
                e(n, r)
            }
            t.exports = e,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/toPrimitive.js": (t,e,n)=>{
            var r = n("../../../node_modules/@babel/runtime/helpers/typeof.js").default;
            t.exports = function(t, e) {
                if ("object" != r(t) || !t)
                    return t;
                var n = t[Symbol.toPrimitive];
                if (void 0 !== n) {
                    var o = n.call(t, e || "default");
                    if ("object" != r(o))
                        return o;
                    throw new TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === e ? String : Number)(t)
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/toPropertyKey.js": (t,e,n)=>{
            var r = n("../../../node_modules/@babel/runtime/helpers/typeof.js").default
              , o = n("../../../node_modules/@babel/runtime/helpers/toPrimitive.js");
            t.exports = function(t) {
                var e = o(t, "string");
                return "symbol" == r(e) ? e : e + ""
            }
            ,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/helpers/typeof.js": t=>{
            function e(n) {
                return t.exports = e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                t.exports.__esModule = !0,
                t.exports.default = t.exports,
                e(n)
            }
            t.exports = e,
            t.exports.__esModule = !0,
            t.exports.default = t.exports
        }
        ,
        "../../../node_modules/@babel/runtime/regenerator/index.js": (t,e,n)=>{
            var r = n("../../../node_modules/@babel/runtime/helpers/regeneratorRuntime.js")();
            t.exports = r;
            try {
                regeneratorRuntime = r
            } catch (t) {
                "object" == typeof globalThis ? globalThis.regeneratorRuntime = r : Function("r", "regeneratorRuntime = r")(r)
            }
        }
        ,
        "../../../node_modules/available-typed-arrays/index.js": (t,e,n)=>{
            "use strict";
            var r = n("../../../node_modules/possible-typed-array-names/index.js")
              , o = "undefined" == typeof globalThis ? n.g : globalThis;
            t.exports = function() {
                for (var t = [], e = 0; e < r.length; e++)
                    "function" == typeof o[r[e]] && (t[t.length] = r[e]);
                return t
            }
        }
        ,
        "../../../node_modules/@solana/wallet-standard-features/lib/esm/signAndSendTransaction.js": (t,e,n)=>{
            "use strict";
            n.d(e, {
                G: ()=>r
            });
            const r = "solana:signAndSendTransaction"
        }
        ,
        "../../../node_modules/@solana/wallet-standard-features/lib/esm/signMessage.js": (t,e,n)=>{
            "use strict";
            n.d(e, {
                g: ()=>r
            });
            const r = "solana:signMessage"
        }
        ,
        "../../../node_modules/@solana/wallet-standard-features/lib/esm/signTransaction.js": (t,e,n)=>{
            "use strict";
            n.d(e, {
                R: ()=>r
            });
            const r = "solana:signTransaction"
        }
    }, r = {};
    function o(t) {
        var e = r[t];
        if (void 0 !== e)
            return e.exports;
        var i = r[t] = {
            id: t,
            loaded: !1,
            exports: {}
        };
        return n[t].call(i.exports, i, i.exports, o),
        i.loaded = !0,
        i.exports
    }
    o.m = n,
    o.n = t=>{
        var e = t && t.__esModule ? ()=>t.default : ()=>t;
        return o.d(e, {
            a: e
        }),
        e
    }
    ,
    o.d = (t,e)=>{
        for (var n in e)
            o.o(e, n) && !o.o(t, n) && Object.defineProperty(t, n, {
                enumerable: !0,
                get: e[n]
            })
    }
    ,
    o.f = {},
    o.e = t=>Promise.all(Object.keys(o.f).reduce(((e,n)=>(o.f[n](t, e),
    e)), [])),
    o.u = t=>t + ".js",
    o.g = function() {
        if ("object" == typeof globalThis)
            return globalThis;
        try {
            return this || new Function("return this")()
        } catch (t) {
            if ("object" == typeof window)
                return window
        }
    }(),
    o.o = (t,e)=>Object.prototype.hasOwnProperty.call(t, e),
    t = {},
    e = "@solflare/extension:",
    o.l = (n,r,i,s)=>{
        if (t[n])
            t[n].push(r);
        else {
            var a, u;
            if (void 0 !== i)
                for (var c = document.getElementsByTagName("script"), l = 0; l < c.length; l++) {
                    var f = c[l];
                    if (f.getAttribute("src") == n || f.getAttribute("data-webpack") == e + i) {
                        a = f;
                        break
                    }
                }
            a || (u = !0,
            (a = document.createElement("script")).charset = "utf-8",
            a.timeout = 120,
            o.nc && a.setAttribute("nonce", o.nc),
            a.setAttribute("data-webpack", e + i),
            a.src = n),
            t[n] = [r];
            var h = (e,r)=>{
                a.onerror = a.onload = null,
                clearTimeout(d);
                var o = t[n];
                if (delete t[n],
                a.parentNode && a.parentNode.removeChild(a),
                o && o.forEach((t=>t(r))),
                e)
                    return e(r)
            }
              , d = setTimeout(h.bind(null, void 0, {
                type: "timeout",
                target: a
            }), 12e4);
            a.onerror = h.bind(null, a.onerror),
            a.onload = h.bind(null, a.onload),
            u && document.head.appendChild(a)
        }
    }
    ,
    o.r = t=>{
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    o.nmd = t=>(t.paths = [],
    t.children || (t.children = []),
    t),
    o.p = "./",
    (()=>{
        var t = {
            inpage: 0
        };
        o.f.j = (e,n)=>{
            var r = o.o(t, e) ? t[e] : void 0;
            if (0 !== r)
                if (r)
                    n.push(r[2]);
                else {
                    var i = new Promise(((n,o)=>r = t[e] = [n, o]));
                    n.push(r[2] = i);
                    var s = o.p + o.u(e)
                      , a = new Error;
                    o.l(s, (n=>{
                        if (o.o(t, e) && (0 !== (r = t[e]) && (t[e] = void 0),
                        r)) {
                            var i = n && ("load" === n.type ? "missing" : n.type)
                              , s = n && n.target && n.target.src;
                            a.message = "Loading chunk " + e + " failed.\n(" + i + ": " + s + ")",
                            a.name = "ChunkLoadError",
                            a.type = i,
                            a.request = s,
                            r[1](a)
                        }
                    }
                    ), "chunk-" + e, e)
                }
        }
        ;
        var e = (e,n)=>{
            var r, i, s = n[0], a = n[1], u = n[2], c = 0;
            if (s.some((e=>0 !== t[e]))) {
                for (r in a)
                    o.o(a, r) && (o.m[r] = a[r]);
                u && u(o)
            }
            for (e && e(n); c < s.length; c++)
                i = s[c],
                o.o(t, i) && t[i] && t[i][0](),
                t[i] = 0
        }
          , n = self.webpackChunk_solflare_extension = self.webpackChunk_solflare_extension || [];
        n.forEach(e.bind(null, 0)),
        n.push = e.bind(null, n.push.bind(n))
    }
    )(),
    o("../../../node_modules/regenerator-runtime/runtime.js"),
    o("./src/inpage.ts")
}
)();
