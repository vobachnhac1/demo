import _ from 'lodash';
import moment from 'moment';
import FILTER_OPERATIONS from './filter-operations';

const SUPPORT_DATE_FORMAT = ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY h:mm'];

export const FILTER_ULTIS = {
  filter: (condition, record) => {
    let prepare = FILTER_ULTIS.prepare[condition.type];
    let search = prepare(condition.value);
    let base = prepare(record[condition.column]);
    if (
      FILTER_ULTIS.compare[condition.type](base, search, condition.operation)
    ) {
      condition.results.push(record[condition.key]);
    }
  },

  compare: {
    STRING: (base, search, operation) => {
      return operation.exec(base, search);
    },

    DATE: (base, search, operation) => {
      if (base == null || search == null) {
        return false;
      }
      return operation.exec(base, search);
    },

    NUMBER: (base, search, operation) => {
      let asStringCompare =
        FILTER_OPERATIONS.STRING[operation.code] !== undefined;
      if (asStringCompare) {
        return operation.exec(_.toString(base), _.toString(search));
      } else {
        if (Number.isNaN(base) || Number.isNaN(search)) {
          return false;
        }
        return operation.exec(base, search);
      }
    },

    BOOL: (base, search) => {
      return base == search;
    }
  },

  prepare: {
    STRING: val => {
      return _.toLower(val);
    },

    DATE: val => {
      let date = moment(val, SUPPORT_DATE_FORMAT);
      return date.isValid() ? date : null;
    },

    NUMBER: val => {
      if (_.isNil(val) || _.trim(val) == '') {
        return Number.NaN;
      }
      return Number(val);
    },

    BOOL: val => {
      if (_.isBoolean(val)) {
        return val;
      } else if (_.isString(val)) {
        return val == 'checked';
      }
      return false;
    }
  },

  ignore: {
    STRING: val => {
      return val == '' || val == null;
    },

    DATE: val => {
      return val == '' || val == null;
    },

    NUMBER: val => {
      return Number.isNaN(FILTER_ULTIS.prepare.NUMBER(val)) || val == null;
    },

    BOOL: val => {
      return val == '' || val == null;
    }
  }
};
