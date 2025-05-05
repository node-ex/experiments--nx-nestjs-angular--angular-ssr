#!/usr/bin/env bash

set -e

docker container run \
  --name node \
  --rm \
  --init \
  --detach \
  --workdir /host \
  --mount type=bind,source="$(pwd)",target=/host \
  node:22.4.1-alpine3.19 \
  tail \
    -f \
    /dev/null
