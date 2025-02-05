import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from '@inner-desktop/mergeclassnames';

import './style.scss';

function Switch(props) {
  const { active, onClick, className } = props;

  return (
    <div
      role="presentation"
      onClick={() => onClick()}
      className={mergeClassNames('bf-switch', className, active && 'active')}
    />
  );
}

Switch.defaultProps = {
  onClick: () => null,
};

Switch.propTypes = {
  active: PropTypes.any,
  onClick: PropTypes.any,
  className: PropTypes.any,
};

export default Switch;
