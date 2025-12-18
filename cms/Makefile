# Load environment variables if the file exists
-include .env
export

# Variables
IMAGE_NAME ?= sai-cms
VERSION ?= 1.0.0
REGISTRY ?= khedhrije
IMAGE ?= $(REGISTRY)/$(IMAGE_NAME):$(VERSION)
PLATFORMS ?= linux/amd64

.PHONY: all push clean

all: push

push:
	docker buildx build --platform $(PLATFORMS) -t $(IMAGE) --push .

clean:
	docker rmi $(IMAGE) || true