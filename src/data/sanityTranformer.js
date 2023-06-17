"use strict";
exports.__esModule = true;
exports.readAndTransformData = void 0;
var fs_1 = require("fs");
var useFiles_1 = require("../hooks/useFiles");
var transformReunionFile = function (row) {
    var fileCode = row['File Code'].trim();
    var information = row['Information'];
    var setId = row['Set#'];
    var id = "".concat(sanitizeId(fileCode), "-").concat(setId);
    var informationBlock = {
        _type: 'block',
        children: [
            {
                _type: 'span',
                text: information,
                marks: []
            },
        ]
    };
    return {
        _id: sanitizeId(id),
        _type: 'reunionFile',
        title: fileCode,
        description: [informationBlock]
    };
};
var sanitizeId = function (id) {
    return id.replace(/[^a-zA-Z0-9._-]/g, '').replace(/^-/, '');
};
var dataToNdjson = function (data) {
    var ndjson = data.map(function (doc) { return JSON.stringify(doc); }).join('\n');
    fs_1["default"].writeFileSync('./sanityDocuments.ndjson', ndjson);
};
var readAndTransformData = function (data) {
    var documents = [];
    data.forEach(function (document) {
        var documentId = document._id;
        if (!documentId)
            return;
        var transformedDocument = transformReunionFile(document);
        documents.push(transformedDocument);
    });
    return dataToNdjson(documents);
};
exports.readAndTransformData = readAndTransformData;
var data = (0, useFiles_1["default"])().data;
(0, exports.readAndTransformData)(data);
