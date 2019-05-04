<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <slot :model="show" name="activator">
      <v-text-field
        slot="activator"
        v-model="show"
        :label="label"
        :prepend-icon="icon"
        :append-icon="options.clear && hasText ? 'cancel' : ''"
        readonly
        @click:append="clearValue"
      />
    </slot>
    <v-date-picker
      v-model="picker"
      :allowed-dates="allowedDate"
      :color="options.color"
      :readonly="readonly"
      no-titl
      scrollable
      @input="pickDate"
    />
  </v-menu>
</template>

<script>
import _ from 'lodash';
import moment from 'moment';

const DEFAULT_OPTIONS = {
  color: 'primary',
  clear: false,
  date_format: {
    model: 'MM/DD/YYYY',
    shown_up: 'MM/DD/YYYY'
  }
};

const SUPPORT_FORMAT = [
  'MM/DD/YYYY',
  'MM-DD-YYYY',
  'DD/MM/YYYY',
  'DD-MM-YYYY',
  'YYYY-MM-DD',
  'YYYY-DD-MM'
];
const V_PICKER_FORMAT = 'YYYY-MM-DD';

export default {
  props: {
    value: {
      type: String,
      default: ''
    },

    label: {
      type: String,
      default: ''
    },

    icon: {
      type: String,
      default: ''
    },

    greater: {
      type: String,
      default: ''
    },

    smaller: {
      type: String,
      default: ''
    },

    equal: {
      type: Boolean,
      default: true
    },

    readonly: {
      type: Boolean,
      default: false
    },

    custom: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  data() {
    return {
      menu: false,

      show: '',

      picker: '',

      hasText: false,

      options: {}
    };
  },

  watch: {
    value() {
      this.update(this.value);
      this.hasText = false;
      if (_.isString(this.value) && this.value.trim() !== '') {
        this.hasText = true;
      }
    }
  },

  created() {
    this.options = _.assign(_.cloneDeep(DEFAULT_OPTIONS), this.custom);
    if (!_.includes(SUPPORT_FORMAT, this.options.date_format.model)) {
      throw new TypeError(
        `Date picker do not support format [${this.options.date_format.model}]`
      );
    }

    this.update(this.value);
  },

  methods: {
    clearValue() {
      this.$emit('input', null);
      this.update(null);
    },

    update(val) {
      if (this.isValidDate(val)) {
        this.show = this.convertToShownUp(val);
        this.picker = this.convertToPicker(val);
        this.hasText = true;
      } else {
        this.show = '';
        this.picker = null;
        this.hasText = false;
      }
    },

    pickDate() {
      this.menu = false;
      this.show = this.convertToShownUp(this.picker);
      this.$emit('input', this.convertToUpdate(this.picker));
    },

    convertToUpdate(date) {
      if (!date) return null;

      let momentDate = moment(date, SUPPORT_FORMAT);
      if (momentDate.isValid()) {
        return momentDate.format(this.options.date_format.model);
      }
      return null;
    },

    convertToPicker(date) {
      if (!date) return null;

      let momentDate = moment(date, SUPPORT_FORMAT);
      if (momentDate.isValid()) {
        return momentDate.format(V_PICKER_FORMAT);
      }
      return null;
    },

    convertToShownUp(date) {
      if (!date) return '';
      let momentDate = moment(date, SUPPORT_FORMAT);
      if (momentDate.isValid()) {
        return momentDate.format(this.options.date_format.shown_up);
      }
      return '';
    },

    isValidDate(date) {
      let momentDate = moment(date, SUPPORT_FORMAT);
      return momentDate.isValid();
    },

    allowedDate(val) {
      let more = false;
      let less = false;

      if (_.isNil(this.greater) || this.greater == '') {
        more = true;
      } else {
        if (this.isValidDate(this.greater)) {
          more = this.equal
            ? this.createDate(val).isSameOrAfter(this.createDate(this.greater))
            : this.createDate(val).isAfter(this.createDate(this.greater));
        } else {
          more = false;
        }
      }

      if (_.isNil(this.smaller) || this.smaller == '') {
        less = true;
      } else {
        if (this.isValidDate(this.smaller)) {
          less = this.equal
            ? this.createDate(val).isSameOrBefore(this.createDate(this.smaller))
            : this.createDate(val).isBefore(this.createDate(this.smaller));
        } else {
          less = false;
        }
      }
      return more && less;
    },

    createDate(date) {
      let momentDate = moment(date, SUPPORT_FORMAT);
      return momentDate;
    }
  }
};
</script>
