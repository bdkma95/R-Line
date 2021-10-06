Environement de developpement

install Docker environement

Run "docker-compose up --build" dans le dossier racine contenant le fichier docker-compose.yml

Access to localhost:3000 in browser

Each part of application is deploy in his own docker container
to see the infra inside a container use

   docker ps // to see container ID of the target
   
   docker exec -it <container target> bash or sh // the last param depends on the OS present inside docker


