// set up ========================
const express  = require('express');
var app      = express();                              // create our app w/ express
const admin = require("firebase-admin");
const morgan = require('morgan');
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)

app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Max-Age", "3600");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});
//cloud
const serviceAccount = require("./redimed-9a201-firebase-adminsdk-wsv26-99517fcf0d.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://redimed-9a201.firebaseio.com"
});
var db = admin.database();
var patientRef = db.ref("Patient");
var doctorRef = db.ref("Doctor");

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.get('/', function (req, res) {
  res.send("hello")
})


class Account {
  constructor(key,name,birth,email,pass,phone) {
    this.name = name;
    this.birth  = birth
    this.email  = email
    this.pass =  pass
    this.phone  = phone
  }
}

// create Doctor --->ok
app.post('/api/createDoctor', function(req, res) {
  const data = req.body;
  var email = data.Profile.Email;
  var countIndex = 0
  doctorRef.once("value", function(snapshot) {
    if (snapshot.val() == null) {
      res.json({message: "Error: No user found", "result": false});
    } else {
      var erEmail = ""
      snapshot.forEach(function(childSnapshot) {
        let item = childSnapshot.val(); // value
        item.key = childSnapshot.key;// key
        countIndex += 1
        try {
          if (item.Profile.Email != undefined && item.Profile.Email == email )
          erEmail =1;
        }
        catch(err) {}
      })
      if(erEmail == 1)
      try {
        res.json({message: "email error", result: false});
      } catch (e) {
      }
      if(countIndex == (snapshot.numChildren())&& erEmail!=1)
      {
        doctorRef.push(data, function(err) {
          if (err) {
            try {
              res.send(err)
            } catch (e) {}
          } else {
            // var key = Object.keys(snapshot.val())[0];
            // console.log(key);
            try {
              res.json({message: "Success: User Save.", result: true});
            } catch (e) {}
          }
        });
      }
    }
  })
});

// create Patient --->ok
app.post('/api/createPatient', function(req, res) {
  const data = req.body;
  var email = data.Profile.Email;
  var countIndex = 0
  patientRef.once("value", function(snapshot) {
    if (snapshot.val() == null) {
      res.json({message: "Error: No user found", "result": false});
    } else {
      var erEmail = ""
      snapshot.forEach(function(childSnapshot) {
        let item = childSnapshot.val(); // value
        countIndex += 1
        item.key = childSnapshot.key;// key
        try {
          if (item.Profile.Email != undefined && item.Profile.Email == email )
          erEmail = 1;
        }
        catch(err) {}
      })
      if(erEmail == 1)
      try {
        res.json({message: "email error", result: false});
      } catch (e) {}
      if(countIndex == (snapshot.numChildren())&& erEmail!=1)
      {
        patientRef.push(data, function(err) {
          if (err) {
            try {
              res.send(err)
            } catch (e) {}
          } else {
            // var key = Object.keys(snapshot.val())[0];
            // console.log(key);
            try {
              res.json({message: "Success: User Save.", result: true});
            } catch (e) {}
          }
        });
      }
    }
  })
});

// update Patient --->ok
app.put('/api/updatePatient', function(req, res) {
  var data = req.body;
  var flag = 0;
  var count = 0;
  patientRef.once("value", function(snapshot) {
    if (snapshot.val() == null) {
      res.json({message: "Error: No user found", "result": false});
    } else {
      snapshot.forEach(function(childSnapshot) {
        let item = childSnapshot.val(); // value
        item.key = childSnapshot.key;// key
        count += 1
        try {
          if (item.Profile.Email != undefined && item.Profile.Email == data.Profile.Email )
          {
            flag = 1;
            var newData = item;
            if(data.Profile.Name != undefined)
              newData.Profile.Name = data.Profile.Name;
            if(data.Profile.Birth != undefined)
              newData.Profile.Birth = data.Profile.Birth;
            if(data.Profile.Pass != undefined)
              newData.Profile.Pass = data.Profile.Pass;
            if(data.Profile.Phone != undefined)
              newData.Profile.Phone = data.Profile.Phone;
            patientRef.child(item.key).update(newData, function(err) {
              if (err) {
                try {
                  res.send(err);
                } catch (e) {}
              } else {
                patientRef.child(item.key).once("value", function(snapshot) {
                  if (snapshot.val() == null) {
                    try {
                      res.json({message: "Error: No user found", "result": false});
                    } catch (e) {}
                  } else {
                    try {
                      res.json({"message":"successfully update data", "result": true, "data": snapshot.val()});
                    } catch (e) {}
                  }
                });
              }
            });
          }}
            catch(err) {}
            if(flag == 0 && count == snapshot.numChildren())
            {  try {
              res.json({message: "error", result: false});
            } catch (e) {}
          }
        })
      }
    })
});


