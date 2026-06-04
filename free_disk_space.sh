#!/bin/bash

docker ps

docker container purne

docker image prune -a

docker builder prune -a

docker compose down -v