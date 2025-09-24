import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStyleDemoComponent } from './table-style-demo.component';

describe('TableStyleDemoComponent', () => {
  let component: TableStyleDemoComponent;
  let fixture: ComponentFixture<TableStyleDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableStyleDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableStyleDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
