const fs = require("fs");
const path = require("path");
const { program } = require("commander");

program
  .version("0.1.0")
  .arguments("<dir>")
  .option(
    "-d, --depth <n>",
    "maximum depth of directories to traverse",
    parseInt
  )
  .action((dir) => {
    const depth = program.depth || Infinity;
    printTree(dir, "", depth);
  })
  .parse(process.argv);

function printTree(dirPath, prefix, depth) {
  console.log(prefix + path.basename(dirPath) + "/");
  prefix = prefix + "  ";
  if (depth === 0) {
    return;
  }
  try {
    const files = fs.readdirSync(dirPath);
    files.forEach((file, index) => {
      const filePath = path.join(dirPath, file);
      const isLast = index === files.length - 1;
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        printTree(filePath, prefix + (isLast ? "  " : "| "), depth - 1);
      } else {
        console.log(prefix + (isLast ? "└── " : "├── ") + file);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
