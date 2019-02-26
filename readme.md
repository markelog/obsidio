# Obsidio [![Build Status](https://travis-ci.org/markelog/obsidio.svg?branch=master)](https://travis-ci.org/markelog/obsidio)

> CLI for [TCP](https://en.wikipedia.org/wiki/SYN_flood) and [UDP flood](https://en.wikipedia.org/wiki/UDP_flood_attack)  attacks

## Install

> npm install -g obsidio

## Usage

Use as it was intended - for test purposes.
On some systems raw socket (for TCP attack) might be restricted use root privileges (`sudo`) to workaround that.

```bash
$ ./bin/obsidio --help
Usage: obsidio [options] <address>

TCP and UDP DDoS

Options:
  -V, --version            output the version number
  -p, --ports <ports>      ports to attack, range, individual - 80,81, 80-443 - only applicable for tcp attack
  -a, --attacks <attacks>  types of attack - tcp and udp (--attacks=tcp,udp), tcp is a default one
  -h, --help               output usage information
```

*Does not support IPv6*
