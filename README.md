# 🎟️ Ticket Booking App

A microservices-based ticket booking platform built with Node.js, TypeScript, Docker, and Kubernetes. This project demonstrates a scalable, event-driven architecture that simulates real-world applications, showcasing modern DevOps practices and cloud-native design.

---

## 🚀 Overview

This application allows users to:

- **Authenticate** via secure login and registration.
- **Create, update, and list tickets** for events.
- **Place and manage orders** for tickets.
- **Process payments** securely with Stripe.
- **Handle expiration** of unpaid orders automatically.

Each feature is encapsulated within its own microservice, communicating asynchronously through an event bus to ensure loose coupling and high scalability.

---

## 🧱 Microservices Architecture

The system is composed of the following services:

- **Auth Service**: Manages user authentication and authorization.
- **Tickets Service**: Handles creation, updating, and retrieval of tickets.
- **Orders Service**: Manages ticket orders, including creation, cancellation, and status tracking.
- **Payments Service**: Processes payments and confirms transactions.
- **Expiration Service**: Monitors and expires unpaid orders after a set duration.
- **Client**: A simple Next.js frontend for user interaction.
- **Common**: A shared npm package containing reusable code (e.g., middlewares, error handling, event definitions).

Services communicate via [NATS Streaming](https://docs.nats.io/nats-streaming-concepts/intro), enabling event-driven interactions and ensuring eventual consistency across the system.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: Next.js (React)
- **Database**: MongoDB (one per service), Redis (for Expiration service)
- **Messaging**: NATS Streaming (event bus)
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD & Dev Tools**: Skaffold, GitHub Actions

---

## 🧪 Features & Highlights

- **Event-Driven Architecture**: Services publish and subscribe to events, decoupling business logic and improving scalability.
- **Optimistic Concurrency Control (OCC)**: Ensures data consistency during concurrent updates.
- **Custom NPM Package**: Shared logic and event definitions are abstracted into a reusable package.
- **Kubernetes-Ready**: Fully containerized and orchestrated for local or cloud deployment.
- **Developer-Friendly**: Hot reloading, automated builds, and streamlined local development with Skaffold.

---

## ⚙️ Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Skaffold](https://skaffold.dev/)
- [Kubernetes](https://kubernetes.io/docs/home/)
- [Node.js](https://nodejs.org/)

### Local Setup Instructions

**1. Clone the repository:**

```
git clone https://github.com/DucAnhLe1992/ticket-booking-app.git
cd ticket-booking-app
```

**2. Install dependencies:**

```
npm install
```

**3. Start Kubernetes and make sure Ingress is enabled:**

I personally do not use Minikube. I am quite happy with Docker Desktop and its integrated Kubernetes. Please configure your way around to get the necessary things up and running, in this case, your local Kubernetes cluster and Ingress.

**4. Configure environment variables:**

Create secrets for the services (will be updated later, you might temporarily stop here and wait until I update about this part).

Or, create a `.env` file in each service directory (e.g., `auth`, `tickets`, etc.) with the necessary environment variables. Refer to each service's `README.md` or configuration files for required variables. (Each service's `README.md` file will be updated later).

**5. Run the application with Skaffold:**

```
skaffold dev
```

**6. Access the application:**

Once all services are up and running, access the frontend at https://ticketing.io. Ensure that your `/etc/hosts` file maps `ticketing.io` to your Kubernetes IP.

### Setup Instructions and Implementation from Cloud Deployment

Will be implemented soon.

> **Translation:** When I have enough money for a cloud service to deploy my entire project cluster.

---

## 🧪 Testing

Each service includes unit and integration tests using Jest. To run tests for a specific service:
```
cd [service-name]
npm test
```
Replace `[service-name]` with the directory name of the service you wish to test (e.g., `orders`, `payments`).

---

## 📁 Project Structure

```
ticket-booking-app/
├── auth/           # Authentication service
├── client/         # Next.js frontend
├── common/         # Shared npm package
├── expiration/     # Order expiration service
├── infra/          # Kubernetes manifests and configuration
├── orders/         # Order management service
├── payments/       # Payment processing service
├── tickets/        # Ticket management service
├── skaffold.yaml   # Skaffold configuration
└── README.md       # Project documentation
```

---

## 🛠️ API:

To be updated really soon.

---

## 📄 License
This project is licensed under the MIT License.

---

## ✍️ Author
**Duc Anh Le**
GitHub: [@DucAnhLe1992](https://github.com/DucAnhLe1992)  
LinkedIn: [linkedin.com/in/ducanhle92](https://linkedin.com/in/ducanhle92)

---

## 🙌 Acknowledgments
* [Stephen Grider](https://x.com/ste_grider)
