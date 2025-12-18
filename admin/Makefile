# -----------------------------------------------------------------------------
# Admin (React/Vite + Nginx) Docker build/push
# -----------------------------------------------------------------------------

IMAGE_NAME ?= sai-admin
VERSION ?= 1.0.0
REGISTRY ?= khedhrije
IMAGE ?= $(REGISTRY)/$(IMAGE_NAME):$(VERSION)

PLATFORMS ?= linux/amd64
BUILDER ?= sai-builder

.PHONY: all builder build push clean print

all: push

print:
	@echo "IMAGE=$(IMAGE)"
	@echo "PLATFORMS=$(PLATFORMS)"

# Ensure a buildx builder exists and is selected
builder:
	@docker buildx inspect $(BUILDER) >/dev/null 2>&1 || docker buildx create --name $(BUILDER) --use
	@docker buildx use $(BUILDER)
	@docker buildx inspect --bootstrap >/dev/null

# Build and push (recommended)
push: builder
	docker buildx build --platform $(PLATFORMS) -t $(IMAGE) --push .

# Local build (loads into docker images list)
build: builder
	docker buildx build --platform $(PLATFORMS) -t $(IMAGE) --load .

clean:
	docker rmi $(IMAGE) || true
