function analyzeText (lorem) {
  var set = {};
  var current = ''
  for (var i = 0; i < lorem.length; i ++) {
    if (isInList(lorem[i]))
      current += lorem[i];
    else {
      set[current] = true;
      current = '';
    }
  }
  var list = [];
  for (var cluster in set)
    list.push(cluster.split(''));
  list.sort(function (a, b) { return a.length > b.length ? -1 : 1; });
  return list.filter(function (x) { return x.length > 1; });
}

function determineTrim (cluster) {
  var trimList = [];
  cluster.forEach(function () { trimList.push(false); });

  for (var i = 0, j = 1; j < cluster.length; i++, j ++) {
    if (isOpening(cluster[j]))
      trimList[j] = true;
    if (isClosing(cluster[i]) && (isClosing(cluster[j]) || isDots(cluster[j])))
      trimList[i] = true;
  }

  return {
    cluster: cluster,
    trimList: trimList
  };
}

function analyze (lorem) {
  var clusterList = analyzeText(lorem);
  clusterList = clusterList.map(determineTrim);
  console.log(JSON.stringify(clusterList), null, 2);
  return clusterList; 
}
