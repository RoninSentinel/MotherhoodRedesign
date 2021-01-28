import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function invalidUpdateIDValidator(currentValues: any[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        // If the "id" (likely a primary key in the database) is not found,
        // then we want an error to trigger, preventing the user from updating records
        // they likely shouldn't be accessing or that does not exist.

        if (!control.value) {
            // Prevent false positives, if field is blank.
            return null;
        }
        
        let idInUse: boolean;
        idInUse = currentValues.some(obj => obj.id == control.value);

        return idInUse ? null: { 'invalidID': {value: control.value}};

    }
}
