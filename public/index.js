let loading = false;

const button = document.getElementsByTagName('button')[0];
button.onclick = () => {
  loading = true;
  const word = document.getElementById('wordbox').value;
  fetch(`/words/${word}`).then(stream => stream.json()).then(res => {
    handleOxfordResponse(JSON.parse(res));
    loading = false;
  }).catch(err => alert(err));
};

function handleOxfordResponse(response) {
  if (!response.results) { alert("That word didn't work out :("); return; }
  response.results.forEach(result => renderDefinition(result));
}

function renderDefinition(wordObject) {
  const definitionsNode = document.getElementsByClassName('definitions')[0];

  // e.g.: <h1>word</h1>
  const heading = document.createElement('h2');
  heading.innerHTML = wordObject.word;

  definitionsNode.appendChild(heading);

  // I hate this 😬
  wordObject.lexicalEntries.forEach(le => {
    le.entries.forEach(entry => {
      entry.senses.forEach(sense => {
        sense.definitions.forEach(def => {
          // e.g.: <p>definition of the word</p>
          const definitionNode = document.createElement('p');
          definitionNode.innerHTML = def;
          definitionsNode.appendChild(definitionNode);
        });
      });
    });
  });
}

// requestAnimationFrame asynchronously runs handleLoading as often as possible
// to check the state of the 'loading' variable, and alter the body class accordingly
function handleLoading() {
  if (loading) {
    document.body.setAttribute('class', 'loading');
  } else {

    document.body.setAttribute('class', 'loaded');
  }
  requestAnimationFrame(handleLoading);
}

requestAnimationFrame(handleLoading);
