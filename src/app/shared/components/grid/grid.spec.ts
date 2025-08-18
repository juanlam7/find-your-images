import { render, screen } from '@testing-library/angular';
import { mockImages } from '../../../../mocks/mock-images';
import { Grid } from './grid';

describe('Grid Component', () => {
  it('should render photos when the photos input is provided', async () => {
    const mockImg = mockImages.slice(0, 10);
    await render(Grid, {
      componentInputs: {
        photos: mockImg,
        emptyPhotosText: 'test',
        isLoading: false,
        isResultEmpty: false,
      },
    });

    const images = screen.getAllByRole('img', { name: /unsplash/i });

    expect(images.length).toBe(mockImg.length);

    const skeletonItems = screen.queryAllByTestId('skeleton');
    expect(skeletonItems.length).toBe(0);
  });

  it('should display skeleton loaders when the photos input is an empty array', async () => {
    const { container } = await render(Grid, {
      componentInputs: {
        photos: [],
        emptyPhotosText: 'test',
        isLoading: false,
        isResultEmpty: false,
      },
    });

    const skeletonItems = container.querySelectorAll('.skeleton');

    expect(skeletonItems.length).toBe(9);

    const images = screen.queryAllByRole('img');
    expect(images.length).toBe(0);
  });

  it('should pass the correct routerLink to the image container', async () => {
    const mockImg = mockImages.slice(0, 10);
    const redirectRoute = 'detail';
    await render(Grid, {
      componentInputs: {
        photos: mockImg,
        redirectRoute: redirectRoute,
        emptyPhotosText: 'test',
        isLoading: false,
        isResultEmpty: false,
      },
    });

    const links = screen.getAllByRole('link', { name: /unsplash/i });

    links.forEach((link, index) => {
      const expectedLink = `/${redirectRoute}/${mockImg[index].id}`;
      expect(link.getAttribute('href')).toBe(expectedLink);
    });
  });

  it('should not have a routerLink when redirectRoute is not provided', async () => {
    await render(Grid, {
      componentInputs: {
        photos: mockImages,
        emptyPhotosText: 'test',
        isLoading: false,
        isResultEmpty: false,
      },
    });

    const images = screen.getAllByRole('img');

    images.forEach((img) => {
      expect(img.getAttribute('routerLink')).toBe(null);
    });
  });
});
