import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxOverlayComponent } from './box-overlay.component';

describe('BoxOverlayComponent', () => {
  let component: BoxOverlayComponent;
  let fixture: ComponentFixture<BoxOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxOverlayComponent]
    });
    fixture = TestBed.createComponent(BoxOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
