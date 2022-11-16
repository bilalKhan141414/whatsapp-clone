export const getFirstCommonItem = (firstArr, secArr) => {
  const firstArrObj = firstArr.reduce((result, current) => {
    result[current] = true;
    return result;
  }, {});

  for (const element of secArr) {
    if (firstArrObj[element]) return element;
  }
};
