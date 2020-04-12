const fs = require('fs');
const path = require('path');

const File = class File {

    constructor() {
        this.fileName = 'routes.csv';
        this.fileDirPath = path.join(__dirname, '../', 'file');
        this._arrayGlue = ',';
    }

    get filePath() {
        return path.join(this.fileDirPath, this.fileName)
    }

    writing(dataToWrite) {
        return new Promise((resolve, reject) => {
            if (!Array.isArray(dataToWrite)) {
                reject('Please send an array!');
            }

            if (!fs.existsSync(this.filePath)) {
                fs.appendFile(this.filePath, 'from,to,price' + '\r\n', err => {
                    if (err) {
                        reject(err);
                    }
                });
            }

            fs.appendFile(this.filePath, this._processingData(dataToWrite), 'utf8', (err => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            }))
        });
    }

    read() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.filePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(this._parseData(data));
            });
        });
    }

    _processingData(data) {
        if (Array.isArray(data)) {
            return data.map(value => value.toString().toUpperCase()).join(this._arrayGlue) + '\r\n';
        }

        return '';
    }

    _parseData(dataString) {
        const array = dataString.split('\r\n').filter(value => {
            return value !== ''
        }).map(value => {
            return value.split(this._arrayGlue);
        });
        const header = array[0];
        const values = array.splice(1);

        for (let i = 0; i < values.length; i++) {
            const object = {};
            for (let j = 0; j < header.length; j++) {
                object[header[j]] = values[i][j];
            }
            values[i] = object;
        }

        return values;
    }
};

module.exports = File;
