// ファイルを選択するためのinput要素と、選択したファイルのURLを差し込むためのimg要素をそれぞれ取得
const inputfile = document.getElementById('myfile');
const log = document.getElementById('log');
const torqueArray = [];

inputfile.addEventListener('change', (e) => {
  const file = e.target.files;
  file[0].text().then(
      (text) => {
        const lines = text.split(/\n|\r\n/);
        let isFirstLine = true;
        for (const line of lines) {
          if (isFirstLine === true | line.length === 0) {
            isFirstLine = false;
            continue;
          }
          const torqueStr = line.split(',');
          const torque = [parseFloat(torqueStr[0]), parseFloat(torqueStr[1])];
          torqueArray.push(torque);
        }
        log.innerText = text;
      },
  );
}, false);