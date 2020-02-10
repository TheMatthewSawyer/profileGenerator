const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdfFrom = require("pdf-from");

const questions = [{
    type: 'input',
    name: 'username',
    message: "Please enter a github username: ",
  }];

inquirer.prompt(questions).then(data => {
    const username = data.username;
    getProfile(username);
});

function getProfile(person = "TheMatthewSawyer") {
    const URL = "https://api.github.com/users/" + person;
    axios.get(URL).then(function (response) {
        let locationLink = `https://www.google.com/maps/place/${response.data.location}`;
        const profile = new Profile(response.data.avatar_url, response.data.login, response.data.location, locationLink, response.data.blog, response.data.bio, response.data.public_repos, response.data.followers, response.data.following);
        pdfer(profile);
    }).catch(error => {
        throw error + "Try Again";
    });
}

class Profile {
    
    constructor(profileImg, usrName, location, locationLink, blog, bio, public_repos, followers, following) {
        this.profileImg = profileImg;
        this.usrName = usrName;
        this.location = location;
        this.locationLink = locationLink;
        this.blog = blog;
        this.bio = bio;
        this.public_repos = public_repos;
        this.profileImg = profileImg;
        this.followers = followers;
        this.following = following;
    }
}

async function pdfer(profile) {
    const htmlString = `
    
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    
    <style>
        #profileImg {
            border: 3px solid black;
            border-radius: 30px;
        }
        .topPad {
            padding-top: 50px;
        }
        .usrInfo {
            color: green;
        }
        a {
            color: black;
        }
    </style>

    <div style='height: 50px;'></div>
    
    <div class="container">
        
        <div class="row">
            <div class="col green"></div>
            <div class="col-4">
                <img id="profileImg" src="${profile.profileImg}" class="img-fluid" alt="User profile pic">
            </div>
            <div class="col"></div>
        </div>

        <div class="row">
            <div class="col">
                <h1 class="text-center">${profile.usrName}</h1>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <h3 class="text-center">${profile.blog}</h3>
            </div>
        </div>

        <div style='height: 50px;'></div>
        
        <div class="row">
            <div class="col-6">

                <div class="row">
                    <div class="col">
                        <h3 class="text-center usrInfo">Public Repos:</h3>
                        <h3 class="text-center">${profile.public_repos}</h3>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <h3 class="text-center usrInfo">Location:</h3>
                        <a href='${profile.locationLink}'><h3 class="text-center">${profile.location}</h3></a>
                    </div>
                </div>

            </div>
            
            <div class="col-6">

                <div class="row">
                    <div class="col">
                        <h3 class="text-center usrInfo">Followers:</h3>
                        <h3 class="text-center">${profile.followers}</h3>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <h3 class="text-center usrInfo">Following:</h3>
                        <h3 class="text-center">${profile.following}</h3>
                    </div>
                </div>

            </div>

        </div>

        <div style='height: 50px;'></div>
        
        <div class="row">
            <div class="col">
                <h3 class="text-center usrInfo">Biography:</h3>
                <h3 class="text-center">${profile.bio}</h3>
            </div>
        </div> 

    </div>`
    const test = await pdfFrom.html(htmlString);
    fs.writeFile('resume.pdf', test, function(err) {
        if (err) {
           return console.error(err);
        }
    });
    console.log('done');
}