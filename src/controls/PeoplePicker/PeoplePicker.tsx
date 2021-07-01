import { IBasePickerSuggestionsProps, IPersonaProps, NormalPeoplePicker, css, Icon } from "@fluentui/react";
import { IPeoplePickerProps } from "./interfaces/IPeoplePickerProps";
import { IPeoplePickerState } from "./interfaces/IPeoplePickerState";

import { User, UserService, ServicesConfiguration, UtilsService, ServiceFactory } from 'spfx-base-data-services';
import * as React from "react";
import * as strings from 'ControlsStrings';
import { stringIsNullOrEmpty } from "@pnp/common/util";
import styles from './PeoplePicker.module.scss';

export class PeoplePicker extends React.Component<IPeoplePickerProps, IPeoplePickerState> {

  public constructor(props: IPeoplePickerProps) {
    super(props);
    this.state = {
      selectedItems: props.selectedItems.map((u) => {
        return {
          text: u.title,
          secondaryText: u.mail,
          tertiaryText: u.id.toString(),
          optionalText: u.userPrincipalName,
          imageUrl: UserService.getPictureUrl(u)
        };
      })
    };
  }

  public componentDidUpdate(prevProps: IPeoplePickerProps) {
    if (JSON.stringify(this.props.selectedItems) !== JSON.stringify(prevProps.selectedItems)) {
      this.setState({
        selectedItems: this.props.selectedItems.map((u) => {
          return {
            text: u.title,
            secondaryText: u.mail,
            tertiaryText: u.id.toString(),
            optionalText: u.userPrincipalName,
            imageUrl: UserService.getPictureUrl(u)
          };
        })
      });
    }
  }

  private suggestionProps: IBasePickerSuggestionsProps = {

    suggestionsHeaderText: strings.PeoplePickerSuggestion,
    noResultsFoundText: strings.PeoplePickerNoResults,
    loadingText: strings.PeoplePickerLoading,
    showRemoveButtons: true
  };



  private removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
    return personas.filter(persona => !this.listContainsPersona(persona, possibleDupes));
  }

  private listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
    if (!personas || !personas.length || personas.length === 0) {
      return false;
    }
    return personas.filter(item => item.optionalText === persona.optionalText).length > 0;
  }

  private onFilterPeopleChanged = (
    filterText: string,
    currentPersonas: IPersonaProps[],
    limitResults?: number
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (filterText) {
      return new Promise<IPersonaProps[]>((resolve, reject) => {
        ServiceFactory.getService(User, 0).cast<UserService>().getByDisplayName(filterText)
          .then(async (users: User[]) => {
            let personas: IPersonaProps[] = new Array<IPersonaProps>();
            await Promise.all(users.map(async (user) => {
              let pictureUrl = UserService.getPictureUrl(user);
              if (!stringIsNullOrEmpty(pictureUrl)) {
                let isInCache = false;
                if(!stringIsNullOrEmpty(this.props.cacheKey)) {
                  isInCache = await UtilsService.isUrlInCache(pictureUrl, this.props.cacheKey);
                }  
                if (!ServicesConfiguration.configuration.lastConnectionCheckResult && !isInCache) {
                  pictureUrl = null;
                }
              }
              personas.push({
                text: user.title,
                secondaryText: user.mail,
                tertiaryText: user.id.toString(),
                optionalText: user.userPrincipalName,
                imageUrl: stringIsNullOrEmpty(pictureUrl) ? undefined : pictureUrl
              });
            }));
            let filteredPersonas = this.removeDuplicates(
              personas,
              currentPersonas
            );
            resolve(filteredPersonas);
          })
          .catch(err => {
            reject();
          });
      });
    } else {
      // Return nothing if no search
      return [];
    }
  }

  public render() {
    return (
      <div className={styles.peoplePicker}>
        {this.props.label &&
          <label className={this.props.required ? styles.required : ""}>{this.props.label}</label>
        }
        <div className={styles.peopleContainer}>
          <div className={css(styles.picker, !stringIsNullOrEmpty(this.state.error) ? styles.invalid : null)}>
            <NormalPeoplePicker
              onResolveSuggestions={this.onFilterPeopleChanged}
              className={"ms-PeoplePicker"}
              pickerSuggestionsProps={this.suggestionProps}
              key={"peoplepicker"}
              selectedItems={this.state.selectedItems}

              onChange={(items?: IPersonaProps[]) => {
                if (this.props.onChange) {
                  let users: User[] = [];
                  if (items) {
                    users = items.map((item) => {
                      let user = new User();
                      user.id = Number(item.tertiaryText);
                      user.title = item.text;
                      user.mail = item.secondaryText;
                      user.userPrincipalName = item.optionalText;
                      return user;
                    });
                  }

                  let error = null;
                  if (this.props.required && (!items || items.length === 0)) {
                    error = strings.EmptyPeoplePicker;
                  }

                  this.setState({
                    error: error,
                    selectedItems: items
                  }, () => { this.props.onChange(users); });
                }
              }}
              onDismiss={() => {
                let error = null;
                if (this.props.required && (!this.props.selectedItems || this.props.selectedItems.length === 0)) {
                  error = strings.EmptyPeoplePicker;
                }

                this.setState({ error: error });
              }}
              resolveDelay={300}
              disabled={this.props.disabled}
              itemLimit={this.props.itemLimit}
            />
            {!stringIsNullOrEmpty(this.state.error) &&
              <div className={styles.errorMessage}>
                {this.state.error}
              </div>
            }
          </div>
          <Icon className={styles.pickerPeopleIcon} iconName="ProfileSearch" />
        </div>
      </div>
    );
  }
}
