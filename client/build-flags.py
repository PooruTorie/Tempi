import json

Import("env")

with open("config.json", encoding="UTF8") as config:
    config = json.load(config)
    for key in config:
        value = config[key]
        if type(value) == str and not value.isnumeric():
            value = "\\\"" + value + "\\\""
        if type(value) == bool:
            if value:
                value = "1"
            else:
                continue
        env.Append(BUILD_FLAGS=["-DCONFIG_%s=%s" % (key.upper(), value)])

version = env.GetProjectOption("version")

env.Append(BUILD_FLAGS=["-DCONFIG_VERSION=\\\"%s\\\"" % version])

env.Replace(PROGNAME="tempi_%s" % version)

print(env.Dump())
