import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function valueInListValidator(currentValues: any[]): ValidatorFn {
    // Valid if the value being provided is in the list of values being checked against.
    // Essentially the same logic as the 'forbidden name' validator, but returning the opposite value.
    return (control: AbstractControl): ValidationErrors | null => {
        let nameInUse: boolean;
        nameInUse = currentValues.some(obj => <string>obj.toLowerCase().trim() === <string>control.value?.toLowerCase().trim());

        return nameInUse ? null: { 'unknownValue': {value: control.value}};

    }
}