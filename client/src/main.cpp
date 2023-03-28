//
// Created by paulm on 26.03.2023.
//

#include "Arduino.h"
#include "WifiConnector.h"
#include "RemoteUpdater.h"
#include "API.h"
#include "BrokerClient.h"

#include "DS18B20.h"
#include "Discovery.h"

#define SENSOR_PIN 18

WiFiClient net;
BrokerClient client(net);
API api(&client);
Discovery discovery;

OneWire oneWire(SENSOR_PIN);
DS18B20 sensor(&oneWire);

void setBroker(AsyncWebServerRequest *request) {
    if (!client.isReady) {
        if (request->hasParam("ip")) {
            auto brokerIp = request->getParam("ip");
            client.setServer(brokerIp->value().c_str());

            request->send(102);

            if (client.connect()) {
                client.isReady = true;

                client.registerDeviceMessage();

                request->send(200);
            } else {
                request->send(400);
            }
        } else {
            request->send(420);
        }
    } else {
        request->send(409);
    }
}

void setup() {
    Serial.begin(9600);

    WifiConnector::connect(CONFIG_SSID, CONFIG_PASSWORD);

    API::generateUUID();

    discovery.setup();

    RemoteUpdater::setup((String("Tempi ") + CONFIG_DEVICE_TYPE).c_str());

    api.get("/broker", setBroker);

    api.begin();

    sensor.begin();
}

int t = 0;

void loop() {
    WifiConnector::handle();
    RemoteUpdater::handle();
    client.handle();

    if (client.isReady) {
        t++;
        if (t > 1000) {
            t = 0;

            sensor.requestTemperatures();

            while (!sensor.isConversionComplete());

            client.publishToSensorTopic("temp", String(sensor.getTempC()));
        }
    }
}
