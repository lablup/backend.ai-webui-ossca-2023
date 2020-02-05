/**
 @license
 Copyright (c) 2015-2020 Lablup Inc. All rights reserved.
 */

import {css, customElement, html, LitElement, property} from "lit-element";
import 'weightless/snackbar';
import 'weightless/button';
import 'weightless/icon';

@customElement("lablup-notification")
export default class LablupNotification extends LitElement {
  public shadowRoot: any;
  public updateComplete: any;

  @property({type: String}) text = '';
  @property({type: String}) detail = '';
  @property({type: String}) message = '';
  @property({type: String}) requestUrl = '';
  @property({type: String}) status = '';
  @property({type: String}) timestamp = '';
  @property({type: Object}) indicator;
  @property({type: Array}) notifications = Array();
  @property({type: Array}) notificationstore = Array();
  @property({type: Boolean}) active = true;
  @property({type: Boolean}) supportDesktopNotification = false;
  @property({type: Number}) step = 0;
  @property({type: Object}) newDesktopNotification = Object();

  constructor() {
    super();
  }

  static get is() {
    return 'lablup-notification';
  }

  static get styles() {
    return [
      // language=CSS
      css`
        wl-snackbar {
          position: fixed;
          right: 20px;
          font-size: 16px;
          font-weight: 400;
          font-family: 'Quicksand', Roboto, sans-serif;
          z-index: 12345678;
        }

        wl-button {
          --button-font-size: 12px;
          --button-fab-size: 12px;
        }

        wl-icon {
          --icon-size: 10px;
        }
      `];
  }

  render() {
    // language=HTML
    return html``;
  }

  shouldUpdate() {
    return this.active;
  }

  firstUpdated() {
    if ("Notification" in window) {
      console.log(Notification.permission);
      if (Notification.permission === "granted") {
        this.supportDesktopNotification = true;
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(() => {
          this.supportDesktopNotification = true;
        });
      } else {
        Notification.requestPermission().then(() => {
          this.supportDesktopNotification = true;
        });
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  async getMoreState() {

  }

  async ladder() {

  }

  _hideNotification(e) {
    let hideButton = e.target;
    let dialog = hideButton.closest('wl-snackbar');
    dialog.hide();
  }

  _moreNotification(e) {
    const notification = e.target.closest('wl-snackbar');
    const button = e.target.closest('wl-button');
    notification.setAttribute('persistent', 'true');
    if (notification.querySelector('div') !== null) {
      notification.querySelector('div').style.display = 'block';
    }
    button.parentNode.removeChild(button);
    if (notification.querySelector('wl-button') === null) {
      this._createCloseButton(notification);
    }
  }

  _createCloseButton(notification) {
    let button = document.createElement('wl-button');
    button.setAttribute('slot', "action");
    button.setAttribute('flat', "");
    button.setAttribute('fab', "");
    button.addEventListener('click', this._hideNotification.bind(this));
    button.innerHTML = "<wl-icon>close</wl-icon>";
    notification.appendChild(button);
  }
  async show(persistent: boolean = false, message: string = '', log: object = Object()) {
    // if(Object.keys(log).length === 0) {
    //   log['timestamp'] = new Date().toUTCString();
    //   log['type'] = '';
    //   log['statusCode'] = 200;
    //   log['statusText'] = 'OK';
    //   log['message'] = message;
    //   log['requestUrl'] = '';
    //   log['requestMethod'] = '';
    //   log['title'] = '';
    //   log['message'] = message;
    // }
    this.gc();
    let notification_message: string;
    let notification_detail: string;
    let notification = document.createElement('wl-snackbar');
    if (message === '') {
      notification.innerHTML = '<span style="overflow-x:hidden">' + this.text + '</span>';
      if (this.detail != '') {
        notification.innerHTML = notification.innerHTML + '<div style="display:none;"> : ' + this.detail + '</div>';
      }
      notification_message = this.text;
      notification_detail = this.detail;
    } else {
      notification.innerHTML = '<span style="overflow-x:hidden">' + message + '</span>';
      this.text = message;
      if (this.detail != '') {
        notification.innerHTML = notification.innerHTML + '<div style="display:none;"> : ' + this.detail + '</div>';
      }
      notification_message = message;
      notification_detail = this.detail;
    }
    // this.notificationstore.push(log);
    if(Object.keys(log).length !== 0) {
      this._saveToLocalStoarge("backendaiconsole.logs", log);
    }

    if (this.detail != '') {
      let more_button = document.createElement('wl-button');
      more_button.setAttribute('slot', "action");
      more_button.setAttribute('flat', "");
      more_button.setAttribute('fab', "");
      more_button.addEventListener('click', this._moreNotification.bind(this));
      more_button.innerHTML = "<wl-icon>expand_more</wl-icon>";
      notification.appendChild(more_button);
    }
    this.detail = ''; // Reset the temporary detail scripts
    if (persistent === false) {
      notification.setAttribute('hideDelay', '3000');
    } else {
      notification.setAttribute('persistent', 'true');
      this._createCloseButton(notification);
    }
    notification.setAttribute('backdrop', '');
    notification.style.bottom = (20 + 55 * this.step) + 'px';
    notification.style.position = 'fixed';
    (notification.querySelector('span') as any).style.overflowX = 'hidden';
    notification.style.right = '20px';
    notification.style.fontSize = '16px';
    notification.style.fontWeight = '400';
    notification.style.fontFamily = "'Quicksand', Roboto, sans-serif";
    notification.style.zIndex = "12345678";
    document.body.appendChild(notification);
    this.notifications.push(notification);
    await this.updateComplete;
    notification.show();
    this._spawnDesktopNotification("Backend.AI", this.text, '');
  }

  _spawnDesktopNotification(title, body, icon) {
    if (this.supportDesktopNotification === false) {
      return;
    }
    let options = {
      body: body,
      icon: icon
    };
    this.newDesktopNotification = new Notification(title, options);
  }

  _saveToLocalStoarge(key, logMessages) {
    let previous_log = JSON.parse(localStorage.getItem(key) || '{}');
    let current_log = Array();

    current_log.push(logMessages);
    current_log = current_log.concat(previous_log);    
    localStorage.setItem(key, JSON.stringify(current_log));
  }

  gc() {
    if (this.notifications.length > 0) {
      let opened_notifications = this.notifications.filter(noti => noti.open === true);
      this.notifications = opened_notifications;
    }
    if (this.notificationstore.length > 5000) {
      this.notificationstore = this.notificationstore.slice(1, 5000);
    }
    this.step = this.notifications.length;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "lablup-notification": LablupNotification;
  }
}
