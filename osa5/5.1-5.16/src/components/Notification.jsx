import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={notificationStyle} className={type === 'error' ? 'error' : 'success'}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error'])
}

export default Notification