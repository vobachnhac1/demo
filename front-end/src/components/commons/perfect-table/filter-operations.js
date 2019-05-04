import _ from 'lodash';

const FILTER_OPERATIONS = {
  STRING: {
    START_WITH: {
      code: 'START_WITH',
      text: 'Start with',
      icon: 'fa-hashtag',
      exec: (before, after) => _.startsWith(before, after)
    },
    NOT_START_WITH: {
      code: 'NOT_START_WITH',
      text: 'Not start with',
      icon: 'fa-hashtag',
      exec: (before, after) => !_.startsWith(before, after)
    },
    END_WITH: {
      code: 'END_WITH',
      text: 'End with',
      icon: 'fa-hashtag',
      exec: (before, after) => _.endsWith(before, after)
    },
    NOT_END_WITH: {
      code: 'NOT_END_WITH',
      text: 'Not end with',
      icon: 'fa-hashtag',
      exec: (before, after) => !_.endsWith(before, after)
    },
    INCLUDES: {
      code: 'INCLUDES',
      text: 'Includes',
      icon: 'fa-equals',
      exec: (before, after) => _.includes(before, after)
    },
    NOT_INCLUDES: {
      code: 'NOT_INCLUDES',
      text: 'Not includes',
      icon: 'fa-not-equal',
      exec: (before, after) => !_.includes(before, after)
    },
    EQUALS: {
      code: 'EQUALS',
      text: 'Equals',
      icon: 'fa-equals',
      exec: (before, after) => before === after
    },
    NOT_EQUALS: {
      code: 'NOT_EQUALS',
      text: 'Not equals',
      icon: 'fa-not-equal',
      exec: (before, after) => before !== after
    }
  },

  NUMBER: {
    START_WITH: {
      code: 'START_WITH',
      text: 'Start with',
      icon: 'fa-hashtag',
      exec: (before, after) => _.startsWith(before, after)
    },
    NOT_START_WITH: {
      code: 'NOT_START_WITH',
      text: 'Not start with',
      icon: 'fa-hashtag',
      exec: (before, after) => !_.startsWith(before, after)
    },
    END_WITH: {
      code: 'END_WITH',
      text: 'End with',
      icon: 'fa-hashtag',
      exec: (before, after) => _.endsWith(before, after)
    },
    NOT_END_WITH: {
      code: 'NOT_END_WITH',
      text: 'Not end with',
      icon: 'fa-hashtag',
      exec: (before, after) => !_.endsWith(before, after)
    },
    INCLUDES: {
      code: 'INCLUDES',
      text: 'Includes',
      icon: 'fa-equals',
      exec: (before, after) => _.includes(before, after)
    },
    NOT_INCLUDES: {
      code: 'NOT_INCLUDES',
      text: 'Not includes',
      icon: 'fa-not-equal',
      exec: (before, after) => !_.includes(before, after)
    },
    EQUALS: {
      code: 'EQUALS',
      text: 'Equals',
      icon: 'fa-equals',
      exec: (before, after) => before === after
    },
    NOT_EQUALS: {
      code: 'NOT_EQUALS',
      text: 'Not equals',
      icon: 'fa-not-equal',
      exec: (before, after) => before !== after
    },
    LESS_THAN: {
      code: 'LESS_THAN',
      text: 'Less than',
      icon: 'fa-less-than',
      exec: (before, after) => before < after
    },
    LESS_THAN_EQUAL: {
      code: 'LESS_THAN_EQUAL',
      text: 'Less than or equals',
      icon: 'fa-less-than-equal',
      exec: (before, after) => before <= after
    },
    GREATER_THAN: {
      code: 'GREATER_THAN',
      text: 'Greater than',
      icon: 'fa-greater-than',
      exec: (before, after) => before > after
    },
    GREATER_THAN_EQUAL: {
      code: 'GREATER_THAN_EQUAL',
      text: 'Greater than or equals',
      icon: 'fa-greater-than-equal',
      exec: (before, after) => before >= after
    }
  },

  DATE: {
    EQUALS: {
      code: 'EQUALS',
      text: 'Equals',
      icon: 'fa-equals',
      exec: (before, after) => before.diff(after, 'days') == 0
    },
    NOT_EQUALS: {
      code: 'NOT_EQUALS',
      text: 'Not equals',
      icon: 'fa-not-equal',
      exec: (before, after) => before.diff(after, 'days') != 0
    },
    BEFORE: {
      code: 'BEFORE',
      text: 'Before date',
      icon: 'fa-not-equal',
      exec: (before, after) => before.diff(after, 'days') < 0
    },
    AFTER: {
      code: 'AFTER',
      text: 'After date',
      icon: 'fa-not-equal',
      exec: (before, after) => before.diff(after, 'days') > 0
    }
  }
};

FILTER_OPERATIONS.DEFAULTS = {
  STRING: FILTER_OPERATIONS.STRING.INCLUDES,
  NUMBER: FILTER_OPERATIONS.NUMBER.INCLUDES,
  DATE: FILTER_OPERATIONS.DATE.EQUALS
};

export default FILTER_OPERATIONS;
