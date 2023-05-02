const obj = {
  name: 1,
  items: [
    {
      name: 2,
      items: [{ name: 3 }, { name: 4 }],
    },
    {
      name: 5,
      items: [{ name: 6 }],
    },
  ],
};

tree(obj);

function tree(obj, prefix = "", isLast = true) {
  console.log(
    prefix + (obj.name == 1 ? "    " : isLast ? "└── " : "├── ") + obj.name
  );
  if (obj.items) {
    for (let i = 0; i < obj.items.length; i++) {
      const isLastItem = i === obj.items.length - 1;
      const prefixBranch = prefix + (isLast ? "    " : "│   ");
      tree(obj.items[i], prefixBranch, isLastItem);
    }
  }
}
