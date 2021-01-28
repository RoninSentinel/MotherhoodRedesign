import { Color } from '@angular-material-components/color-picker';

// Intended to be used to help determine what font color should be used with a known background Color.
export function contrastingColor(color: Color): string  {
    // Adapted from: https://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color
    
    const black = "#000000";
    const white = "#FFFFFF";

    // Calculate the perceptive luminance (aka luma) - human eye favors green color... 
    let luma: number = ((0.299 * color.r) + (0.587 * color.g) + (0.114 * color.b)) / 255;

    // Return black for bright colors, white for dark colors
    return luma > 0.5 ? black : white;

}