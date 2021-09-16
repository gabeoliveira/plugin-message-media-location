import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'
import { Pin, PinIcon, PinText } from './LocationModal.Styles' 

const LocationPin = ({ text }) => (
    <Pin>
      <Icon icon={locationIcon} style={{fontSize:'4rem'}} />
      <PinText>{text}</PinText>
    </Pin>
  )

export default LocationPin;