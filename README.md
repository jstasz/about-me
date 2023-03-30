<h1 align="center">Restaurants App</h1>

https://jsta-restaurants-app.netlify.app/

## Project Overview 🎉

The restaurant review application enables the user to add places they have visited to the map and rate them in four categories - food, service, price, and overall impression. Added restaurants are stored in local storage, allowing the user to easily find and review their favorite restaurants at any time. 

The map used is the Leaflet map, which displays where the user is currently located and allows them to see what restaurants they have previously rated that are nearby. The application was implemented using JavaScript and object-oriented programming.

#### Adding a restaurant

To add a restaurant, you need to select a location on the map. This will activate a form where you can enter the restaurant's name and ratings. Click the "Add new place" button to add the restaurant to the map and the list.

#### Browsing restaurants

All restaurants added by the user are rendered on the list. The user can select a place of interest to display it on the map. They can also search for a restaurant by name. Places are stored in local storage for easy retrieval and browsing at any time.

### Map

The application uses a Leaflet map (https://leafletjs.com/) that displays where the user is currently located. Restaurants that the user has added will be marked on the map. To view details about a restaurant, click on the marker on the map.

## Tech used 🔧

|                                                   | 
| ------------------------------------------------------- |
| HTML                         
| SCSS (using parcel/transformer-sass to convert)
| JS                       


## Installation 💾</h1>

To run this app you need to have Node.js and npm installed.

1. Clone this repository: <i>git clone https://github.com/jstasz/restaurants-app.git</i>
2. Install the dependencies: <i>npm install</i>
3. Build the app: <i>npm run build</i>
4. Start the app at http://localhost:1234/: <i>npm start</i>
