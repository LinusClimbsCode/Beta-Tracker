#!/bin/bash

# check for existing .env file
if ! [[ -e .env ]]; then 
  echo 'Error: need a .env file!'
  exit 1
fi

CONTAINER_NAME=$(grep "^CONTAINER_NAME=" .env | cut -d "=" -f2)
if [[ -z $CONTAINER_NAME ]]; then
  echo 'Variable CONTAINER_NAME in .env is empty, needs a value!'
  exit 1
fi
ROOT_USER=$(grep "^ROOT_USER=" .env | cut -d "=" -f2)
if [[ -z $ROOT_USER ]]; then
  echo 'Variable ROOT_USER in .env is empty, needs a value!'
  exit 1
fi
ROOT_PASSWORD=$(grep "^ROOT_PASSWORD=" .env | cut -d "=" -f2)
if [[ -z $ROOT_PASSWORD ]]; then
  echo 'Variable ROOT_PASSWORD in .env is empty, needs a value!'
  exit 1
fi
DATABASE=$(grep "^DATABASE=" .env | cut -d "=" -f2)
if [[ -z $DATABASE ]]; then
  echo 'Variable DATABASE in .env is empty, needs a value!'
  exit 1
fi
APP_USER=$(grep "^APP_USER=" .env | cut -d "=" -f2)
if [[ -z $APP_USER ]]; then
  echo 'Variable APP_USER in .env is empty, needs a value!'
  exit 1
fi
USER_PASSWORD=$(grep "^USER_PASSWORD=" .env | cut -d "=" -f2)
if [[ -z $USER_PASSWORD ]]; then
  echo 'Variable USER_PASSWORD in .env is empty, needs a value!'
  exit 1
fi
CONTAINER_HOST=$(grep "^CONTAINER_HOST=" .env | cut -d "=" -f2)
if [[ -z $CONTAINER_HOST ]]; then
  echo 'Variable CONTAINER_HOST in .env is empty, needs a value!'
  exit 1
fi
PORT=$(grep "^POSTGRES_PORT=" .env | cut -d "=" -f2)
if [[ -z $PORT ]]; then
  echo 'Variable PORT in .env is empty, needs a value!'
  exit 1
fi

# check for podman or docker 
if /usr/bin/which -s podman; then
  PROGRAM='podman'
elif /usr/bin/which -s docker; then
  PROGRAM='docker'
else
  echo 'Error: you need podman or docker installed!'
  exit 1
fi

# container loop
counter=0
while [ "$counter" -lt 3 ]; do
  # check if container exist
  if $PROGRAM ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "Container '$CONTAINER_NAME' exist."

    # check if container runs
    if $PROGRAM ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
      echo "Container '$CONTAINER_NAME' runs."
      counter=3
    # start container
    else
      echo "Container '$CONTAINER_NAME' exist, but is down. Try to start"
      $PROGRAM start $CONTAINER_NAME
      counter=$((counter + 1))
    fi
  # setup container
  else
    echo "Container '$CONTAINER_NAME' does not exist."
    $PROGRAM run -d --name $CONTAINER_NAME \
      -e POSTGRES_PASSWORD=$ROOT_PASSWORD \
      -e POSTGRES_USER=$ROOT_USER \
      -e POSTGRES_DB=$DATABASE \
      -v postgres_data:/var/lib/postgresql/data \
      -p $CONTAINER_HOST:$PORT \
      postgres:17-alpine
    counter=$((counter + 1))
  fi
done

# user loop
counter=0
while [ $counter -lt 2 ]; do
  # setup user in db
  result=$($PROGRAM exec $CONTAINER_NAME psql -U $ROOT_USER -d $DATABASE -tAc "SELECT 1 FROM pg_user WHERE usename='$APP_USER';" 2>&1)
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
    $PROGRAM exec $CONTAINER_NAME psql -U $ROOT_USER -d $DATABASE -tAc "CREATE USER $APP_USER WITH PASSWORD '$USER_PASSWORD'"
    $PROGRAM exec $CONTAINER_NAME psql -U $ROOT_USER -d $DATABASE -tAc "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO $APP_USER"
    counter=$((counter + 1))
  fi
done
echo "Ready to rumble"
