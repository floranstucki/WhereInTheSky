# Where In The Sky

“Where in the Sky” is a project based on the OpenSky API and the Mapbox API, enabling aerial information to be visualized on a map.

## Table of contents

- [Preview](#preview)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)

## Preview

“Where in the Sky” uses OpenSky API data to obtain real-time flight information and displays it on an interactive map using the Mapbox API.

## Installation

To install the project, follow the steps below:

1. Clone the repository on your device:

    ``bash
    git clone https://github.com/floranstucki/whereinthesky.git
    cd whereinthesky
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

## Usage

1. Replace `YOUR_TOKEN` with your Mapbox API token in the `AirportOfTheDay.jsx` file:

    ```javascript
    const MAPBOX_TOKEN = 'YOUR_TOKEN';
    ```

2. Start the project:

    ```bash
    npm start
    ```

## Contributors

- **Floran Stucki** - [GitHub](https://github.com/floranstucki)

## License
Distributed under the MIT license. See the `LICENSE` file for more information.
