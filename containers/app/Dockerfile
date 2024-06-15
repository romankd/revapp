FROM node:22-alpine3.18 as builder
RUN mkdir /nodeapp
WORKDIR /nodeapp
COPY . .

ARG environment_type=dev
ENV NODE_ENV=$environment_type
RUN npm install .


FROM node:22-alpine3.18 as runner
ARG app_build_verion
ENV APP_VERSION=$app_build_verion

ARG app_port=3000
ENV APP_PORT=$app_port

ARG app_host=0.0.0.0
ENV APP_HOST=$app_host

#USER node
COPY --from=builder /nodeapp /nodeapp
WORKDIR /nodeapp

EXPOSE 3000

ENTRYPOINT ["nodejs", "app.js"]