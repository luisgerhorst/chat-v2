// Build 3

$(document).ready(function () {


socket.on('newMessage', function (message) {

	console.log("socket: newMessage");
    
    var entry = '<li data-userID="' + message.userID + '"><div class="content"><p class="message">' + linkURLs(message.message) + '</p><h4 class="name">- ' + message.name + '</h4><time data-time="' + message.time + '"></time></div></li>';
	
	$('#messages').append(entry);
	
    setTime();
    
    // scrool to botteom
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) $('html, body').animate({scrollTop: $(document).height()}, 0);
    else $('#messages').animate({ scrollTop: document.getElementById('messages').scrollHeight }, 0);
    
    // functions:
    
    function linkURLs(text) {
		var url = '', www = '', mail = '';
		url = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim; // URLs starting with http://, https://, or ftp://
		www = /(^|[^\/])(www\.[\S]+(\b|$))/gim; // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		mail = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;  // Change email addresses to mailto:: links.
		return String(text).replace(url, '<a href="$1" target="_blank">$1</a>').replace(www, '$1<a href="http://$2" target="_blank">$2</a>').replace(mail, '<a href="mailto:$1">$1</a>');
	}
    
});


socket.on('archivedMessages', function (messages) {

	console.log("socket: archivedMessages");
	
	var html='';
	
	for (var message in messages) {
		html += '<li data-userID="' + messages[message].userID + '"><div class="content"><p class="message">' + linkURLs(messages[message].message) + '</p><h4 class="name">- ' + messages[message].name + '</h4><time data-time="' + messages[message].time + '"></time></div></li>';
	}
	
	$('#messages').html(html);
	
	setTime();
	
	// for iOS, shows the time when tapping onto a message
    if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) $('html, body').animate({scrollTop: $(document).height()}, 100);
    else $('#messages').animate({ scrollTop: document.getElementById('messages').scrollHeight }, 100);
    
    // functions:
    
    function linkURLs(text) {
		var url = '', www = '', mail = '';
		url = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim; // URLs starting with http://, https://, or ftp://
		www = /(^|[^\/])(www\.[\S]+(\b|$))/gim; // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		mail = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;  // Change email addresses to mailto:: links.
		return String(text).replace(url, '<a href="$1" target="_blank">$1</a>').replace(www, '$1<a href="http://$2" target="_blank">$2</a>').replace(mail, '<a href="mailto:$1">$1</a>');
	}
    
});


socket.on('updatedUsers', function (users) {

	console.log("socket: updatedUsers");
    
    var html='';
    var	watching = 0;
	
	for (var this_userID in users) {
		if (this_userID != userID) {
			if (users[this_userID].name != false) html += '<li data-userID="' + this_userID + '">' + users[this_userID].name + '</li>';
			else watching++;
		}
	}
	
	if (watching == 1) html += '<li>' + watching + ' person watching</li>';
	if (watching >= 2) html += '<li>' + watching + ' people watching</li>';
	if (html == '') html = '<li>no people online</li>';
	
	if (html != $('#users').html()) {
	
		$('#users li').each(function(index) { // for each, do:
    		$(this).addClass('disappear');
    	});
	
    	setTimeout(function () {
			$('#users').html(html);
		}, 200);
		
	}
    
});


setInterval(setTime, 10*1000);

function setTime() { // adds relative timestamps to every entry

    $('#messages li time').each(function(index) { // for each, do
    
    	if ($(this).attr('data-time')) { // if this element has 'data-time' attribute
    
	    	var time;
	    	time = moment('"' + $(this).attr('data-time') + '"', "YYYY-MM-DDTHH:mm:ssZ"); // cretates moment() with the content of the data-time attribute
	    	time = time.from(moment().utc()); // coverts it to realtive timestamps
	    	$(this).html(time); // add's the relative timestamp into the element
      
	    }
	    
    });
    
}


}); // document.ready