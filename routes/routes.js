const express = require("express");
const router = express.Router();
module.exports = router;

const user = require("../models/user");
const opinion = require("../models/opinion");
const Event = require("../models/event");

//Import PythonShell module.
const { PythonShell } = require("python-shell");

// Import file system
const fs = require("fs");

const user_not_found = "user not found";
const update_failed = "update failed due to internal server error";
const delete_failed = "delete failed due to internal server error";
const prediction_failed = "prediction failed due to internal server error";
router.get("/register", async (req, res) => {
  res.status(200).json("get user");
});

// User Registration
router.post("/register", async (req, res) => {
  console.log("register");
  const name = req.body.name;
  const dc_id = req.body.dc_id;
  const student_id = req.body.student_id;
  try {
    let user_id = "";

    //check if registered before
    const allUsers = await user.find();
    for (let i = 0; i < allUsers.length; i++) {
      if (
        allUsers[i].dc_id == dc_id ||
        allUsers[i].name == name ||
        allUsers[i].student_id == student_id
      ) {
        user_id = allUsers[i]._id;
        console.log("already resigtered");
        return res.json({ message: "你已經註冊過囉!" });
      }
    }

    // register
    if (user_id.length == 0) {
      const newUser = new user({
        dc_id: req.body.dc_id,
        name: req.body.name,
        student_id: req.body.student_id,
        role: req.body.role,
        vote: false,
      });
      const saveResult = await newUser.save();
      console.log(`user ${name} registered`);
      user_id = saveResult._id;
    }
    return res.status(200).json({ message: "註冊成功!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

async function findUser(req, res, next) {
  try {
    const dc_id = req.b.dc_id;
    const target_user = await user.findById(dc_id);
    if (target_user == null) {
      res.status(400).json({ message: "您尚未註冊!" });
      throw user_not_found;
    }
    req.target_user = target_user; // Store the found user in the request object
    if (target_user.vote == true) {
      return res.status(400).json({ message: "您已經投票!" });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    // Handle the error if needed
    res.status(404).json({ error: "User not found" });
  }
}

// Vote
http: router.post("/vote/:dc_id/:candidate", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "http://192.168.65.232:4200");
  const dc_id = req.params.dc_id;
  const candidate = req.params.candidate;
  try {
    let targetUser = null;

    //check if registered before
    const allUsers = await user.find();
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].dc_id == dc_id) {
        targetUser = allUsers[i];
        if (targetUser.vote) {
          return res.status(402).json({ message: "you have voted before" });
        } else {
          console.log(targetUser._id);
          // user status change
          const userUpdateResult = await user.findByIdAndUpdate(
            targetUser._id,
            {
              vote: true,
            }
          );

          // event status change
          let event = await Event.findById("6689f72daf69f3035ac6616c");
          let original_vote = event.votes;
          original_vote[candidate] += 1;
          const eventUpdateResult = await Event.findByIdAndUpdate(
            "6689f72daf69f3035ac6616c",
            { votes: original_vote }
          );
          
          return res.status(200).json({ message: "vote succeed" });
        }
      }
    }
    return res.status(401).json({ message: "user not found!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

//__________________OPINION_________________________

// add opinion
router.post("/opinion", async (req, res) => {
  console.log("new opinion");
  const candidateName = req.body.candidateName;
  const issue = req.body.issue;
  const statement = req.body.statement;
  try {
    const newOpinion = new opinion({
      candidateName: candidateName,
      issue: issue,
      statement: statement,
    });
    const saveResult = await newOpinion.save();

    return res.status(200).json({ message: "issue added!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// get all opinions
router.get("/opinion", async (req, res) => {
  console.log("get opinion");
  try {
    const opinions = await opinion.find();
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    return res.status(200).json(opinions);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

//__________________EVENT_____________________________

// add new event
router.post("/event", async (req, res) => {
  console.log("new event");
  const name = req.body.name;
  const startDateTime = req.body.startDateTime;
  const endDateTime = req.body.endDateTime;
  const candidates = req.body.candidates;
  const issues = req.body.issues;
  try {
    const newEvent = new Event({
      name: name,
      startDateTime: startDateTime,
      endDateTime: endDateTime,
      candidates: candidates,
      endDateTime: endDateTime,
      issues: issues,
    });
    const saveResult = await newEvent.save();

    return res.status(200).json({ message: `Event ${name} added!` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// get all candidates
router.get("/event/candidates", async (req, res) => {
  console.log("get candidates");
  try {
    const events = await Event.find();
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    return res.status(200).json(events[0].candidates);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// get all candidates
router.get("/event/issues", async (req, res) => {
  console.log("get issue");
  try {
    const events = await Event.find();
    res.set("Access-Control-Allow-Origin", "http://localhost:4200");
    return res.status(200).json(events[0].issues);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

