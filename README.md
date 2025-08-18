# FindImages

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

During development, the application uses **Mock Service Worker (MSW)** to intercept API requests and serve mock responses. The mock server is configured in `src/mocks/browser.ts`.

To switch between using the mock API and the real server API, modify the `useMockApi` flag in `src/environments/environment.ts`. The application will automatically reload when you make changes.

## Environment Variables

This project requires a `.env` file at the root of the project to manage API keys and URLs. Create a file named `.env` and include the following variables:

```
NG_APP_ACCESS_KEY=your_unsplash_access_key
NG_APP_BASE_API=https://api.unsplash.com
```

-----

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

-----

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

-----

## Testing

This project uses **Jest** and **Angular Testing Library** for all testing needs.

  - **Unit Tests:** To execute all unit tests, use the following command:

    ```bash
    npm run test
    ```

  - **Test Coverage:** To generate a coverage report, run:

    ```bash
    npm run test:coverage
    ```

  - **Watch Mode:** For a live-reloading test runner, use:

    ```bash
    npm run test:watch
    ```

-----

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
