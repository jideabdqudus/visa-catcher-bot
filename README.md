# 🤖 Visa Slot Monitor Bot

A simple Node.js script designed to monitor the availability status of multiple websites. Upon detecting an open slot, it immediately sends an email alert and shuts down the process.

## 🛠️ Prerequisites

You must have the following installed on your machine:

* **Node.js** (v14 or higher)
* A **Gmail App Password** (required for `nodemailer` if using Gmail, as standard passwords are not accepted).

## 🚀 Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/jideabdqudus/visa-catcher-bot
    cd visa-catcher-bot
    ```

2.  **Install Dependencies:**
    ```bash
    npm install axios nodemailer dotenv
    ```
---

## ⚙️ Configuration

The bot uses environment variables defined in a `.env` file for all sensitive data and settings.

### 1. Create the `.env` file

Create a file named `.env` in the root directory of the project and populate it with your credentials, check `.env.example.` for samples

### 2. Usage

```bash
  node index.js
```

Note: If the bot detects a slot on the first site it checks (e.g., "Netherlands"), it will exit immediately and will not check the subsequent sites (e.g., "Portugal").