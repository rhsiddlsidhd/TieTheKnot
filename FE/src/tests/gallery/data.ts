interface ItemType {
  quantity: number;
  type: string[][];
}

interface Data {
  [key: string]: ItemType;
}

const data: Data = {
  a: {
    quantity: 3,
    type: [
      ["a", "b"],
      ["a", "c"],
    ],
  },
  b: {
    quantity: 3,
    type: [
      ["b", "a"],
      ["c", "a"],
    ],
  },
  c: {
    quantity: 4,
    type: [
      ["a", "b"],
      ["a", "c"],
      ["d", "c"],
    ],
  },
};

export default data;
