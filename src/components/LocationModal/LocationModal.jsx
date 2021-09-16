import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import LocationPin from './LocationPin';
import GoogleMapReact from 'google-map-react';


export default class LocationModal extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.showForm = this.showForm.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
    this.state = {
      open: false,
      location: {},
      disposition: "option-1"
    };
  }

  googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  componentDidMount() {
    console.log("modal did mount");
    document.addEventListener(
      "locationModalControlOpen",
      e => {
        this.showForm(e.location);
      },
      false
    );
  }

  showForm(location) {
    console.log("show form function");
    this.setState({ open: true, location: location });
  }

  cancelForm() {
    this.setState({ open: false });
  }

  render() {

    return (
      <Dialog
        open={this.state.open}
        onClose={this.cancelForm}
        aria-labelledby="form-dialog-title"
        maxWidth={"md"}
        fullWidth={true}
      >
        <DialogContent>
            <div style={{ height: '60vh', width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: this.googleMapsApiKey }}
                    defaultCenter={this.state.location}
                    defaultZoom={17}
                >
                    <LocationPin
                        lat={this.state.location.lat}
                        lng={this.state.location.lng}
                        text={this.state.location.address}
                    />
                </GoogleMapReact>
            </div>
        </DialogContent>
      </Dialog>
    );
  }
}
