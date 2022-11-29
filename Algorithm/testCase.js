const case1 = {
  neededContainer: 3,
  listOption: [
    {
      name: "Container renter A",
      container: 1,
      totalCost: 1,
    },
    {
      name: "Container renter B",
      container: 2,
      totalCost: 1,
    },
    {
      name: "Container renter C",
      container: 3,
      totalCost: 3,
    },
  ],
};
const case2 = {
  neededContainer: 10,
  listOption: [
    {
      name: "Container renter A",
      container: 9,
      totalCost: 5,
    },
    {
      name: "Container renter B",
      container: 2,
      totalCost: 10,
    },
    {
      name: "Container renter C",
      container: 4,
      totalCost: 3,
    },
  ],
};
const case3 = {
  neededContainer: 10,
  listOption: [
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
      container: 10,
      totalCost: 3,
    },
  ],
};

module.exports = { case1, case2, case3 };
