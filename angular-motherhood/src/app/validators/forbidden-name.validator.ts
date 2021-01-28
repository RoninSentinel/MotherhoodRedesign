import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function forbiddenNameValidator(currentValues: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let nameInUse: boolean;
        nameInUse = currentValues?.some(obj => <string>obj.name?.toLowerCase().trim() === <string>control.value?.toLowerCase().trim());
        
        return nameInUse ? { 'forbiddenName': {value: control.value}} : null;

    }
}
