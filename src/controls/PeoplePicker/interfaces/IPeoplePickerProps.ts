import { IPersonaProps } from "@fluentui/react";
import { User } from "spfx-base-data-services";

export interface IPeoplePickerProps {
  onChange:(items?:User[])=>void;
  cacheKey?: string;
  disabled?:boolean;
  selectedItems: User[];
  itemLimit?: number;
  required?: boolean;
  label?: string;
  populatePersona?: (user: User)=>  IPersonaProps;
  populateUser?: (persona: IPersonaProps) => User;
  filterField?: keyof IPersonaProps;
}

