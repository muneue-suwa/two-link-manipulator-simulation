// ファイルを選択するためのinput要素と、選択したファイルのURLを差し込むためのimg要素をそれぞれ取得
const inputfile = document.getElementById('myfile');
const log = document.getElementById('log');

inputfile.addEventListener('change', function(e) {
  const file = e.target.files;
  file[0].text().then(
      (text) => {
        log.innerText = text;
      },
  );
}, false);
