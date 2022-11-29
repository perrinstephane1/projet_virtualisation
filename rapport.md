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

 ### génération du dockerfile
 Tout se passe bien, on peut le lancer sans problème : 
 ``` bash
 stephane@LAPTOP-65O90SPK:~/projet_virtualisation$ sudo docker run -p 8123:8000 -m1024m --cpus=1 sysinfo-api:0.0.1

> i-want-typescript@1.0.0 watch
> nodemon --watch 'src/**/*.ts' --ignore 'src/**/*.spec.ts' --exec 'ts-node' src/index.ts

[nodemon] 2.0.19
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*.ts
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/index.ts`
[nodemon] clean exit - waiting for changes before restart
```
Tout se passe comme si on avait lancé nous-même notre app !

### commande docker run
- flag `-p` : nous permet de nous (à l'hôte)communiquer le port du container
- flag `-m` : sert à fixer une limite de mémoire
- flag `-cpus` : désigne le nombre de CPUs sur lequel on veut lancer le container

Changer le nombre de CPU de 1 à 4 permet de passer de plus de 4s d'attente entre la ligne "[nodemon] starting `ts-node src/index.ts`"  et la ligne "[nodemon] clean exit - waiting for changes before restart"

*test de la commande avec un autre bash*
``` bash
stephane@LAPTOP-65O90SPK:~/projet_virtualisation$ curl 127.0.0.1:8123/api/v1/sysinfo
```
On prend soin de changer le port avec le port que l'on a entré 
```bash
stephane@LAPTOP-65O90SPK:~/projet_virtualisation$ curl 127.0.0.1:8123/api/v1/sysinfo
```
(On a auparavant changé le `server.listen(8000, "localhost")` en `server.listen(8000, "0.0.0.0")`) pour pouvoir écouter tous les ports.
### historique
```bash
stephane@LAPTOP-65O90SPK:~/projet_virtualisation$ sudo docker image history sysinfo-api:0.0.1
IMAGE          CREATED             CREATED BY                                      SIZE      COMMENT
2899adac2e25   4 minutes ago       /bin/sh -c #(nop)  CMD ["npm" "run" "watch"]    0B        
e1eacdad133e   4 minutes ago       /bin/sh -c npm run build                        29.9kB    
cee86743eae7   4 minutes ago       /bin/sh -c npm install                          519kB     
b68f67a8780b   4 minutes ago       /bin/sh -c #(nop) COPY --chown=nodeuser:node…   126MB     
dcf2feb9944c   About an hour ago   /bin/sh -c #(nop)  USER nodeuser                0B        
080e1acd481e   About an hour ago   /bin/sh -c addgroup -S nodegroup && adduser …   4.72kB    
5ea0a70aa2a0   About an hour ago   /bin/sh -c apk add --upgrade nodejs-doc         156kB     
945a397f872e   About an hour ago   /bin/sh -c apk add git  curl  nodejs  npm       63.2MB    
55e8556ea7b8   About an hour ago   /bin/sh -c apk update                           2.3MB     
129fa324d573   About an hour ago   /bin/sh -c #(nop) WORKDIR /app                  0B        
c4fc93816858   3 months ago        /bin/sh -c #(nop)  CMD ["/bin/sh"]              0B        
<missing>      3 months ago        /bin/sh -c #(nop) ADD file:f77e3f51f020890d2…   5.59MB 
```
###utilisation de dive
Après avoir utilis dive, on se rend dans notre container, et on remarque qu'on a bien une partie de la mémoire utilisée qui est "potentiellement gâchée" (1.8 MB/197 MB).

On a peut-être pas besoin d'installer toutes les dépendances et seulement celles dont on a besoin...

### Quesion 6 : construction multi-stages
On commente tout le `dockerfile`qu'on a créé pour recréer une image en mutli-stages.
On n'ajoute ensuite que les packages nécessaires.
```bash
Successfully built 64159b17be90
Successfully tagged sysinfo-api:0.0.2
```
Cette fois-ci :a taille est de 61 MB et seulement 496 kB sont potentiellement gâchés.
### Question 8
> Déployez un nouveau conteneur à partir de votre image publiée. Quelle commande utilisez-vous ?

On se rend sur la page [documentation-"run-containers"](https://docs.docker.com/language/nodejs/run-containers/)   et on relance le docker (`sudo service docker start`). Malgré cela, quelques erreurs interviennent quand on relance l'image : on la modifie donc en rajoutant les droits pour copier les modules et en changeant la commande `CMD` en `node` plutôt que `npm`. On obtient l'erreur  :
``` bash
stephane@LAPTOP-65O90SPK:~/projet_virtualisation$ docker run stephperrin/sysinfo-api:0.0.2
docker: Error response from daemon: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: exec: "npm": executable file not found in $PATH: unknown.
ERRO[0000] error waiting for container: context canceled
```
L'image obtenue marche bien !
`docker run -d -p 8123:8000 sysinfo-api:0.0.3`

## TD3 : CI/CD
On doit installer la version 16.18.1 de node (cf. documentation Github)
```
- name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "16"
          cache: ${{ steps.detect-package-manager.outputs.manager }}
- name: test Node
         run node -v
```
On veut ensuite installer les dépendances de notre application, ici un `npm install` suffit puisque les dépendances sont dans le `package.json`

## FLY.IO
On se connecte à docker (username: `stephperrin`), puis on tag notre nouvelle image
``` bash
stephane@LAPTOP-65O90SPK:~/projet_virtualisation$ sudo docker tag sysinfo-api:0.0.3 stephperrin/sysinfo-api:0.0.3
stephane@LAPTOP-65O90SPK:~/projet_virtualisation$ sudo docker push stephperrin/sysinfo-api:0.0.3
The push refers to repository [docker.io/stephperrin/sysinfo-api]
fe696f09bea9: Pushed 
839e32493246: Pushed 
ea1ef2b70666: Pushed 
99183192017d: Layer already exists 
57f579c19b94: Layer already exists 
34d5ebaa5410: Layer already exists 
0.0.3: digest: sha256:f656615110a722ccacbd9a77d196ed2289316899622cf5aacad7762d4a34a4ae size: 1575
```
on recrée une image `sudo docker build . -t registry.fly.io/sysinfo-api:0.0.3` puis on lance le push `docker push registry.fly.io/sysinfo-api:0.0.3` mais cela ne marche pas. On essaye donc le `flyctl launch`directement.