require('dotenv').load();
const Express = require('express');
const App = Express();
const BodyParser = require('body-parser');
const Request = require('request-promise-native');
const PORT = 8080;

App.set('view engine', 'ejs');
App.use(BodyParser.urlencoded({ extended: false }));
App.use(Express.static('public'));

App.get('/', (req, res) => {
  res.render('index');
});

App.get('/words/:word', (req, res) => {
  lookupWord(req.params.word).then(apiResponse => {
    res.json(apiResponse);
  }).catch(err => res.json(JSON.stringify({ err })));
});

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Goodwords seems to be listening on port ${PORT} so that's pretty good 👍`);
});

// Helpers
function lookupWord(word, language='en') {
  const options = {
    headers: {'app_id': process.env.OXFORD_ID, 'app_key': process.env.OXFORD_KEY},
    uri: `https://od-api.oxforddictionaries.com:443/api/v1/entries/${language}/${word.toLowerCase()}`,
  };
  return Request(options);
}
