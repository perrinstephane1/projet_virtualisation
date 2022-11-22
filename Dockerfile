# image de départ
 FROM alpine:3.15

 # chemin de travail
 WORKDIR /app

 # installation des paquets système
 RUN apk update
 RUN apk add git \
 # batch \
 curl \
 nodejs \
 npm

 # apk installation du packet node
 RUN apk add --upgrade nodejs-doc

 # ajout utilisateur node et groupe node
 RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup
 # RUN adduser stephane
 

 # downgrade des privilèges, pour changer d'utilisateur pendant les commandes
 USER nodeuser
 
 # copie des fichiers du dépôt
 COPY --chown=nodeuser:nodegroup . ./

 # installation des dépendances avec npm
 RUN npm install

 # build avec npm
 RUN npm run build

 # exécution
 CMD ["npm", "run", "watch"]