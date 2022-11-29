# PREMIER TRUCS
# image de départ
 #FROM alpine:3.15

 # chemin de travail
 #WORKDIR /app

 # installation des paquets système
 #RUN apk update
 #RUN apk add nodejs npm

 # apk installation du packet node
 #RUN apk add --upgrade nodejs-doc

 # ajout utilisateur node et groupe node
 #RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup
 # RUN adduser stephane
 

 # downgrade des privilèges, pour changer d'utilisateur pendant les commandes
 #USER nodeuser
 
 # copie des fichiers du dépôt
 #COPY --chown=nodeuser:nodegroup . ./

 # installation des dépendances avec npm
 #RUN npm install

 # build avec npm
 #RUN npm run build

 # exécution
 #CMD ["npm", "run", "watch"]

 #On crée une première image avec tout
 FROM alpine:3.15 AS builder
 
 WORKDIR /app
 COPY . ./
 RUN apk add --update nodejs
 RUN apk add --upgrade npm

 

 # on utilise que la version de production (pex pas les tests)
 RUN npm ci --only=production
 # on rajoute les fichiers dans un fichier des trucs de production
 RUN cp -r /app/node_modules /app/node_modules_production
 #on installe toutes les dépendances, on build
 RUN npm install
 RUN npm run build

 # MAintenant on crée une image spéciale avec seulement les choses utiles pour la finalité
 # c'est la dernière image qui prévaut
 FROM alpine:3.15 as runner
 WORKDIR /app
 RUN apk add --update nodejs
 #on a pas besoin de npm, on copie que les modules utilisés
 RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup
 USER nodeuser
 COPY --chown=nodeuser:nodegroup --from=builder /app/node_modules_production/ ./node_modules/
 COPY --chown=nodeuser:nodegroup --from=builder /app/dist/ ./dist/

 #puis on lance
 CMD ["node","dist/index.js"]