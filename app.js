const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      contentTypes = require('./utils/content-types'),
      sysInfo      = require('./utils/sys-info'),
      math         = require('mathjs'),
      env          = process.env,
      express = require('express'),
      bodyParser = require('body-parser'),
      urlencodedParser = bodyParser.urlencoded({ extended: false }),
      app = express(),
      exphbs = require('express-handlebars');


app.use('/static', express.static(path.join(__dirname, 'static')));
app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');

/* ROUTES */
app.get('/health', function (req, res) {
  res.writeHead(200);
  res.end();
})

app.get('/old', function (req, res){
  res.render('introOLD.hbs', {layout: 'singleOLD.hbs'});
})
app.get('/', function (req, res){
  res.render('intro.hbs', {layout: 'single.hbs'});
})
app.post('/postdata', urlencodedParser, function (req, res) {
  var doc = { age: req.body.age,
              cardiac: req.body.cardiac,
              resp: req.body.resp,
              ecg: req.body.ecg,
              sys: req.body.sys,
              pulse: req.body.pulse,
              hb: req.body.hb,
              wbc: req.body.wbc,
              ur: req.body.ur,
              na: req.body.na,
              pot: req.body.pot,
              gcs: req.body.gcs
            };

  var possum = {};
  possum.ps =  parseInt(doc.age)+parseInt(doc.cardiac)+
               parseInt(doc.resp)+parseInt(doc.ecg)+
               parseInt(doc.sys)+parseInt(doc.pulse)+
               parseInt(doc.hb)+parseInt(doc.wbc)+
               parseInt(doc.ur)+parseInt(doc.na)+
               parseInt(doc.pot)+parseInt(doc.gcs);
  var a = -6.0386+(0.1539*possum.ps);
  var b = -2.7569+(0.0968*possum.ps);
  possum.vpm = math.round((Math.exp(a)/(1+Math.exp(a))*100),2);
  possum.rpm = math.round((Math.exp(b)/(1+Math.exp(b))*100),2);

  res.render('score.hbs', possum);
})

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
  console.log(`Application worker ${process.pid} started...`);
});
