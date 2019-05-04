import _ from 'lodash';

export const toggleFullScreen = () => {
  let doc = window.document;
  let docEl = doc.documentElement;

  let requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  let cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
};

export const prettyJson = (target, spaces = 2) => {
  let jsonStr = '{}';
  if (_.isString(target)) {
    jsonStr = target;
  } else if (_.isObject(target)) {
    jsonStr = JSON.stringify(target, null, spaces);
  }

  jsonStr = jsonStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return jsonStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function(match) {
      var styles = 'color: darkorange;'; //Number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          styles = 'color: #666;font-weight: 600;'; //key
        } else {
          styles = 'color: green;'; //String
        }
      } else if (/true|false/.test(match)) {
        styles = 'color: blue;'; //Boolean
      } else if (/null/.test(match)) {
        styles = 'color: magenta;'; //null
      }
      return '<span style="' + styles + '">' + match + '</span>';
    }
  );
};
