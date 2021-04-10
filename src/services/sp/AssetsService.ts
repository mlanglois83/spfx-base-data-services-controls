import { BaseFileService } from "spfx-base-data-services";
import { Asset } from "@models";
import { Decorators } from "spfx-base-data-services";
const dataService = Decorators.dataService;

@dataService("Asset")
export class AssetsService extends BaseFileService<Asset> {
    constructor() {
        super(Asset, "/SiteAssets");
    }
}