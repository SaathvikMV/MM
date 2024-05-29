const { exec } = require('child_process');
function runPythonScript(a) {
    return new Promise((resolve, reject) => {
        exec(`python ./routes/Categorise/Storedtop.py ${a}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(stdout.trim());
        });
    });
}

const categories = (keyword) => {
    return new Promise((resolve, reject) => {
        runPythonScript(keyword)
            .then((result) => {
                resolve(result); 
            })
            .catch((error) => {
                console.error('Error running Python script:', error);
                reject(error);
            });
    });
};


// runPythonScript('Tomato')
//     .then((result) => {
//         console.log('Result from Python script:', result);
//         // Send the result or perform further actions
//     })
//     .catch((error) => {
//         console.error('Error running Python script:', error);
//     });

module.exports = categories