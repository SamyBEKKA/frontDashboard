import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperationMotDePasseComponent } from './recuperation-mot-de-passe.component';

describe('RecuperationMotDePasseComponent', () => {
  let component: RecuperationMotDePasseComponent;
  let fixture: ComponentFixture<RecuperationMotDePasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperationMotDePasseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperationMotDePasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
