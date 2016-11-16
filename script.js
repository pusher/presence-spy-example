// we get a random id for simplicity’s sake
var id = Math.random().toString().substring(2)
var userName = "user-" + id
var spyName = "spy-" + id

// so we know who’s who
console.log("Hi there " + userName);

var pusher = new Pusher("REDACTED", {
  encrypted: true,
  authEndpoint: "http://127.0.0.1:5000/pusher/auth",
  auth: {
    params: {
      user: userName,
      isSpy: false
    }
  }
});

// as well as our normal pusher instance, instantiate a "spy" to spy on members
// of a presence channel independently of the main instance
var spy = new Pusher("052c5401f56d4bde9fce", {
  encrypted: true,
  authEndpoint: "http://127.0.0.1:5000/pusher/auth",
  auth: {
    params: {
      user: spyName,
      isSpy: true
    }
  }
});

// returns a channel specific function that lists all currently connected
// members – ignoring spies
var listMembers = function (channel) {
  return function () {
    console.log("Current users in " + channel.name + ":");
    channel.members.each(function (member) {
      if (!member.info.isSpy) { console.log("user: " + member.id); }
    });
  };
};

// spy on a channel
var spyOn = function (channelName) {
  var channel = spy.subscribe(channelName);
  channel.bind("pusher:subscription_succeeded", listMembers(channel));
  channel.bind("pusher:member_added", listMembers(channel));
  channel.bind("pusher:member_removed", listMembers(channel));
};

["presence-one", "presence-two"].forEach(spyOn);

// now our spies report all the non spies in each channel, so if we subscribe
// to "presence-one" like so:
//
// pusher.subscribe("presence-one")
//
// this is reported in all our clients by our spies
