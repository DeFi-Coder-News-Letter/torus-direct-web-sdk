import { EventEmitter } from "events";

class PopupHandler extends EventEmitter {
  constructor({ url, target, features }) {
    super();
    this.url = url;
    this.target = target || "_blank";
    this.features = features || "directories=0,titlebar=0,toolbar=0,status=0,location=0,menubar=0,height=700,width=1200";
    this.window = undefined;
    this.windowTimer = {};
    this.iClosedWindow = false;
    this._setupTimer();
  }

  _setupTimer() {
    this.windowTimer = setInterval(() => {
      if (this.window && this.window.closed) {
        clearInterval(this.windowTimer);
        if (!this.iClosedWindow) {
          this.emit("close");
        }
        this.iClosedWindow = false;
        this.window = undefined;
      }
      if (this.window === undefined) clearInterval(this.windowTimer);
    }, 500);
  }

  open() {
    this.window = window.open(this.url, this.target, this.features);
    return Promise.resolve();
  }

  close() {
    this.iClosedWindow = true;
    if (this.window) this.window.close();
  }
}

export default PopupHandler;
