# SteamDepotDownloaderGUI development information

SteamDepotDownloaderGUI is a graphical user interface for DepotDownloader.

It is written in Node.js and uses the [electron](https://electronjs.org/) framework.
The CSS framework is [Primer](https://primer.style).

## Setup development environment

**Note that these instructions may differ from operating system to operating system.**

* Install node.js, npm, and git on your computer.

* Clone the repository.

```bash
git clone https://github.com/mmvanheusden/SteamDepotDownloaderGUI
```

* Move into the directory and install npm dependencies.

```bash
cd SteamDepotDownloaderGUI
npm install
```

* **You are now ready to contribute**

## Testing the application

```bash
npm start
```

## Building the application

```bash
npm run build
```

* If you are using macOS, you may build using the following command:

```bash
npm run buildall
```

This will build the application for all supported operating systems.

## Contributing Guidelines

Please make sure to keep code consistent and cross-platform compatible.

After you made a change, clean-up the code using your favorite code editor and run the following command:

```bash
npx eslint *.js --fix
```

Please make sure your git commit message is descriptive and contains the changes you made.

**Happy coding!**