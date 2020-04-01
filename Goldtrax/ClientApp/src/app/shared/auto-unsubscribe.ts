export function AutoUnsubscribe(constructor) {

  const original = constructor.prototype.ngOnDestroy;

  constructor.prototype.ngOnDestroy = function () {
    //for (let prop in this) {
    //  const property = this[prop];
    //  if (Array.isArray(property) && property.length && property.every(item => typeof item.unsubscribe === "function")) {
    //    for (let sub of property) {
    //      sub.unsubscribe();
    //    }
    //    break;
    //  }
    //}
    if (this.subscriptions) {
      for (let sub of this.subscriptions) {
        sub.unsubscribe();
      }
    }
    original && typeof original === "function" && original.apply(this, arguments);
  };

}
