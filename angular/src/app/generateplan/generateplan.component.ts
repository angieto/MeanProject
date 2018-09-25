import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Params } from  '@angular/router';

@Component({
  selector: 'app-generateplan',
  templateUrl: './generateplan.component.html',
  styleUrls: ['./generateplan.component.css']
})
export class GenerateplanComponent implements OnInit {

  _currentUser: any;       // the current logged in user, needs initial values.
  
  _dateForm: any = {
    date: null,
    time: null,
    activity: "",
    location: "",
    dressCode: "",
    user1: null,
    user2: null,
    invitaion: true
  }          // probably needs initial values.


  constructor(
    private _httpService : HttpService,
    private _route : ActivatedRoute
  ) { }


  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      let observer = this._httpService.getUser(params.userId);
      observer.subscribe(data => {
        this._currentUser = data;
        this._dateForm.user1 = this._currentUser;
      })
    })
  }

  // createDate will first grab a randomly matched user and attach it to the dateForm
  // it will then create the date with user1 (the inviter)
  // then it will take this date info and push it to user2

  createDate(){
    this._dateForm.user2 = this.getRandomMatch();
    let observer = this._httpService.createDate(this._currentUser._id, this._dateForm);
    observer.subscribe(data1 => {
      let _dateData = data1;
      // push to invited user's date array
      let secondObs = this._httpService.updateUser(_dateData['user2']['_id'], _dateData);
      secondObs.subscribe(data2 => {
        console.log("Create Date data:", data2);
        if (data2['errors']){
          console.log("User2's update failed to add date.");
        }
        else {
          console.log("Date successfully created!");
        }
      })

    })
  }

  // grabs a random user that matches well
  // model.find based on logged in user's preferences
  // returns an array with which we can generate a random number
  // possibly only include those who don't currently don't have invites or less than 3 or somethig like that
  
  getRandomMatch(){
    let observer = this._httpService.getUsers(this._currentUser.city);
    observer.subscribe(data => {
      let _potentialMatches = data;
      for(let user in _potentialMatches){
        // Remove logged in user from the list if that shows up.
        if (user['_id'] == this._currentUser['_id']){
          delete _potentialMatches[user];
        }
        // Check gender (might happen in the query instead)
        if (user['gender'] != this._currentUser.gender){
          delete _potentialMatches[user];
        }
      }

      let num = Math.floor(Math.random() * Object.keys(_potentialMatches).length);
      let match = _potentialMatches[num];
      return match;
    })
  }

  // grab a random activity and location from the activities array.

  getRandomActivity(){
    let activities = this._httpService.activities;
    this._dateForm.activity = activities[Math.floor(Math.random()* activities.length)].activity;
    this._dateForm.location = this._dateForm.activity.locations[Math.floor(Math.random() * this._dateForm.activity.locations.length)];
  }

  getRandomLocation(){
    this._dateForm.location = this._dateForm.activity.locations[Math.floor(Math.random() * this._dateForm.activity.locations.length)];
  }
}
