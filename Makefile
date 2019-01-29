DEBUG?=debug,info,warn,error,fatal
DOCKER_LOGIN_URL?=
DOCKER_PASS?=
DOCKER_USER?=
LOG_LEVEL?=debug

build:
	docker build -t int-test-example .

docker-login:
	docker login $(DOCKER_LOGIN_URL) -u $(DOCKER_USER) -p $(DOCKER_PASS)

down:
	docker-compose down --remove-orphans

down-test-ci:
	COMPOSE_FILE=docker-compose.integration.yml \
	docker-compose down --remove-orphans

install:
	COMPOSE_FILE=docker-compose.build.yml \
	docker-compose run --rm install

install-ci: docker-login install

test-ci: docker-login test-all

test:
	COMPOSE_FILE=docker-compose.build.yml \
	LOG_LEVEL=off \
	docker-compose run --rm test

test-debug:
	COMPOSE_FILE=docker-compose.build.yml \
	LOG_LEVEL=$(LOG_LEVEL) \
	docker-compose run --rm test

test-all:
	COMPOSE_FILE=docker-compose.integration.yml \
	LOG_LEVEL= \
	docker-compose run --rm test-all && \
	docker-compose down --remove-orphans

test-all-debug:
	COMPOSE_FILE=docker-compose.integration.yml \
	LOG_LEVEL=$(LOG_LEVEL) \
	docker-compose run --rm test-all && \
	docker-compose down --remove-orphans

test-integration:
	COMPOSE_FILE=docker-compose.integration.yml \
	LOG_LEVEL= \
	docker-compose run --rm test-integration && \
	docker-compose down --remove-orphans

test-integration-debug:
	COMPOSE_FILE=docker-compose.integration.yml \
	LOG_LEVEL=$(LOG_LEVEL) \
	docker-compose run --rm test-integration && \
	docker-compose down --remove-orphans

up:
	LOG_LEVEL=$(LOG_LEVEL) \
	docker-compose up
