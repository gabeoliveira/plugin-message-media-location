const MessagingResponse = require('twilio').twiml.MessagingResponse;


/**
 * HTTP Redirect Function
 *
 * This Function redirects a request from Twilio Functions to another URL by
 * setting the Location header to the respective URL
 */
 exports.handler = function (context, event, callback) {
  const response = new MessagingResponse();
  const client = context.getTwilioClient();

  console.log(event);

  if(event.Latitude && event.Longitude){
    console.log('Location Message Received');

    const gps = {
      latitude : event.Latitude,
      longitude: event.Longitude,
      address: event.Address,
      label: event.Label
    }

    console.log(gps);

    client.sync.services(context.SYNC_SERVICE_SID)
           .documents
           .create({
              uniqueName: 'msg_' + event.MessageSid,
              data: gps,
              ttl: 3000
            })
           .then(
             document => {
                console.log(document.sid)

                response.redirect(context.HTTP_REDIRECT_URL);

                console.log(response);

                callback(null, response);
              
              })
            .catch( err => console.log(err));
              ;


  }

  else{

    response.redirect(context.HTTP_REDIRECT_URL);

    callback(null, response);

  }

  
};