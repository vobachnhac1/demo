import Vue from 'vue';
import { Checker } from 'utilities';

const KEY_EVENTS = {
  13: 'pressed_enter',
  16: 'pressed_shift',
  17: 'pressed_ctrl',
  18: 'pressed_alt',
  27: 'pressed_escape',
  36: 'pressed_home',
  46: 'pressed_delete'
};
export const APPEVENT_ACTIVATE = 'onActived';
export const APPEVENT_ALERT_INFO = 'onAlertInfo';
export const APPEVENT_ALERT_WARN = 'onAlertWarn';
export const APPEVENT_ALERT_ERROR = 'onAlertError';

const ACTIVATE_EVENTS = ['keypress', 'mousemove', 'mousewheel', 'click'];
const ALL_EVENTS = [
  APPEVENT_ALERT_INFO,
  APPEVENT_ALERT_WARN,
  APPEVENT_ALERT_ERROR
];

class ApplicationEvent {
  constructor(bus, { events = [], options = {} }) {
    this.$event_bus = bus;
    if (events.length > 0) {
      this.events = events;
    } else {
      this.events = ACTIVATE_EVENTS;
    }

    this.options = options;
  }

  registerApplicationEvents() {
    var _event_bus = this.$event_bus;
    for (let i in this.events) {
      let event_name = this.events[i];
      if (ACTIVATE_EVENTS.includes(event_name)) {
        if (event_name === 'keypress') {
          window.addEventListener(event_name, event => {
            if (Checker.hasText(KEY_EVENTS[event.keyCode])) {
              _event_bus.$emit(KEY_EVENTS[event.keyCode]);
            }
            _event_bus.$emit(APPEVENT_ACTIVATE);
          });
        } else {
          window.addEventListener(
            event_name,
            () => {
              _event_bus.$emit(APPEVENT_ACTIVATE);
            },
            { passive: true }
          );
        }
      }
    }
  }

  publishEvent = (event, data) => {
    if (Checker.hasText(event) && ALL_EVENTS.includes(event)) {
      this.$event_bus.$emit(event, data);
      return true;
    }
    return false;
  };
}

// Apply global app event
export const bus = new Vue();
const APP_EVENT = new ApplicationEvent(bus, {});
export default APP_EVENT;
