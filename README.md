[![Travis Build Status](https://img.shields.io/travis/cmr1/docker-ts3-bot-verify-gw2.svg?style=flat-square)](https://travis-ci.org/cmr1/docker-ts3-bot-verify-gw2)
[![DockerHub pulls](https://img.shields.io/docker/pulls/cmr1/ts3-bot-verify-gw2.svg?style=flat-square)](https://hub.docker.com/r/cmr1/ts3-bot-verify-gw2)
[![DockerHub stars](https://img.shields.io/docker/stars/cmr1/ts3-bot-verify-gw2.svg?style=flat-square)](https://hub.docker.com/r/cmr1/ts3-bot-verify-gw2)

# docker-ts3-bot-verify-gw2

## Install

Pull from DockerHub:

```bash
docker pull cmr1/ts3-bot-verify-gw2
```

Clone & build from GitHub:

```bash
git clone https://github.com/cmr1/docker-ts3-bot-verify-gw2.git
docker build -t cmr1/ts3-bot-verify-gw2 ./docker-ts3-bot-verify-gw2/
```

## Usage

Run the Docker image with default configuration:

```bash
# Run bot in the foreground
docker run -it cmr1/ts3-bot-verify-gw2

## OR ##

# Run bot in the background
docker run -d cmr1/ts3-bot-verify-gw2
```
- *Attempt to connect to a TS3 server running locally with user: `serveradmin` and pass: `password`*
- **NOTE:** *This will fail because `127.0.0.1` within Docker is not your local host, use `172.17.0.2` instead*

## Configuration

Customize the bot configuration with environment variables:

```bash
docker run -it \
  -e BOT_NAME="Woodhouse" \
  -e TS3_HOST="172.17.0.2" \
  -e TS3_CHANNEL="Server Verify Bot" \
  -e GW2_HOME_WORLD="Sea of Sorrows" \
  -e GW2_HOME_GROUP="Verified" \
  -e GW2_LINKED_WORLDS="Devona's Rest" \
  -e GW2_LINKED_GROUP="Linked" \
  cmr1/ts3-bot-verify-gw2
```

Available environment variables and sample values:

```bash
# Bot Settings
BOT_NAME="Woodhouse"  # Name of the bot client (default = Woodhouse)
BOT_VERBOSE=0         # Set to non-zero value to enable verbose output (default = false)

# TS3 Settings
TS3_SID=1                       # SID of the virtual server to connect to (default = 1)
TS3_USER=serveradmin            # TS3 ServerQuery username (default = serveradmin)
TS3_PASS=password               # TS3 ServerQuery password (no default value)
TS3_CHANNEL="Server Verify Bot" # Channel for bot to join when initialized
TS3_HOST="172.17.0.2"           # TS3 server host (default = 127.0.0.1)
TS3_PORT=10011                  # TS3 ServerQuery TCP port (default = 10011)

# GW2 Verification Settings
GW2_HOME_WORLD="Sea of Sorrows"   # GW2 home world for verification (default = null)
GW2_HOME_GROUP="Verified"         # GW2 home group (default = Normal)
GW2_LINKED_WORLDS="Devona's Rest" # GW2 linked worlds (comma separated, default = null)
GW2_LINKED_GROUP="Linked"         # GW2 linked world group (default = Normal)
```