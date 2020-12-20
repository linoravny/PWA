import {
  Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, Output, EventEmitter,
} from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { switchMap, takeUntil, pairwise, skipUntil, repeat, mergeMap } from 'rxjs/operators'

@Component({
  selector: 'app-drawing-board-canvas',
  templateUrl: './drawing-board-canvas.component.html',
  styleUrls: ['./drawing-board-canvas.component.scss']
})
export class DrawingBoardCanvasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('canvas') public canvas: ElementRef;

  @ViewChild('canvasContainer') canvasElementView: ElementRef;
  @Input() public width = 100;
  @Input() public height = 500;

  userName: string = 'Omer';
  public defaultColors: string[] = [
    '#ffffff',
    '#000105',
    '#3e6158',
    '#3f7a89',
    '#96c582',
    '#b7d5c4',
    '#bcd6e7',
    '#7c90c1',
    '#9d8594',
    '#dad0d8',
    '#4b4fce',
    '#4e0a77',
    '#a367b5',
    '#ee3e6d',
    '#d63d62',
    '#c6a670',
    '#f46600',
    '#cf0500',
    '#efabbd',
    '#8e0622',
    '#f0b89a',
    '#f0ca68',
    '#62382f',
    '#c97545',
    '#c1800b'
  ];
  color: string = '#ffffff';
  colorPickerIsOpen:boolean = false;

  private cx: CanvasRenderingContext2D;

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.canvasElementView.nativeElement.offsetWidth;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#9d8594';

    this.captureEvents(canvasEl);
  }
  
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mouse + touch events from the canvas element

    const down$ = merge(
      fromEvent(canvasEl, 'mousedown'),
      fromEvent(canvasEl, 'touchstart'));
    
    const up$ = merge(
      fromEvent(canvasEl, 'mouseup'),
      fromEvent(canvasEl, 'touchend'));

    const cancle$ = merge(
      fromEvent(canvasEl, 'mouseleave'),
      fromEvent(canvasEl, 'touchcancel'));
    
    const move$ = merge(
      fromEvent(canvasEl, 'mousemove'),
      fromEvent(canvasEl, 'touchmove'));

    down$
      .pipe(
        mergeMap(down => move$.pipe(
            takeUntil(up$),
            takeUntil(cancle$),
            pairwise()
          )
        )
        // switchMap((e) => {
        //   // after a mouse down, we'll record all mouse moves
        //   return move$
        //     .pipe(
              
        //       // we'll stop (and unsubscribe) once the user releases the mouse
        //       // this will trigger a 'mouseup' event    
        //       takeUntil(up$),
        //       // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
        //       takeUntil(cancle$),
        //       // pairwise lets us get the previous value to draw a line from
        //       // the previous point to the current point    
        //       pairwise()
        //     )
        // })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
  
        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
  
        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  public changeColor(color:string) {
    this.color = color;
    this.cx.strokeStyle = color;
    this.colorPickerIsOpen = false;
  }

}
