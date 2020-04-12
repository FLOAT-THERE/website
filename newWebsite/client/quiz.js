function Quiz(questions) {
  this.questions = questions;
  this.questionIndex = 0;
  this.like = [];
  this.dislike = [];

  // images
  // responses - yes tags and no tags
}

Quiz.prototype.getQuestionIndex = function() {
  return this.questions[this.questionIndex];
}

Quiz.prototype.guess = function(answer) {

  if (answer == "yes") {
    this.like.push(this.getQuestionIndex().id);
  } else {
    this.dislike.push(this.getQuestionIndex().id);
  }

  this.questionIndex++;
}

Quiz.prototype.isEnded = function() {
  return this.questionIndex === this.questions.length;
}


function Question(id, img) {
  this.id = id;
  this.img = img;
}

Question.prototype.answer= function(choice) {
  return this.answer === choice;
}


function populate() {
  if(quiz.isEnded()) {
      showScores();
  }
  else {
      // show image

      document.getElementById("img").src=quiz.getQuestionIndex().img;

      /*
      var img = document.createElement("img");
      img.src = quiz.getQuestionIndex().img;
      var src = document.getElementById("img");
      src.appendChild(img);
      */

      // show options
      guess("btnyes", "yes");
      guess("btnno", "no");


      showProgress();
  }
};

function guess(id, guess) {
  var button = document.getElementById(id);
  button.onclick = function() {
      quiz.guess(guess);
      populate();
  }
};


function showProgress() {

  var currentQuestionNumber = quiz.questionIndex + 1;
  var element = document.getElementById("progress");
  element.innerHTML = "Question " + currentQuestionNumber + " of " + quiz.questions.length;
};

function showScores() {
  alert("likes: " + quiz.like);
  alert("dislikes: " + quiz.dislike);
  /*
  var gameOverHTML = "<h1>Result</h1>";
  gameOverHTML += "<h2 id='score'> Your scores: " + quiz.score + "</h2>";
  var element = document.getElementById("quiz");
  element.innerHTML = gameOverHTML;
  */
};


// create questions here
var questions = [
  new Question(0, "./images/anthropologie_bell_sleeve_sweater_dress.jpg"),
  new Question(1, "./images/aston_rib_knit_turtleneck_top.jpg"),
  new Question(2, "./images/bohme_lucie_floral_mini_dress.jpg"),
  new Question(3, "./images/choosy_lila_top.jpg"),
  new Question(4, "./images/free_people_retro_vegan_bodycon_mini_skirt.jpeg"),
  new Question(5, "./images/j_crew_tie_front_shirt.jpg"),
  new Question(6, "./images/lost_and_wander_lasso_sweater.jpg"),
  new Question(7, "./images/madwell_embroidered_cover_up_dress.jpeg"),
  new Question(8, "./images/nike_crop_mesh_running_top.jpeg"),
  new Question(9, "./images/topshop_honeycomb_sleeve_oversized_cardigan.jpeg")
];

// create quiz
var quiz = new Quiz(questions);

// display quiz
populate();