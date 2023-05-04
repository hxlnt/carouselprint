const fs = require('fs');
const path = require('path');
const mdpdf = require('mdpdf');
const args = process.argv;
const dateRegion = 'en-US';
const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
const topicPath = path.resolve(args[2]);
const topic = path.basename(topicPath);
const concatMd = path.join(topicPath, topic + ".md");
const pdfOptions = {
    source: concatMd,
    destination: path.join(topicPath, topic + '.pdf'),
    styles: 'include/print.css',
    footer: 'include/footer-temp.html',
    header: 'include/header.html',
    debug: path.join(topicPath, topic + '.html'),
    pdf: {
      format: 'letter',
      header: {height: '0px'},
      footer: { height: '.75in' },
      border: {
        top: '.75in',
        left: '.75in',
        bottom: '.75in',
        right: '.75in'
        }
    }
};
const allFiles = fs.readdirSync(topicPath);
const tsRegex = new RegExp('([0-9]){8}.md', 'i');
const mdFiles = allFiles.filter(file => {
    return path.extname(file).toLowerCase() === ".md";
});
const validMdFiles = mdFiles.filter(file => {
    if (tsRegex.test(file)) { return file }
})

if (validMdFiles.length == 0) {
    console.log(`No files matching the [timestamp].md pattern were found at ${topicPath}. Make sure your file path is correct and try again.`);
    process.exit();
}

fs.writeFileSync("include/footer-temp.html", fs.readFileSync("include/footer.html").toString())
fs.appendFileSync("include/footer-temp.html", `${topic.toUpperCase()}</div></body></html>`);

fs.writeFileSync(concatMd, "");
console.log(`Joining files:`);
validMdFiles.forEach((file) => { 
    let entry = path.join(topicPath, file);
    if (fs.lstatSync(entry).isFile()) {
        console.log(` - ${file}`);
        fs.appendFileSync(concatMd, frontmatter(file)) 
        fs.appendFileSync(concatMd, fs.readFileSync(entry).toString()) 
        fs.appendFileSync(concatMd, '\r\n\r\n</div>') 
    }
});
console.log(`Creating PDF...`)

mdpdf.convert(pdfOptions).then((pdfPath) => {
    console.log('PDF saved to ', pdfPath);
}).catch((err) => {
    console.error(err);
});

function frontmatter(filename) {
    let year = parseInt(filename.substring(0, 4));
    let month = parseInt(filename.substring(4, 6));
    let day = parseInt(filename.substring(6, 8));
    let date = new Date(year, month - 1, day, 0, 0, 0);
    let datestring = date.toLocaleDateString(dateRegion, dateOptions);
    return `<div class="entry" markdown>\r\n# ${datestring} #\r\n\r\n`
}