'use strict'

const utils = (() => {
  const searchString = (field, term) => {
    let temp = typeof term === "string" ? term : term.toString();
    const strArray = temp
      .toLowerCase()
      .split(/[ ,.&]/)
      .filter(Boolean)
      .map(item => field + ":" + item);
    return strArray.join("+AND+");
  };

  return {
    searchString
  };
})();