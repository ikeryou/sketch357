import { MyDisplay } from "../core/myDisplay";
import { Util } from "../libs/util";
import { Func } from "../core/func";
import { Tween } from "../core/tween";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _parentTxt: HTMLElement;
  private _line: number = Func.val(8, 10);
  private _blocks: Array<{con:HTMLElement, img:HTMLElement}> = [];
  private _order: Array<number> = [];


  private _motionFlg: number = 0;
  private _motionCnt: number = 0;

  constructor(opt:any) {
    super(opt)

    this._parentTxt = this.qs('p') as HTMLElement
    const block = this.qs('.js-photo-blocks') as HTMLElement;
    const line = this._line;
    const num = line * line;
    for(let i = 0; i < num; i++) {
      const b = document.createElement('div');
      block.append(b);
      b.append(this._parentTxt.cloneNode(true));

      Tween.set(b, {
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
      })

      const imgEl = b.querySelector('p') as HTMLElement;

      Tween.set(imgEl, {
        position: 'absolute',
        top: 0,
        left: 0,
      })

      this.useGPU(imgEl);
      this.useGPU(b);

      this._blocks.push({
        con: b,
        img: imgEl,
      });

      this._order.push(i);
    }

    this._start();
  }

  private _start(): void {
    let txt = Util.randomArr('ABCDEFGHIKLMNOPRSTUVWXYZ123456789'.split(''));
    // txt += Util.randomArr('ABCDEFGHIKLMNOPRSTUVWXYZ123456789'.split(''));

    this._parentTxt.innerHTML = txt;
    this._blocks.forEach((val) => {
      val.img.innerHTML = txt;
      if(Util.hit(20)) {
        val.con.classList.add('-red');
      } else {
        val.con.classList.remove('-red');
      }
    });
    Util.shuffle(this._order);

    this._motionCnt = 0;
    this._motionFlg = 0;

    Tween.set(this._parentTxt, {
      opacity: 0,
    })

    this._updateMosaic();
  }


  protected _updateMosaic(): void {
    const line = this._line;
    const imgSize = this.getWidth(this.el);
    const size = imgSize / line;

    const it = 10;

    this._motionCnt++;
    if(this._motionCnt >= it) {
      this._motionCnt = 0;
      this._motionFlg++;
      if(this._motionFlg > 2) {
        this._start();
      }
    }

    Tween.set(this._parentTxt, {
      opacity: this._motionFlg == 0 ? 0 : 1,
    })

    this._blocks.forEach((val,i) => {
      const scale = 2;

      const ix = ~~(i / line);
      const iy = ~~(i % line);

      const x = (ix / (line - 0));
      const y = (iy / (line - 0));

      const order = this._order[i];
      const orderTest = Util.map(this._motionCnt, 0, this._order.length - 1, 0, it);
      let opacity;
      if(this._motionFlg == 0) {
        if(order < orderTest) {
          opacity = 1;
        } else {
          opacity = 0;
        }
      }

      if(this._motionFlg == 1) {
        if(order < orderTest) {
          opacity = 0;
        } else {
          opacity = 1;
        }
      }

      if(this._motionFlg == 2) {
        if(order <= orderTest) {
          opacity = 1;
        } else {
          opacity = 0;
        }
      }

      Tween.set(val.con, {
        width: size,
        height: size,
        left: ix * size,
        top: iy * size,
        opacity: opacity,
        scale: 1.01,
        // border: this._motionFlg == 2 ? '1px #000 solid' : ''
      })

      const size2 = imgSize * scale;
      Tween.set(val.img, {
        top: -size * 0.5,
        left: -size * 0.5,
        scale: scale,
        x: -x * size2,
        y: -y * size2,
        fontSize: imgSize,
        width: imgSize,
        height: imgSize,
        opacity: this._motionFlg == 2 ? 0 : 1,
        color: Util.randomArr(['#ff0000', '#00ff00', '#0000ff']),
      })
    })
  }

  protected _update(): void {
    super._update();

    const size = Math.min(Func.sw(), Func.sh()) * 0.5;

    Tween.set(this.el, {
      width: size,
    })
    Tween.set(this._parentTxt, {
      fontSize:  size,
    })

    if(this._c % 2 == 0) {
      this._updateMosaic();
    }
  }

  protected _resize(): void {
    super._resize();
  }
}