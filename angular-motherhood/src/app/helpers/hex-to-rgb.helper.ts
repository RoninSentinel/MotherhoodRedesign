import { Color } from '@angular-material-components/color-picker';

// Converts a hex string to a Color object based on rgb conversion for Color Picker component.
export function hexToRgb(hex: string): Color | null  {
    // Color for the color picker only has a constructor for RGB, so the hex string must be converted.
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        let color = new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), 1);
        return color;
    } else {
        return null;
    }

}