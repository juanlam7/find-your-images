import { render, screen } from '@testing-library/angular';
import { LazyImage } from './lazy-image';

describe('LazyImage Component', () => {
  it('should apply provided inputs correctly', async () => {
    await render(LazyImage, {
      componentInputs: {
        src: 'https://example.com/image.jpg',
        alt: 'A beautiful landscape',
        imageClass: 'product-image',
        aspectRatio: '4 / 3',
      },
    });

    const imgElement = screen.getByRole('img', {
      name: 'A beautiful landscape',
    });
    const wrapperDiv = imgElement.parentElement;

    expect(imgElement).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(imgElement).toHaveAttribute('alt', 'A beautiful landscape');
    expect(imgElement).toHaveClass('lazy-image', 'product-image');
    expect(wrapperDiv).toHaveStyle('aspect-ratio: 4 / 3');
  });

});
