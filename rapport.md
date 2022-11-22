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
