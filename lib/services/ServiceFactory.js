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
import { BaseServiceFactory, TaxonomyHidden, TaxonomyHiddenListService, User, UserService } from "spfx-base-data-services";
import { FakeTerm } from "../models/taxonomy/FakeTerm";
import { Asset } from "../models/sp/Asset";
import { FakeTermsService } from "./taxonomy/FakeTermsService";
import { AssetsService } from "./sp/AssetsService";
var ServiceFactory = /** @class */ (function (_super) {
    __extends(ServiceFactory, _super);
    function ServiceFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServiceFactory.prototype.create = function (modelName) {
        var result = null;
        switch (modelName) {
            /* Base */
            case TaxonomyHidden["name"]:
                result = new TaxonomyHiddenListService();
                break;
            case User["name"]:
                result = new UserService();
                break;
            case FakeTerm["name"]:
                result = new FakeTermsService();
                break;
            case Asset["name"]:
                result = new AssetsService();
                break;
            default:
                throw Error("error");
        }
        return result;
    };
    ServiceFactory.prototype.getItemTypeByName = function (typeName) {
        var result = _super.prototype.getItemTypeByName.call(this, typeName);
        if (!result) {
            switch (typeName) {
                /* Base */
                case TaxonomyHidden["name"]:
                    result = TaxonomyHidden;
                    break;
                case User["name"]:
                    result = User;
                    break;
                case FakeTerm["name"]:
                    result = FakeTerm;
                    break;
                case Asset["name"]:
                    result = Asset;
                    break;
                default:
                    throw Error("error");
            }
        }
        return result;
    };
    return ServiceFactory;
}(BaseServiceFactory));
export { ServiceFactory };
//# sourceMappingURL=ServiceFactory.js.map