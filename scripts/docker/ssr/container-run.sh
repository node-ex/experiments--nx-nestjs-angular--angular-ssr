#!/usr/bin/env bash

set -e

docker container run \
  --name my-ssr \
  --rm \
  --init \
  --detach \
  --publish host_ip=0.0.0.0,published=4000,target=4000 \
  my-ssr:latest
