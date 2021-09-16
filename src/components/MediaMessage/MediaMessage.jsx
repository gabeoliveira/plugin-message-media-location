import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as Flex from '@twilio/flex-ui';
import GoogleMapReact from 'google-map-react';
import LocationPin from '../LocationModal/LocationPin';


import {
  ImageWrapper,
  AudioPlayerWrapper,
  PdfViewerWrapper,
  VideoPlayerWrapper,
  MapsWrapper
} from './MediaMessage.Styles';

const {Button} = Flex;

class MediaMessageComponent extends Component {

  googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  handleLocationClick = (e) => {
    const target = e.target;
    console.log(target);
  }

  renderImage = () => {
    const { mediaUrl } = this.props;

    return (
      <ImageWrapper>
        <img
          src={mediaUrl}
          alt='MMS'
          width='150px'
          onClick={() =>
            Flex.Actions.invokeAction('smsModalControl', {
              url: mediaUrl
            })
          }
        />
      </ImageWrapper>
    );
  };

  renderAudioPlayer = () => {
    const { mediaUrl, mediaType } = this.props;

    return (
      <AudioPlayerWrapper>
        <audio controls>
          <source src={mediaUrl} type={mediaType} />
        </audio>
        <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
          Full Size Player
        </a>
      </AudioPlayerWrapper>
    );
  };

  renderPdfViewer = () => {
    const { mediaUrl } = this.props;

    return (
      <PdfViewerWrapper>
        <iframe title='PDF Preview' src={mediaUrl} width='100%' />
        <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
          Full Size Document
        </a>
      </PdfViewerWrapper>
    );
  };

  renderVideoPlayer = () => {
    const { mediaUrl, mediaType } = this.props;

    return (
      <VideoPlayerWrapper>
        <video width='100%' controls>
          <source src={mediaUrl} type={mediaType} />
        </video>
        <a href={mediaUrl} target='_blank' rel='noopener noreferrer'>
          Full Size Player
        </a>
      </VideoPlayerWrapper>
    );
  };

  renderLocation = () => {
    
    const location = {
      lat: parseFloat(this.props.latitude),
      lng: parseFloat(this.props.longitude),
      address: this.props.address
    }

    return (
      <div>
        <div style={{ height: '10vh', width: '100%' }}>
          <GoogleMapReact
              bootstrapURLKeys={{ key: this.googleMapsApiKey }}
              defaultCenter={location}
              defaultZoom={15}
          >
              <LocationPin
                  lat={location.lat}
                  lng={location.lng}
                  text={location.address}
              />
          </GoogleMapReact>
        </div>
        <React.Fragment>
          <Button onClick={() => Flex.Actions.invokeAction('locationModalControl', {
                  location: location
                })}>
            Show location
          </Button>
        </React.Fragment>
    </div>)
  }

  render() {
    const { mediaType } = this.props;

    switch (mediaType) {
      case 'image/jpeg':
      case 'image/png':
        return this.renderImage();
      case 'audio/mpeg':
      case 'audio/ogg':
      case 'audio/amr':
        return this.renderAudioPlayer();
      case 'application/pdf':
        return this.renderPdfViewer();
      case 'video/mp4':
        return this.renderVideoPlayer();

      case 'location':
        return this.renderLocation()
      default:
        return <div />;
    }
  }
}

MediaMessageComponent.propTypes = {
  mediaType: PropTypes.string.isRequired
};

export default MediaMessageComponent;
