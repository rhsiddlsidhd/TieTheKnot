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
  d: {
    quantity: 4,
    type: [
      ["a", "b"],
      ["d", "b"],
      ["d", "c"],
    ],
  },
  e: {
    quantity: 5,
    type: [
      ["a", "b"],
      ["a", "c"],
      ["d", "c"],
      ["d", "e"],
    ],
  },
  f: {
    quantity: 5,
    type: [
      ["a", "b"],
      ["c", "b"],
      ["c", "d"],
      ["e", "d"],
    ],
  },
  g: {
    quantity: 6,
    type: [
      ["a", "b"],
      ["c", "d"],
      ["c", "d"],
      ["e", "f"],
    ],
  },
};

export default data;
