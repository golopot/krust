openssl req -nodes \
	-newkey rsa:2048 \
	-keyout site.key \
	-out site.csr \
	-subj "/C=TW/ST=London/L=London/O=Some Organization/OU=IT Department/CN=localhost"

openssl x509 -req -days 365 \
	-in site.csr \
	-signkey site.key \
	-out site.crt

rm site.csr
