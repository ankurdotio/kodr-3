import k8sCoreApi from "./config.js";

export async function createPod(sandboxId) {
    const podManifest = {
        metadata: {
            name: `sandbox-pod-${sandboxId}`,
            labels: {
                sandboxId: sandboxId
            }
        },
        spec: {
            volumes: [
                {
                    name: "workspacevolume",
                    emptyDir: {}
                }
            ],
            containers: [
                {
                    image: "template",
                    name: "sandbox-container",
                    ports: [ { containerPort: 5173, protocol: "TCP", name: "sandbox-port" } ],
                    resources: {
                        limits: { cpu: "500m", memory: "1Gi" },
                        requests: { cpu: "250m", memory: "512Mi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspacevolume",
                            mountPath: "/workspace"
                        }
                    ]
                },
                {
                    image: "agent",
                    name: "agent-container",
                    ports: [ { containerPort: 3000, protocol: "TCP", name: "agent-port" } ],
                    resources: {
                        limits: { cpu: "500m", memory: "128Mi" },
                        requests: { cpu: "250m", memory: "64Mi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspacevolume",
                            mountPath: "/workspace"
                        }
                    ]
                }
            ]
        }
    }

    const response = await k8sCoreApi.createNamespacedPod({
        namespace: "default",
        body: podManifest
    })

    return response.body;
}

export async function deletePod(sandboxId) {
    await k8sCoreApi.deleteNamespacedPod({
        name: `sandbox-pod-${sandboxId}`,
        namespace: "default"
    })
}