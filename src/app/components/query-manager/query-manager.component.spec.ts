import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryManagerComponent } from './query-manager.component';

describe('QueryManagerComponent', () => {
  let component: QueryManagerComponent;
  let fixture: ComponentFixture<QueryManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QueryManagerComponent]
    });
    fixture = TestBed.createComponent(QueryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
