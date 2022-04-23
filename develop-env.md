# 開発環境の構築方法

本アプリの開発環境の構築方法を記述する．

## 環境

このアプリは，`WSL-Ubuntu`にて，開発・動作確認を行っている．

```shell-session:environment
$ cat /etc/os-release
NAME="Ubuntu"
VERSION="20.04.4 LTS (Focal Fossa)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 20.04.4 LTS"
VERSION_ID="20.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=focal
UBUNTU_CODENAME=focal
```

## 準備

開発環境に必要な初期設定を示す．なお，この文書では，[Visual Studio Code](https://code.visualstudio.com)と[Git](https://git-scm.com/)がインストールとセットアップが完了していることを前提として記述する．

### 必要なアプリのインストール

`npm` ([Node.js](https://nodejs.org/ja/)) コマンドを使えるようにする．`WSL-Ubuntu`の場合は，以下のコマンドでインストールできる．

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

参考文献：[NodeSource Node.js Binary Distributions](https://github.com/nodesource/distributions/blob/master/README.md)

### Visual Studio Codeのセットアップ
1. JavaScriptの整形を行うため，[Visual Studio Code](https://code.visualstudio.com)にてESLintを使えるようにする．
    1. 以下のコマンドを実行する．

        ```bash
        npm install
        ```

    2. Visual Studio Codeに[ESLint - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)をインストールする．
2. VScode上でサーバを立てるため，[Live Server - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)をインストールする．

## テスト方法

### ローカル環境でのテスト方法

`index.html`を`Live Server`で起動することで，テストを行う．`VSCode`の右下の`Go Live`をクリックすれば，自動的に当該ページがブラウザで開かれる．

### 本番環境でのテスト方法

以下のコマンドでビルドした後に，
```bash
bash build.sh
```
`public/`ディレクトリの中身をサーバにアップロードする．

## リリースの方法

`git`で`tag`をつけて，GitHubにプッシュすると，ReleaseへのアップロードとGitHub Pagesへの公開が自動で行われる．
