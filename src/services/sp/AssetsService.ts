import { BaseFileService } from "spfx-base-data-services";
import { Asset } from "../../models/sp/Asset";

export class AssetsService extends BaseFileService<Asset> {
    constructor() {
        super(Asset, "/SiteAssets", "Assets");
    }
}