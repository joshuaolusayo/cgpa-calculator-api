"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determinePagination = exports.buildWildcardOptions = exports.buildSortOrderString = exports.buildReturnFieldsString = exports.buildRangeQuery = exports.buildQuery = exports.buildOrQuery = exports.buildNorQuery = exports.buildInQuery = void 0;
var buildQuery = function (options) {
    var sort_condition = options.sort_by
        ? buildSortOrderString(options.sort_by)
        : '';
    var fields_to_return = options.return_only
        ? buildReturnFieldsString(options.return_only)
        : '';
    var count = options.count || false;
    var seek_conditions = {
    // ...buildBooleanQuery(options.bool || '')
    };
    if (options.bool) {
        seek_conditions = __assign({}, buildBooleanQuery(options.bool || ''));
    }
    var _a = determinePagination(options.page, options.population), skip = _a.skip, limit = _a.limit;
    /** Delete sort and return fields */
    delete options.bool;
    delete options.count;
    delete options.page;
    delete options.population;
    delete options.return_only;
    delete options.sort_by;
    Object.keys(options).forEach(function (field) {
        if (field.trim()) {
            var field_value = options[field]
                ? options[field].toString().toLowerCase()
                : '';
            var condition = void 0;
            if (field_value.includes(':')) {
                condition = buildInQuery(field_value);
            }
            else if (field_value.includes('!')) {
                condition = buildNorQuery(field_value);
            }
            else if (field_value.includes('~')) {
                condition = buildRangeQuery(field_value);
            }
            else {
                condition = buildOrQuery(field_value);
            }
            seek_conditions[field] = __assign({}, condition);
        }
    });
    return {
        count: count,
        fields_to_return: fields_to_return,
        limit: limit,
        seek_conditions: seek_conditions,
        skip: skip,
        sort_condition: sort_condition
    };
};
exports.buildQuery = buildQuery;
var buildBooleanQuery = function (value) {
    var values = value.split(',');
    return values.reduce(function (sac, val) {
        var _a;
        var truthiness = true;
        var key = val;
        if (val[0] === '-') {
            truthiness = false;
            key = val.substr(1);
        }
        return __assign(__assign({}, sac), (_a = {}, _a[key] = truthiness, _a));
    }, {});
};
var buildInQuery = function (value) {
    var values = value.split(':');
    return {
        $in: __spreadArray([], values, true)
    };
};
exports.buildInQuery = buildInQuery;
var buildNorQuery = function (value) {
    var values = value.split('!');
    return {
        $nin: __spreadArray([], values.slice(1), true)
    };
};
exports.buildNorQuery = buildNorQuery;
var buildOrQuery = function (value) {
    var values = value.split(',');
    return {
        $in: __spreadArray([], values, true)
    };
};
exports.buildOrQuery = buildOrQuery;
var buildRangeQuery = function (value) {
    var _a = value.split('~'), min = _a[0], max = _a[1];
    return {
        $gte: min ? Number(min) : Number.MIN_SAFE_INTEGER,
        $lte: max ? Number(max) : Number.MAX_SAFE_INTEGER
    };
};
exports.buildRangeQuery = buildRangeQuery;
var buildReturnFieldsString = function (value) {
    return value.replace(/,/gi, ' ');
};
exports.buildReturnFieldsString = buildReturnFieldsString;
var buildSortOrderString = function (value) {
    return value.replace(/,/gi, ' ');
};
exports.buildSortOrderString = buildSortOrderString;
var buildWildcardOptions = function (key_list, value) {
    var keys = key_list.split(',');
    return {
        $or: keys.map(function (key) {
            var _a;
            return (_a = {},
                _a[key] = {
                    $regex: value || '',
                    $options: 'i'
                },
                _a);
        })
    };
};
exports.buildWildcardOptions = buildWildcardOptions;
var determinePagination = function (page, population) {
    if (page === void 0) { page = 0; }
    if (population === void 0) { population = Number.MAX_SAFE_INTEGER; }
    return {
        limit: Number(population),
        skip: page * population
    };
};
exports.determinePagination = determinePagination;
