# Londoola - Equipment Maintenance Tracker

A web application for tracking equipment maintenance schedules, service records, and generating reports. Built with PHP, JavaScript, and MySQL.

## Table of Contents

-   [About](#about)
-   [Features](#features)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
-   [Usage](#usage)
-   [Contributing](#contributing)
-   [License](#license)

## About

Londoola is designed to simplify the management of equipment maintenance. It provides a user-friendly interface for tracking equipment details, scheduling maintenance, generating reports on equipment status, and receiving notifications about upcoming maintenance tasks.

## Features

-   Equipment Inventory Management: Add, view, edit, and delete equipment records.
-   Maintenance Scheduling: Schedule regular maintenance tasks for each piece of equipment.
-   Service History Tracking: Maintain a record of all maintenance performed on each piece of equipment.
-   Report Generation: Generate reports on equipment status, upcoming maintenance, and service history.
-   Notifications: Receive notifications about upcoming maintenance tasks.
-   Catalog: Browse a catalog of equipment models with descriptions and images.
-   Model and Serial Number Tracking: Track specific model and serial numbers for each equipment item.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   A web server with PHP support (XAMPP, PHP's built-in server).
-   MySQL database server.
-   PHP 7.4 or higher .
-   A modern web browser.

### Installation

1.  Clone the repository:

    (Is yet to be made clear)

2.  Create a MySQL database named `londoola_db`.

3.  Import the database schema (provided in `database/londoola_db.sql`). You can use phpMyAdmin or the command line:

    ```bash
    mysql -u londoola -p Password1! londoola_db < database/londoola_db.sql
    ```

4.  Configure the database connection in `backend/equipment.php`:

    ```php
    $dbHost = 'localhost';
    $dbName = 'londoola_db';
    $dbUser = 'londoola';      
    $dbPass = 'Password1!';  
    ```

## Usage

1.  Open your web browser and navigate to the project's URL
2.  Use the navigation menu to access different sections of the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.
