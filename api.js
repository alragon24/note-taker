//import statements for required packages
const express = require('express');
const fs = require('fs');
const router = express.Router(); 
const path = require('path');
const databasePATH = path.join(__dirname, "../db/db.json");
const uuid = require('../helpers/uuid');

router.use(express.json());


//basic GET call to send notes.html to display on notes
router.get("/", (req, res) => {
    res.send('Invalid URL: please provide accurate path to data.');
});

router.get('notes', (req, res) => {
    res.sendFile(databasePATH);
  });

  //Set up request to allow user to request single note
  router.get('notes:id', (req, res) => {
    const notes = require(databasePATH);
    if (req.params.id) {
      const noteID = req.params.id;
      for (let i = 0; i < notes.length; i++) {
        const currentNote = notes[i];
        if (currentNote.id === noteID) {
          res.json(currentNote);
          return;
        }
      }
      res.status(404).send('Note not found');
    } else {
      res.status(400).send('Note ID not provided');
    }
  });

  //POST REQUEST TO ADD TO THE LIST
  router.post('notes', (req, res) => {
    //Creates valid JSON file synchronously if a file does not exist already
    if(!(fs.existsSync(databasePATH))){
      console.log("Database does not exist! Creating database JSON now...")
      const output = fs.openSync(databasePATH,'w');
      fs.writeSync(output, '[]')
    }
    
    //Reads the existing JSON file and extracts data from it to be rewritten adding info added from POST request
    fs.readFile(databasePATH, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Parse the existing JSON data
        const existingData = JSON.parse(data);
        
            // Destructuring assignment for the items in req.body
            const { title, text } = req.body;

            // If all the required properties are present
            if (title && text) {
              // Variable for the object we will save
              const newNote = {
                title,
                text,
                id: uuid(),
              };

              const response = {
                status: 'success',
                body: newNote,
              };




              //Adds new object to json file
              existingData.push(newNote);
              noteDataJSON = JSON.stringify(existingData);
              

              //Rewrites info to JSON file with new object
              fs.writeFile(databasePATH , noteDataJSON, function(err) {
                  if(err) {console.log(err);
                  }});


              res.status(201).json(response);
            } else {
              res.status(500).json('Error in posting review');
            }
      }
    });
  });

    //Set up request to allow user to request single note for deletion
    router.delete('/notes/:id', (req, res) => {
    const notes = require(databasePATH);
    if (req.params.id) {
        var noteID = req.params.id;
        for (let i = 0; i < notes.length; i++) {
        var currentNote = notes[i];
        if (currentNote.id === noteID) {
            var rNote = currentNote;
            break;
        }
        // res.status(404).send('No match for Note ID');
        }
    } else {
        res.status(400).send('Note ID not provided');
    }
        //Reads the existing JSON file and extracts data from it to be rewritten adding info added from POST request
        fs.readFile(databasePATH, 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            } else {
            // Parse the existing JSON data
            var existingData = JSON.parse(data);
            


            //Finds index of the note that needs to removed
            var index = existingData.findIndex(note => note.id === rNote.id);

            //Removes note object from json file
            existingData.splice(index, 1);
            noteDataJSON = JSON.stringify(existingData);
            

            //Rewrites info to JSON file with new object
            fs.writeFile(databasePATH , noteDataJSON, function(err) {
                if(err) {console.log(err);
                }});
            }
        });
    });

//exports file to be used in server.js
module.exports = router;
