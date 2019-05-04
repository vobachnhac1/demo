const REGEX_DDMMYYYY_DASH = new RegExp(
  /^((0)\d{1}|[1-9]{1}|(1|2)\d{1}|(3)[0-1]{1})-((0)\d{1}|[1-9]{1}|(1)[0-2]{1})-((19|20)\d{2})$/,
  ''
);
const REGEX_DDMMYYYY_SLASH = new RegExp(
  /^((0)\d{1}|[1-9]{1}|(1|2)\d{1}|(3)[0-1]{1})\/((0)\d{1}|[1-9]{1}|(1)[0-2]{1})\/((19|20)\d{2})$/,
  ''
);
const REGEX_MMDDYYYY_DASH = new RegExp(
  /^((0)\d{1}|[1-9]{1}|(1)[0-2]{1})-((0)\d{1}|[1-9]{1}|(1|2)\d{1}|(3)[0-1]{1})-((19|20)\d{2})$/,
  ''
);
const REGEX_MMDDYYYY_SLASH = new RegExp(
  /^((0)\d{1}|[1-9]{1}|(1)[0-2]{1})\/((0)\d{1}|[1-9]{1}|(1|2)\d{1}|(3)[0-1]{1})\/((19|20)\d{2})$/,
  ''
);
const REGEX_YYYYMMDD_DASH = new RegExp(
  /^((19|20)\d{2})-((0)\d{1}|[1-9]{1}|(1)[0-2]{1})-((0)\d{1}|[1-9]{1}|(1|2)\d{1}|(3)[0-1]{1})$/,
  ''
);

const SUPPORTED = {
  'DD-MM-YYYY': REGEX_DDMMYYYY_DASH,
  'MM-DD-YYYY': REGEX_MMDDYYYY_DASH,
  'YYYY-MM-DD': REGEX_YYYYMMDD_DASH,
  'DD/MM/YYYY': REGEX_DDMMYYYY_SLASH,
  'MM/DD/YYYY': REGEX_MMDDYYYY_SLASH
};

export default class DateFormater {
  static isSupported(format) {
    if (
      hasText(format) &&
      Object.keys(SUPPORTED).includes(format.toUpperCase())
    ) {
      return true;
    }
    return false;
  }

  static isValid(date, format) {
    if (isDate(date)) {
      return true;
    }

    if (hasText(date) && DateFormater.isSupported(format)) {
      return SUPPORTED[format].test(date);
    }
    return false;
  }

  static transform(date, format) {
    let validDate = null;
    isDate(date) ? (validDate = date) : false;

    if (
      validDate == null &&
      hasText(date) &&
      DateFormater.isValidSupported(date)
    ) {
      validDate = DateFormater.toDate(date);
    }

    if (validDate != null) {
      return dateToString[format.toUpperCase()](validDate);
    }
    return null;
  }

  static toDate(date) {
    if (isDate(date)) {
      return date;
    }

    let result = null;
    if (hasText(date)) {
      if (REGEX_DDMMYYYY_DASH.test(date)) {
        result = stringToDate['DD-MM-YYYY'](date);
      } else if (REGEX_MMDDYYYY_DASH.test(date)) {
        result = stringToDate['MM-DD-YYYY'](date);
      } else if (REGEX_YYYYMMDD_DASH.test(date)) {
        result = stringToDate['YYYY-MM-DD'](date);
      } else if (REGEX_DDMMYYYY_SLASH.test(date)) {
        result = stringToDate['DD/MM/YYYY'](date);
      } else if (REGEX_MMDDYYYY_SLASH.test(date)) {
        result = stringToDate['MM/DD/YYYY'](date);
      }
    }

    if (result !== 'Invalid Date' && isDate(result)) {
      return result;
    } else {
      return null;
    }
  }

  static isValidSupported(date) {
    if (isDate(date)) {
      return true;
    } else if (hasText(date)) {
      return (
        REGEX_DDMMYYYY_DASH.test(date) ||
        REGEX_MMDDYYYY_DASH.test(date) ||
        REGEX_YYYYMMDD_DASH.test(date) ||
        REGEX_DDMMYYYY_SLASH.test(date) ||
        REGEX_MMDDYYYY_SLASH.test(date)
      );
    }
    return false;
  }
}

const dateToString = {
  'DD-MM-YYYY': date => {
    let parts = getDateParts(date);
    return `${parts.date.padStart(2, '0')}-${parts.month.padStart(2, '0')}-${
      parts.year
    }`;
  },

  'MM-DD-YYYY': date => {
    let parts = getDateParts(date);
    return `${parts.month.padStart(2, '0')}-${parts.date.padStart(2, '0')}-${
      parts.year
    }`;
  },

  'YYYY-MM-DD': date => {
    let parts = getDateParts(date);
    return `${parts.year}-${parts.month.padStart(2, '0')}-${parts.date.padStart(
      2,
      '0'
    )}`;
  },

  'DD/MM/YYYY': date => {
    let parts = getDateParts(date);
    return `${parts.date.padStart(2, '0')}/${parts.month.padStart(2, '0')}/${
      parts.year
    }`;
  },

  'MM/DD/YYYY': date => {
    let parts = getDateParts(date);
    return `${parts.month.padStart(2, '0')}/${parts.date.padStart(2, '0')}/${
      parts.year
    }`;
  }
};

const stringToDate = {
  'DD-MM-YYYY': str => {
    const [date, month, year] = str.split('-');
    if (isValidDate(year, month, date)) {
      return new Date(year, month - 1, date);
    }
    return null;
  },

  'MM-DD-YYYY': str => {
    const [month, date, year] = str.split('-');
    if (isValidDate(year, month, date)) {
      return new Date(year, month - 1, date);
    }
    return null;
  },

  'YYYY-MM-DD': str => {
    const [year, month, date] = str.split('-');
    if (isValidDate(year, month, date)) {
      return new Date(year, month - 1, date);
    }
    return null;
  },

  'DD/MM/YYYY': str => {
    const [date, month, year] = str.split('/');
    if (isValidDate(year, month, date)) {
      return new Date(year, month - 1, date);
    }
    return null;
  },

  'MM/DD/YYYY': str => {
    const [month, date, year] = str.split('/');
    if (isValidDate(year, month, date)) {
      return new Date(year, month - 1, date);
    }
    return null;
  }
};

const toString = Object.prototype.toString;

const hasText = val => {
  return typeof val === 'string' && val.trim() != '';
};

const isDate = val => {
  return toString.call(val) === '[object Date]';
};

const getDateParts = date => {
  return {
    date: `${date.getDate()}`,
    month: `${date.getMonth() + 1}`,
    year: `${date.getFullYear()}`
  };
};

const isValidDate = (year, month, date) => {
  let isleapYear = false;
  if (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  ) {
    isleapYear = true;
  }
  let maxDaysInMonth = [
    31,
    isleapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];
  if (maxDaysInMonth[month - 1] < date) {
    return false;
  }

  return true;
};
