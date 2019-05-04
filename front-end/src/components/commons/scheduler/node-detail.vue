<template>
  <v-dialog v-model="dialog" width="40%">
    <v-card flat class="app-wrapper">
      <v-layout align-center fill-height class="header white--text ui_title">
        <v-flex md10>
          <v-card-title class="subheading white--text title">
            Chi tiết đặt phòng
          </v-card-title>
        </v-flex>
        <v-flex md5>
          <v-layout row align-center justify-end fill-height>
            <v-btn flat icon @click="emitCloseState">
              <v-icon color="white">close</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-card-text class="body overflow_hidden">
        <v-layout row wrap>
          <v-flex md4 class="lable-form"><div>Người đặt</div></v-flex>
          <v-flex md8>
            <v-text-field v-model="data.author" label="" readonly />
          </v-flex>

          <v-flex md4 class="lable-form"><div>Thời gian (giờ)</div></v-flex>
          <v-flex md8>
            <v-text-field v-model="computeTimeBooking" label="" readonly />
          </v-flex>

          <v-flex md4 class="lable-form"><div>Ngày</div></v-flex>
          <v-flex md8>
            <v-text-fieldv-model="data.booking_date" label="" readonly />
          </v-flex>

          <v-flex
            v-if="data.extra_info != null && data.extra_info != undefined"
            md12
          >
            <v-layout row wrap>
              <v-flex md4 class="lable-form"><div>Phòng</div></v-flex>
              <v-flex md8>
                <v-text-field
                  v-model="data.extra_info.room"
                  label=""
                  readonly
                />
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex md4 class="lable-form"><div>Ghi chú</div></v-flex>
          <v-flex md8>
            <v-text-field v-model="data.description" label="" readonly />
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },

    data: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dialog: false
    };
  },

  computed: {
    computeTimeBooking() {
      return (
        this.computeNumber(this.data.from) +
        ' - ' +
        this.computeNumber(this.data.to)
      );
    }
  },

  watch: {
    show() {
      this.dialog = this.show;
    },

    dialog() {
      if (!this.dialog) {
        this.emitCloseState();
      }
    }
  },

  created() {
    this.dialog = this.show;
  },

  methods: {
    emitCloseState() {
      this.$emit('close', false);
    },

    computeNumber(num) {
      if ((num + '').includes('.5')) {
        return (num + '').split('.')[0] + ':30';
      }

      return (num + '').padStart(2, '0') + ':00';
    }
  }
};
</script>

<style scoped>
.lable-form {
  display: flex;
}

.lable-form div {
  margin: auto 0;
  vertical-align: middle;
  font-size: 15px;
  color: #8a8a8a;
  font-weight: 500;
}
</style>
