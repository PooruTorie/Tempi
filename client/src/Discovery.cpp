//
// Created by Paul on 28.03.2023.
//

#include "Discovery.h"

void Discovery::setup() {
    if (udp.listen(CONFIG_DISCOVER_PORT)) {
        udp.onPacket([](AsyncUDPPacket packet) {
            Serial.println("Remote: " + packet.remoteIP());
            Serial.write(packet.data(), packet.length());
        });
    }
}