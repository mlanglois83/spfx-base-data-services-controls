
import { PeoplePicker } from "../../../controls/PeoplePicker/PeoplePicker";
import { TaxonomyPicker } from "../../../controls/TaxonomyPicker/TaxonomyPicker";
import { TaxonomyFilter } from "../../../controls/TaxonomyFilter/TaxonomyFilter";
import { MediaSelector } from "../../../controls/MediaSelector/MediaSelector";
import * as React from 'react';
import { User, ServicesConfiguration } from "spfx-base-data-services";
import { cloneDeep, findIndex } from "@microsoft/sp-lodash-subset";
import { FakeTerm } from "../../../models/taxonomy/FakeTerm";
import { FakeTermsService } from "../../../services/taxonomy/FakeTermsService";
import { Asset } from "../../../models/sp/Asset";
import { AssetsService } from "../../../services/sp/AssetsService";

export interface ITestProps {

}
export interface ITestState {
    selectedUsers: User[];
    selectedTerms: FakeTerm[];
    selectedTerm: FakeTerm;
    allTerms: FakeTerm[];
    files: Asset[];
}
export class Test extends React.Component<ITestProps, ITestState> {
    private assetsService: AssetsService = null;
    constructor(props: ITestProps) {
        super(props);
        this.state = {  
            selectedUsers: [],
            selectedTerms: [],
            selectedTerm: null, 
            allTerms: [],
            files:[]
        };
        this.assetsService = new AssetsService();
    }

    public async componentDidMount() {
        const fakeService = new FakeTermsService();
        const allTerms = await fakeService.getAll();
        const assets = await this.assetsService.getAll();
        this.setState({allTerms: allTerms, files: assets});
    }

    public render() {        
        return <>
            <div>
                <PeoplePicker
                    label = "people picker"
                    selectedItems={this.state.selectedUsers} 
                    onChange={(users?: Array<User>)=>{
                        this.setState({selectedUsers: (users ? cloneDeep(users) : [] )});
                    }}
                />
            </div>
            <div>
                <TaxonomyPicker
                    label = "taxonomy picker"
                    modelName = "FakeTerm"
                    multiSelect
                    onChanged={(value?) => {
                        this.setState({selectedTerms: (value ? (Array.isArray(value) ? cloneDeep(value) : [value]) : [] )});
                    }}                    
                />
            </div>   
            <div>
                <TaxonomyFilter
                    terms={this.state.allTerms}
                    onFilterChanged={(term) => {
                        this.setState({selectedTerm: term});
                    }}     
                    selectedTerm={this.state.selectedTerm}           
                />
            </div>     
            <div>
                <MediaSelector
                    editMode
                    files={this.state.files}
                    onFileAdded={async (file) => {
                        file.id = ServicesConfiguration.context.pageContext.web.serverRelativeUrl +
                        "/SiteAssets/" + file.title;
                        const copy = cloneDeep(this.state.files);
                        await this.assetsService.addOrUpdateItem(file);
                        copy.push(file);
                        this.setState({files: copy});
                    }} 
                    onFileRemoved={async (file) => {
                        const copy = cloneDeep(this.state.files);
                        const idx = findIndex(copy, (f) => {return f.id === file.id;});
                        await this.assetsService.deleteItem(file);
                        copy.splice(idx,1);
                        this.setState({files: copy});
                    }} 
                    online        
                />
            </div>         
        
        </>;
    }

}