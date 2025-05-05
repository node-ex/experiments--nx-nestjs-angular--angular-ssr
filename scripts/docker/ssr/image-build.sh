#!/usr/bin/env bash

set -e

docker image build \
  --tag my-ssr:latest \
  --file ./docker/ssr/Dockerfile \
  .
