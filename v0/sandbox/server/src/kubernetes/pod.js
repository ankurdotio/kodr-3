import k8sCoreApi from "./config.js";

export async function createPod(sandboxId, projectId) {
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
            initContainers: [
                {
                    image: "template",
                    name: "init-container",
                    command: [ "sh", "-c", "cp -r /workspace/. /load/" ],
                    volumeMounts: [
                        {
                            name: "workspacevolume",
                            mountPath: "/load"
                        }
                    ],
                    resources: {
                        limits: { cpu: "100m", memory: "500Mi" },
                        requests: { cpu: "50m", memory: "256Mi" }
                    }
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
                },
                {
                    image: "sync",
                    name: "sync-container",
                    ports: [ { containerPort: 3000, protocol: "TCP", name: "sync-port" } ],
                    resources: {
                        limits: { cpu: "500m", memory: "128Mi" },
                        requests: { cpu: "250m", memory: "64Mi" }
                    },
                    volumeMounts: [
                        {
                            name: "workspacevolume",
                            mountPath: "/workspace"
                        }
                    ],
                    env: [
                        {
                            name: "AWS_REGION",
                            valueFrom: {
                                secretKeyRef: {
                                    name: "aws",
                                    key: "AWS_REGION"
                                }
                            }
                        },
                        {
                            name: "AWS_ACCESS_KEY_ID",
                            valueFrom: {
                                secretKeyRef: {
                                    name: "aws",
                                    key: "AWS_ACCESS_KEY_ID"
                                }
                            }
                        },
                        {
                            name: "AWS_SECRET_ACCESS_KEY",
                            valueFrom: {
                                secretKeyRef: {
                                    name: "aws",
                                    key: "AWS_SECRET_ACCESS_KEY"
                                }
                            }
                        },
                        {
                            name: "S3_BUCKET",
                            valueFrom: {
                                secretKeyRef: {
                                    name: "aws",
                                    key: "S3_BUCKET"
                                }
                            }
                        },
                        {
                            name: "PROJECTID",
                            value: projectId
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