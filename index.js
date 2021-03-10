const port = process.env.PORT || 5000;
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

app.use((req, res, next) => {
  if(req.query.lang) {
    res.cookie('selected_language', req.query.lang)
    res.redirect(req._parsedUrl.pathname);
  }else{
    next();
  }
});

app.get("/", function (req, res) {
  res.render("index", {
    _: i18n.translateMiddleware(req, res)
  })
})

app.get("/project/:id", function (req, res) {
  const project = req.params.id;
  const _ = i18n.translateMiddleware(req, res);
  const _p = i18n.createNamespace(_, `projects_page.${project}`);

  if(_p()) {
    res.render("project", {
      project,
      _,
      _p
    })
  }else{
    res.status(404);
    res.render("404", {
      _,
    })
  }
})

app.use(function(req, res, next){
  res.status(404);

  const _ = i18n.translateMiddleware(req, res);

  // respond with html page
  if (req.accepts('html')) {
    res.render("404", {
      _,
    });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});



app.listen(port, function () {
  console.log(`listening to requests on port ${port}`);
})