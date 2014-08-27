function demo (lorem) {
  var testStyle = document.getElementById('test-style');
  if (!testStyle) {
    testStyle = document.createElement('style');
    testStyle['id'] = 'test-style';
    document.head.appendChild(testStyle);
  }

  var svg = generate(fontData, analyze(lorem));
  // ensure that every character is 8 bit.
  // otherwise it will crash.
  var base64 = btoa(svg);
  testStyle.innerHTML = StylePrefix + base64 + StyleSuffix;
}

var lorem =
  '小明说：「为了更好的中文排版！」\n' + 
  '小红说：「小明说了一句『为了更好的中文排版！』，我十分激动，便写了一本《Web 中文排版指南》。」\n';

var fontData;

function getFontData () {
  var url = '/puncs/SHS-SC-Regular';
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.onreadystatechange = function () {
    if (request.readyState != 4)
      return;

    fontData = JSON.parse(request.responseText);
    demo(lorem);
  };
  request.send();
}

getFontData();
