

\# EVCharge — Project Status



\## Project Title

EVCharge: Cloud-Native EV Charging Station Reservation with Wait-Time Guardian



\## Project Overview

A cloud-native application for viewing EV charging stations, making reservations, estimating waiting times, and cancelling reservations.



\## Technology Stack

\- Backend: Java 21, Spring Boot, Spring Data JPA

\- Frontend: React, Vite, Nginx

\- Database: MySQL

\- Containerization: Docker

\- Orchestration: Kubernetes with Minikube

\- Autoscaling: Kubernetes HPA and metrics-server

\- Packaging: Helm



\## Implemented Features

\- View charging stations

\- Create charging reservations

\- View reservations

\- View reservations by customer

\- Estimate station waiting time

\- Cancel reservations

\- Persist data in MySQL

\- Expose backend health through Spring Boot Actuator



\## Kubernetes Resources

\- Namespace: evcharge

\- Backend Deployment and ClusterIP Service

\- Frontend Deployment and NodePort Service

\- MySQL Deployment and ClusterIP Service

\- MySQL PersistentVolumeClaim

\- Database Secret and initialization ConfigMap

\- Backend HorizontalPodAutoscaler



\## Autoscaling Configuration

\- Minimum replicas: 1

\- Maximum replicas: 3

\- CPU utilization target: 70%

\- Backend CPU request: 100m

\- Backend memory request: 512Mi

\- Backend CPU limit: 500m

\- Backend memory limit: 768Mi



\## Helm

\- Chart created under helm/evcharge-chart

\- Chart lint validation passed

\- Helm template rendering validated

\- Backend resource settings and HPA included in the chart

\- MySQL excluded from the chart to protect the existing database

\- The current live resources have not yet been adopted into a Helm release



\## Backups

Kubernetes configuration snapshots are stored in:

backup/helm-migration/



These snapshots are for recovery reference and should not be reapplied blindly.



\## Current Status

Core application and Kubernetes deployment are implemented and have been tested.

Reservation creation, wait-time display, and cancellation were confirmed working.

The backend HPA is active and metrics are available.

Helm chart validation is complete.



\## Remaining Finalization

\- Capture final application and Kubernetes screenshots

\- Prepare the final demonstration

\- Confirm any course-specific Helm release requirements

\- Review documentation and backup files



