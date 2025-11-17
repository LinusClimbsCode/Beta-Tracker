#!/bin/bash

CONTAINER_NAME=$(grep "^CONTAINER_NAME" .env | cut -d "=" -f2)
ROOT_USER=$(grep "^ROOT_USER" .env | cut -d "=" -f2)
ROOT_PASSWORD=$(grep "^ROOT_PASSWORD" .env | cut -d "=" -f2)
DATABASE=$(grep "^DATABASE" .env | cut -d "=" -f2)
APP_USER=$(grep "^APP_USER" .env | cut -d "=" -f2)
APP_PASSWORD=$(grep "^APP_PASSWORD" .env | cut -d "=" -f2)
DOCKER_HOST=$(grep "^DOCKER_HOST" .env | cut -d "=" -f2)
PORT=$(grep "^POSTGRES_PORT" .env | cut -d "=" -f2)

# container loop
counter=0
while [ "$counter" -lt 3 ]; do
  # check if container exist
  if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container '$CONTAINER_NAME' exist."

    # check if container runs
    if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
      echo "Container '$CONTAINER_NAME' runs."
      counter=3
    # start container
    else
      echo "Container '$CONTAINER_NAME' exist, but is down. Try to start"
      docker start $CONTAINER_NAME
      counter=$((counter + 1))
    fi
  # setup container
  else
    echo "Container '$CONTAINER_NAME' does not exist."
    docker run -d --name $CONTAINER_NAME \
      -e POSTGRES_PASSWORD=$ROOT_PASSWORD \
      -e POSTGRES_USER=$ROOT_USER \
      -e POSTGRES_DB=$DATABASE \
      -v postgres_data:/var/lib/postgresql/data \
      -p $DOCKER_HOST:$PORT \
      postgres:17-alpine
    counter=$((counter + 1))
  fi
done

# user loop
counter=0
while [ $counter -lt 2 ]; do
  # setup user in db
  result=$(docker exec $CONTAINER_NAME psql -U $ROOT_USER -d $DATABASE -tAc "SELECT 1 FROM pg_user WHERE usename='$APP_USER';" 2>&1)
  exit_code=$?

  if [ $exit_code -ne 0 ]; then
    echo "Error: no reply from DB: $result"
    exit 1
  fi

  if echo "$result" | grep -q "^1$"; then
    echo "User exist"
    counter=2
  else
    echo "User does not exist"
    docker exec $CONTAINER_NAME psql -U $ROOT_USER -d $DATABASE -tAc "CREATE USER $APP_USER WITH PASSWORD '$APP_PASSWORD'"
    docker exec $CONTAINER_NAME psql -U $ROOT_USER -d $DATABASE -tAc "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ublic TO $APP_USER"
    counter=$((counter + 1))
  fi
done
echo "Ready to rumble"
