# Time Tracking tool

A simple tool to make it quick and easy to record your time. At the end of the week, you can fill in your timesheet from reliable and accurate data.

A demo of this project is at http://piranm.github.com/timetracker/

STATUS: **Still In Development** (pre-Alpha)

NOTE: This is not my idea, see History below.

# Overview

The website presents a Time Grid for each day where you can record time spent on tasks:

![Example Time Grid](https://raw.github.com/piranm/timetracker/master/app/img/example_day.png)

Clicking in the grid once records half-an-hour.

The data is stored locally on your computer, and the website works while you're off-line. You can export your data to Excel.

Go to http://piranm.github.com/timetracker/ and have a play.

# Development

Development is using http://yeoman.io/, so many command lines are from there.

In one terminal, start the dev server:

    yeoman server

In another terminal, run the tests:

    yeoman test

To run the e2e (End-To-End) tests, go to: http://localhost:3501/test/runner.html

## References

http://localhost:8000/app/timetrack.html

http://localhost:8000/test/e2e/runner.html

http://localhost:8000/README.md

https://trello.com/board/timetracker-dev/5108e6bea3c834f22500d6ba

https://github.com/piranm/timetracker

http://docs.angularjs.org/api

http://docs.angularjs.org/tutorial

# History

Many years back I worked as part of the off-shore team on a project, where we were 12-hours different from the customer. Each day we'd arrive to work to a set of questions from the customer, which we'd answer before starting development. At the end of the week, we totted up the time spent on answering questions, development, meetings, etc and send a summary timesheet to the customer. All was good.

I then came across a free [Yahoo! Widget](http://en.wikipedia.org/wiki/Yahoo!_Widgets) that allowed us to track our time in a simpler way, just taking a few clicks ([widgets](http://en.wikipedia.org/wiki/Widget_engine) were all the rage back then). We used it for one week... and then had to phone the customer because our timesheets were so radically different from any before: we were spending far longer answering questions and in meetings than we'd thought.

After the second week, the customer came to realise the true cost of answering those questions, and started to think a lot more before sending them to us. We could also give them an accurate amount of time we spent answering each question. The shape of the project changed, and so did the projects next door.

A year later, and having moved company and continent, I could not find that Yahoo Widget again. And after 5yrs I'm still unable to locate it. And it would be oh-so helpful.

So, this is my copy of that widget. Share and Enjoy!

# Contact

This project is hosted at https://github.com/piranm/timetracker, and you can contact me there.

[angular-seed]: https://github.com/angular/angular-seed
