# Pick'em

In 2022, legal sportsbooks in the United States reached new records in handled bets ($93.2 billion) and revenue ($7.5 billion), according to the [American Gaming Association](https://www.americangaming.org/new/2022-commercial-gaming-revenue-tops-60b-breaking-annual-record-for-second-consecutive-year/). A key driver is the incremental legalization of mobile gambling. 

However, as sports betting gets more integrated into fans' lives, it remains a siloed activity that expires moments after the final whistle of a game. Pick’em seeks to change that. Sports fans and betting sharks can make their picks publicly, interact with others’ and see how he/she/they compare to the millions who enjoy sports betting.
## Tech stack
* HTML
* CSS
* JavaScript
* Node.js
* [Express framework](https://www.npmjs.com/package/express)
* [Sequelize ORM](https://www.npmjs.com/package/sequelize)
* [PostgreSQL](https://www.npmjs.com/package/postgres)
* [dot-env](https://www.npmjs.com/package/dot-env)
* [Embedded JavaScript templates](https://www.npmjs.com/package/ejs)
* ESPN API - [example](http://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard)
* YouTube API (tbd)
* Front-end framework (tbd)
## Entity Relational Diagram
![ERD](./erd/PickEm-erd-v02.png)
## Routing Chart
| HTTP METHOD | URL                               | CRUD    | Description                                                                                         | View                |     |     |     |
|:----------- |:--------------------------------- |:------- |:--------------------------------------------------------------------------------------------------- |:------------------- | --- | --- | --- |
| GET         | /                                 | READ    | Load homepage with login form                                                                       | Home / Member login |     |     |     |
|             |                                   |         |                                                                                                     |                     |     |     |     |
| POST        | /members/login                    | READ    | Checks user credentials against database                                                            |                     |     |     |     |
| GET         | /members/new                      | READ    | Display signup form                                                                                 | Member signup form  |     |     |     |
| POST        | /members                          | CREATE  | Add member to database, redirect to members/:username/todayspicks                                   |                     |     |     |     |
| GET         | /members/logout                   | READ    | Logout member by clearing cookies, redirect to homepage                                             |                     |     |     |     |
| GET         | /members/:username/todayspicks    | READ    | Display member data with member's "today's picks"                                                   | Profile             |     |     |     |
| GET         | /members/:username/notifications  | READ    | Display member data with member's "notifications"                                                   |                     |     |     |     |
|             |                                   |         |                                                                                                     |                     |     |     |     |
| GET         | /picks/:league                    | READ    | Display feed of real-time picks                                                                     | Picks               |     |     |     |
| POST        | /picks/:league/add/:pickId        | CREATE  | Adds pick to database, change color of logo & switch "PICK'EM" to "CANCEL PICK", redirect to picks/ |                     |     |     |     |
| PUT/PATCH   | /picks/:league/update/:pickId     | UPDATE  | Changes teamSelect of existing pickId, redirect to picks/                                           |                     |     |     |     |
| DELETE      | /picks/:league/delete/:pickId     | DESTROY | Removes pick from database, resets color of both picks                                              |                     |     |     |     |
| GET         | /picks/:username                  | READ    | Display feed of real-time picks                                                                     |                     |     |     |     |
| PUT/PATCH   | /picks/:username/update/:pickId   | UPDATE  | Changes teamSelect of existing pickId, redirect to picks/                                           |                     |     |     |     |
| DELETE      | /picks/:username/delete/:pickId   | DESTROY | Removes pick from database, resets color of both picks                                              |                     |     |     |     |
|             |                                   |         |                                                                                                     |                     |     |     |     |
| GET         | /:league                          | READ    | Display pick options from league view                                                               | League              |     |     |     |
| POST        | /:league/add/:pickId              | CREATE  | Adds pick to database, change color of logo & switch "PICK'EM" to "CANCEL PICK", redirect to picks/ |                     |     |     |     |
| PUT/PATCH   | /:league/update/:pickId           | UPDATE  | Changes teamSelect of existing pickId, redirect to picks/                                           |                     |     |     |     |
| DELETE      | /:league/delete/:pickId           | DESTROY | Removes pick from database, resets color of both picks                                              |                     |     |     |     |
| GET         | /:league/:username                | READ    | Display feed of real-time picks                                                                     |                     |     |     |     |
| PUT/PATCH   | /:league/:username/update/:pickId | UPDATE  | Changes teamSelect of existing pickId, redirect to picks/                                           |                     |     |     |     |
| DELETE      | /:league/:username/delete/:pickId | DESTROY | Removes pick from database, resets color of both picks                                              |                     |     |     |     |
|             |                                   |         |                                                                                                     |                     |     |     |     |
| GET         | /leaderboard                      | READ    | Displays leaderboard, default view is "yesterday"                                                   | Leaderboard         |     |     |     |
| GET         | /leaderboard/:thismonth           | READ    | Displays leaderboard, view is "this month"                                                          |                     |     |     |     |
| GET         | /leaderboard/alltime              | READ    | Displays leaderboard, default view is "all time"                                                    |                     |     |     |     |

## Wireframes
![homepage](wireframes/Pickem-homepage.png)
![signup](wireframes/Pickem-signup.png)
![profile](wireframes/Pickem-profile.png)
![picks](wireframes/Pickem-picks.png)
![leagues](wireframes/Pickem-leagues.png)
![leaderboard](wireframes/Pickem-leaderboard.png)

## User Stories
**MVP**
- I want to see details about each sports game (teams, odds, location, time, record, probable pitchers) - modal
- I want to bet on sports games
- I want to know the status of my bets
- I want to know how successful I am at betting on sports games
- I want to comment on other users bet decisions
- I want to see how successful other users are at betting on sports games

**Stretch**
- I want to see a leader board of the best sports betters
- I want to see what sports I’m best/worst at betting at
- I want to see what team I’m best/worst at betting at
- I want to click on teams and see recent news, stats, roster
- I want to know if I'm on a winning streak

## Goals
**MVP**
HTML 
* Accessibility-considered HTML
* Use of views & partials
* Page metadata (ex: titles) echo views

CSS
* App is attractive and comfortably spaced, information is digestable
* Desktop-first design
* Stylized font and color scheme 
* Sporty theme
* Incorporate one front-end framework element

JavaScript
* Functional and responsive without bugs
* Send appropriate webpage statuses
* Picks auto populate to API data
* User picks are tracked in database 
* Response for pick actions
* Picks lock at game start time
* Actively refreshing feed of picks in "/picks"
* One league of picks available

**Stretch**
JavaScript
* Live scores of picked games
* Leaderboard 
* 2+ leagues of picks available
* Secondary 'confirm password' on sign up page
* Integrate Outcomes model

CSS
* Flexible design for diverse screen sizes, mobile



[GitHubGist](https://gist.github.com/andrewbantly/86869292a2862c58a2c910217f06d0fe)