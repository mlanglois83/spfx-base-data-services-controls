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
    return super.onInit().then(_ => {
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
