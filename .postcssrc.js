// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = ({ file, options, env }) => {
    return {
        plugins: {
            'autoprefixer': {},
            'postcss-pxtorem': /node_modules\\vant\\/.test(file && file.dirname) ? {
                rootValue: 37.5,
                propList: ['*']
            } : false
        }
    };
}
