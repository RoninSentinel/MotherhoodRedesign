import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function forbiddenCodeValidator(currentValues: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let codeInUse: boolean;
        codeInUse = currentValues?.some(obj => <string>obj.code?.toLowerCase().trim() === <string>control.value?.toLowerCase().trim());
        
        return codeInUse ? { 'forbiddenCode': {value: control.value}} : null;

    }
}
