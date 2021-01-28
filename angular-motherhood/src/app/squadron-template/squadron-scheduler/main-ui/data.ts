/**
 * Schedule datasource
 */

let msPerDay: number = 86400000;
let msPerHour: number = 3600000;
let currentTime: number = new Date().setMinutes(0, 0, 0);

export let flightData: Object[] = [
  {
    Id: 10,
    Name: "David Groehl",
    Rank:"Maj",
    StartTime: new Date(2020, 11, 10, 10, 0),
    EndTime: new Date(2020, 11, 10, 11, 0),
    Description: "Pilot",
    DepartmentID: 1,
    GCSCockpitID: 1,
    DepartmentName: "LINES",
    CategoryColor: "Blue",
    FlightHours:1300
  },
  {
    Id: 11,
    Name: "John Wayne",
    Rank:"Lt",
    StartTime: new Date(2020, 11, 10, 8, 30),
    EndTime: new Date(2020, 11, 10, 10, 30),
    Description: "Pilot",
    DepartmentID: 1,
    GCSCockpitID: 2,
    DepartmentName: "LINES",
    CategoryColor: "#7fa900",
    FlightHours:1300
  },
  {
    Id: 12,
    Name: "Peter Gabriel",
    Rank:"Lt",
    StartTime: new Date(2018, 7, 1, 12, 0),
    EndTime: new Date(2018, 7, 1, 13, 0),
    Description: "Pilot",
    DepartmentID: 1,
    GCSCockpitID: 3,
    DepartmentName: "LINES",
    CategoryColor: "#ff0000",
    FlightHours:1300
  },
  {
    Id: 13,
    Name: "Tony Stark",
    Rank:"Lt Col",
    StartTime: new Date(2018, 7, 1, 14, 0),
    EndTime: new Date(2018, 7, 1, 15, 0),
    Description: "Pilot",
    DepartmentID: 2,
    GCSCockpitID: 4,
    DepartmentName: "LINES",
    CategoryColor: "#7fa900",
    FlightHours:1300
  },
 
];

export let rosterList: { [key: string]: Object }[] = [
  {
    Id: 1,
    Name: "Steven Johnson",
    Rank:"Lt",
    Description: "PILOT",
    DepartmentName: "LINES",
    CategoryColor: "grey",
    FlightHours:500
  },
  {
    Id: 2,
    Name: "David Groehl",
    Rank:"Col",
    StartTime: new Date(2020, 12, 10, 8, 30),
    EndTime: new Date(2020, 12, 10, 10, 30),
    Description: "PILOT",
    DepartmentName: "LINES",
    CategoryColor: "grey",
    FlightHours:1300
  },
  {
    Id: 3,
    Name: "Laura Johnson",
    Rank:"Lt",
    StartTime: new Date(2018, 8, 4, 9, 30),
    EndTime: new Date(2018, 8, 4, 10, 30),
    Description: "PILOT",
    DepartmentName: "LINES",
    CategoryColor: "grey",
    FlightHours:500
  },
  {
    Id: 4,
    Name: "Janet Joplin",
    StartTime: new Date(2018, 8, 3, 11, 0),
    EndTime: new Date(2018, 8, 3, 12, 30),
    Description: "SENSOR",
    DepartmentName: "LINES",
    CategoryColor: "grey",
    FlightHours:350
  },
  {
    Id: 5,
    Name: "Steven Adams",
    StartTime: new Date(2018, 8, 3, 11, 0),
    EndTime: new Date(2018, 8, 3, 12, 30),
    Description: "SENSOR",
    DepartmentName: "LINES",
    CategoryColor: "grey",
    FlightHours:1400
  },
  {
    Id: 6,
    Name: "John Frost",
    StartTime: new Date(2018, 8, 3, 11, 0),
    EndTime: new Date(2018, 8, 3, 12, 30),
    Description: "SENSOR",
    DepartmentName: "LINES",
    CategoryColor: "grey",
    FlightHours:1300
  }
];

