/* you can make changes in this file and the functions as per your api requirements */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import axios from "axios";
import constants from "../constants";
import root_config from "../root_config";
var _getApiOptions = function (_a, key) {
    var page = _a.page, limit = _a.limit, query = _a.query, searchParam = _a.searchParam, id = _a.id, searchCategories = _a.searchCategories;
    var url = "".concat(root_config.getUrl(key, query, searchParam, searchCategories, id, page, limit));
    return { url: url, method: "GET", headers: root_config.getHeaders(key) };
};
// common function for making third party API calls
// you can modify it as per your third party service response
var _makeApiCall = function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var res, e_1;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                _g.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios(__assign(__assign({}, opts), { timeout: constants.REQ_TIMEOUT }))];
            case 1:
                res = _g.sent();
                return [2 /*return*/, res === null || res === void 0 ? void 0 : res.data];
            case 2:
                e_1 = _g.sent();
                if (((_a = e_1 === null || e_1 === void 0 ? void 0 : e_1.response) === null || _a === void 0 ? void 0 : _a.status) === constants.HTTP_ERROR_CODES.NOT_FOUND) {
                    return [2 /*return*/, {
                            data: {
                                id: (_d = (_c = (_b = e_1 === null || e_1 === void 0 ? void 0 : e_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.title) === null || _d === void 0 ? void 0 : _d.match(constants.EXTRACT_ID_REGX)[0],
                                error: (_f = (_e = e_1 === null || e_1 === void 0 ? void 0 : e_1.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.title,
                            },
                        }];
                }
                console.error(constants.HTTP_ERROR_TEXTS.API_ERROR);
                console.error(e_1);
                throw e_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
// get a particular product
export var getById = function (_a, key) {
    var id = _a.id, query = _a.query;
    return _makeApiCall(_getApiOptions({ id: id, query: query }, key));
};
// get all products and categories
export var getProductAndCategory = function (data, key) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _makeApiCall(_getApiOptions(data, key))];
            case 1:
                response = _a.sent();
                if (root_config.getProductAndCategory) {
                    return [2 /*return*/, root_config.getProductAndCategory(data, response)];
                }
                return [2 /*return*/, response];
        }
    });
}); };
var getByCategoryId = function (data, query, key) {
    return Promise.all(data === null || data === void 0 ? void 0 : data.map(function (category) { return __awaiter(void 0, void 0, void 0, function () {
        var url, categoryResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = root_config.getByCategoryIdUrl(key, query, category);
                    return [4 /*yield*/, _makeApiCall({
                            url: url,
                            method: "GET",
                            headers: root_config.getHeaders(key),
                        })];
                case 1:
                    categoryResponse = _a.sent();
                    categoryResponse.catalogId = category === null || category === void 0 ? void 0 : category.catalogId;
                    categoryResponse.catalogVersionId = category === null || category === void 0 ? void 0 : category.catalogVersionId;
                    return [2 /*return*/, categoryResponse];
            }
        });
    }); }))
        .then(function (response) { return response; })
        .catch(function (err) {
        console.error(err);
    });
};
// get an array of selected products and categories
export var getSelectedProdsAndCats = function (data, key) { return __awaiter(void 0, void 0, void 0, function () {
    var response, idsArr, url;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(root_config.getSeparateProdCat &&
                    root_config.getSeparateProdCat === true)) return [3 /*break*/, 5];
                response = void 0;
                if (!((data === null || data === void 0 ? void 0 : data.query) === "product")) return [3 /*break*/, 2];
                idsArr = data === null || data === void 0 ? void 0 : data["id:in"].split(",").filter(function (id) { return id !== ""; });
                return [4 /*yield*/, Promise.all(idsArr === null || idsArr === void 0 ? void 0 : idsArr.map(function (id) { return getById({ id: id, query: data === null || data === void 0 ? void 0 : data.query }, key); }))];
            case 1:
                response = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, getByCategoryId(key === null || key === void 0 ? void 0 : key.selectedIDs, "category", key)];
            case 3:
                response = _b.sent();
                _b.label = 4;
            case 4: return [2 /*return*/, (_a = {}, _a[root_config.URI_ENDPOINTS[data === null || data === void 0 ? void 0 : data.query]] = response, _a)];
            case 5:
                url = root_config.getSelectedProductandCatUrl(data, key);
                return [2 /*return*/, _makeApiCall({
                        url: url,
                        method: "GET",
                        headers: root_config.getHeaders(key),
                    })];
        }
    });
}); };
// filter products as per categories
export var filterByCategory = function (data, key) {
    return _makeApiCall({
        url: "".concat(root_config.getUrl(key, data === null || data === void 0 ? void 0 : data.query), "?categories:in=").concat(data["categories:in"], "&").concat(root_config.PRODUCT_URL_PARAMS),
        method: "GET",
        headers: root_config.getHeaders(key),
    });
};