// update Doctor --->ok
app.put('/api/updateDoctor', function(req, res) {
  var data = req.body;
  var flag = 0;
  var count = 0;
  doctorRef.once("value", function(snapshot) {
    if (snapshot.val() == null) {
      res.json({message: "Error: No user found", "result": false});
    } else {
      snapshot.forEach(function(childSnapshot) {
        let item = childSnapshot.val(); // value
        item.key = childSnapshot.key;// key
        count += 1
        try {
          if (item.Profile.Email != undefined && item.Profile.Email == data.Profile.Email )
          {
            flag = 1;
            var newData = item;
            if(data.Profile.Name != undefined)
              newData.Profile.Name = data.Profile.Name;
            if(data.Profile.Birth != undefined)
              newData.Profile.Birth = data.Profile.Birth;
            if(data.Profile.Pass != undefined)
              newData.Profile.Pass = data.Profile.Pass;
            if(data.Profile.Phone != undefined)
              newData.Profile.Phone = data.Profile.Phone;
            doctorRef.child(item.key).update(newData, function(err) {
              if (err) {
                try {
                  res.send(err);
                } catch (e) {

                }
              } else {
                doctorRef.child(item.key).once("value", function(snapshot) {
                  if (snapshot.val() == null) {
                    try {
                      res.json({message: "Error: No user found", "result": false});
                    } catch (e) {}
                  } else {
                    try {
                      res.json({"message":"successfully update data", "result": true, "data": snapshot.val()});
                    } catch (e) {}
                  }
                });
              }
            });
          }}
            catch(err) {}
            if(flag == 0 && count == snapshot.numChildren())
            {  try {
              res.json({message: "error", result: false});
            } catch (e) {}
          }
        })
      }
    })
});

