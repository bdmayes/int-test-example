# int-test-example
Simple example of running isolated integration tests using Jenkins and Docker. Everything in this repo is controlled via the `Makefile`. It should work fine in both a Linux and Mac environment. I have no idea how to make this work in Windows.

This repo contains both unit as well as integration tests, but the main point of this repo is to demonstrate execution of integration tests, particularly in the context of a continuous integration environment, such as Jenkins.

## Getting started
Once you have cloned this repo, make sure to run `npm install` or feel free to run `make install` instead (which will utilize a Docker container, mapped to the current working directory that will perform the installation). Just about everything in here will assume that you have the Docker engine already installed on your machine.

## Running tests
#### Unit tests: `make test`
The default test target for this project will only execute unit tests. I personally prefer this, just in case I am developing and don't want wait to wait minutes for an entire integration test suite to run.

#### Integration tests: `make test-integration`
The real heart of what we are trying to demonstrate here. The make target is as follows:

```
test-integration:
	COMPOSE_FILE=docker-compose.integration.yml \
	LOG_LEVEL= \
	docker-compose run --rm test-integration && \
	docker-compose down --remove-orphans
```

This instructs docker-compose to use the file named `docker-compose.integration.yml` instead of looking for the default `docker-compose.yml` file. Additionally, it runs the target `test-integration` with the `--rm` flag, which instructs the Docker engine to remove the running containers as soon as execution is complete. Oddly enough, this doesn't seem to be working so I added in the case of success it will then call `docker-compose down`. Inside of the Jenkinsfile, this is wrapped in a try/finally block, where we always execute the down command to be sure that we clean up any running containers.

The `docker-compose.integration.yml` contains a few different services:
- int-test-example: This container gets the current working directory copied inside of it. Basically, it copies the current version of the source code inside of it and then starts it up in development mode.
- redis: While redis isn't technically required, I wanted to pick something to demonstrate a dependency for the running code. In this case, we need redis up and running, and the API will utilize it to cache results. Other depedencies might include persistence layers such as database here, another API/service that this one consumes, etc.
- test-integration: The target executed by the `docker-compose` command. It lists the container that is running our code as a dependency, as well as any dependencies of that code (such as redis).
- test-all: Basically the same as test-integration. See the next section for more information.

#### All tests: `make test-all`
This is very similar to the integration test target, which barely differs from the `test-integration` target. They are basically a copy/paste of each other, except that in this case:
- The run command invoked will execute `npm run test:all` rather than `npm run test:integration`
- The jest configuration file that will locate _all_ of the *.js files under the `tests` directory