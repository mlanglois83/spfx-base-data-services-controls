import { BaseDataService, BaseServiceFactory, IBaseItem } from "spfx-base-data-services";
export declare class ServiceFactory extends BaseServiceFactory {
    create(modelName: string): BaseDataService<IBaseItem>;
    getItemTypeByName(typeName: string): (new (item?: any) => IBaseItem);
}
//# sourceMappingURL=ServiceFactory.d.ts.map