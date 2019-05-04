<template>
  <div :class="['c-checkbox', local ? 'active' : '']" @click="change">
    <v-icon v-if="local">check_box</v-icon>
    <v-icon v-else>check_box_outline_blank</v-icon>
  </div>
</template>

<script>
export default {
  props: {
    table: {
      type: String,
      default: ''
    },

    id: {
      type: String,
      default: ''
    },

    color: {
      type: String,
      default: '#0000008a'
    }
  },

  data() {
    return {
      local: false
    };
  },

  created() {
    this.$bus.$on(`select_all_${this.table}`, val => {
      this.local = val;
    });

    if (this.id != '') {
      this.$bus.$on(`select_${this.id}_${this.table}`, val => {
        this.local = val;
      });
    }
  },

  methods: {
    change(event) {
      event.preventDefault();
      event.stopPropagation();
      this.local = !this.local;
      this.$emit('change', this.local);
    }
  }
};
</script>

<style scoped>
.c-checkbox i {
  color: '#0000008a';
  user-select: none;
  cursor: pointer;
}

.c-checkbox.active i {
  color: var(--v-primary-base);
}
</style>
