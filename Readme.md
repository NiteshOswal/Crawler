Crawler
-------

A demo crawler app for review, or maybe something even more exciting for the
future! it even respects robots.txt for the root URL!

A really clean init procedure, can help create multiple crawlers on different
threads. just a simple `new Crawler(url, depth, persist)`

`Default: persist = false;`

Install instructions -

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
git clone https://github.com/NiteshOswal/Crawler.git
cd Crawler
npm install
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 

1.  Regular method for execution -

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    node console.js http://niteshoswal.me -d 1
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    to output everything to an external log file

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    node console.js http://niteshoswal.me -d 1 > out.txt
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

     

    Now that I think about it, I could've actually allowed helpers.log to write
    to a log file instead of just console.log (next version?, maybe bump it up a
    little bit)

2.  Enable --persist, save the URLs we crawled,

    To ensure you make through this mode moon-walking, you need to edit
    `config.js`

    `database: {`

`	host: "localhost",`

`	user: "user",`

`	password: "nomnom",`

`	database: "something"`

    `}`

    Save `config.js`

    Import `crawler.sql to the database`

    and enable `--persist`! (yay!)

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    node console.js http://niteshoswal.me -d 1 --persist
    #OR
    node console.js http://niteshoswal.me -d 1 --persist > out.txt
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 

To disable those console.log's navigate to "`lib/helpers.js`" and set
`log=false`

 

>   I tried..
