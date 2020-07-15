import { BaseTermsetService } from "spfx-base-data-services";
import { FakeTerm } from "../../models/taxonomy/FakeTerm";
export declare class FakeTermsService extends BaseTermsetService<FakeTerm> {
    private _terms;
    private get terms();
    private generateTerm;
    private generateSubTerms;
    constructor();
    getAll_Internal(): Promise<Array<FakeTerm>>;
    getItemById_Internal(id: string): Promise<FakeTerm>;
    getItemsById_Internal(ids: Array<string>): Promise<Array<FakeTerm>>;
}
//# sourceMappingURL=FakeTermsService.d.ts.map