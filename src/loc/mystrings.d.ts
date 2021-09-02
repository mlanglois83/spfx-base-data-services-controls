declare interface IControlsStrings {
  TaxonomyPickerSuggestedTerms: string;
  ItemPickerSuggestedTerms: string;
  TaxonomyPickerNoTerm: string;
  ItemPickerNoTerm: string;
  TaxonomyPickerTermLocationPrefix: string;
  saveButtonLabel: string;
  cancelButtonLabel: string;
  selectTermLabel: string;
  PeoplePickerSuggestion: string;
  PeoplePickerNoResults: string;
  PeoplePickerLoading: string;
  EmptyPeoplePicker: string;
  takePicture: string;
  startVideo: string;
  stopVideo: string;
  removeButtonLabel: string;
  NoMediaMessage: string;
  NavHomeText: string;
  FullscreenLabel: string;
  AbortFullScreenLabel: string;
  ElementTypeColumnLabel: string;
  OperationColumnLabel: string;
  AddLabel: string;
  UpdateLabel: string;
  DeleteLabel: string;
  UploadLabel: string;
  titleLabel: string;
  IdColumnLabel: string;
  PendingTransactionsLabel: string;
  TransactionErrorsLabel: string;
  NoTransactionsLabel: string;
  NoSyncErrorsLabel: string;
  clearSyncErrors: string;
  download: string;
}
declare module 'ControlsStrings' {
  const strings: IControlsStrings;
  export = strings;
}
