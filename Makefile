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

install:
	COMPOSE_FILE=docker-compose.build.yml \
	docker-compose run --rm install

install-ci: docker-login install

test-ci: docker-login test-integration

test:
	LOG_LEVEL=off \
	docker-compose -f docker-compose.build.yml run --rm test

test-all:
	LOG_LEVEL=off \
	docker-compose -f docker-compose.integration.yml run --rm test-all

test-integration:
	LOG_LEVEL=off \
	docker-compose -f docker-compose.integration.yml run --rm test-integration

test-integration-debug:
	LOG_LEVEL=$(LOG_LEVEL) \
	docker-compose -f docker-compose.build.yml run --rm test-integration

up:
	LOG_LEVEL=$(LOG_LEVEL) \
	docker-compose up
