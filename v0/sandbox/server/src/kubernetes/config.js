import * as k8s from '@kubernetes/client-node';

const k8sApi = new k8s.KubeConfig();
k8sApi.loadFromDefault();

const k8sCoreApi = k8sApi.makeApiClient(k8s.CoreV1Api);

export default k8sCoreApi 