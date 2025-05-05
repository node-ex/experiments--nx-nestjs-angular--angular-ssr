# syntax=docker/dockerfile:1

FROM node:22.4.1-alpine3.19 AS base-node-version

FROM base-node-version AS install

# DEBUG: Check .dockerignore file
# DEBUG: Output configuration summary for NPM
# RUN npm config list

USER root
WORKDIR /app

RUN npm install --global pnpm

# NOTE: Copy only files required for installing dependencies. Helps with
# layer caching.
COPY \
    package.json \
    pnpm-lock.yaml \
    .npmrc* \
    ./
RUN --mount=type=cache,target=/node/.local/share/pnpm/store,sharing=shared \
    pnpm install --frozen-lockfile

# WARN: DO NOT remove the following files, otherwise `npm prune` and `pnpm prune` will delete
#       all dependencies.
# RUN rm -f \
#     package.json \
#     pnpm-lock.yaml \
#     .npmrc*

# NOTE: Use if not mounting cache for dependency installation
# RUN npm cache clean --force \
#     && pnpm store prune

FROM install AS build

USER root
WORKDIR /app

# NOTE: Copy only files required for correct production build
COPY ./apps/app-angular-1 ./apps/app-angular-1
# NOTE: ESLint and Jest configs are required by Nx, they don't affect the build itself
COPY \
    nx.json \
    tsconfig.base.json \
    .eslintrc.js \
    jest.config.ts \
    jest.preset.js \
    ./

ENV NODE_ENV=production
# DEBUG: Use --verbose flag
# DEBUG: Set NX_VERBOSE_LOGGING
# ENV NX_VERBOSE_LOGGING=true
RUN pnpm exec nx run app-angular-1:build:production

# NOTE: Delete development dependencies from `node_modules`
RUN pnpm install --prod \
    && find node_modules -type d -empty -delete

FROM base-node-version AS production-base

USER root

# NOTE: Add Tini to reap zombie processes and handle signals correctly.
#       Not needed, if using host PID mode or running only a single process
# RUN apk update \
#     && apk add --no-cache tini=0.19.0-r1

# NOTE: Add curl for healthcheck
RUN apk update \
    && apk add --no-cache curl

USER node
WORKDIR /app

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
# NOTE: For documentation purposes only
COPY --chown=node:node ./docker/ssr/Dockerfile ./docker/ssr/Dockerfile
COPY --chown=node:node \
    package.json \
    README.md \
    ./

ENV NODE_ENV=production
# NOTE: For documentation purposes only
EXPOSE 4000
# NOTE: Not needed, if using host PID mode or running only a single process
# ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./dist/apps/app-angular-1/server/server.mjs"]

HEALTHCHECK \
    --start-period=10s \
    --interval=1m \
    CMD curl --fail http://localhost:4000 || exit 1
