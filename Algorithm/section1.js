const { case1, case2, case3 } = require("./testCase");

// console.log("case1", case1);
function sortListOption(listOption) {
  listOption.sort((current, next) => {
    return (
      current.totalCost / current.container - next.totalCost / next.container
    );
  });
}

function solveProblem(neededContainer, listOption) {
  const result = [];
  sortListOption(listOption);
  // console.log(listOption);
  for (let i = 0; i < listOption.length; i++) {
    const option = listOption[i];
    const costPerOne = option.totalCost / option.container;
    if (option.container >= neededContainer) {
      option.container = neededContainer;
      option.totalCost = costPerOne * option.container;
      result.push({
        ...option,
      });
      return result;
    }
    result.push({
      ...option,
    });
    neededContainer -= listOption[i].container;
  }
  return result;
}

function logOutPut(result, neededContainer) {
  let totalCost = 0;
  let totalContainer = 0;
  result.forEach((element) => {
    console.log(
      `[Contract with] ${element.name} ${element.container} container, price: ${element.totalCost}`
    );
    totalCost += element.totalCost;
    totalContainer += element.container;
  });
  if (totalContainer < neededContainer) {
    console.log("No enough container");
  }
  console.log(`[Summary] total cost ${totalCost}`);
}

const result = solveProblem(case2.neededContainer, case2.listOption);
logOutPut(result, case2.neededContainer);