// delete Patient --->ok
app.delete('/api/removePatient', function(req, res) {
  var data = req.body;
  var email =  data.Profile.Email;
  var flag = 0;
  var count = 0;
  patientRef.once("value", function(snapshot) {
    if (snapshot.val() == null) {
      res.json({message: "Error: No user found", "result": false});
    } else {
      snapshot.forEach(function(childSnapshot) {
        let item = childSnapshot.val(); // value
        item.key = childSnapshot.key;// key
        count += 1
        try {
          if (item.Profile.Email != undefined && item.Profile.Email == email )
          {
            flag = 1;
            patientRef.child(item.key).remove(function(err) {
              if (err) {
                res.send(err);
              } else {
                try {
                  res.json({message: "Success: User deleted.", result: true});
                } catch (e) {}
              }
            })}}
            catch(err) {}
            if(flag == 0 && count == snapshot.numChildren())
            {  try {
              res.json({message: "error", result: false});
            } catch (e) {}
          }
        })
      }
    })
  });
  // delete Doctor --->ok
  app.delete('/api/removeDoctor', function(req, res) {
    var data = req.body;
    var email =  data.Profile.Email;
    var flag = 0;
    var count = 0;
    doctorRef.once("value", function(snapshot) {
      if (snapshot.val() == null) {
        res.json({message: "Error: No user found", "result": false});
      } else {
        snapshot.forEach(function(childSnapshot) {
          let item = childSnapshot.val(); // value
          item.key = childSnapshot.key;// key
          count += 1
          try {
            if (item.Profile.Email != undefined && item.Profile.Email == email )
            {
              flag = 1;
              doctorRef.child(item.key).remove(function(err) {
                if (err) {
                  res.send(err);
                } else {
                  try {
                    res.json({message: "Success: User deleted.", result: true});
                  } catch (e) {}
                }
              })}}
              catch(err) {}
              if(flag == 0 && count == snapshot.numChildren())
              {  try {
                res.json({message: "error", result: false});
              } catch (e) {}
            }
          })
        }
      })
  });

  // get Patients --->ok
  app.post('/api/getPatients', function(req, res) {
    var accounts = []
    patientRef.once("value", function(snapshot) {
      if (snapshot.val() == null) {
        res.json({message: "Error: No user found", "result": false});
      } else {
        snapshot.forEach(function(childSnapshot) {
          let item = childSnapshot.val(); // value
          item.key = childSnapshot.key;// key
          var key,name,birth,email,pass,phone = ""
          if (item.key != undefined)
          key = item.key// key
          try {
            if (item.Profile.Name !== undefined)
            name = item.Profile.Name;
          }
          catch(err) {
            name = ""
          }
          try {
            if (item.Profile.Birth != undefined)
            birth  = item.Profile.Birth;
          }
          catch(err) {
            birth = ""
          }
          try {
            if (item.Profile.Email != undefined)
            email  = item.Profile.Email;
          }
          catch(err) {
            email = ""
          }
          try {
            if  (item.Profile.Pass != undefined)
            pass =  item.Profile.Pass;
          }
          catch(err) {
            pass = ""
          }
          try {
            if (item.Profile.Phone != undefined)
            phone  = item.Profile.Phone;
          }
          catch(err) {
            phone = ""
          }
          account = new Account(key,name,birth,email,pass,phone)
          accounts.push(account)
        })
         res.json({"message":"successfully fetch data", "result": true, "data": accounts});
        // res.json({"message":"successfully fetch data", "result": true, "data": snapshot.val()})
      }
    });
  });

  //get Doctors --->ok
  app.post('/api/getDoctors', function(req, res) {
    var accounts = []
    doctorRef.once("value", function(snapshot) {
      if (snapshot.val() == null) {
        res.json({message: "Error: No user found", "result": false});
      } else {
        snapshot.forEach(function(childSnapshot) {
          let item = childSnapshot.val(); // value
          item.key = childSnapshot.key;// key
          var key,name,birth,email,pass,phone = ""
          if (item.key != undefined)
          key = item.key// key
          try {
            if (item.Profile.Name !== undefined)
            name = item.Profile.Name;
          }
          catch(err) {
            name = ""
          }
          try {
            if (item.Profile.Birth != undefined)
            birth  = item.Profile.Birth;
          }
          catch(err) {
            birth = ""
          }
          try {
            if (item.Profile.Email != undefined)
            email  = item.Profile.Email;
          }
          catch(err) {
            email = ""
          }
          try {
            if  (item.Profile.Pass != undefined)
            pass =  item.Profile.Pass;
          }
          catch(err) {
            pass = ""
          }
          try {
            if (item.Profile.Phone != undefined)
            phone  = item.Profile.Phone;
          }
          catch(err) {
            phone = ""
          }
          account = new Account(key,name,birth,email,pass,phone)
          accounts.push(account)
        })
        res.json({"message":"successfully fetch data", "result": true, "data": accounts});
      }
    });
  });

//  login Doctor --->ok
app.post('/api/login', function(req, res) {
  var data = req.body;
  var flag = 0;
  var count = 0;
  doctorRef.once("value", function(snapshot) {
    if (snapshot.val() == null) {
      res.json({message: "Error: No user found", "result": false});
    } else {
      snapshot.forEach(function(childSnapshot) {
        let item = childSnapshot.val(); // value
        item.key = childSnapshot.key;// key
        count += 1
        try {
          if (item.Profile.Email != undefined && item.Profile.Email == data.Profile.Email &&
            item.Profile.Pass != undefined && item.Profile.Pass == data.Profile.Pass)
          {
            flag = 1;
            return res.json(item);
          }
          }
            catch(err) {}
            if(flag == 0 && count == snapshot.numChildren())
            {  try {
              res.json({message: "error", result: false});
            } catch (e) {}
          }
        })
      }
    })
  });

  app.listen(4000);
  console.log("localhost:4000");
