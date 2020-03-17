export {}; // Avoid isolatedModules warning

it("renders without crashing", () => {
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.appendChild(root);
  require("./index");
});
