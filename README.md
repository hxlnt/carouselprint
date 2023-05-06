# carouselprint
A utility for Carousel that generates topic-wide HTML and print-ready PDFs


## Installation
```
git clone https://github.com/hxlnt/carouselprint
cd carouselprint
npm install carouselprint
```

### Additional step for Raspberry Pi / ARM7 devices 
To get this working on my Raspberry Pi, I had to change a line of code somewhere in `node_modules` to point to the correct ARM7 path for Chromium, which is used by puppeteer to generate the PDF. IIRC, this is due to a bug in puppeteer. 

I don't remember which file I modified; I'll look it up shortly and update this section once I have more information. However, I think it's more or less the change described [in this Stack Overflow post](https://stackoverflow.com/questions/60129309/puppeteer-on-raspberry-pi-zero-w).

## Usage
Collect all Carousel-generated Markdown files into a single folder, then run
`node index.js folderpath`
where **folderpath** is the path to the folder.
All timestamped Markdown files will be collated into a single Markdown file, a single HTML file, and a single PDF. The PDF is printer-ready.


