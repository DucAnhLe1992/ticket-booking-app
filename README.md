# 🎟️ Ticket Booking App

A microservices-based ticket booking platform built with Node.js, TypeScript, Docker, and Kubernetes. This project demonstrates a scalable, event-driven architecture that simulates real-world applications, showcasing modern DevOps practices and cloud-native design. Visit `http://www.ticket-system.xyz/` for a quick demonstration of the app.

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

### I. Local Setup Instructions

**1. Clone the repository:**

```
git clone https://github.com/DucAnhLe1992/ticket-booking-app.git
cd ticket-booking-app
```

**2. Install dependencies:**
Please go through all directories as listed: `auth`, `client`, `expiration`, `orders`, `payments`, and `tickets`. No need to go through `common` and `infra`, as the former is already an npm package itself, used for supporting other services, and the latter is just a combination of configurations and manifests.

```
// Do this 6 times, presumably you're at root folder of the project
// whenever you start to do as followed:
cd [directory-name]
npm install
```

**3. Start Kubernetes and make sure Ingress is enabled:**

**Optional:** If you need to apply configuration to your cluster (or if you don't know if you already have one just yet):

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/cloud/deploy.yaml
```

> I personally do not use Minikube. I am quite happy with Docker Desktop and its integrated Kubernetes. Please configure your way around to get the necessary things up and running, in this case, your local Kubernetes cluster and Ingress.

**4. Configure environment variables:**

Please navigate to `payments/src/test/setup.ts` and you can find raw values for `JWT_KEY` and `STRIPE_KEY`.

> For this project, I wouldn't want to create a separate files for these secret keys, which act as environment variables.
> The keys' values are exposed in the test files anyways, and I personally used kubectl to create secret keys, not using any files.
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

Or, create a `.env` file in each service directory (e.g., `auth`, `tickets`, etc.) with the necessary environment variables `JWT_KEY` and `STRIPE_KEY`, values of which are mentioned above (not preferrable as I haven't tested it yet, but i don't think there might be any issues).

**5. Run the application with Skaffold:**

```
skaffold dev
```

**6. Access the application:**

Once all services are up and running, access the frontend at `https://ticketing.io`. Ensure that your `/etc/hosts` file maps `ticketing.io` to your Kubernetes IP, or most simply, just your `localhost` address.

### II. Setup Instructions and Implementation from Cloud Deployment

~~Will be implemented sometime soon.~~

> ~~**Translation:** When I have enough money for a cloud service to deploy my entire project cluster.~~

Finally I did it! Please head to `http://www.ticket-system.xyz/` to explore my deployment of the entire app. It might require some refreshes to fully and correctly display. Happy testing!

> I don't know for how long I can maintain it. Please bear with me.

---

## 🧪 Testing

Each service includes unit and integration tests using Jest. To run tests for a specific service:

```
cd [service-name]
npm run test
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

## 📜 Diagram

```mermaid
flowchart TD
    subgraph "Kubernetes Cluster"
        direction TB
        Ingress["Ingress Gateway"]:::infra
        AuthS["Auth Service"]:::service
        AuthDB[(MongoDB)]:::db
        TicketsS["Tickets Service"]:::service
        TicketsDB[(MongoDB)]:::db
        OrdersS["Orders Service"]:::service
        OrdersDB[(MongoDB)]:::db
        PaymentsS["Payments Service"]:::service
        PaymentsDB[(MongoDB)]:::db
        ExpirationS["Expiration Service"]:::service
        Redis[(Redis)]:::db
        NATS["NATS Streaming Cluster"]:::messagebus
    end

    Client["Next.js Client"]:::frontend
    Stripe["Stripe API"]:::external
    subgraph "CI/CD Pipeline"
        direction TB
        GH["GitHub Actions"]:::ci
        Docker["Docker Images"]:::ci
        Skaffold["Skaffold"]:::ci
        GH --> Docker --> Skaffold --> Ingress
    end

    Client -->|"HTTP Calls"| Ingress
    Ingress --> AuthS
    Ingress --> TicketsS
    Ingress --> OrdersS
    Ingress --> PaymentsS

    AuthS --> AuthDB
    TicketsS --> TicketsDB
    OrdersS --> OrdersDB
    PaymentsS --> PaymentsDB
    ExpirationS --> Redis

    AuthS ---|pub/sub| NATS
    TicketsS ---|pub/sub| NATS
    OrdersS ---|pub/sub| NATS
    PaymentsS ---|pub/sub| NATS
    ExpirationS ---|pub/sub| NATS

    PaymentsS -->|"Stripe API"| Stripe

    classDef service fill:#ADD8E6,stroke:#000,stroke-width:1px
    classDef db fill:#90EE90,stroke:#000,stroke-width:1px,shape:cylinder
    classDef messagebus fill:#FFA500,stroke:#000,stroke-width:1px
    classDef external fill:#F08080,stroke:#000,stroke-width:1px,shape:cloud
    classDef infra fill:#DDA0DD,stroke:#000,stroke-width:2px
    classDef frontend fill:#87CEFA,stroke:#000,stroke-width:1px
    classDef ci fill:#D3D3D3,stroke:#000,stroke-width:1px

    click Client "https://github.com/ducanhle1992/ticket-booking-app/tree/main/client/"
    click AuthS "https://github.com/ducanhle1992/ticket-booking-app/blob/main/auth/src/index.ts"
    click AuthDB "https://github.com/ducanhle1992/ticket-booking-app/blob/main/infra/k8s/auth-mongo-depl.yaml"
    click TicketsS "https://github.com/ducanhle1992/ticket-booking-app/blob/main/tickets/src/index.ts"
    click TicketsDB "https://github.com/ducanhle1992/ticket-booking-app/blob/main/infra/k8s/tickets-mongo-depl.yaml"
    click OrdersS "https://github.com/ducanhle1992/ticket-booking-app/blob/main/orders/src/index.ts"
    click OrdersDB "https://github.com/ducanhle1992/ticket-booking-app/blob/main/infra/k8s/orders-mongo-depl.yaml"
    click PaymentsS "https://github.com/ducanhle1992/ticket-booking-app/blob/main/payments/src/stripe.ts"
    click PaymentsDB "https://github.com/ducanhle1992/ticket-booking-app/blob/main/infra/k8s/payments-mongo-depl.yaml"
    click ExpirationS "https://github.com/ducanhle1992/ticket-booking-app/blob/main/expiration/src/index.ts"
    click Redis "https://github.com/ducanhle1992/ticket-booking-app/blob/main/infra/k8s/expiration-redis-depl.yaml"
    click NATS "https://github.com/ducanhle1992/ticket-booking-app/blob/main/infra/k8s/nats-depl.yaml"
    click GH "https://github.com/ducanhle1992/ticket-booking-app/tree/main/.github/workflows/"
    click Skaffold "https://github.com/ducanhle1992/ticket-booking-app/blob/main/skaffold.yaml"
```

---

## 🛠️ API:

Remember to add domain `http://www.ticket-system.xyz/`, (or if you want to set up the project on your own local machine, `https://ticketing.io/`) leading each API.
Except `POST /api/users/signin`, `POST /api/users/signout`, `POST /api/users/signup`, all other routes require user's cookie, which can be acquired from `POST /api/users/signin` or `POST /api/users/signup`.

> Will be updated along the way.

#### 🧑 Auth Service

Handles user authentication and authorization.

<details>
    <summary>
        <code>POST /api/users/signup</code> – Register a new user
    </summary>
    <code>
        {
            "request": {
                "body": {
                    "email": "Must be of valid email address format",
                    "password": "From 5 to 20 characters"
                }
            },
            "response": {
                "email": "The registered email address",
                "id": "Uniquely assigned user ID"
            }
        }
    </code>
</details>

<details>
    <summary>
        <code>POST /api/users/signin</code> – Authenticate an existing user
    </summary>
    <code>
        {
            "request": {
                "body": {
                    "email": "Must be a correct email of course",
                    "password": "Same."
                }
            },
            "response": {
                "email": "The logged in email address",
                "id": "User ID."
            }
        }
    </code>
</details>

<details>
    <summary><code>POST /api/users/signout</code> – Sign out the current user</summary>
    <code>
        {
            "response": {}
        }
    </code>
</details>

<details>
    <summary>
        <code>GET /api/users/currentuser</code> – Retrieve information about the currently authenticated user
    </summary>
    <code>
        {
            "response": {
                "currentUser": {
                    "id": "user ID",
                    "email": "user's email address",
                    "iat": "the IssuedAt property of JWT"
                }
            }
        }
    </code>
</details>

#### 🎫 Tickets Service

Manages ticket creation, updating, and retrieval.

<details>
    <summary>
        <code>GET /api/tickets</code> – Retrieve a list of all tickets
    </summary>
    <code>In progress ...</code>
</details>

<details>
    <summary>
        <code>GET /api/tickets/:id</code> – Retrieve details of a specific
    </summary>
    <code>In progress ...</code>
</details>

<details>
    <summary>
        <code>POST /api/tickets</code> – Create a new ticket
    </summary>
    <code>In progress ...</code>
</details>

<details>
    <summary>
        <code>PUT /api/tickets/:id</code> – Update an existing ticket
    </summary>
    <code>In progress ...</code>
</details>

#### 📦 Orders Service

Handles order creation, cancellation, and retrieval.

<details>
    <summary>
        <code>GET /api/orders</code> – Retrieve a list of orders for the current user
    </summary>
    <code>In progress ...</code>
</details>

<details>
    <summary>
        <code>GET /api/orders/:id</code> – Retrieve details of a specific order
    </summary>
    <code>In progress ...</code>
</details>

<details>
    <summary>
        <code>POST /api/orders</code> – Create a new order
    </summary>
    <code>In progress ...</code>
</details>

<details>
    <summary>
        <code>DELETE /api/orders/:id</code> – Cancel an existing order
    </summary>
    <code>In progress ...</code>
</details>

#### 💳 Payments Service

Processes payments for orders.

<details>
    <summary>
        <code>POST /api/payments</code> – Submit a payment for an order
    </summary>
    <code>In progress ...</code>
</details>

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

- [Stephen Grider](https://x.com/ste_grider)
