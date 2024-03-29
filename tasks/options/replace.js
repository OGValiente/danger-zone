module.exports = {
    dev: {
        src: ['_build/dev/<%= package.name %>.min.js'],
        overwrite: true,
        replacements: [{
            from: 'var adProvider = phaserAdProvider;',
            to: 'var adProvider = new PhaserAds.AdProvider.GameDistributionAds(this.game,\'<%= package.gameId %>\');'
        }]
    },
    gd: {
        src: ['_build/dist/<%= package.name %>-<%= package.version %>.js'],
        overwrite: true,
        replacements: [{
            from: 'var adProvider = phaserAdProvider;',
            to: 'var adProvider = new PhaserAds.AdProvider.GameDistributionAds(this.game,\'<%= package.gameId %>\');'
        }]
    }
}