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
import { BaseFileService } from "spfx-base-data-services";
import { Asset } from "../../models/sp/Asset";
var AssetsService = /** @class */ (function (_super) {
    __extends(AssetsService, _super);
    function AssetsService() {
        return _super.call(this, Asset, "/SiteAssets", "Assets") || this;
    }
    return AssetsService;
}(BaseFileService));
export { AssetsService };
//# sourceMappingURL=AssetsService.js.map