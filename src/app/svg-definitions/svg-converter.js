const fs = require('fs');
const path = 'src/assets/svg/';
const glob = require('glob');
const assetsPath = 'src/assets/svg';

var getDirectories = function (src, callback) {
    glob(src + '/**/*.svg', callback);
};

let i = 0;
const fileHtml = new Promise((resolve, reject) => {
    getDirectories(assetsPath, function (err, res) {
        if (err) {
        } else {
            res = res.map((item) => {
                return item.replace('src/', '');
            });
            fs.writeFile(
                path + 'image-list.json',
                JSON.stringify(res),
                'utf8',
                function (err) {}
            );
        }

        i++;
    });
});

Promise.all([fileHtml]).then(
    ([html]) => {},
    (error) => {}
);
