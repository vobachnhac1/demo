import _ from 'lodash';

export default {
  methods: {
    __u(field, value, mutation) {
      if (!field) return;
      let updateData = {};
      if (field.indexOf('.') > -1) {
        const fields = field.split('.');
        updateData[fields[0]] = {
          [fields[1]]: value
        };
      } else {
        updateData[field] = value;
      }
      if (_.isString(mutation) && this.$store) {
        this.$store.commit(mutation, updateData);
      }
      if (_.isFunction(mutation)) {
        mutation(updateData);
      }
    }
  }
};
