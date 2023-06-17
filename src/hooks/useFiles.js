"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// eslint-disable-next-line import/no-unresolved
var june17_xlsx_url_1 = require("../data/june17.xlsx?url");
var react_1 = require("react");
var xlsx_1 = require("xlsx");
var sanityTranformer_1 = require("../data/sanityTranformer");
var useFiles = function () {
    var _a = (0, react_1.useState)([]), data = _a[0], setData = _a[1];
    var _b = (0, react_1.useState)(null), error = _b[0], setError = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    (0, react_1.useEffect)(function () {
        try {
            ;
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                var f, wb, ws, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setLoading(true);
                            return [4 /*yield*/, fetch(june17_xlsx_url_1["default"])];
                        case 1: return [4 /*yield*/, (_a.sent()).arrayBuffer()];
                        case 2:
                            f = _a.sent();
                            wb = (0, xlsx_1.read)(f) // parse the array buffer
                            ;
                            ws = wb.Sheets[wb.SheetNames[0]] // get the first worksheet
                            ;
                            data = xlsx_1.utils.sheet_to_json(ws) // generate objects
                            ;
                            return [4 /*yield*/, setData(data)]; // update state
                        case 3:
                            _a.sent(); // update state
                            (0, sanityTranformer_1.readAndTransformData)(data);
                            setLoading(false);
                            return [2 /*return*/];
                    }
                });
            }); })();
        }
        catch (error) {
            console.log(error);
            setLoading(false);
            setError(error);
        }
    }, []);
    return { data: data, error: error, loading: loading };
};
exports["default"] = useFiles;
