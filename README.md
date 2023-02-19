## A NodeJS Microservice based Application

---

### 🛠 &nbsp;Tech Stack

- Front-End: NextJS
- Backend: NodeJS
- Database: MongoDB
- Tools: RabbitMQ, Ingress Nginx, Docker, Kubernetes

---

### 🧑🏼‍🔬 Overview

 - The application is a simple message app which allows users to key in a message and a sub-message. 
 - It utilizes a microservice architecture that breaks down the 3 services.
 
    - Message service - the service that allows a message to be created
    - Peep service - the service that allows a sub-message to be created
    - Query service - the service from which display data is pulled from

 - All services follow a database per service architecture, with the database of choice being MongoDB
 - Each service is Dockerized and deployed to a Kubernetes Cluster
 - Kubernetes ClusterIP Services are setup for communication

<img width="704" alt="Screenshot 2023-02-20 at 2 10 59 AM" src="https://user-images.githubusercontent.com/72048640/219968647-0c076177-f4f2-484c-b3d9-4255b4228475.png">

---

### 🌐 High-Level Architecture

- The application allows for asynchronous event handling via RabbitMQ
- This allows for data changes in any service to be normalized across the other services and databases
- Ingress Nginx acts as a load balancer and external router for HTTP requests from outside the Kubernetes Cluster
- RabbitMQ topics allow for a pub-sub model where a multi-subscriber pattern is utilized

<img width="803" alt="Screenshot 2023-02-20 at 2 38 15 AM" src="https://user-images.githubusercontent.com/72048640/219969257-e01a3a24-e721-44dc-bfa5-4d03a921205e.png">

## Set-up Environment

You will need Docker, Kubernetes, Skaffold and Ingress Nginx installed in your development environment.  

[Install Docker Desktop on Windows or MacOS. Install Docker on Linux.](https://docs.docker.com/get-docker/)

[Install Kubernetes on Linux](https://minikube.sigs.k8s.io/docs/start/)

[Install Skaffold](https://skaffold.dev/docs/install/)

[Install Ingress Nginx](https://kubernetes.github.io/ingress-nginx/deploy/)

## Customize local hosts file  

You will also need to customize your local hosts file to point message-app.dev to your localhost IP address.

Windows:
c:\Windows\System32\Drivers\etc\hosts

macOS and Linux:
/etc/hosts

 Open your hosts file and add the following line at the bottom:
`127.0.0.1 message-app.dev`

## Runnning the Microservices  

From a terminal in the root directory of NodeJS-Microservices, run the following command:
`skaffold dev`

Allow time for all of the services to start and connect. Stop any pods which fail to connect via Docker Desktop. They will restart automatically.

Open your browser and navigate to http://message-app.dev/. You may get a security warning. To bypass this in chrome, type "thisisunsafe" directly in the browser window.

