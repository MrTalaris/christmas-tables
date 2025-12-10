# Global Christmas Dining Table Project — 

This repository contain a front‑end-only web app for the ELFO Hideout "Global Christmas Dining Table" exhibition.

## About this project

The ELFO Hideout (in PT-BR: Esconderijo ELFO) is a Brazilian Christmas-dedicated museum in Natal, a Brazilian city named after Christmas.

This is the code that runs on the interactive kiosk that displays dining tables set for Christmas celebrations around the globe. Because of the nature of the device it is used, the web app is intended to run entirely offline, with minimum to no use of internet connection.

## How to run locally (offline)
- Copy the repository to the target machine.
- Option A (**recommended**) —  Serve files with VS Code:
    - Using Visual Code Studio "Live Server" extension, you can simpy click on the "Go live" button once it is installed
- Option B — open directly:
    - Open `index.html` in a modern browser (file://). Note: some browsers restrict fetch/XHR from file://, it may require to allow exceptions in order to avoid CORS issues.

## Current technology used

Pretty basic tech. Not using any node html builder, model-view, or anything similar. Just plain HTML for V1:
- HTML5 for markup
- CSS3 (plain CSS or a preprocessor if present) for styling
- JavaScript (ES6+) for interactivity
- All assets (images, fonts, data JSON) are included locally — no CDN dependencies

## Development notes
- Keep all external libraries and assets inside the repo to preserve offline capability.
- Final files should always be easily served offline or with localhost only. So no fetching data from live servers or anything.

## Desired features for future versions
Honestly, I'm probably not going to work on these but it would be pretty cool. Being more honest, no one is probably going to read any of this but, again, it would be pretty cool.

- Add a framework to build the country pages and food modals dynamically instead of hardcoded, serving final files to a /public folder
- A separate web app that allows people from around the globe to add to their suggestions for dishes in their own countries. Ideally, it won't add them directly to the list, but could be a button for adms to do it automatically.

## License

This project follows the [MIT License](https://mit-license.org/).

## Credits

***Concept, code, and design*** - **Kevin Talarico**
***Flag images*** - [Flagpedia.net](https://flagpedia.net/)