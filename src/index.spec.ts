import { getSystemInfos, createMyServer, startMyServer, stopMyServer } from './server';
import * as http from 'http'

describe('server test API', () => {
  const server = createMyServer();
  it('should tell me if the server responds correctly acccording to the url', () => {
    startMyServer(server);
    const response = http.get('http://localhost:8000/api/v1/sysinfo', (res) => {
      //console.log(response);
      expect(res.statusCode).toEqual(200);
      stopMyServer(server);
    });
  });
  it('should tell me if the server responds correctly acccording to the url', async() => {
    startMyServer(server);
    const response = http.get('http://localhost:8000/api/v1/blabla', (res) => {
    //console.log(response);
      expect(res.statusCode).toEqual(404);
      stopMyServer(server);
    });
  });
  it('should te')
});



