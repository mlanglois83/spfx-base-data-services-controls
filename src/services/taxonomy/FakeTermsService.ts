import { BaseTermsetService, TaxonomyTerm } from "spfx-base-data-services";
import { FakeTerm } from "../../models/taxonomy/FakeTerm";
import { find } from "@microsoft/sp-lodash-subset";
import { Guid } from "@microsoft/sp-core-library";
import { Decorators } from "spfx-base-data-services";
const dataService = Decorators.dataService;

dataService("FakeTerm");
export class FakeTermsService extends BaseTermsetService<FakeTerm> {
    private _terms: Array<FakeTerm> = null;
    private get terms(): Array<FakeTerm> {
        if(!this._terms) {
            this._terms = [];
            const levels = Math.random() * 5;
            for (let level = 0; level < levels; level++) {
                let term =  this.generateTerm(level + 1); 
                this._terms.push(term);
                this._terms.push(...this.generateSubTerms(term, levels - level + 1));
            }
        }
        return this._terms;
    }
    private generateTerm(index: number, parent?: FakeTerm): FakeTerm {
        return new FakeTerm({
            Name : "Term-" + index.toString(),
            Id: `/Guid(${Guid.newGuid().toString()})/`,
            PathOfTerm: (parent ? parent.path + ";" : "") + "Term-" + index.toString(),
            IsDeprecated: false
        });
    }
    private generateSubTerms(term: FakeTerm, sublevels: number): Array<FakeTerm> {
        const result = [];
        if(sublevels > 0) {
            const termsCount = Math.random() * 10;
            for (let index = 0; index < termsCount; index++) {
                let newterm =  this.generateTerm(index + 1, term); 
                result.push(newterm);
                result.push(...this.generateSubTerms(newterm, sublevels - 1));
            }
        }
        return result;
    }

    constructor() {
        super(FakeTerm, "fake");
    }
    public async getAll_Internal(): Promise<Array<FakeTerm>> {
        return this.terms;
    }
    public async getItemById_Internal(id: string): Promise<FakeTerm> {
        return find(this.terms, (t) => {return t.id === id;});
    }
    public async getItemsById_Internal(ids: Array<string>): Promise<Array<FakeTerm>> {
        return this.terms.filter((t) => {return ids.indexOf(t.id) > -1; });
    }
}