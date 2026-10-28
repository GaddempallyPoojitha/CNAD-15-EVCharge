# EVCharge Helm Chart

This chart describes the existing EVCharge frontend, backend, and MySQL resources. It expects the namespace, Secret (`evcharge-db-secret`), ConfigMap (`evcharge-db-init`), and PVC (`evcharge-mysql-pvc`) to already exist.

## Important: do not install over the current deployment yet

The chart uses the same Kubernetes resource names as the running application. A normal `helm install` will fail because those resources already exist and are not owned by Helm. First validate rendering:

```cmd
helm lint C:\EVCharge\helm\evcharge-chart
helm template evcharge C:\EVCharge\helm\evcharge-chart -n evcharge
```

Do not run `helm uninstall` or delete the existing PVC. The database PVC contains persistent data.

Frontend image defaults to `evcharge-frontend:1.1`, the image tag used for the CORS fix. Backend defaults to `evcharge-backend:1.0`.

After render validation, plan a controlled migration/adoption of existing resources into Helm before installing or upgrading the release.
