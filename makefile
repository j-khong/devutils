
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
	@echo 'compiling typescript'
	@npx mocha tests/tests.js
