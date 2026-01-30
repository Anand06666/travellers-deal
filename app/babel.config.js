module.exports = function (api) {
    api.cache(true);
    return {
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
        ],
        plugins: [
            "react-native-reanimated/plugin",
        ],
    };
};
