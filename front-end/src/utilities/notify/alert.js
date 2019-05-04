import APP_EVENT from 'core/app-events';
import { Checker } from 'utilities';
import {
  APPEVENT_ALERT_INFO,
  APPEVENT_ALERT_WARN,
  APPEVENT_ALERT_ERROR
} from 'core/app-events';

const OPTIONS = {
  INTERVAL_UPDATE_MESSAGE: false,
  INTERVAL_TIME_UPDATE_MESSAGE: 990 // interval each 1s
};

export default class {
  static CONFIRM(callback) {
    YES_NO_ALERT.setCallback(choose => {
      callback(Checker.hasText(choose) && choose == 'true');
    }).open();
  }

  static info() {
    return new AlertBuilder(APPEVENT_ALERT_INFO);
  }

  static warn() {
    return new AlertBuilder(APPEVENT_ALERT_WARN);
  }

  static error() {
    return new AlertBuilder(APPEVENT_ALERT_ERROR);
  }
}

class AlertBuilder {
  constructor(event) {
    this.event_code = event;
  }

  setTitle(title) {
    if (Checker.hasText(title)) {
      this.title = title;
      return this;
    }
    return null;
  }

  setMessage(message) {
    if (Checker.hasText(message) || Checker.isFunction(message)) {
      this.message = message;
      return this;
    }
    return null;
  }

  setControls(controls) {
    if (controls == null || !Checker.isObject(controls)) {
      return null;
    }
    this.controls = controls;
    return this;
  }

  setCallback(callback, data) {
    if (callback == null || !Checker.isFunction(callback)) {
      return null;
    }
    this.callback = callback;
    this.data = data;
    return this;
  }

  setOptions(options) {
    if (options == null || !Checker.isObject(options)) {
      return null;
    }
    this.options = options;
    return this;
  }

  prepare() {
    if (this.title == undefined) this.title = 'global.alert.title';

    if (this.message == undefined) return false;

    if (this.controls == undefined) this.controls = {};

    if (this.callback == undefined) this.callback = () => {};

    if (this.options == undefined) {
      this.options = Object.assign({}, OPTIONS);
    } else {
      this.options = Object.assign(OPTIONS, this.options);
    }

    return true;
  }

  open() {
    if (!this.prepare())
      throw new TypeError('Please provide a message before open alert.');

    APP_EVENT.publishEvent(this.event_code, this);
  }
}

const YES_NO_ALERT = new AlertBuilder(APPEVENT_ALERT_INFO);
YES_NO_ALERT.setTitle('global.alert.default_confirm.title')
  .setMessage('global.alert.default_confirm.message')
  .setControls({
    true: {
      text: 'global.alert.default_confirm.yes_btn',
      color: 'primary',
      style: 'normal',
      dark: true
    },
    false: {
      text: 'global.alert.default_confirm.no_btn',
      color: 'info'
    }
  });
