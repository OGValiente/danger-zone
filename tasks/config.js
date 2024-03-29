const buildFiles = [
    'node_modules/es6-promise-polyfill/promise.min.js',
    'node_modules/@orange-games/phaser/build/phaser.min.js',
    'node_modules/webfontloader/webfontloader.js',
    '_build/dist/<%= package.name %>-<%= package.version %>.js'
];

module.exports = {
    jitGrunt: {
        // here you can pass options to jit-grunt (or just jitGrunt: true)
        staticMappings: {
            htmlbuild: 'grunt-html-build',
            replace: 'grunt-text-replace'
        }
    },
    configPath: [
        process.cwd() + '/tasks/options'
    ],
    config: {
        //Get some details from the package.json
        partialBuild: buildFiles,
        fullBuild: buildFiles.concat([
            'node_modules/@orange-games/phaser-ads/build/phaser-ads.min.js',
            'node_modules/@orange-games/phaser-spine/build/phaser-spine.min.js',
            'node_modules/@orange-games/phaser-super-storage/build/phaser-super-storage.min.js',
            'node_modules/@orange-games/phaser-cachebuster/build/phaser-cachebuster.min.js',
            'node_modules/@orange-games/splash/build/splash.min.js'
        ]),
        ads: {
            pandoraId: ''
        }
    },
    init: true
};