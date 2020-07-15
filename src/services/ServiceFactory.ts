import { BaseDataService, BaseServiceFactory, IBaseItem, TaxonomyHidden, TaxonomyHiddenListService, User, UserService } from "spfx-base-data-services";
import { FakeTerm } from "../models/taxonomy/FakeTerm";
import { Asset } from "../models/sp/Asset";
import { FakeTermsService } from "./taxonomy/FakeTermsService";
import { AssetsService } from "./sp/AssetsService";

export class ServiceFactory extends BaseServiceFactory {

    public create(modelName: string): BaseDataService<IBaseItem> {
        let result = null;        
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
                result= new AssetsService();
                break;
            default:
                throw Error("error");
        }
        return result;
    }

    public getItemTypeByName(typeName: string): (new (item?: any) => IBaseItem) {
        let result = super.getItemTypeByName(typeName);
        if(!result) {
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
                    result= Asset;
                    break;
                default:
                    throw Error("error");
            }
        }        
        return result;
    }

}