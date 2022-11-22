/**
 * Mandatory Hello World function.
 * @returns A string which contains "Hello world!"
 */
 import * as http from 'http';
import { Http2ServerRequest } from 'http2';
 import * as si from 'systeminformation';
import { ISystemInformation } from './interface';

export const helloWorld = (): string => {
  return 'Hello Stéphane !';
};

export const getSystemInfos= async():Promise<ISystemInformation>=>{
  let resultat:ISystemInformation={
    cpu: undefined,
    system: undefined,
    mem: undefined,
    os: undefined,
    currentLoad: undefined,
    processes: undefined,
    diskLayout: [],
    networkInterfaces: []
  };


  await si.cpu().then( //info que je cherche
    (data=>resultat.cpu=data)
  ).catch(error => console.error(error));
  //console.log(resultat.cpu);

  await si.system().then( //info que je cherche
    (data=>resultat.system=data)
  ).catch(error => console.error(error));
  //console.log(resultat.system);

  await si.mem().then( //info que je cherche
    (data=>resultat.mem=data)
  ).catch(error => console.error(error));

  await si.osInfo().then( //info que je cherche
    (data=>resultat.os=data)
  ).catch(error => console.error(error));

  await si.currentLoad().then( //info que je cherche
    (data=>resultat.currentLoad=data)
  ).catch(error => console.error(error));

  await si.processes().then( //info que je cherche
    (data=>resultat.processes=data)
  ).catch(error => console.error(error));

  await si.networkInterfaces().then( //info que je cherche
    (data=>resultat.networkInterfaces=data)
  ).catch(error => console.error(error));
  
  return resultat;
}

export function createMyServer ():http.Server{
  return http.createServer (async(req, res) => {
    if (req.url=='/api/v1/sysinfo'){
      console.log("Tu es sur le bon chemin \n");
      // Appel à ma fonction qui retourne le json
      let resultat:ISystemInformation= await getSystemInfos();
      // le mettre en json
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({data: resultat}, null, 4)
        );
    }
    else{
      res.writeHead(404, { 'Content-Type': 'text/plain' }); // trouver l'erreur 404
      res.end('404 not found\n');
    }
  });
}

export function startMyServer(server: http.Server): void {
  server.listen(8000, "localhost");
}

export function stopMyServer(server: http.Server):void {
  server.close();
}

function main(): void {
  const server = createMyServer();
  startMyServer(server);
}