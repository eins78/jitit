var path      = require('path'),
    fs        = require('fs'),
    inspect = require('eyes').inspector(),
    GitHubApi    = require('github');
    

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    timeout: 5000
});
github.repos.getReadme({
    user: "eins78",
    repo: "txt.178.is",
}, function(err, res) {
    console.log(inspect(res));
});