import { Server } from 'http';
import url from 'url';
import axios from 'axios';

import generateApp from '../src/app';
import { Application } from '../src/declarations';

describe('Feathers application tests (with jest)', () => {
  let server: Server;
  let app: Application;
  let port: number;
  let getUrl: (pathName?: string) => string;

  beforeAll(async () => {
    app = await generateApp();
    port = app.get('port') || 8998;
    getUrl = (pathname?: string): string => url.format({
      hostname: app.get('host') || 'localhost',
      protocol: 'http',
      port,
      pathname
    });
    server = app.listen(port);
    await new Promise(resolve => server.once('listening', resolve));
  });

  afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
  });

  it('starts and shows the index page', async () => {
    expect.assertions(1);

    const { data } = await axios.get(getUrl());

    expect(data.indexOf('<html lang="en">')).not.toBe(-1);
  });

  describe('404', () => {
    it('shows a 404 HTML page', async () => {
      expect.assertions(2);

      try {
        await axios.get(getUrl('path/to/nowhere'), {
          headers: {
            Accept: 'text/html'
          }
        });
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data.indexOf('<html>')).not.toBe(-1);
      }
    });

    it('shows a 404 JSON error without stack trace', async () => {
      expect.assertions(4);

      try {
        await axios.get(getUrl('path/to/nowhere'));
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data.code).toBe(404);
        expect(response.data.message).toBe('Page not found');
        expect(response.data.name).toBe('NotFound');
      }
    });
  });
});
