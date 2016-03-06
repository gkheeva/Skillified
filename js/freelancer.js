/*!
 * Start Bootstrap - Freelancer Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('body').on('click', '.page-scroll a', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !! $(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});



      /*var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {

          if (xhr.readyState == XMLHttpRequest.DONE) {

                console.log(xhr.responseText);
            var json = xhr.responseText;
            var obj = JSON.parse(json);

            var answersIds = [];
            var numAcceptedAnswers = 0;

            for (j=0; j < obj.items.length; j++) {

              var item = obj.items[j];
              
              answersIds.push(item.answer_id);

              if (item.is_accepted == true) {
                numAcceptedAnswers++;
              }

            }

            for (i=0; i < questionsIds.length; i++) {


            }

          }

      }

      xhr.open("GET", "https://api.stackexchange.com/2.2/users/3375847/answers?order=desc&sort=activity&site=stackoverflow", true);
      xhr.send();*/

           var skills = new Map();
      var competencies = new Map();
      
      // Call to the stackexchange api, and parses the resulting JSON object into skills and competencies.
      function request(userId) {

        var tagRequest = new XMLHttpRequest();
        tagRequest.onreadystatechange = function() {

          if (tagRequest.readyState == XMLHttpRequest.DONE) {

            var json = tagRequest.responseText;
            var obj = JSON.parse(json);

              for (j=0; j < obj.items.length; j++) {
                var item = obj.items[j];
                var answerArray = [item.answer_count, item.answer_score];
                skills.set(item.tag_name, answerArray);
                competencies.set(item.tag_name, item.answer_score >= 2*(item.answer_count));
              }

            }
        }

        tagRequest.open("GET", "https://api.stackexchange.com/2.2/users/" + userId + "/top-answer-tags?site=stackoverflow", true);
        tagRequest.send();
      }

      // Return map of skills, with [key = skill name, value = [answer_count, answer_socre]]
      function getAllSkills () {
        return skills;
      }

      // Return map of competencies with [key = skill name, value = boolean value of whether competent in skill]
      function getCompetencies() {
        return competencies;
      }

      // Return map of the top three skills with [key = skill bame, value = [boolean value of whether competent in skill, skill level score]
      function getTopSkills() {
        "use strict"
        var topSkills = new Map();

        var skillsAdded = 0;

        // nested function to compute the top skills
        function computeSkill (pair, compare) {

          if (compare) {
            var answerSkill = skills.get(pair[0]);
            var skillLevel = (answerSkill[1]/answerSkill[0])/2;

            var score;
            if (skillLevel >= 1) {
              score = Math.log10(10);
            }
            else {
              score = Math.log10((9*skillLevel)+1);
            }
                
            var comptencyArray = [pair[1], score];
            topSkills.set(pair[0], comptencyArray);
            skillsAdded++;
          }

        }

        // collect skills the user is competent in and calculate score
        for (let pair of competencies) {

          if (skillsAdded >= 3)
            break;

          computeSkill(pair, function () {return pair[1] == true;});
        }

        // if the user is competent in < 3 skills, pick first skill not currently in list. 
        if (skillsAdded != 3) {

          for (let pair of competencies) {

            if (skillsAdded >= 3)
              break;

            computeSkill(pair, function() {return topSkills.has(pair[0]);});
          }

        }

        return topSkills;
      }

      function getAll() {
        var all = [];
        all.push(skills);
        all.push(competencies);

        var topSkills = getTopSkills();

        all.push(topSkills);

        return all;
      }


