import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SpfxBaseDataServicesControlsStrings';
import { ServicesConfiguration } from 'spfx-base-data-services';
import { Test, ITestProps } from './components/Test';
//inject:imports
/************************* Automatic services declaration injection for base-data-services *************************/
import { TaxonomyHiddenListService } from "spfx-base-data-services";
import { UserService } from "spfx-base-data-services";
import { AssetsService } from "../../services/sp/AssetsService";
import { FakeTermsService } from "../../services/taxonomy/FakeTermsService";

console.groupCollapsed("spfx-base-data-services - register services");
[
	TaxonomyHiddenListService,
	UserService,
	AssetsService,
	FakeTermsService
].forEach(function (value) { 
	console.log(value["name"] + " added to ServiceFactory");
});
console.groupEnd();
//endinject

export interface ITestWebPartProps {
  description: string;
}

export default class TestWebPart extends BaseClientSideWebPart<ITestWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITestProps > = React.createElement(
      Test,
      {
      }
    );

    ReactDom.render(element, this.domElement);
  }

  public onInit(): Promise<void> {
    return super.onInit().then(() => {
      ServicesConfiguration.Init({
        onlineCheckPage: "/SitePages/home.aspx",
        dbName: "spfx-base-data-services-controls",
        dbVersion: 1,
        checkOnline: true,
        context: this.context,
        translations: {
          AddLabel: strings.AddLabel,
          DeleteLabel: strings.DeleteLabel,
          IndexedDBNotDefined: strings.IndexedDBNotDefined,
          SynchronisationErrorFormat: strings.SynchronisationErrorFormat,
          UpdateLabel: strings.UpdateLabel,
          UploadLabel: strings.UploadLabel,
          versionHigherErrorMessage: strings.versionHigherErrorMessage,
          typeTranslations: {
            SPFile: strings.SPFileLabel
          }      
        }     
      });
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
