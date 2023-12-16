FROM node:12.18.3-alpine3.9 as builder

WORKDIR /usr/src/app

COPY ./package.json .
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install \
    && apk del .gyp

COPY . .

RUN npm run build  

FROM node:12.18.3-alpine3.9 

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=builder /usr/src/app/build ./build