const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const multer = require("multer");
const app = express();

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "/Users/bhargj/worksapce/SG-Hackverse/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".sol");
  },
});

// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 20 * 1000 * 1000;

var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },

  // watchFile is the name of file attribute
}).single("watchFile");

app.get("/", function (req, res) {
  res.render("Signup");
});

app.post("/upload", function (req, res, next) {
  // Error MiddleWare for multer file upload, so if any
  // error occurs, the image would not be uploaded!
  upload(req, res, function (err) {
    if (err) {
      // ERROR occurred (here it can be occurred due
      // to uploading image of size greater than
      // 1MB or uploading different file type)
      res.send(err);
    } else {
      // SUCCESS, image successfully uploaded

      exec(
        "python3 zion_scan.py --contract solidity_files/Greeting.sol",
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            res.send(
              "File Uploaded successfully ; command execution failed: " +
                error.message
            );
            return;
          }
          if (stderr) {
            res.send(
              "File Uploaded successfully ; command execution failed: " + stderr
            );
          }
          res.send(
            "File Uploaded successfully ; command execution success: " + stdout
          );
        }
      );
    }
  });
});

// Take any port number of your choice which
// is not taken by any other process
app.listen(8080, function (error) {
  if (error) throw error;
  console.log("Server created Successfully on PORT 8080");
});
