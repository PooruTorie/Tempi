import json

Import("env")

with open("config.json", encoding="UTF8") as config:
    config = json.load(config)
    useOta = config["ota"]
    if useOta:
        env.Replace(UPLOAD_PROTOCOL="espota")
    for key in config:
        value = config[key]
        if type(value) == str and not value.isnumeric():
            value = "\\\"" + value + "\\\""
        if type(value) == bool:
            if value:
                value = "1"
            else:
                continue
        if type(value) == dict:
            continue
        env.Append(BUILD_FLAGS=["-DCONFIG_%s=%s" % (key.upper(), value)])
        if key.upper() == "DEVICE_TYPE":
            env.Append(BUILD_FLAGS=["-DCONFIG_DEVICE_TYPE_NAME=\\\"%s\\\"" % config["device_types"][str(value)]])
        if useOta:
            if key.upper() == "OTA_PASSWORD":
                env.Append(UPLOAD_FLAGS=["--auth=%s" % value])
            if key.upper() == "OTA_IP":
                env.Replace(UPLOAD_PORT=value)

version = env.GetProjectOption("version")

env.Append(BUILD_FLAGS=["-DCONFIG_VERSION=\\\"%s\\\"" % version])


env.Replace(PROGNAME="tempi_%s" % version)

print(env.Dump())
