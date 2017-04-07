# Google Maps
* Show locations on google maps

## Features
* Show location on a map based on an address
* Show location on a map based on an coordinate
* Show list of both addresses and coordinates on the map

## Limitations
The widget uses [Google Maps API v3](https://developers.google.com/maps/). So the [Limitations](https://developers.google.com/maps/premium/usage-limits)
from Google applies, especially for geocoding. We even advise geocoding your locations within your
Mendix application and store them for later use as coordinates on the widget.

## Dependencies
Mendix 7.1

## How it Works
When displaying locations, the widget will prioritize coordinates over addresses.In the event that 
the coordinate is not specified, it will use address.
If there are multiple locations, the map will be centered based on default address specified.
However it is only a single point in the list, the map will center to that point.

## Demo project

[https://googlemaps101.mxapps.io/](https://googlemaps101.mxapps.io/)

<img src="./assets/usage.png" width="900px" height="500px" />

## Usage
<img src="./assets/setup.png" width="900px" height="600px" />

 ### Data source: Static
 - On the `Data source` option of the `Data source` tab, select the `static` option if its not already selected by default.
 - On the `Static locations` option of the same tab, click new to add `Static locations`.
 
 ### Data source: XPath
 - On the `Data source` option of the `Data source` tab, select the `XPath` option.
 - Specify the `Location entity` and the `XPath` constraint (if any).
 
 ### Data source: Microflow
  - On the `Data source` option of the `Data source` tab, select the `Microflow` option.
  - Specify the `Location entity` and the `Microflow` to retrieve the Map `locations` from (both required).

## Issues, suggestions and feature requests
Please report issues at [https://github.com/mendixlabs/google-maps/issues](https://github.com/mendixlabs/google-maps/issues).


## Development
Prerequisite: Install git, node package manager, webpack CLI, grunt CLI, Karma CLI

To contribute, fork and clone.

    git clone [https://github.com/FlockOfBirds/google-maps.git](https://github.com/FlockOfBirds/google-maps.git)

The code is in typescript. Use a typescript IDE of your choice, like Visual Studio Code or WebStorm.

To set up the development environment, run:

    npm install

Create a folder named dist in the project root.

Create a Mendix test project in the dist folder and rename its root folder to MxTestProject. Changes to the widget code shall be automatically pushed to this test project. Or get the test project from [https://github.com/MendixLabs/google-maps/releases/download/1.0.0/Test.mpk](https://github.com/MendixLabs/google-maps/releases/download/1.0.0/Test.mpk)

    dist/MxTestProject

To automatically compile, bundle and push code changes to the running test project, run:

    grunt

To run the project unit tests with code coverage, results can be found at dist/testresults/coverage/index.html, run:

    npm test

or run the test continuously during development:

    karma start
