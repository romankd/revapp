<h3>Summary</h3>
- Task number 1 is located in the path ./containers/app/
- Task number 2 is located in the path ./cloudflow.drawio.png
- Task number 3 is located in the path ./cd/infra


<h4>Variables dump you might need for testing purposes</h4>
```
export MONGODB_ADMIN_USER=admin
export MONGODB_ADMIN_PASSWORD=adminpass
export MONGODB_LOCAL_PORT=27017
export MONGODB_DOCKER_PORT=27017
export MONGODB_DATABASE=users
export MONGODB_INIT_DB=init
export MONGODB_USER=dbuser
export MONGODB_PASSWORD=dbuserpass
export NODE_LOCAL_PORT=3000
export NODE_DOCKER_PORT=3000
export APP_IMAGE_TAG=nodeapp
```

<h3>Runnig containers locally on docker compose</h3>
```
cd ./containers
docker compose --env-file=.devenv up --build
```

<h4>Shutting down</h4>
```
docker compose --env-file=.devenv down --rmi all --volumes
```

<h3>Runnig on K8S</h3>
PRE REQS 
1) any k8s cluster running in cloud or locally. I used kind
2) ingress controller of your choice, I used nginx-ingress in my approach
3) a basic secret (used for both mongo and application) per environment, use the command below to create it.
4) run kustomize and kubectl to apply the structure per environment that can be deployed incrementally without downtime (as speciafied in the task)
5) prod and dev have a different configuration
6) ideal finish for this part would have been a terraform deploy to k8s cluster using k8s and helm providers, but I didn't have time for that unfortunately. 

<h4>DEV SETUP</h4>
```
kubectl create secret generic mongodb-secret \
--from-literal mongo-admin=${MONGODB_ADMIN_USER} \
--from-literal mongo-admin-password=${MONGODB_ADMIN_PASSWORD} \
--from-literal initdb=${MONGODB_INIT_DB} \
--from-literal mongo-db=${MONGODB_DATABASE} \
--from-literal mongo-user=${MONGODB_USER} \
--from-literal mongo-password=${MONGODB_PASSWORD} --namespace dev

cd ./cd/infra
kubectl kustomize dev/ --enable-helm | kubectl apply -f -
```

If running locally (you might need to use sudo)
```
sudo sh -c "echo '127.0.0.1 nodeapp-dev.local nodeapp-prod.local' >> /etc/hosts"
```


<h3>PROD</h3>

```
kubectl create secret generic mongodb-secret \
--from-literal mongo-admin=${MONGODB_ADMIN_USER} \
--from-literal mongo-admin-password=${MONGODB_ADMIN_PASSWORD} \
--from-literal initdb=${MONGODB_INIT_DB} \
--from-literal mongo-db=${MONGODB_DATABASE} \
--from-literal mongo-user=${MONGODB_USER} \
--from-literal mongo-password=${MONGODB_PASSWORD} --namespace prod

cd ./cd/infra
kubectl kustomize prod/ --enable-helm | kubectl apply -f -
```

