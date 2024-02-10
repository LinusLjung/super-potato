# Super Potato

## Developing

### .env

Add `.env` file. See example file

### Github personal access token

Add `.github-token.txt` with a GH PAT with `read:packages` scope

### Docker volumes

Create the necessary docker volumes. See docker-compose.yml

### Generate SSL certificate

```
openssl req -x509 -out localhost.crt -keyout localhost.key \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

Place the files in folder `ssl`
