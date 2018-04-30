'use strict';

function ClassManager() {
  if(!(this instanceof ClassManager)){
    throw new TypeError('ClassManager must be created with new keyword');
  }
}

ClassManager.prototype.toggleClass = function(element, className) {

  if (element.classList) {
    console.log('element toggled : '+element.classList.toggle(className));
  } else {
    // For IE9
    const classes = element.className.split(" ");
    const i = classes.indexOf(className);

    if (i >= 0)
      classes.splice(i, 1);
    else
      classes.push(className);
    element.className = classes.join(" ");
  }
};

module.exports = ClassManager;