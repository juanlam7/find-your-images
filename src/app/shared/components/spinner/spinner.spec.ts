import { Injectable, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SpinnerService } from '@core/services/spinner.service';
import { render, screen } from '@testing-library/angular';
import Spinner from './spinner';

@Injectable({ providedIn: 'root' })
class MockSpinnerService {
  public isLoading = signal(false);
}

describe('Spinner Component', () => {
  let mockSpinnerService: MockSpinnerService;

  beforeEach(async () => {
    mockSpinnerService = new MockSpinnerService();
    await TestBed.configureTestingModule({
      providers: [{ provide: SpinnerService, useValue: mockSpinnerService }],
    }).compileComponents();
  });

  it('should not show the spinner by default', async () => {
    await render(Spinner);
    const spinnerElement = screen.queryByRole('status');
    expect(spinnerElement).toBeNull();
  });

  it('should display "Loading..." text when the spinner is visible', async () => {
    mockSpinnerService.isLoading.set(true);
    await render(Spinner);

    const loadingTextElement = screen.getByLabelText('Loading...');
    expect(loadingTextElement).toBeInTheDocument();
  });
});
