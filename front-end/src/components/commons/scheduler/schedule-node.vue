<template>
  <v-tooltip top>
    <div
      v-if="data.state != undefined"
      slot="activator"
      :class="['schedule-line', data.state]"
      v-bind:style="{ width: data.width + 'px', left: data.left + 'px' }"
      @click="openDetail"
    />
    <div class="tooltip-data">
      <span>
        {{ computeNumber(data.from) + 'h - '
        }}{{ computeNumber(data.to) + 'h' }}
      </span>
      <strong>{{ ' | ' + data.author }}</strong>
    </div>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  methods: {
    computeNumber(num) {
      if ((num + '').includes('.5')) {
        return (num + '').split('.')[0] + ':30';
      }

      return (num + '').padStart(2, '0') + ':00';
    },

    openDetail() {
      this.$emit('view');
    }
  }
};
</script>

<style scoped>
.node-container {
  background-color: #fff;
  box-shadow: 0px 0px 5px 5px red;
}

.schedule-line {
  cursor: pointer;
  position: absolute;
  height: 15px;
  top: 16px;
  border-left: 1px solid #fff;
  border-right: 1px solid #fff;
}

.schedule-line.old-time {
  background-color: #d1d1d1;
}

.schedule-line.current-time {
  background-color: rgb(243, 156, 18);
}

.schedule-line.future-time {
  background-color: rgb(51, 122, 183);
}

.tooltip-data {
  background-color: #fff;
  margin: -5px -8px;
  color: #5a5a5a;
  font-weight: 500;
  padding: 5px 8px;
  border: 1px solid #c5c5c5;
}

.tooltip-data span {
  color: rgb(51, 122, 183);
}
</style>
