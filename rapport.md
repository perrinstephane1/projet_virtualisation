# RAPPORT PROJET CLOUD, Stéphane PERRIN
(en collab avec Delphine 'crackito' FOUQUET)

## TD1 : une application Node.js
### Question 1
Les fonctions données dans le README marchent toutes, en modifiant la fonction helloWorld et en rajoutant un `console.log(helloWorld())` on obtient bien le bon résultat :
``` bash
[nodemon] restarting due to changes...
[nodemon] starting `ts-node src/index.ts`
Hello Stéphane !
[nodemon] clean exit - waiting for changes before restart
```
### Question 2
Dans le package `package.json` on a la déclaration de l'objet "i-want-typescript" avec toutes les variables qui en découlent.

Dans le package `package-lock.json` on trouve  une ligne `lockfileVersion : 2` qui n'est pas présente dans le premier fichier et dont découle la suite. Si on est authentifié (`requires : true`) alors on a accès aux variables qui sont définies plus tard dans le fichier non verouillé. On peut aussi faire du gen-mapping.

### Question 3
Dans le fichier `package-lock.json`, on remarque l'ajout dans les packages
```
"dependencies": {
        "systeminformation": "^5.12.13"
      },
```
Ce qui est modifié dans le répertoire Git.

**Différence entre `dependencies` et `devDependencies`** : les `dependencies` sont installées à partir d'un répertoire qui contient le fichier `package.json` et éventuellement sur d'autres répertoires, tandis que les `devDependencies` sur un répertoire qui contient le fichier `package.json` (sauf si on passe un argument spécifique), et ne sont pas installées sur d'autres répertoires (transitivement). (D'après la page [Stackoverflow](https://stackoverflow.com/questions/18875674/whats-the-difference-between-dependencies-devdependencies-and-peerdependencies))

### Question 4 : écriture de l'application
- On crée un fichier `interface.ts` avec le code donné dans le sujet
- Ensuite on modifie l'`index.ts` en regardant la doc de systeminformation
- En ajoutant ce code, on obtient les informations dans la console
```
si.cpu(function(data) {
  console.log('CPU Information:');
  console.log('- manufacturer: ' + data.manufacturer);
  console.log('- brand: ' + data.brand);
  console.log('- speed: ' + data.speed);
  console.log('- cores: ' + data.cores);
  console.log('- physical cores: ' + data.physicalCores);
  console.log('...');
})
```
- On cherche à vérifier qu'on a bien le bon url, d'où le test `if (req.url=='/api/v1/sysinfo')`
- Ensuite, on fait appel à la fonction `getSystemInfos()`qui retourne le json, et sinon on renvoie l'erreur 404.

La difficulté vient de `getSystemInfos()` : en effet, il faut aller chercher de manière asynchrone chacune des informations de `systeminfo`, sans oublier de déclarer la fonction asynchrone, d'attendre `await` et surtout de ne pas oublier d'attendre dans la boucle de résultat (`await getSystemInfos()`)

###Quesiton 6 : tests 
On crée deux tests : d'abord pour savori si le serveur répond bien de la manière voulue, ie si le bon url est entré. Ensuite on teste si la réponse a bien tous les champs requis.

## TD2 : Docker
###installation
On fait bien attention à séparer les lignes 
` sudo apt install apt-transport-https ca-certificates curl software-properties-common`

`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`

Visiblement je suis sur la version WSL 2 
```bash
C:\Users\steph>wsl --status
Distribution par défaut : Ubuntu
Version par défaut : 2

La dernière mise à jour effectuée du Sous-système Windows pour Linux date du 08/11/2022
Le sous-système Windows pour le noyau Linux peut être manuellement mis à jour avec « WSL--Update », mais les mises à jour automatiques ne peuvent pas être effectuées en raison des paramètres de votre système.
Pour recevoir les mises à jour automatiques du noyau, activez le paramètre Windows Update : « Recevoir les mises à jour d’autres produits Microsoft lors de la mise à jour de Windows ».
Pour plus d’informations, rendez-vous sur https://aka.ms/wsl2kernel.

Version du noyau : 5.10.16
```

Donc je lance le daemon à la main selon le tuto et on a bien le résultat :
``` bash
stephane@LAPTOP-65O90SPK:~/projet_virtualisation$ sudo docker run hello-world
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete 
Digest: sha256:faa03e786c97f07ef34423fccceeec2398ec8a5759259f94d99078f264e9d7af
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/ 
 ```