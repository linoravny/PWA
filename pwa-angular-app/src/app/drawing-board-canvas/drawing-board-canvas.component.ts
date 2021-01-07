import {
  Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter, HostListener, OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { switchMap, takeUntil, pairwise, skipUntil, repeat, mergeMap, map } from 'rxjs/operators'


@Component({
  selector: 'app-drawing-board-canvas',
  templateUrl: './drawing-board-canvas.component.html',
  styleUrls: ['./drawing-board-canvas.component.scss']
})
export class DrawingBoardCanvasComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }

  @ViewChild('canvas') public canvas: ElementRef;
  @ViewChild('canvasContainer') canvasElementView: ElementRef;
  //@Input() public width = 100;
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
  color: string = '#000105';
  colorPickerIsOpen:boolean = true;

  private cx: CanvasRenderingContext2D;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;
  orientationObservable$: Observable<Event>;
  orientationSubscription$: Subscription;

  ngOnInit(): void {
    
    // resize app
    this.resizeObservable$ = fromEvent(window, 'resize')
    this.resizeSubscription$ = this.resizeObservable$.subscribe( evt => {
      console.log('window -> resize');
      
      //reload page
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate(['/drawingBoard']));
    });

    // screen.orientation.lock;
    // this.orientationObservable$ = fromEvent(screen.orientation, 'change')
    // this.orientationSubscription$ = this.resizeObservable$.subscribe( evt => {
    //   console.log('screen orientation -> change');
    //   screen.orientation.lock;
    // });
  }

  ngOnDestroy() {
    this.resizeSubscription$.unsubscribe();
    //this.orientationSubscription$.unsubscribe();
    screen.orientation.unlock;
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.canvasElementView.nativeElement.offsetWidth;
    canvasEl.height = this.height;

    this.cx.lineWidth = 4;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000105';

    this.captureEvents(canvasEl);
  }
  
  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mouse + touch events from the canvas element

    const mouseEventToCoordinate = mouseEvent => {
      mouseEvent.preventDefault();
      return {
        x: mouseEvent.clientX, 
        y: mouseEvent.clientY
      };
    };
  
    const touchEventToCoordinate = touchEvent => {
      touchEvent.preventDefault();
      return {
        x: touchEvent.changedTouches[0].clientX, 
        y: touchEvent.changedTouches[0].clientY
      };
    };

    const mouseDowns = fromEvent(canvasEl, "mousedown").pipe(map(mouseEventToCoordinate));
    const mouseMoves = fromEvent(canvasEl, "mousemove").pipe(map(mouseEventToCoordinate));
    const mouseUps = fromEvent(canvasEl, "mouseup").pipe(map(mouseEventToCoordinate));
  
    const touchStarts = fromEvent(canvasEl, "touchstart").pipe(map(touchEventToCoordinate));
    const touchMoves = fromEvent(canvasEl, "touchmove").pipe(map(touchEventToCoordinate));
    const touchEnds = fromEvent(canvasEl, "touchend").pipe(map(touchEventToCoordinate));

    const down$ = merge(mouseDowns,touchStarts);
    const move$ = merge(mouseMoves, touchMoves);
    const end$ = merge(mouseUps, touchEnds);

    down$
      .pipe(
        mergeMap(down => move$.pipe(
            takeUntil(end$),
            pairwise()
          )
        )
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        
        const rect = canvasEl.getBoundingClientRect();
  
        // previous and current position with the offset
        const prevPos = {
          x: res[0].x - rect.left,
          y: res[0].y - rect.top
        };
  
        const currentPos = {
          x: res[1].x - rect.left,
          y: res[1].y - rect.top
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
    if(color === '#ffffff'){
      this.cx.lineWidth = 60;
    } else {
      this.cx.lineWidth = 4;
    }
    this.color = color;
    this.cx.strokeStyle = color;
    this.colorPickerIsOpen = false;
    
  }

}
