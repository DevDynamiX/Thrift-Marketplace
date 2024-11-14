const { BACKEND_HOST } = require('./env');
export default {
    expo: {
        name: "thrift-market",
        slug: "thrift-market",
        version: "1.0.0",
        scheme: "thrift-market",
        extra: {
            BACKEND_HOST,
        },
        plugins: [
            "expo-font",
            "expo-router"
        ]
    },
};
