
import { MediaSelector, PeoplePicker, TaxonomyFilter, TaxonomyPicker } from "@controls";
import { cloneDeep, findIndex } from "@microsoft/sp-lodash-subset";
import { Asset, FakeTerm } from "@models";
import * as React from 'react';
import { ServiceFactory, ServicesConfiguration, User } from "spfx-base-data-services";

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
    constructor(props: ITestProps) {
        super(props);
        this.state = {  
            selectedUsers: [],
            selectedTerms: [],
            selectedTerm: null, 
            allTerms: [],
            files:[]
        };
    }

    public async componentDidMount() {
        const allTerms = await ServiceFactory.getService(FakeTerm).getAll();
        const assets = await ServiceFactory.getService(Asset).getAll();
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
                    fileConstructor={Asset}
                    editMode
                    files={this.state.files}
                    onFileAdded={async (file) => {
                        file.id = ServicesConfiguration.context.pageContext.web.serverRelativeUrl +
                        "/SiteAssets/" + file.title;
                        const copy = cloneDeep(this.state.files);
                        await ServiceFactory.getService(Asset).addOrUpdateItem(file);
                        copy.push(file);
                        this.setState({files: copy});
                    }} 
                    onFileRemoved={async (file) => {
                        const copy = cloneDeep(this.state.files);
                        const idx = findIndex(copy, (f) => {return f.id === file.id;});
                        await ServiceFactory.getService(Asset).deleteItem(file);
                        copy.splice(idx,1);
                        this.setState({files: copy});
                    }} 
                    online        
                    customFilesAccept="image/*"
                />
            </div>         
        
        </>;
    }

}