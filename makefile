
.PHONY: install
install:
	@echo 'installing dependencies...'
	@npm i

.PHONY: format
format: install
	@npx prettier --write "src/**/*.ts"

.PHONY: lint
lint: install
	@npx eslint src --ext .js,.ts

.PHONY: build
build: install
	@echo 'compiling typescript'
	@npx tsc

.PHONY: test
test: build
	@npx mocha tests/tests.js && \
	npx vitest run

.PHONY: release
release: build
	@npm login
	npm version $(VERSION)
	npm publish --access=public