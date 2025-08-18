import { provideZonelessChangeDetection } from '@angular/core';
import { fireEvent, render, screen } from '@testing-library/angular';
import { ThemeService } from '@core/services/theme.service';
import { ThemePickerComponent } from './theme';

describe('ThemePickerComponent', () => {
  let mockThemeService: jest.Mocked<ThemeService>;

  beforeEach(() => {
    mockThemeService = {
      getPreferredTheme: jest.fn(),
      applyTheme: jest.fn(),
      onSystemThemeChange: jest.fn(),
      storeTheme: jest.fn(),
    } as any;
  });

  const renderComponent = async () => {
    return await render(ThemePickerComponent, {
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        provideZonelessChangeDetection(),
      ],
    });
  };

  it('should render toggle button with tooltip', async () => {
    mockThemeService.getPreferredTheme.mockReturnValue('light');
    mockThemeService.onSystemThemeChange.mockReturnValue(() => {});

    await renderComponent();

    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
    expect(button).toHaveAttribute('mattooltip', 'Toggle theme');
  });

  it('should display dark_mode icon when in light mode', async () => {
    mockThemeService.getPreferredTheme.mockReturnValue('light');
    mockThemeService.onSystemThemeChange.mockReturnValue(() => {});

    await renderComponent();

    const icon = screen.getByText('dark_mode');
    expect(icon).toBeTruthy();
  });

  it('should display light_mode icon when in dark mode', async () => {
    mockThemeService.getPreferredTheme.mockReturnValue('dark');
    mockThemeService.onSystemThemeChange.mockReturnValue(() => {});

    await renderComponent();

    const icon = screen.getByText('light_mode');
    expect(icon).toBeTruthy();
  });

  it('should initialize with preferred theme from service', async () => {
    mockThemeService.getPreferredTheme.mockReturnValue('dark');
    mockThemeService.onSystemThemeChange.mockReturnValue(() => {});

    await renderComponent();

    expect(mockThemeService.getPreferredTheme).toHaveBeenCalled();
    expect(mockThemeService.applyTheme).toHaveBeenCalledWith('dark');
  });

  it('should toggle theme when button is clicked', async () => {
    mockThemeService.getPreferredTheme.mockReturnValue('light');
    mockThemeService.onSystemThemeChange.mockReturnValue(() => {});

    const { fixture } = await renderComponent();
    const button = screen.getByRole('button');

    fireEvent.click(button);
    fixture.detectChanges();

    expect(mockThemeService.storeTheme).toHaveBeenCalledWith('dark');
    expect(mockThemeService.applyTheme).toHaveBeenCalledWith('dark');

    const icon = screen.getByText('light_mode');
    expect(icon).toBeTruthy();
  });

  it('should handle system theme changes and store them', async () => {
    let systemThemeCallback: (theme: 'light' | 'dark') => void = () => {};

    mockThemeService.getPreferredTheme.mockReturnValue('light');
    mockThemeService.onSystemThemeChange.mockImplementation((callback) => {
      systemThemeCallback = callback;
      return () => {};
    });

    const { fixture } = await renderComponent();

    systemThemeCallback('dark');
    fixture.detectChanges();

    expect(mockThemeService.storeTheme).toHaveBeenCalledWith('dark');
    expect(mockThemeService.applyTheme).toHaveBeenCalledWith('dark');

    const icon = screen.getByText('light_mode');
    expect(icon).toBeTruthy();
  });
});
