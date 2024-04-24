
export class DialogEntity{
    message: string[] = [];
    type: DialogType = DialogType.INFO;
    title: string = "";
    textOkayButton: string = "Ok";
    showOkayButton: boolean = true;
    textCancelButton: string = "Cancel";
}

export enum DialogType{
    INFO = "Information(s)",
    WARNING = "Warning(s)",
    ERROR = "Error(s)",
    SUCCESS = "Success(s)",
    CONFIRM = "Confirmation",
    FORM_VALIDATION_ERROR = "Form Validation Error(s)"
}