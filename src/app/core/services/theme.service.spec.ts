import { TestBed } from '@angular/core/testing';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockRenderer: jest.Mocked<Renderer2>;
  let mockRendererFactory: jest.Mocked<RendererFactory2>;
  let mockMediaQuery: jest.Mocked<MediaQueryList>;

  beforeEach(() => {
    mockRenderer = {
      addClass: jest.fn(),
      removeClass: jest.fn(),
      setStyle: jest.fn(),
    } as any;

    mockRendererFactory = {
      createRenderer: jest.fn().mockReturnValue(mockRenderer),
    } as any;

    mockMediaQuery = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as any;

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockReturnValue(mockMediaQuery),
    });

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: RendererFactory2, useValue: mockRendererFactory }
      ]
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return stored theme when available', () => {
    (localStorage.getItem as jest.Mock).mockReturnValue('dark');

    const result = service.getPreferredTheme();

    expect(result).toBe('dark');
    expect(localStorage.getItem).toHaveBeenCalledWith('docs-theme-storage-current-name');
  });

  it('should store theme in localStorage', () => {
    service.storeTheme('light');

    expect(localStorage.setItem).toHaveBeenCalledWith('docs-theme-storage-current-name', 'light');
  });

  it('should set up system theme change listener', () => {
    const callback = jest.fn();

    const cleanup = service.onSystemThemeChange(callback);

    expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    
    const listener = (mockMediaQuery.addEventListener as jest.Mock).mock.calls[0][1];
    listener({ matches: true });
    
    expect(callback).toHaveBeenCalledWith('dark');

    cleanup();
    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith('change', listener);
  });

  it('should clear localStorage correctly', () => {
    service.clearStorage();

    expect(localStorage.removeItem).toHaveBeenCalledWith('docs-theme-storage-current-name');
  });
});