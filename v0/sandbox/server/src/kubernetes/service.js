import k8sCoreApi from "./config.js";

export async function createService(sandboxId) {
    const serviceManifest = {
        metadata: {
            name: `sandbox-service-${sandboxId}`,
            labels: {
                sandboxId: sandboxId
            }
        },
        spec: {
            selector: {
                sandboxId: sandboxId
            },
            ports: [
                {
                    name: "sandbox-port",
                    protocol: "TCP",
                    port: 80,
                    targetPort: 5173,
                },
                {
                    name: "agent-port",
                    protocol: "TCP",
                    port: 8080,
                    targetPort: 3000,
                }
            ]
        }
    }
    const response = await k8sCoreApi.createNamespacedService({
        namespace: "default",
        body: serviceManifest
    })
    return response.body;
}

export async function deleteService(sandboxId) {
    await k8sCoreApi.deleteNamespacedService({
        name: `sandbox-service-${sandboxId}`,
        namespace: "default"
    })
}