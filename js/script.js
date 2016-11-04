var temples = [{
    title: 'brihadeeswarar temple',
    location: {
        lat: 10.7828,
        lng: 79.1318
    },
}, {
    title: 'Meenakshi temple',
    location: {
        lat: 9.9195,
        lng: 78.1193
    },
}, {
    title: 'Ramanathaswamy Temple',
    location: {
        lat: 9.2881,
        lng: 79.3174
    },
}, {
    title: 'Kailasanathar Temple',
    location: {
        lat: 12.8423,
        lng: 79.6897
    },
}, {
    title: 'Ramaswamy temple',
    location: {
        lat: 10.9573,
        lng: 79.3736
    },
}];
//function to initialise the map
function myMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 11.1271,
            lng: 78.6569
        },
        zoom: 6

    });
    //create markers
    for (var i = 0; i < temples.length; i++) {
        var position = temples[i].location;
        var title = temples[i].title;
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
        });
        temples[i].markerObject = marker;



google.maps.event.addListener(marker, 'click', clickListener);





    }

    ko.applyBindings(new AppViewModel());
}
//function to bounce and display details when clicked
var bouncingMarker = null;
var clickListener = function() {
    if(bouncingMarker)
        bouncingMarker.setAnimation(null);
    if(bouncingMarker != this) {
        this.setAnimation(google.maps.Animation.BOUNCE);


         loadData(temples.markerObject,self.details);

        bouncingMarker = this;
    } else
        bouncingMarker = null;
}
//function to load the wiki links to the wikipedia-container(DOM)element
function loadData(marker,details) {




    var marker=marker;

    // load streetview

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json';
    var wikiRequestTimeout = setTimeout(function() {
     details("failed to get wikipedia resources");
    }, 10000);
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
    }).success(function(response) {
        var articleList = response[1];
        var marker = marker;
        for (var i = 0; i < articleList.length; i++) {
            articleStr = articleList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articleStr;
         details('<li><a href="' + url + '">' + articleStr + '</a></li>');
        }
        clearTimeout(wikiRequestTimeout);
    });
    return false;
}


//AppViewModel implementing knockout js
var AppViewModel = function() {
    var self = this;


self.details=ko.observable();

self.myMap=ko.observable(myMap);
    self.temples = ko.observable(temples);//for traking all the dependencies of temples
    //click on function to display marker
    self.clickFunction = function(temples) {
        map.setZoom(18 );
        map.setCenter(temples.location);
        loadData(temples.markerObject,self.details);
    };

    self.query = ko.observable('');
     //this block is for search and filter
    self.search = ko.computed(function() {



        var newArray = ko.utils.arrayFilter(self.temples(), function(gallery)  {
    if(gallery.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
      if(gallery.markerObject) {
          gallery.markerObject.setVisible(true);

      }
      return true;
    }else {

          gallery.markerObject.setVisible(false);

    }
});
return newArray;
});

};


//error to handle Google failure
var googleFailure = function() {
    alert('Could not load Google Map. Try again later');
};
