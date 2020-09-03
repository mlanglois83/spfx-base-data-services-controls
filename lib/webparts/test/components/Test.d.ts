import * as React from 'react';
import { User } from "spfx-base-data-services";
import { FakeTerm } from "../../../models/taxonomy/FakeTerm";
import { Asset } from "../../../models/sp/Asset";
export interface ITestProps {
}
export interface ITestState {
    selectedUsers: User[];
    selectedTerms: FakeTerm[];
    selectedTerm: FakeTerm;
    allTerms: FakeTerm[];
    files: Asset[];
}
export declare class Test extends React.Component<ITestProps, ITestState> {
    private assetsService;
    constructor(props: ITestProps);
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
}
//# sourceMappingURL=Test.d.ts.map