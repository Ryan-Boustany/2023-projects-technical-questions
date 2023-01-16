import { on } from "events";
import express from "express";
import { loadavg } from "os";

// location is the simple (x, y) coordinates of an entity within the system
// spaceCowboy models a cowboy in our super amazing system
// spaceAnimal models a single animal in our amazing system
type location = { x: number; y: number };
type spaceCowboy = { name: string; lassoLength: number };
type spaceAnimal = { type: "pig" | "cow" | "flying_burger" };
type spaceAnimalInfo =  { type: string; location: location; }

// spaceEntity models an entity in the super amazing (ROUND UPPER 100) system
type spaceEntity =
  | { type: "space_cowboy"; metadata: spaceCowboy; location: location }
  | { type: "space_animal"; metadata: spaceAnimal; location: location };

// === ADD YOUR CODE BELOW :D ===
const lassoable = (Cx: number, Ax: number, Cy: number, Ay: number, lassoLength: number): boolean => {

  const xDist = Cx-Ax;
  const yDist = Cy-Ay;
  const Dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  if (Dist <= lassoLength) {
    return true; 
  }

  return false;

}

// === ExpressJS setup + Server setup ===
const spaceDatabase = [] as spaceEntity[];
const app = express();
app.use(express.json());

// the POST /entity endpoint adds an entity to your global space database
app.post("/entity", (req, res) => {
  // TODO: fill me in
  
  let entities = req.body.entities;
  // Since all entites are in the correct type already just loop through and add them to the database.
  for (let object of entities) {
    spaceDatabase.push(object);
  }
  
  res.status(200).send();
});

// /lassoable returns all the space animals a space cowboy can lasso given their name
app.get("/lassoable", (req, res) => {
  // TODO: fill me in
  const lassoableAnimalsList = [] as spaceAnimalInfo[];
  let lassoableAnimals = {
    "space_animals": lassoableAnimalsList
  }
  

  const cowboyName = req.query.cowboy_name;
  let lassoLength: number = 0;
  let Cx: number = 0;
  let Cy: number = 0;
  // Simple loop to extract lassoLength
  for (let object of spaceDatabase) {
    if (object.type === "space_cowboy" && object.metadata.name === cowboyName) {
      lassoLength = object.metadata.lassoLength;
      Cx = object.location.x;
      Cy = object.location.y;
    }
  }
  
  for (let object of spaceDatabase) {
    if (object.type === "space_animal") {
      if (lassoable(Cx, object.location.x, Cy, object.location.y, lassoLength)) {
        const spaceAnimal: spaceAnimalInfo = {
          "type": object.metadata.type,
          "location": object.location
        }
        lassoableAnimalsList.push(spaceAnimal)
      }
    }
  }
  lassoableAnimals.space_animals = lassoableAnimalsList; 

  res.status(200).send(lassoableAnimals);

});

app.listen(8080);