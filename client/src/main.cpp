//
// Created by paulm on 26.03.2023.
//

#include "Arduino.h"
#include "WifiConnector.h"
#include "RemoteUpdater.h"
#include "API.h"
#include "BrokerClient.h"
#include "Discovery.h"

#include "DS18B20.h"

#define SENSOR_PIN 18

WiFiClient net;
BrokerClient client(net);
API api(&client);
Discovery discovery;

OneWire oneWire(SENSOR_PIN);
DS18B20 sensor(&oneWire);

int pullSpeed = 5000;

void setSettings(AsyncWebServerRequest *request) {
    if (!request->hasParam("pullSpeed")) {
        request->send(420);
        return;
    }
    pullSpeed = request->getParam("pullSpeed")->value().toInt();

    request->send(200);
}

void setBroker(AsyncWebServerRequest *request) {
    if (client.isReady) {
        request->send(409);
        return;
    }
    if (request->hasParam("ip")) {
        String brokerIp = request->getParam("ip")->value();
        Serial.println("Set new Broker on " + brokerIp);
        client.setServer(brokerIp.c_str());

        request->send(102);

        if (!client.connect()) {
            request->send(400);
            return;
        }

        client.isReady = true;
        client.registerDeviceMessage();

        request->send(200);
    } else {
        request->send(420);
    }
}

void setup() {
    Serial.begin(9600);
    Serial.println();

    WifiConnector::connect(CONFIG_SSID, CONFIG_PASSWORD);

    API::generateUUID();

    discovery.setup();

    RemoteUpdater::setup((String("Tempi ") + CONFIG_DEVICE_TYPE).c_str());

    api.get("/broker", setBroker);
    api.get("/settings", setSettings);

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
        if (t > pullSpeed) {
            t = 0;

            sensor.requestTemperatures();

            while (!sensor.isConversionComplete());

            client.publishToSensorTopic("temp", String(sensor.getTempC()));
        }
    }

    delay(1);
}
