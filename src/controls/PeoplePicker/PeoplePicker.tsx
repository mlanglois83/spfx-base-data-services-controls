import { css, IBasePickerSuggestionsProps, Icon, IPersonaProps, NormalPeoplePicker } from "@fluentui/react";
import { stringIsNullOrEmpty } from "@pnp/common/util";
import * as strings from 'ControlsStrings';
import * as React from "react";
import { ServiceFactory, ServicesConfiguration, User, UserService, UtilsService } from 'spfx-base-data-services';
import { IPeoplePickerProps } from "./interfaces/IPeoplePickerProps";
import { IPeoplePickerState } from "./interfaces/IPeoplePickerState";
import styles from './PeoplePicker.module.scss';


export class PeoplePicker extends React.Component<IPeoplePickerProps, IPeoplePickerState> {

  public constructor(props: IPeoplePickerProps) {
    super(props);
    this.state = {};
  }

  private getPersona(user: User): IPersonaProps {
    if(this.props.populatePersona) {
      return this.props.populatePersona(user);
    }
    else {
      return {
        text: user.title,
        secondaryText: user.mail,
        tertiaryText: user.id.toString(),
        optionalText: user[UserService.userField],
        imageUrl: UserService.getPictureUrl(user)
      };
    }    
  }

  private getUser(persona: IPersonaProps): User {
    if(this.props.populateUser) {
      return this.props.populateUser(persona);
    }
    else {
      const user = new User();
      user.id = Number(persona.tertiaryText);
      user.title = persona.text;
      user.mail = persona.secondaryText;
      user[UserService.userField] = persona.optionalText;
      return user;
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
    const field: keyof IPersonaProps = this.props.filterField || "optionalText"
    return personas.some(item => item[field] === persona[field]);
  }

  private onFilterPeopleChanged = (
    filterText: string,
    currentPersonas: IPersonaProps[]
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (filterText) {
      return new Promise<IPersonaProps[]>((resolve, reject) => {
        const userService = ServiceFactory.getService(User, 0).cast<UserService>();
        userService.getByDisplayName(filterText)
          .then(async (users: User[]) => {
            const personas: IPersonaProps[] = new Array<IPersonaProps>();
            await Promise.all(users.map(async (user) => {
              const persona = this.getPersona(user);
              if (!stringIsNullOrEmpty(persona.imageUrl)) {
                let isInCache = false;
                if(!stringIsNullOrEmpty(this.props.cacheKey)) {
                  isInCache = await UtilsService.isUrlInCache(persona.imageUrl, this.props.cacheKey);
                }  
                if (!ServicesConfiguration.configuration.lastConnectionCheckResult && !isInCache) {
                  persona.imageUrl = undefined;
                }
              }
              personas.push(persona);
            }));
            const filteredPersonas = this.removeDuplicates(
              personas,
              currentPersonas
            );
            resolve(filteredPersonas);
          })
          .catch(() => {
            reject();
          });
      });
    } else {
      // Return nothing if no search
      return [];
    }
  }

  public render(): React.ReactElement<IPeoplePickerProps> {
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
              selectedItems={this.props.selectedItems?.map(u => this.getPersona(u))}

              onChange={(items?: IPersonaProps[]) => {
                if (this.props.onChange) {
                  let users: User[] = [];
                  if (items) {
                    users = items.map((item) => this.getUser(item));
                  }

                  let error = null;
                  if (this.props.required && (!items || items.length === 0)) {
                    error = strings.EmptyPeoplePicker;
                  }

                  this.setState({
                    error: error
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
