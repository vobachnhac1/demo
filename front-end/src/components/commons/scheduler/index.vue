<template>
  <div>
    <v-data-table :headers="table.headers" :items="table.data" hide-actions>
      <template slot="headers" slot-scope="props">
        <tr class="scheduler-header">
          <th
            v-for="(header, index) in props.headers"
            :key="index"
            :width="index == 0 ? 120 : colWidth"
            class="text-xs-center fix_col"
          >
            {{ header.text }}
          </th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
        <tr class="scheduler-row">
          <td width="120">{{ props.item.date }}</td>
          <td
            :width="fix_headers.length * colWidth"
            class="text-xs-center scheduler-wrapper"
          >
            <template v-for="(item, i) in loadScheduler(props.item.date)">
              <schedule-node
                :key="i"
                :data="item"
                @view="openDetailDialog(item, props.item.date)"
              />
            </template>
          </td>
        </tr>
      </template>
    </v-data-table>
    <node-detail
      :show="view_detail"
      :data="view_data"
      @close="handleCloseDetailDialog"
    />
  </div>
</template>

<script>
import ScheduleNode from './schedule-node';
import NodeDetail from './node-detail';

export default {
  components: { ScheduleNode, NodeDetail },

  props: {
    scheduleData: {
      type: Object,
      required: true
    },

    extraInfo: {
      type: Object,
      default: () => {},
      required: false
    },

    curMonth: {
      type: Number,
      default: new Date().getMonth() + 1,
      required: false
    },

    curYear: {
      type: Number,
      default: new Date().getFullYear(),
      required: false
    },

    colWidth: {
      type: Number,
      default: 80,
      required: false
    }
  },

  data() {
    return {
      view_detail: false,
      view_data: {},

      table: {
        headers: [
          { text: 'Ngày', sortable: false, align: 'center', value: 'date' }
        ],
        data: {}
      },

      fix_headers: [
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
        '10:30',
        '11:00',
        '11:30',
        '12:00',
        '12:30',
        '13:00',
        '13:30',
        '14:00',
        '14:30',
        '15:00',
        '15:30',
        '16:00',
        '16:30',
        '17:00',
        '17:30'
      ]
    };
  },

  watch: {
    curMonth() {
      this.prepareDateRows();
    },

    curYear() {
      this.prepareDateRows();
    },

    colWidth() {
      this.prepareHeader();
    },

    scheduleData() {
      this.table.data = [];
      this.prepareDateRows();
    }
  },

  created() {
    this.prepareHeader();
    this.prepareDateRows();
  },

  methods: {
    prepareHeader() {
      for (var i = 0; i < this.fix_headers.length; i++) {
        this.table.headers.push({
          text: this.fix_headers[i],
          sortable: false,
          width: this.colWidth
        });
      }
    },

    prepareDateRows() {
      let listDays = [];
      let date = new Date(this.curYear, this.curMonth - 1, 1);

      while (date.getMonth() === this.curMonth - 1) {
        let [month, day, year] = date.toLocaleDateString('en').split('/');
        listDays.push({
          date: `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`
        });
        date.setDate(date.getDate() + 1);
      }
      this.table.data = listDays;
    },

    openDetailDialog(node, booking_date) {
      this.view_detail = true;
      node.booking_date = booking_date;
      node.extra_info = this.extraInfo;
      this.view_data = node;
    },

    loadScheduler(date) {
      let result = [];
      if (this.scheduleData != null) {
        let dataInDate = this.scheduleData[date];
        if (dataInDate != undefined || dataInDate != null) {
          for (var i = 0; i < dataInDate.length; i++) {
            let element = dataInDate[i];
            if (element.to > element.from) {
              element.left =
                (element.from * 2 - 16) * this.colWidth + this.colWidth / 2;
              element.width =
                (element.to * 2 - element.from * 2) * this.colWidth;
              element.state = this.calculateTime(element, date);
              result.push(element);
            }
          }
        }
      }
      return result;
    },

    handleCloseDetailDialog() {
      this.view_detail = false;
      this.view_data = {};
    },

    calculateTime(node, date) {
      let now = new Date();

      let compare_date = new Date(date);
      let current_date = new Date(now.toLocaleDateString('en'));

      let hours = (now.getUTCHours() + 7) % 24;
      let minutes = now.getUTCMinutes();
      let current_time =
        hours + (minutes == 30 ? 0.5 : minutes > 30 ? 0.6 : 0.4);

      if (
        compare_date.getTime() == current_date.getTime() &&
        node.from <= current_time &&
        current_time <= node.to
      ) {
        return 'current-time';
      } else if (
        compare_date.getTime() > current_date.getTime() ||
        (compare_date.getTime() == current_date.getTime() &&
          current_time < node.from)
      ) {
        return 'future-time';
      } else {
        return 'old-time';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.scheduler-wrapper {
  position: relative;
}

.fix_col {
  display: table;
  line-height: 48px;
}

.scheduler-header {
  display: inline-flex;
  height: 48px;
  line-height: 48px;
  max-height: 48px;
}

.scheduler-row {
  display: table-row-group;
}
</style>
