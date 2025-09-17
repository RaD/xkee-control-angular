NAMESPACE ?= xkee
PACKAGE := control
SHELL := /bin/bash
REGISTRY := registry.halfakop.ru
REPOSITORY := $(NAMESPACE)/$(PACKAGE)
PLATFORM ?= --platform=linux/amd64
BIND_IP ?= localhost
BIND_PORT ?= 4200

SOURCE_VERSION ?= $(shell cat VERSION)
SOURCE_COMMIT ?= $(shell git rev-parse --short=8 HEAD)
GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD | sed s,feature/,,g)

IMAGE_NAME_TAGGED = $(REPOSITORY):$(SOURCE_VERSION)
EXEC=$(PACKAGE).run

all: help

help:
	@echo "container - run container"
	@echo "release - build and push image"

shell:
	docker run -it --rm ${PLATFORM} \
		--entrypoint sh \
		$(REGISTRY)/$(IMAGE_NAME_TAGGED)

kill:
	docker kill ${PACKAGE}

container:
	docker run -it --rm ${PLATFORM} \
		-d -p ${BIND_IP}:${BIND_PORT}:80 --name ${PACKAGE} \
		-e APP_BACKEND_URL=http://localhost:8000 \
		$(REGISTRY)/$(IMAGE_NAME_TAGGED)

release: title clean build login push

build:
	DOCKER_BUILDKIT=0 \
	docker build $(PLATFORM) --compress \
		-t $(IMAGE_NAME_TAGGED) \
		-t $(REGISTRY)/$(IMAGE_NAME_TAGGED) \
		--build-arg SOURCE_VERSION=$(SOURCE_VERSION) \
		--build-arg SOURCE_COMMIT=$(SOURCE_COMMIT) \
		${DOCKER_OPTS} \
		-f Dockerfile .

login:
	$(call check-var-defined,DOCKER_USERNAME)
	$(call check-var-defined,DOCKER_PASSWORD)
	@echo ${DOCKER_PASSWORD} | \
	docker login -u ${DOCKER_USERNAME} --password-stdin $(REGISTRY)

push:
	docker push $(REGISTRY)/$(IMAGE_NAME_TAGGED)

.PHONY: build release build login push
