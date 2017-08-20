module.exports = function() {

    require('fs').unlink(global.configPath, (err) => {
        if (err) throw err 
    });
    
}
