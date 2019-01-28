FROM node:10-alpine AS build

ADD . /src
WORKDIR /src

### Build

RUN npm install
RUN npm run build
RUN npm prune --production

### Run

FROM node:10-alpine
ENV PORT=3000
EXPOSE $PORT

ENV DIR=/opt/app
WORKDIR $DIR
COPY --from=build /src/config.js config.js
COPY --from=build /src/dist dist
COPY --from=build /src/node_modules node_modules
COPY --from=build /src/package.json package.json
COPY --from=build /src/package-lock.json package-lock.json
CMD ["npm","run", "start:production"]
