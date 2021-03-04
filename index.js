const express = require("express")
const app = express()
const eta = require("eta")
const cookieParser = require('cookie-parser');
const I18N = require('./i18n')
eta.configure({
  // cache: true,
  tags: ['{{', '}}'],
  useWith: true,
  parse: {
    exec: "=",
    interpolate: "",
    raw: "%"
  },
})

const i18n = new I18N({
  availableLang: [
    'fr', 
    'en'
  ]
})

app.engine("eta", eta.renderFile)
app.set("view engine", "eta")
app.set("views", "./views")

app.use(express.static('public'));
app.use(cookieParser());


app.get("/", function (req, res) {
  res.render("index", {
    _: i18n.translateMiddleware(req, res)
  })
})

app.listen(5000, function () {
  console.log("listening to requests on port 5000")
})