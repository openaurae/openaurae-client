
.PHONY: build
build:
	sudo mkdir -p /var/www/html/openaurae/ && npm run build && sudo cp -r dist/* /var/www/html/openaurae/