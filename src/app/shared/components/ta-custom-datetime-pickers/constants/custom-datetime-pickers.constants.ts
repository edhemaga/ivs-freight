export class CustomDatetimePickersConstants {
  public static readonly timeMinutes = ['00', '15', '30', '45'];
  public static readonly timeMinutesGapFive = [
    '00',
    '05',
    '10',
    '15',
    '20',
    '25',
    '30',
    '35',
    '40',
    '45',
    '50',
    '55',
  ];
  public static readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  public static readonly hourTimes = [
    12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11,
  ];
  public static readonly defaultScrollTypes = {
    pmAmScroll: 0,
    minutesScroll: 0,
    hourScroll: 8,
    monthScroll: 0,
    dayScroll: 0,
    yearScroll: 0,
  };
  public static readonly timeOfDay = ['AM', 'PM'];
  public static readonly defaultSelectedTime = '12:00 AM';
  public static readonly defaultOutputTypeTime = ['hh', ':', 'mm', ' ', 'AM'];
  public static readonly defaultOutputTypeDate = ['MM', '/', 'DD', '/', 'YY'];
  public static readonly dayOfWeekLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
}
