# ---- build stage ----
FROM node:20.18.1-alpine3.19 AS build

RUN apk add --no-cache \
  build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git

WORKDIR /opt/app

COPY package.json yarn.lock ./
RUN yarn config set network-timeout 600000 -g \
  && yarn install --frozen-lockfile

COPY . .
ENV NODE_ENV=production
RUN yarn build


# ---- runtime stage ----
FROM node:20.18.1-alpine3.19 AS runtime

RUN apk add --no-cache vips-dev

WORKDIR /opt/app
COPY --from=build /opt/app ./

ENV NODE_ENV=production
EXPOSE 1337

RUN mkdir -p /opt/app/public/uploads
USER node

CMD ["yarn", "start"]
