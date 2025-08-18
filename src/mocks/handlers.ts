import { delay, http, HttpResponse } from 'msw';
import { mockImages } from './mock-images';
import { mockSearchImagesResult } from './mock-search-images';

export const handlers = [
  http.get('https://api.unsplash.com/photos', async ({ request }) => {
    const url = new URL(request.url);
    console.log('MSW: Intercepted GET /photos request');

    await delay(1000);

    // simulate error
    // return new HttpResponse(null, {
    //   status: 404,
    //   statusText: 'Image not found',
    // });

    return HttpResponse.json(mockImages, {
      headers: {
        'X-Total': '15',
      },
    });
  }),

  http.get('https://api.unsplash.com/photos/:id', async ({ params }) => {
    const { id } = params;
    console.log(`MSW: Intercepted GET /photos/${id} request`);

    const image = mockImages.find((img) => img.id === id);

    await delay(500);

    if (image) {
      return HttpResponse.json(image);
    } else {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Image not found',
      });
    }
  }),

  http.get('https://api.unsplash.com/search/photos', async ({ request }) => {
    const url = new URL(request.url);
    console.log('MSW: Intercepted GET /search/photos request');

    await delay(1000);

    return HttpResponse.json(mockSearchImagesResult, {
      headers: {
        'X-Total': '15',
      },
    });
  }),
];
