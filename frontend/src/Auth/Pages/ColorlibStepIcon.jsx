
import PropTypes from 'prop-types';

import Car from '../icons/Car';
import Battery from '../icons/Battery';
import Bag from '../icons/Bag';
import Fire from '../icons/Fire';
import Other from '../icons/Other';
import Cart from '../icons/Cart';
import CarOff from '../icons/CarOff';
import CartOff from '../icons/CartOff';
import BatteryOff from '../icons/BatteryOff';
import OtherOff from '../icons/OtherOff';
import BagOff from '../icons/BagOff';
import Calc from '../icons/Calc';
import Display from '../icons/Display';
import Chev from '../icons/Chev';
import Steps from '../icons/Steps';


function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const iconColor = active || completed ? true : false;

   const icons = {
     1: <Fire />,
     2: iconColor ? <Battery /> : <BatteryOff />,
     3: iconColor ? <Car /> : <CarOff />,
     4: iconColor ? <Bag /> : <BagOff />,
     5: iconColor ? <Cart /> : <CartOff />,
     6: iconColor ? <Other /> : <OtherOff />,
     7: iconColor ? <Calc /> : <Calc />,
     8: iconColor ? <Display /> : <Display />,
     9: iconColor ? <Steps /> : <Steps />,
     99: iconColor ? <Chev /> : <Chev />,
   };

    return (
        <div className={className}>
            {icons[String(props.icon)]}
        </div>
    );
}

ColorlibStepIcon.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    completed: PropTypes.bool,
    icon: PropTypes.node,
};

export default ColorlibStepIcon;
