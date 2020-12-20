import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingBoardCanvasComponent } from './drawing-board-canvas.component';

describe('DrawingBoardCanvasComponent', () => {
  let component: DrawingBoardCanvasComponent;
  let fixture: ComponentFixture<DrawingBoardCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawingBoardCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingBoardCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
