TARGET := /var/www/html/openaurae/

.PHONY: build
build:
	sudo mkdir -p $(TARGET) && \
	npm install && npm run build && \
	sudo cp -r dist/* $(TARGET)

.PHONY: clean
clean:
	rm -rf dist/
