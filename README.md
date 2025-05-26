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
- [**Common**](https://www.npmjs.com/package/@ticket-system/common): A shared npm package containing reusable code (e.g., middlewares, error handling, event definitions).

More about this `common` package can be found at `https://www.npmjs.com/package/@ticket-system/common`.

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
- [**Custom NPM Package**](https://www.npmjs.com/package/@ticket-system/common): Shared logic and event definitions are abstracted into a reusable package.
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

> I personally do not use Minikube. I am quite happy with Docker Desktop and its integrated Kubernetes. Please configure your way around to get the necessary things up and running, in this case, your local Kubernetes cluster and Ingress.

**4. Configure environment variables:**

Please navigate to `payments/src/test/setup.ts` and you can find raw values for `JWT_KEY` and `STRIPE_KEY`.

> For this project, I wouldn't want to create a separate files for these secret keys, which act as environment variables.
>
> The keys'values are exposed in the test files anyways, and I personally used kubectl to create secret keys, not using any files.
> 
> Of course things won't be so insecured in real-life projects, and there will be different approaches for secret key management.
> 
> **tl;dr:** I'm a bit lazy.

Create secrets for the services as followed:
```
// Just to make sure that you're using the correct context,
// Ideally, the context name will be most likely docker-desktop
kubectl config view
```
```
// Skip this if you're running the correct context.
kubectl config use-context [your-context-name-here]
```
Now, when you already found out the values for `JWT_KEY` and `STRIPE_KEY`:
```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<value-of-JWT_KEY>
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<value-of-STRIPE_KEY>
```

Or, create a `.env` file in each service directory (e.g., `auth`, `tickets`, etc.) with the necessary environment variables `JWT_KEY` and `STRIPE_KEY`, values of which are mentioned above (not preferrable as I haven't tested it yet, but).

**5. Run the application with Skaffold:**

```
skaffold dev
```

**6. Access the application:**

Once all services are up and running, access the frontend at `https://ticketing.io`. Ensure that your `/etc/hosts` file maps `ticketing.io` to your Kubernetes IP.

### Setup Instructions and Implementation from Cloud Deployment

Will be implemented sometime soon.

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

Remember to add domain `https://ticketing.io/` leading each API.

#### 🧑 Auth Service
Handles user authentication and authorization.
- `POST /api/users/signup` – Register a new user
- `POST /api/users/signin` – Authenticate an existing user
- `POST /api/users/signout` – Sign out the current user
- `GET /api/users/currentuser` – Retrieve information about the currently authenticated user

#### 🎫 Tickets Service
Manages ticket creation, updating, and retrieval.
- `GET /api/tickets` – Retrieve a list of all tickets
- `GET /api/tickets/:id` – Retrieve details of a specific ticket
- `POST /api/tickets` – Create a new ticket
- `PUT /api/tickets/:id` – Update an existing ticket

#### 📦 Orders Service
Handles order creation, cancellation, and retrieval.
- `GET /api/orders` – Retrieve a list of orders for the current user
- `GET /api/orders/:id` – Retrieve details of a specific order
- `POST /api/orders` – Create a new order
- `DELETE /api/orders/:id` – Cancel an existing order

#### 💳 Payments Service
Processes payments for orders.
- `POST /api/payments` – Submit a payment for an order

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
