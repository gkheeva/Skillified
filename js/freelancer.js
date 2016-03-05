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
            var skillLevel = answerSkill[1]/answerSkill[0];

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

(function(a){a.easyPieChart=function(d,l){var f,g,i,j,c,k,e,b,h=this;this.el=d;this.$el=a(d);this.$el.data("easyPieChart",this);this.init=function(){var n,m;h.options=a.extend({},a.easyPieChart.defaultOptions,l);n=parseInt(h.$el.data("percent"),10);h.percentage=0;h.canvas=a("<canvas width='"+h.options.size+"' height='"+h.options.size+"'></canvas>").get(0);h.$el.append(h.canvas);if(typeof G_vmlCanvasManager!=="undefined"&&G_vmlCanvasManager!==null){G_vmlCanvasManager.initElement(h.canvas)}h.ctx=h.canvas.getContext("2d");if(window.devicePixelRatio>1){m=window.devicePixelRatio;a(h.canvas).css({width:h.options.size,height:h.options.size});h.canvas.width*=m;h.canvas.height*=m;h.ctx.scale(m,m)}h.ctx.translate(h.options.size/2,h.options.size/2);h.ctx.rotate(h.options.rotate*Math.PI/180);h.$el.addClass("easyPieChart");h.$el.css({width:h.options.size,height:h.options.size,lineHeight:""+h.options.size+"px"});h.update(n);return h};this.update=function(m){m=parseFloat(m)||0;if(h.options.animate===false){i(m)}else{if(h.options.delay){g(h.percentage,0);setTimeout(function(){return g(h.percentage,m)},h.options.delay)}else{g(h.percentage,m)}}return h};e=function(){var n,o,m;h.ctx.fillStyle=h.options.scaleColor;h.ctx.lineWidth=1;m=[];for(n=o=0;o<=24;n=++o){m.push(f(n))}return m};f=function(m){var n;n=m%6===0?0:h.options.size*0.017;h.ctx.save();h.ctx.rotate(m*Math.PI/12);h.ctx.fillRect(h.options.size/2-n,0,-h.options.size*0.05+n,1);h.ctx.restore()};b=function(){var m;m=h.options.size/2-h.options.lineWidth/2;if(h.options.scaleColor!==false){m-=h.options.size*0.08}h.ctx.beginPath();h.ctx.arc(0,0,m,0,Math.PI*2,true);h.ctx.closePath();h.ctx.strokeStyle=h.options.trackColor;h.ctx.lineWidth=h.options.lineWidth;h.ctx.stroke()};k=function(){if(h.options.scaleColor!==false){e()}if(h.options.trackColor!==false){b()}};i=function(m){var n;k();h.ctx.strokeStyle=a.isFunction(h.options.barColor)?h.options.barColor(m):h.options.barColor;h.ctx.lineCap=h.options.lineCap;h.ctx.lineWidth=h.options.lineWidth;n=h.options.size/2-h.options.lineWidth/2;if(h.options.scaleColor!==false){n-=h.options.size*0.08}h.ctx.save();h.ctx.rotate(-Math.PI/2);h.ctx.beginPath();h.ctx.arc(0,0,n,0,Math.PI*2*m/100,false);h.ctx.stroke();h.ctx.restore()};c=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(m){return window.setTimeout(m,1000/60)}})();g=function(p,o){var n,m;h.options.onStart.call(h);h.percentage=o;Date.now||(Date.now=function(){return +(new Date)});m=Date.now();n=function(){var q,r;r=Math.min(Date.now()-m,h.options.animate);h.ctx.clearRect(-h.options.size/2,-h.options.size/2,h.options.size,h.options.size);k.call(h);q=[j(r,p,o-p,h.options.animate)];h.options.onStep.call(h,q);i.call(h,q);if(r>=h.options.animate){return h.options.onStop.call(h,q,o)}else{return c(n)}};c(n)};j=function(o,n,r,p){var m,q;m=function(s){return Math.pow(s,2)};q=function(s){if(s<1){return m(s)}else{return 2-m((s/2)*-2+2)}};o/=p/2;return r/2*q(o)+n};return this.init()};a.easyPieChart.defaultOptions={barColor:"#ef1e25",trackColor:"#f2f2f2",scaleColor:"#dfe0e0",lineCap:"round",rotate:0,size:110,lineWidth:3,animate:false,delay:false,onStart:a.noop,onStop:a.noop,onStep:a.noop};a.fn.easyPieChart=function(b){return a.each(this,function(d,e){var c,f;c=a(e);if(!c.data("easyPieChart")){f=a.extend({},b,c.data());return c.data("easyPieChart",new a.easyPieChart(e,f))}})};return void 0})(jQuery);



        $('#skills').slideToggle(500);
        $('.chart').easyPieChart({
            barColor: '#1ABC9C',
            trackColor: '#2F4254',
            scaleColor: false,
            lineCap: 'butt',
            lineWidth: 12,
            size:110,
            animate: 2000
        });


