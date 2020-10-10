module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 8080,   // 端口号
    },
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://127.0.0.1:8080/',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     },
    //
    // }
}