module.exports = [
  {
    type: "list",
    name: "type",
    message: "select a type of project(web/app/wap)",
    default: "web",
    choices: ["web", "app", "wap"],
  },
  {
    type: "input",
    name: "name",
    message: "input the project name",
    default: "bici-web",
    default: function(answer) {
      const { type } = answer
      const defaultName = type === "web" ? "bici-web" : type === "wap" ? "bici-wap" : "bici-app"
      return defaultName
    },
  },
  {
    type: "input",
    name: "version",
    message: "input the version number",
    default: "1.0.0",
  },
  {
    type: "input",
    name: "description",
    message: "description",
    default: function (answer) {
      const { type } = answer
      const desc = type === 'web' ? 'A web app for bicitech.' : type === "wap" ? "A wap app for bicitech" : 'A rn app for bicitech.'
      return desc
    },
  },
  {
    type: "confirm",
    name: "redux",
    message: "do you need redux",
    default: true,
    when: function(answer) {
      const { type } = answer
      return type === "web"
    },
  },
  {
    type: "confirm",
    name: "eslint",
    message: "use a standard eslint config",
    default: true,
  },
]
