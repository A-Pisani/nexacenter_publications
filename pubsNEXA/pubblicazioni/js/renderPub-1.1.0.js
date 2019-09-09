/**
 * Render publications in HTML
 *
 * Requires irisJsonParser.js
 *
 */
document.addEventListener("DOMContentLoaded",function(){

    const PEOPLE_JSON = "people.json";
    let BASE = "publications/";
    let SUFFIX = ".json";



    let renderHtml = function(p){
        switch (p.type) {
            case TYPE_JOURNAL: return (p.ap(p.author).join('; ') + "<br/><b><a href='" + p.uri +  "'>" + p.title
                + "</a></b><br/>"+p.journal+ " " + (p.volume?p.volume + "(" + (p.number||"-") + ")":"")
                + (p.pages?", pp."+ p.pages:"") +", ISSN:"+p.issn
                + (p.doi?"<br/>(<a href='http://dx.doi.org/" + p.doi + "'>DOI: " + p.doi + "</a>)":"")
            );
            case TYPE_CONFERENCE: return p.ap(p.author).join('; ') + "<br/><b><a href='" + p.uri +  "'>" + p.title
                + "</a></b><br/>in "+ (p.booktitle||"Proc. " + p.conference) + (p.pages?", pp." + p.pages:"")
                + (p.doi?"<br/>(<a href='http://dx.doi.org/" + p.doi + "'>DOI: " + p.doi + "</a>)":"");
            case TYPE_CHAPTER: return p.ap(p.author).join('; ') + "<br/><b><a href='" + p.uri +  "'>" + p.title
                + "</a></b><br/>in "+p.booktitle+", ISBN:"+p.isbn+", "
                +p.publisher;
            case TYPE_BOOK: return p.ap(p.author).join('; ') + "<br/><b><a href='" + p.uri +  "'>" + p.title
                + "</a></b><br/>"+p.publisher+", ISBN:"+p.isbn;
            case TYPE_POSTER: return p.ap(p.author).join('; ') + "<br/><b><a href='" + p.uri +  "'>" + p.title
                + "</a></b><br/>in "+p.booktitle+", ISBN:"+p.isbn+", "
                +p.publisher;
            case TYPE_OTHER: return p.ap(p.author).join('; ') + "<br/><b><a href='" + p.uri +  "'>" + p.title
                + "</a></b>";
        }
    };

    let decode = function(q,p){
        let re = new RegExp("(^|&|\\?)"+p+"=([^&]*)(&|$)");
        let m = re.exec(q);
        return m?m[2]:null;

    };

    if(!$){
        console.error("Missing jQuery: jQuery library should be imported");
        throw "Missing jQuery: jQuery library should be imported";
    } //$ means the jQuery library
    if(!PubList){
        console.error("Missing irisJsonParser: irisJsonParser library should be imported before");
        throw "Missing irisJsonParser: irisJsonParser library should be imported before ";
    }

    let outElement = $("#publications");
        if(!outElement){
        console.error("Missing #publications element: add a <div id='publications'> where you wish your publist be generated.")
        $("body").append("<div id='publications'>");
    }

    $.getJSON(PEOPLE_JSON, function (data) {

        let NexaPeople = {};
        data.people.forEach( it => NexaPeople[it.id] = it);

        let people = decode(window.location.search,"people");

        if(people) {
            people = people.split(/\s*[;,]\s*/);
            if(people.length === 1){
                let p = NexaPeople[people[0]];

                if(p){
                    $('h1').text(p.first + " " + p.last + " Publications");
                }else {
                    console.error(people[0] + " is not a listed member of the group");
                }
            }
        }else {
            people = [];
            for (let i in NexaPeople) {
                if(NexaPeople.hasOwnProperty(i)) {
                    let pp = NexaPeople[i];
                    if (pp.current) {
                        people.push(pp.id);
                    }
                }
            }
        }

        let pubs = new PubList();
        let count = 0;

        people.forEach((person)=> {
            let url = BASE.replace(/[^\/]$/,x => x+'/') + person + SUFFIX;
            console.log(url);
            $.getJSON(url, function (irisJson) {
                pubs.process(irisJson);
            }).fail(function () {
                console.warn("Could not load publication list for " + NexaPeople[person].first + " " + NexaPeople[person].last);
            }).always( function(){
                count++;
                if(count === people.length){
                    outElement.text("");

                    let pubbs = pubs.getPubsByYearType();
                    let types = {
                        [TYPE_JOURNAL]: "Journal articles",
                        [TYPE_CONFERENCE]: "Conferences",
                        [TYPE_CHAPTER]: "Book chapter",
                        [TYPE_BOOK]: "Books",
                        [TYPE_OTHER]: "Other"
                    };

                    //console.log(pubbs);
                    let summaryOut = "<ul>"; // side nav bar for years selection
                    pubs.getYears().sort().reverse().forEach(year => {
                        let outbuffer = "";
                        summaryOut += "<li style='margin: 1px'><a href='#" + year + "'>" + year + "</a></li>";

                        outbuffer += ("<a name='" + year + "'><h2 class='year'>" + year + "</h2></a><div class='per_year_block'>");

                        for (let t in types) {
                            let pt = pubbs[year][t];
                            if (pt) {
                                outbuffer += ("<h3>" + types[t] + "</h3><ul>");
                                pt.forEach(p => outbuffer += ("<li>" + renderHtml(p) + "<br/>" +
                                    // '<div data-badge-type="4" data-doi="' + p.doi +
                                    // '" data-condensed="true" data-hide-no-mentions="true" class="altmetric-embed"></div>' +
                                    '<details><summary>BibTeX</summary>Click text to copy<br><textarea class="abstract" enabled="false">' +
                                    p.toBibtex() + '</textarea></details>' +
                                    (p.abstract ? "<details><summary>Abstract</summary><p class='abstract'>" +
                                        p.abstract.replace(/\\.(\n|\r)+/g, ".<br>") + "</p></details>" : "") +

                                    "</li>")
                                );
                                outbuffer += ("</ul>");
                            } else {
                            }
                        }

                        outElement.append(outbuffer + "</div>"); //publication result
                        $('details textarea').click(ev => {
                            ev.target.focus();
                            //this.focus();
                            ev.target.select();
                            //this.select();
                            let res = document.execCommand('copy');
                        });
                    });
                    $('#summary').html(summaryOut+"</ul>"); // side nav bar for years selection
                }
            });
        });

    }).fail(function(){
        console.error("Could not load group people information from " + PEOPLE_JSON);
    });

});