import 'cross-fetch/polyfill';
//======alternative approach for polyfills========
//import AbortController from 'abort-controller'
//import { fetch, Headers, Request, Response } from 'cross-fetch'
//global.fetch = fetch
//global.Headers = Headers
//global.Request = Request
//global.Response = Response
//global.AbortController = AbortController
//=============/=================================

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

require('jest-fetch-mock').enableMocks()

//TUTORIAL: Mocking RTK Query API with Mock Service Worker (MSW) for testing React Native Apps with Jest
//REF: https://dev.to/jbudny/mocking-rtk-query-api-with-mock-service-worker-for-testing-react-native-apps-o3m