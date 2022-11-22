import { createMyServer, startMyServer } from "./server";



function main(): void {
  const server = createMyServer();
  startMyServer(server);
}

main();