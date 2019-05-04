<template>
  <v-dialog v-model="show" width="500" v-bind="{ persistent: btns.length > 0 }">
    <v-container fluid text-md-center grid-list-md class="no_padding">
      <v-card>
        <v-card-text class="alert_title" :style="{ color: color }">
          <v-icon :color="color" medium>{{ icon }}</v-icon>
          {{ $t(event_data.title) }}
        </v-card-text>
        <v-card-text>
          <v-flex class="text_message" md10 v-html="$t(message)" />
        </v-card-text>
        <v-card-text class="no_padding control_side">
          <v-layout justify-end>
            <template v-for="item in btns">
              <v-btn
                :key="item.code"
                :color="item.color || color"
                :class="{
                  control_btn: true,
                  'white--text': item.dark || false
                }"
                v-bind="{
                  flat: item.style == undefined || item.style == BTN_STYLE.NONE,
                  outline: item.style == BTN_STYLE.OUTLINE
                }"
                small
                @click="response(item.code)"
              >
                {{ $t(item.text) }}
              </v-btn>
            </template>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-container>
  </v-dialog>
</template>

<script>
import { Checker } from 'utilities';
import {
  APPEVENT_ALERT_INFO,
  APPEVENT_ALERT_WARN,
  APPEVENT_ALERT_ERROR
} from 'core/app-events';

export default {
  data() {
    return {
      show: false,
      message: '',
      icon: '',
      color: '',

      btns: [],

      event_data: {
        title: 'global.alert.title'
      },

      [APPEVENT_ALERT_INFO]: {
        icon: this.$vuetify.icons.INFO,
        color: this.$vuetify.theme.success
      },

      [APPEVENT_ALERT_WARN]: {
        icon: this.$vuetify.icons.WARN,
        color: this.$vuetify.theme.warning
      },

      [APPEVENT_ALERT_ERROR]: {
        icon: this.$vuetify.icons.ERROR,
        color: this.$vuetify.theme.error
      },

      ALL_EVENTS: [
        APPEVENT_ALERT_INFO,
        APPEVENT_ALERT_WARN,
        APPEVENT_ALERT_ERROR
      ],

      BTN_STYLE: {
        NORMAL: 'NORMAL',
        OUTLINE: 'OUTLINE',
        NONE: 'NONE'
      }
    };
  },

  created() {
    this.listenEvent();
  },

  methods: {
    listenEvent() {
      this.$bus.$on(this.ALL_EVENTS, data => {
        if (!this.show) {
          Object.assign(this, this[data.event_code]);
          this.message = '';
          this.btns = [];

          this.showAlert(data);
        }
      });
    },

    showAlert(event_data) {
      this.show = true;
      this.event_data = event_data;

      if (Checker.isFunction(event_data.message)) {
        this.message = event_data.message();
      } else {
        this.message = event_data.message;
      }

      if (event_data.controls != null) {
        for (let btn in event_data.controls) {
          let btn_config = event_data.controls[btn];
          if (Checker.hasText(btn_config)) {
            this.btns.push({
              code: btn,
              text: btn_config
            });
          } else if (Checker.isObject(btn_config)) {
            this.btns.push({
              code: btn,
              text: btn_config.text,
              color: btn_config.color || this.color,
              style: this.chooseBtnStyle(btn_config.style),
              dark: btn_config.dark || false
            });
          }
        }
      }

      this.optionsHandler(event_data);
    },

    chooseBtnStyle(style) {
      if (
        Checker.hasText(style) &&
        Object.keys(this.BTN_STYLE).includes(style.toUpperCase())
      ) {
        return style.toUpperCase();
      }
      return this.BTN_STYLE.NONE;
    },

    optionsHandler(event_data) {
      if (
        Checker.isBoolean(event_data.options.INTERVAL_UPDATE_MESSAGE) &&
        event_data.options.INTERVAL_UPDATE_MESSAGE
      ) {
        if (Checker.isFunction(event_data.message)) {
          var updateMessage = setInterval(() => {
            let result = event_data.message();
            if (Checker.isString(result)) {
              this.message = result;
            } else {
              clearInterval(updateMessage);
            }
          }, event_data.options.INTERVAL_TIME_UPDATE_MESSAGE);
        }
      }
    },

    response(code) {
      let clone_data = Object.assign({}, this.event_data);
      this.show = false;

      if (clone_data.callback != null) {
        clone_data.callback(code, clone_data.data);
      }
    }
  }
};
</script>

<style scoped>
.alert_title {
  text-align: left;
  color: #444;
  font-size: 22px;
  background-color: #e1e1e1;
}

.text_message {
  line-height: 40px !important;
  color: #999;
  text-align: left;
  font-size: 18px;
}

.control_side {
  width: calc(100% - 32px);
  margin: 0 16px;
  padding: 7px 0 !important;
}

.control_btn {
  margin: 7px 0 7px 10px !important;
}
</style>
