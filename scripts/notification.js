'use strict';
/*global angular:false, window:false */

angular.module(
    'Notification', []
).service('Notification', function() {
  var NotificationsWebkitApi = window.webkitNotifications;
  var NotificatonW3cApi = window.Notification;

  function getStatus() {
    if (NotificatonW3cApi) {
      var n = new NotificatonW3cApi('');
      var status = n.permission;
      window.setTimeout(function() {n.close();}, 1);
      if (status === "granted") {
        return 'allowed';
      } else if (status === "default") {
        return 'unknown';
      } else {
        return 'denied';
      }
    } else if (NotificationsWebkitApi) {
      if (NotificationsWebkitApi.checkPermission() === 0 /*PERMISSION_ALLOWED*/) {
        return 'allowed';
      } else if (NotificationsWebkitApi.checkPermission() === 1 /*PERMISSION_NOT_ALLOWED*/) {
        return 'unknown';
      } else {
        return 'denied';
      }
    } else {
      return 'unsupported';
    }
  }
  
  function requestPermission(notifyFn) {
    // Appears Chrome's old style is more reliable (with v 24.0.1312.57)
    if (NotificationsWebkitApi) {
      NotificationsWebkitApi.requestPermission(notifyFn);
    } else if (NotificatonW3cApi) {
      NotificatonW3cApi.requestPermission(notifyFn);
    }
  }
  
  function show(title, body, image, tag, onclick, onclose) {
    var n;
    if (NotificatonW3cApi) {
      n = new NotificatonW3cApi(title, {body: body, iconUrl: image, tag: tag});
    } else if (NotificationsWebkitApi) {
      n = NotificationsWebkitApi.createNotification(image ? image : '', title, body);
    } else {
      return;
    }
    
    n.onclick = onclick;
    n.onclose = onclose;
    
    if (NotificationsWebkitApi) {
      n.tag = tag;
      n.show();
    }
    
    return n;
  }
  
  return {
    getStatus: getStatus,
    requestPermission: requestPermission,
    show: show
  };
});