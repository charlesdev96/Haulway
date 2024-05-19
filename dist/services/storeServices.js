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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStoreByName = exports.createStore = void 0;
const model_1 = require("../model");
const createStore = (input) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.StoreModel.create(input);
});
exports.createStore = createStore;
const findStoreByName = (storeName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield model_1.StoreModel.findOne({ storeName: storeName });
});
exports.findStoreByName = findStoreByName;
