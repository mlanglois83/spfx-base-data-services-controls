var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'SpfxBaseDataServicesControlsStrings';
import { ServicesConfiguration } from 'spfx-base-data-services';
import { ServiceFactory } from '../../services/ServiceFactory';
import { Test } from './components/Test';
var TestWebPart = /** @class */ (function (_super) {
    __extends(TestWebPart, _super);
    function TestWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestWebPart.prototype.render = function () {
        var element = React.createElement(Test, {});
        ReactDom.render(element, this.domElement);
    };
    TestWebPart.prototype.onInit = function () {
        var _this = this;
        return _super.prototype.onInit.call(this).then(function (_) {
            ServicesConfiguration.Init({
                lastConnectionCheckResult: false,
                onlineCheckPage: "/SitePages/home.aspx",
                dbName: "spfx-base-data-services-controls",
                dbVersion: 1,
                checkOnline: true,
                context: _this.context,
                currentUserId: -1,
                serviceFactory: new ServiceFactory(),
                tableNames: ["Assets", "FakeTerms"],
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
    };
    TestWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(TestWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    TestWebPart.prototype.getPropertyPaneConfiguration = function () {
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
    };
    return TestWebPart;
}(BaseClientSideWebPart));
export default TestWebPart;
//# sourceMappingURL=TestWebPart.js.map