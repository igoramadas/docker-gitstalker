# HELPER COMMANDS

build:
	docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t igoramadas/gitstalker .

publish:
	docker buildx build --push --platform linux/amd64,linux/arm64,linux/arm/v7 -t igoramadas/gitstalker .
