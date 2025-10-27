/*
Obsidian Multi-Git Plugin
Author: officefutaro
*/

(function() {
    'use strict';

    const { Plugin } = require('obsidian');

    class ObsidianMultiGitPlugin extends Plugin {
        async onload() {
            console.log('Loading Obsidian Multi-Git Plugin');
            
            this.addCommand({
                id: 'multi-git-sync',
                name: 'Sync all repositories',
                callback: () => {
                    new Notice('Git sync started...');
                }
            });
        }

        onunload() {
            console.log('Unloading Obsidian Multi-Git Plugin');
        }
    }

    module.exports = ObsidianMultiGitPlugin;
})();