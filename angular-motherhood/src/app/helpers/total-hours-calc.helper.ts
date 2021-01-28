
// Takes a generic string representing UTC timestamp (HH:mm format) and calculates the number of hours between them.
// Assumes at least a 1 minute difference and supports up to 24 hours.
export function totalHoursCalc(startTime: string, endTime: string): number  {
    // Assumes correct formatting of strings has already been confirmed.
    let today= new Date();
    let startTimeHours : number = +startTime.slice(0,2);
    let startTimeMinutes: number = +startTime.slice(-2);
    let endTimeHours: number = +endTime.slice(0,2);
    let endTimeMinutes: number = +endTime.slice(-2);

    let startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startTimeHours, startTimeMinutes, 0, 0);
    let endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endTimeHours, endTimeMinutes, 0, 0);

    if (startDate.getTime() == endDate.getTime()) {
        // Special case: if the times provided are the same, treat as 24 hours apart.
        return 24.0;
    }

    if (endDate > startDate) {
        // The two times provided represent a time period that begins and ends on the same calendar day.
        return ((endDate.getTime() - startDate.getTime()) / 36e5);

    } else {
        // The two times provided represent a time period that begins on one day and ends the next calendar day.
        endDate.setHours(endDate.getHours()+24);
        return ((endDate.getTime() - startDate.getTime()) / 36e5);
    }

}