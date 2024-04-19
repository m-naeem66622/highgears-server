# Grand Online Store - Server

Welcome to the server-side application for Grand Online Store! This server handles all the backend operations for the Grand Online Store frontend application.

## Features

- Handles user authentication and authorization.
- Manages product data, including creating, updating, and deleting products.
- Manages user data, including user profiles and purchase history.
- Handles order processing, including payment processing and order status updates.

## Technologies Used

- Node.js: JavaScript runtime for building server-side applications.
- Express.js: Web application framework for Node.js.
- Mongoose: Object Data Modeling (ODM) library for MongoDB and Node.js.
- JSON Web Token (JWT): For securely transmitting information between parties as a JSON object.
- bcrypt: Library to help you hash passwords.
- Joi: Object schema validation.
- dotenv: Module that loads environment variables from a `.env` file into `process.env`.
- multer: Middleware for handling `multipart/form-data`, which is primarily used for uploading files.

## Getting Started

To get start with the development server, follow the instructions below:

1. Install the dependencies:
    ```bash
    npm install
    ```

2. Configure the environment variables:

    Create a duplicate of the `.env.example` file and name it `.env` or use the following command:

    For **Windows Command Prompt**:
    ```bash
    copy .env.example .env
    ```
    For **Windows PowerShell or Linux/macOS Terminal**:
    ```bash
    cp .env.example .env
    ```

    Replace the values of the environment variables with your own values like the MongoDB connection string, JWT secret key and PAYFAST credentials.


3. Start the development server:
    ```bash
    npm run dev
    ```

## Running the Project

To run the project, use the following command:

```bash
npm start
```

## Contributing

We welcome feedback from the community! If you find any bugs or have suggestions for new features, please contact us directly.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

## Contact

For any inquiries or support, please contact us at [m.naeem66622@outlook.com](mailto:m.naeem66622@outlook.com).