function setup(){
  //キャンバスを作成
  createCanvas(600,425);
  //背景色
  background(255);
  //図形の線無し
  noStroke();
}
function draw(){
  //オブジェクトの色をランダム（透明度70）
  fill(random(255),random(255),random(255),70);
  //キャンバスの中心に直径100pxの丸を描画
  ellipse(random(width),random(height),random(100));
}