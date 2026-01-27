# Command Log

Attempted to access the requested gist using curl:

```console
$ curl -L https://gist.github.com/OminousIndustries/aa62e97053bf5c5b7e3ed464721e2a7c
curl: (56) CONNECT tunnel failed, response 403
```

Attempted to access the raw gist URL:

```console
$ curl -L https://gist.githubusercontent.com/OminousIndustries/aa62e97053bf5c5b7e3ed464721e2a7c/raw
curl: (56) CONNECT tunnel failed, response 403
```

Attempted access via a text proxy:

```console
$ curl -L https://r.jina.ai/http://gist.github.com/OminousIndustries/aa62e97053bf5c5b7e3ed464721e2a7c
curl: (56) CONNECT tunnel failed, response 403
```
