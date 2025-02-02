const VError = require('verror');
const waitFor = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const getApiUtils = (context) => {
  const client = context.getTwilioClient();

  return {
    fetchSubresourcesList: async (messageSid, retry = 3) => {
      for (let i = 0; i <= retry; i++) {
          console.log('MESSAGE SID =>', messageSid);
          const mediaMessage = await client.messages(messageSid).media.list({ limit: 1 });
          if (mediaMessage.length > 0) {
              return mediaMessage;
          } else {
              console.log("Message is a MMS, but it doesn't have any media attached.", ` retry = ${i}`);
          }
          await waitFor(1000);
      }
  },
    fetchSession: async (sessionSid) => {
      try {
        return await client.proxy
          .services(context.PROXY_SERVICE)
          .sessions(sessionSid)
          .fetch();
      } catch (err) {
        throw new VError(err, "error while fecthing Proxy's session details");
      }
    },
    updateChatMessageMedia: async (channelSid, messageSid, data) => {
      try {
        return await client.chat
          .services(context.CHAT_SERVICE_SID)
          .channels(channelSid)
          .messages(messageSid)
          .update(data);
      } catch (err) {
        throw new VError(err, "error while updating Chat's message with incoming media");
      }
    }
  }
}

const updateFlexChatMessageWithLocation = async (context, event, data) => {
  const { fetchSession, updateChatMessageMedia } = getApiUtils(context);

  const sessionSid = event.interactionSessionSid;
  const messageSid = event.outboundResourceSid;

  const session = await fetchSession(sessionSid);
  const channelSid = session.uniqueName.split('.')[0];

  const updatedChatMessage = await updateChatMessageMedia(channelSid, messageSid, {
    attributes: JSON.stringify(data)
  });


  console.log(updatedChatMessage);

}

const updateFlexChatMessageWithMMSMedia = async (context, event) => {
  const { fetchSession, fetchSubresourcesList, updateChatMessageMedia } = getApiUtils(context);

  const sessionSid = event.interactionSessionSid;
  const messageSid = event.outboundResourceSid;

  const subResourcesList = await fetchSubresourcesList(event.inboundResourceSid);

  if (subResourcesList.length) {
    const [subResource] = subResourcesList;
    const mediaType = subResource.contentType;
    const mediaURL =
      'https://api.twilio.com' + subResource.uri.replace('.json', '');

    const session = await fetchSession(sessionSid);
    const channelSid = session.uniqueName.split('.')[0];
  
    const updatedChatMessage = await updateChatMessageMedia(channelSid, messageSid, {
      attributes: JSON.stringify({
        mediaType,
        media: mediaURL,
      })
    });

    console.log(updatedChatMessage);
  } else {
    console.log('Message is a MMS, but it doesn\'t have any media attached.')
  }
}

exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();
  const SYNC_SERVICE_SID = context. SYNC_SERVICE_SID;
  var document;

  console.log(event);

  try{
    document = await client.sync.services(SYNC_SERVICE_SID).documents('msg_' + event.inboundResourceSid).fetch();
    console.log(document);
  }

  catch(err){
    if(err.code == 20404){
      console.log('Sync document not found');
    }

    else{
      console.error(err);
      throw new Error('Execution Error');
    }
  }
  

  if (event.inboundResourceSid.includes('MM')) {
    try {
      await updateFlexChatMessageWithMMSMedia(context, event);
      callback(null);
    } catch (err) {
      console.error('An unexpected error occurred: ', err);
      callback(err);
    }
  } 

  else if(document) {
    console.log('Location Message');

    try {
      await updateFlexChatMessageWithLocation(context, event, document.data);
      callback(null);
    } catch (err) {
      console.error('An unexpected error occurred: ', err);
      callback(err);
    }


  }

  else {
    console.log('not MMS');
    callback(null);
  }
};
