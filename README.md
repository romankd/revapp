Only for testing purposes

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

#TESTING BUILD

kubectl create secret generic mongodb-secret \
--from-literal mongo-admin=${MONGODB_ADMIN_USER} \
--from-literal mongo-admin-password=${MONGODB_ADMIN_PASSWORD} \
--from-literal initdb=${MONGODB_INIT_DB} \
--from-literal mongo-db=${MONGODB_DATABASE} \
--from-literal mongo-user=${MONGODB_USER} \
--from-literal mongo-password=${MONGODB_PASSWORD} --namespace dev

kustomize build dev/ --enable-helm

