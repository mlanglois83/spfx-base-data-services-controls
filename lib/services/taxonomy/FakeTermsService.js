var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
import { BaseTermsetService } from "spfx-base-data-services";
import { FakeTerm } from "../../models/taxonomy/FakeTerm";
import { find } from "@microsoft/sp-lodash-subset";
import { Guid } from "@microsoft/sp-core-library";
var FakeTermsService = /** @class */ (function (_super) {
    __extends(FakeTermsService, _super);
    function FakeTermsService() {
        var _this = _super.call(this, FakeTerm, "fake", "FakeTerms") || this;
        _this._terms = null;
        return _this;
    }
    Object.defineProperty(FakeTermsService.prototype, "terms", {
        get: function () {
            var _a;
            if (!this._terms) {
                this._terms = [];
                var levels = Math.random() * 5;
                for (var level = 0; level < levels; level++) {
                    var term = this.generateTerm(level + 1);
                    this._terms.push(term);
                    (_a = this._terms).push.apply(_a, this.generateSubTerms(term, levels - level + 1));
                }
            }
            return this._terms;
        },
        enumerable: false,
        configurable: true
    });
    FakeTermsService.prototype.generateTerm = function (index, parent) {
        return new FakeTerm({
            Name: "Term-" + index.toString(),
            Id: "/Guid(" + Guid.newGuid().toString() + ")/",
            PathOfTerm: (parent ? parent.path + ";" : "") + "Term-" + index.toString(),
            IsDeprecated: false
        });
    };
    FakeTermsService.prototype.generateSubTerms = function (term, sublevels) {
        var result = [];
        if (sublevels > 0) {
            var termsCount = Math.random() * 10;
            for (var index = 0; index < termsCount; index++) {
                var newterm = this.generateTerm(index + 1, term);
                result.push(newterm);
                result.push.apply(result, this.generateSubTerms(newterm, sublevels - 1));
            }
        }
        return result;
    };
    FakeTermsService.prototype.getAll_Internal = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.terms];
            });
        });
    };
    FakeTermsService.prototype.getItemById_Internal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, find(this.terms, function (t) { return t.id === id; })];
            });
        });
    };
    FakeTermsService.prototype.getItemsById_Internal = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.terms.filter(function (t) { return ids.indexOf(t.id) > -1; })];
            });
        });
    };
    return FakeTermsService;
}(BaseTermsetService));
export { FakeTermsService };
//# sourceMappingURL=FakeTermsService.js.map