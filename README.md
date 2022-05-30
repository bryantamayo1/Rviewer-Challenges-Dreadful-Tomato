# Dreadful Tomato

Dreadful Tomato is a new platform to find new movies and TV shows. The main objective is to
 help users to find information about their favourite TV shows and movies.
 
To do so, the company has to create a new web app that allow users do some fancy things.

## What do you have to do?

Dreadful Tomato needs to implement an awesome webpage where the users could view information
 about almost every new TV Shows and movie.
 
The Design team has sent us the new interface which has to be implemented. As you could see,
 there are three different pages.
 
* The first page is a landing page where user could select whether she wants to see TV shows
 or movies and some claims and logo of Dreadful Tomato
* The second one is the list of TV shows. Here, the user could filter TV shows by title and
 release year. In that page the user will see a list of card with the Title, description
 and image from each TV show. 
* The third one is quite similar, but for the movies. The user could filter by title and
 release year as well, to see a list of cards with the information of every movie.
 
Here you could see the design of the 3 pages:

Home page:

![](images/Dreadful%20Tomato%20-%20HOME.png)

TV shows page:

![](images/Dreadful%20Tomato%20-%20POPULAR%20SERIES.png)

Movies page:

![](images/Dreadful%20Tomato%20-%20POPULAR%20MOVIES.png) 
 
## Technical Requirements

Their CTO has no time to implement that, but she has defined some technical constraints:
 
 * This webapp has to be develop using React
 * Create reusable components
 * Create a **clean, maintainable and well-designed** code
 * Test your code until you are comfortable with that
 
#### Considerations

 * To obtain the data of the TV Shows and Movies, you have to request [that file](https://gitlab.com/-/snippets/2041384/raw/master/data.json).
 * Use SCSS or SASS to manage your stylesheets
 * Use any component you want in the date picker to allow the user select the Year
 * Pay attention to hover effects (Home and Shows/Movies cards) 
 
To understand how you take decisions during the implementation, please write a README file
 explaining some of the most important parts of the application.

---

## How to submit your solution

* Push your code to the `devel` branch - we encourage you to commit regularly to show your thinking process was.
* **Create a new Pull Request** to `main` branch & **merge it**.

Once merged you **won't be able to change or add** anything to your solution, so double-check that everything is as
you expected!

Remember that **there is no countdown**, so take your time and implement a solution that you are proud!

---

# My notes by Bryan David Tamayo Abad
This steps are I have done by this project:
1. Creation router with react-router-dom in folder *src/router*.
2. Creation three main components *HomerPage.js, MoviesPage.js and TVShowPage.js* in folder *src/pages*.
3. Definition two components *Header.js* and *Footer.js*.
4. Personalization of *header.js* and creation *MyCustomNavLink.js* with NavLink to change component *MoviesPage.js* or *TVShowPage.js*.
5. Personalization of *HomePage.js* and *Footer.js*.
6. Creation *MoviesPage.js*:<br>
    6.1. Installation json-server to consume data in folder *api/db.json* in PORT 3001 with command:<br>
    ```
    npm run api
    ```
    6.2. CSS and logic pagination. <br>
    6.3. CSS and logic Filter. <br>
    6.4. Handle filter with input and date-picker and queries url. <br>
7. Handle appearance button filter in *Header.js* with context created in folder *context/AppContext.js*.
8. Handle message error and loading data in *MoviesPage.js*.
9. Fixed errors message in *MoviesPage.js*.
10. Fixed bug with serie RuPaul's Drag Race with releaseYear 0 or Star Trek: Enterprise in *ContainerItems.js*.
11. Responsive web application.
12. Cleaned code.

Run project and api fake:<br>

    npm install
    npm start
    npm run api
