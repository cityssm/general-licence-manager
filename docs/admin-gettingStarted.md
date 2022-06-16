[Home](https://cityssm.github.io/general-licence-manager/)
•
[Help](https://cityssm.github.io/general-licence-manager/docs/)

# Admin - Getting Started

Managing municipal licences is oftentimes a one or two person job.
While this application can run on a high end server, that is by no means a requirement.
Most user workstations are sufficient.

## Minimum Requirements

The system must meet the minimum requirements for Node.js,
which is able to run on budget hardware.

_More is better_, however under stress tests,
the application peaked at the following:

-   2 GB of RAM
-   1 GB of storage for application, dependencies, and data.

## Step 1: Install Node.js 14 or better and npm

[Node.js](https://nodejs.org) is a JavaScript runtime environment.
The General Licence Manager is built to run on Node.js.

[npm](https://www.npmjs.com/) is a package manager that contains all the prerequisites
for the General Licence Manager application.

Node.js can run on Windows, Mac, and Linux.
Installers on the [Node.js website](https://nodejs.org) include npm.
Node.js and npm are also available in most package managers.

    > sudo apt install nodejs
    > sudo apt install npm

## Step 2: Install git

_Alternatively, [releases are available on GitHub](https://github.com/cityssm/general-licence-manager/releases).  Git is not required when using releases._

[Git](https://git-scm.com/) is the version control system that manages the
code for the General Licence System.

Git can run on Windows, Mac, and Linux.
You can install it using an install on the [Git website](https://git-scm.com/),
or from most package managers.

    > sudo apt install git

## Step 3: Clone the `general-licence-manager` repository using git

Open a command line, and navigate to the folder where the application will reside.

    > git clone https://github.com/cityssm/general-licence-manager

## Step 4: Install the dependencies

    > cd general-licence-manager
    > npm install

## Step 5: Create a `config.js` file

It is recommended to copy the `config.example.js` file to get started.

    > cp data/config.example.js data/config.js

See the [config.js documentation](admin-configJS.md) for help customizing
your configuration.

## Step 6: Start the application

**Start Using npm**

    > npm start

**Start Using node**

    > node ./bin/www

**Start as a Windows Service**

The included `windowsService-install.bat` script simplifies
the process of keeping the application running in a Windows environment
by creating a service that can start with the hosting server.

    > npm link node-windows
    > windowsService-install
