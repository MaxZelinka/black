const fspromise = require('fs.promises');
const naturalCompare = require('natural-compare');
const childProcess = require('child_process');

const path = 'js/module/';
const index = '_index.js';

exports.init = () => {
    try {
        fspromise.readdir(path, 'utf8')
        .then(files => files.sort((a, b) => naturalCompare(a, b)))
        .then(files => {
            files = files.filter(file => file !== index);
            str_files = files.map(file => file = 'exports.' + file.replace('.js','') + ' = require(\'./' + file + '\');');
                      
            str_files = str_files.toString().replace(/,/gi, '\n');

            fspromise.writeFile(path + index, str_files, 'utf8').then(() => {
                const modules = require('./module/' + index);
                
         
               

                // files.map(file => {
                    
                    // childProcess.exec('modules._test.init();');

                    
   
                
                // });
                
                // modules._test.init();
            });        
        })
    } catch (err) {
        throw err;
    }
}