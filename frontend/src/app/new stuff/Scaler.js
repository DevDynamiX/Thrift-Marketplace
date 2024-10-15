import posed from 'react-native-pose';

const Scaler = posed.View({
    active: {
        scale:1.5
    },
    inactive: {
        scale: 1
    }
});

export default Scaler;