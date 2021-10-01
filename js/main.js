"use strict";
{
  class Maze {
    constructor(canvas, width, height) {
      if (width < 5 || height < 5 || width % 2 === 0 || height % 2 === 0) {
        alert("width & height is wrong!");
        return;
      }
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");

      this.date = []; //迷路データ(i行j列)
      this.WALL_SIZE = 10; //壁の大きさ
      this.col = width; //迷路の幅を取得
      this.row = height; //迷路の高さを取得
      this.row_char = this.row - 2; //キャラクターの現在位置(高さ) && 初期設定でスタート位置(高さ)
      this.col_char = 0; //キャラクターの現在位置(幅) && 初期設定でスタート位置(幅)
      this.isShowAns = false; //答えが表示されているかの真偽値
    }

    //迷路
    setCanvas() {
      //canvasの大きさを変更
      this.canvas.height = this.row * this.WALL_SIZE;
      this.canvas.width = this.col * this.WALL_SIZE;
    }
    setDate() {
      //迷路データを作成(棒倒し法)
      //配列を全て1に
      for (let i = 0; i < this.row; i++) {
        this.date[i] = [];
        for (let j = 0; j < this.col; j++) {
          this.date[i][j] = 1;
        }
      }
      //外周以外を0に
      for (let i = 1; i < this.row - 1; i++) {
        for (let j = 1; j < this.col - 1; j++) {
          this.date[i][j] = 0;
        }
      }
      //棒作成
      for (let i = 2; i < this.row - 2; i += 2) {
        for (let j = 2; j < this.col - 2; j += 2) {
          this.date[i][j] = 1;
        }
      }
      //棒倒し
      for (let i = 2; i < this.row - 2; i += 2) {
        for (let j = 2; j < this.col - 2; j += 2) {
          let row;
          let col;
          do {
            const num =
              i === 2
                ? Math.floor(Math.random() * 4)
                : Math.floor(Math.random() * 3);

            row = i;
            col = j;
            switch (num) {
              case 0:
                col++;
                break;
              case 1:
                col--;
                break;
              case 2:
                row++;
                break;
              case 3:
                row--;
                break;
            }
          } while (this.date[row][col] === 1);
          this.date[row][col] = 1;
        }
      }

      //スタートとゴールを作成
      this.date[this.row_char][this.col_char] = 0; //start
      this.date[this.row - 2][this.col - 1] = 0; //gorl
    }
    drow() {
      //迷路を表示
      for (let i = 0; i < this.date.length; i++) {
        for (let j = 0; j < this.date[i].length; j++) {
          if (this.date[i][j] === 1) {
            this.ctx.fillStyle = "#ccc";
            this.ctx.fillRect(
              j * this.WALL_SIZE,
              i * this.WALL_SIZE,
              this.WALL_SIZE,
              this.WALL_SIZE
            );
          }
        }
      }
    }

    //キャラクター
    clear_char() {
      //移動前のキャラクターを削除
      this.ctx.clearRect(
        this.col_char * this.WALL_SIZE,
        this.row_char * this.WALL_SIZE,
        this.WALL_SIZE,
        this.WALL_SIZE
      );
      if (!this.date[this.row_char][this.col_char] && this.isShowAns) {
        this.drow_ans();
      }
    }
    drow_char() {
      //キャラクターを表示
      this.ctx.fillStyle = "red";
      this.ctx.beginPath();
      this.ctx.arc(
        (this.col_char + 0.5) * this.WALL_SIZE,
        (this.row_char + 0.5) * this.WALL_SIZE,
        this.WALL_SIZE / 2,
        0,
        2 * Math.PI
      );
      this.ctx.fill();
    }
    character() {
      //キーボードイベント + clear_char() + drow_char()
      addEventListener("keydown", (e) => {
        let row = this.row_char;
        let col = this.col_char;
        switch (e.key) {
          case "ArrowUp":
            row--;
            break;
          case "ArrowDown":
            row++;
            break;
          case "ArrowLeft":
            col--;
            break;
          case "ArrowRight":
            col++;
            break;
          default:
            break;
        }
        if (this.date[row][col] === 1 || this.date[row][col] === undefined) {
          row = this.row_char;
          col = this.col_char;
          return;
        }
        this.clear_char();
        this.row_char = row;
        this.col_char = col;
        this.drow_char();
      });
    }

    //答え
    setAns() {
      //正解データを作成
      let complete;
      do {
        complete = 1;
        for (let i = 0; i < this.date.length; i++) {
          for (let j = 0; j < this.date[i].length; j++) {
            if (!this.date[i][j]) {
              let surrounded = 0;
              if (this.date[i - 1][j]) {
                surrounded++;
              }
              if (this.date[i + 1][j]) {
                surrounded++;
              }
              if (this.date[i][j - 1]) {
                surrounded++;
              }
              if (this.date[i][j + 1]) {
                surrounded++;
              }
              if (surrounded === 3) {
                this.date[i][j] = 2;
                complete = 0;
              }
            }
          }
        }
      } while (!complete);
    }
    drow_ans() {
      //正解を表示
      for (let i = 0; i < this.date.length; i++) {
        for (let j = 0; j < this.date[i].length; j++) {
          if (!this.date[i][j]) {
            this.ctx.fillStyle = "#ffe0ff";
            this.ctx.fillRect(
              j * this.WALL_SIZE,
              i * this.WALL_SIZE,
              this.WALL_SIZE,
              this.WALL_SIZE
            );
          }
        }
      }
    }
    clear_ans() {
      //正解を非表示
      for (let i = 0; i < this.date.length; i++) {
        for (let j = 0; j < this.date[i].length; j++) {
          if (!this.date[i][j]) {
            this.ctx.clearRect(
              j * this.WALL_SIZE,
              i * this.WALL_SIZE,
              this.WALL_SIZE,
              this.WALL_SIZE
            );
          }
        }
      }
    }

    //実行
    run() {
      this.setCanvas();
      this.setDate();
      this.drow();
      this.character();
      document.addEventListener("keydown", (e) => {
        if (e.key === "a") {
          this.setAns();
          console.log(this.date);
          if (!this.isShowAns) {
            this.isShowAns = true;
            this.drow_ans();
            return;
          }
          this.isShowAns = false;
          this.clear_ans();
        }
      });
    }
  }

  function main() {
    const canvas = document.querySelector("canvas");
    if (typeof canvas.getContext === undefined) {
      return;
    }
    const maze = new Maze(canvas, 25, 45); //[99, 141] => A4
    maze.run();
  }
  main();
}
