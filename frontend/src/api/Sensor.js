export async function getNewSensorUUIDs(): Promise<string[]> {
    const res = await fetch("/api/sensor/new");
    return await res.json();
}

export async function setSensorName(uuid: string, name: string) {
    const res = await fetch("/api/sensor/known", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({uuid, name})
    });
    return await res.json();
}

export async function getSensors() {
    const res = await fetch("/api/sensor/known");
    return await res.json();
}