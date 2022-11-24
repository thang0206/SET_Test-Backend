const neededContainer = 10;
const listOption = [
  {
    name: "Container renter A",
    container: 5,
    totalCost: 5,
  },
  {
    name: "Container renter B",
    container: 2,
    totalCost: 10,
  },
  {
    name: "Container renter C",
    container: 2,
    totalCost: 3,
  },
];

function getSumOfContainerAndTotalPrice(subAggregate, listOption) {
  let container = 0,
    totalPrice = 0;
  const field = {
    sumOfContainer: container,
    sumOfTotalPrice: totalPrice,
  };

  for (let key in subAggregate) {
    if (subAggregate[key] == 1) {
      field.sumOfContainer += listOption[key].container;
      field.sumOfTotalPrice += listOption[key].totalCost;
    }
  }
  return field;
}

function solve(neededContainer, list) {
  const subAggregate = list.map(() => 0);
  let length = subAggregate.length;
  let i;
  let minPrice = Infinity;
  do {
    i = length - 1;
    const field = getSumOfContainerAndTotalPrice(subAggregate, list);
    if (
      field.sumOfContainer === neededContainer &&
      field.sumOfTotalPrice < minPrice
    ) {
      minPrice = field.sumOfTotalPrice;
    }
    while (i >= 0 && subAggregate[i] == 1) {
      subAggregate[i] = 0;
      i--;
    }
    if (i >= 0) {
      subAggregate[i] = 1;
    }
  } while (i >= 0);
  if (minPrice === Infinity) {
    console.log("No enough");
  } else {
    console.log("total cost is " + minPrice);
  }
}

solve(neededContainer, listOption);
