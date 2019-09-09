/*-------------------------
 * Parsing and rendering utilities for IRIS Generated JSON
 *
 * Author: Marco Torchiano
 * Version: 0.2
 *
 */

class People {
    constructor(id) {
        this.id = id;
    }
}
class PeoplePast {
    constructor(id, year) {
        this.id = id;
        this.year=year;
    }
    extraCheck (authors, yearOfPub) {
        if (authors.find(a => a.includes(this.id)) && yearOfPub > this.year )return 1;
        else return 0;
    }
}
peopleNexa = []; // ++ Array of active members of Nexa Group

peopleNexa.push(new People("Vetrò, A"));
peopleNexa.push(new People("Vetro', A"));
peopleNexa.push(new People("Vetro, A"));
peopleNexa.push(new People("Beretta, E"));
peopleNexa.push(new People("De Martin, Juan Carlos"));
peopleNexa.push(new People("Santangelo, A"));
peopleNexa.push(new People("Fenoglietto, S"));
peopleNexa.push(new People("Bassi, E"));
peopleNexa.push(new People("Plazio, M"));
peopleNexa.push(new People("Bassi, E"));
peopleNexa.push(new People("Garifo, G"));
peopleNexa.push(new People("Conoscenti, M"));
peopleNexa.push(new People("Futia, G"));
// console.log(peopleNexa)

var peoplePast = []; // -- Array of past members of Nexa with the relative last year of activity
//peoplePast.push(new PeoplePast("Bassi, E", 2009));
//peoplePast.push(new PeoplePast("Conoscenti, M", 2017));
peoplePast.push(new PeoplePast("Glorioso, A", 2007));
peoplePast.push(new PeoplePast("Ruggiero, F", 2007));
peoplePast.push(new PeoplePast("Basso, S", 2017));
peoplePast.push(new PeoplePast("Pellegrino, P", 2018));
peoplePast.push(new PeoplePast("Mantelero, A", 2017));
peoplePast.push(new PeoplePast("Cairo, F", 2013));
peoplePast.push(new PeoplePast("Leschiutta, L", 2015));
peoplePast.push(new PeoplePast("Canova, L", 2017));
peoplePast.push(new PeoplePast("Iemma, R", 2015));
peoplePast.push(new PeoplePast("Melandri, A", 2015));
peoplePast.push(new PeoplePast("Morando, F", 2015));
// console.log(peoplePast)



/**
 * Checks whether an object is an IRIS JSON
 * containing publications.
 *
 * @param json the supposed IRIS JSON object
 * @returns {boolean}
 */
function isIrisJson(json){
   // console.log(json);
    return json && "rp" in json && "NumRec" in json && "records" in json && "handle" in json.records[0];
}


/**
 * Build an author recognizer object
 *
 * @param {[]} [authors]
 * @constructor
 */
function AuthorRecognizer(authors){
    this.names = {};
    if(authors) {
        if ( isIrisJson(authors) ) { // IRIS JSON
            this.train(authors.records.map(it => it.dc_description_allpeople[0].value));

        }
        if(Array.isArray(authors)){
            this.train(authors);

        }
    }
}

AuthorRecognizer.prototype.train = function(authors) {
    if(!Array.isArray(authors)){
        this.train([authors]);
        return;
    }
    authors.forEach(
        a => {
            a = a.replace(/([^a-zA-Z]|^)([A-Z])([A-Z]+)/g, function(_, pre, iniziale, thisto) {
                return pre + iniziale + thisto.toLowerCase(); } ).
            replace(/( [A-Z])(;| |$)/,(_,i,s) => i+'.'+s);
            let last, first;
            if (/,/.test(a)) { // last, first: OK
                [last, first] = /([^,]+)\s*,\s*(.+)\s*/.exec(a).slice(1);
            } else if (/^([A-Z]\. *)+/.test(a)) { // F. Last
                last = /^(([A-Z]\. *)+)(.+)/.exec(a)[3];
            } else if (/(( *[A-Z]\.)+)$/.test(a)) { // Last F.
                last = /([^.]+)\s((\s*[A-Z]\.)+)$/.exec(a)[1];
            }
            if (last) {
                if (!this.names[last]) this.names[last] = {name: last, first: 0, last: 0};
                this.names[last].last++;
            }
            if (first) {
                if (!this.names[first]) this.names[first] = {name: first, first: 0, last: 0};
                this.names[first].first++;
            }
        }
    );
    for (let n in this.names) {
        if(this.names.hasOwnProperty(n)) {
            let ns = this.names[n];
            ns.pLast = ns.last / (ns.last + ns.first);
        }
    }
};
// AuthorRecognizer.prototype._assess = function(a,b,current){
//     if(!current){
//         current = {first:null, last:null, strenght:0};
//     }
//     let pla = (this.names[a]||{}).pLast;
//     let plb = (this.names[b]||{}).pLast;
//
//     if(pla===plb ) return null;
//     if(((!plb || pla > plb) && pla > 0.5) || (!pla && plb < 0.5)){
//         let s = (this.names[a]||{last:0}).last + (this.names[b]||{first:0}).first;
//         if(s>strenght) {
//             last = a;
//             first = b;
//             strenght = s;
//         }
//     }
//     if(((!pla || plb > pla) && plb > 0.5) || (!plb && pla < 0.5)){
//         if( plb >= 0.5 || pla < 0.5) {
//             let s = (this.names[b] || {last: 0}).last + (this.names[a] || {first: 0}).first;
//             if (s > strenght) {
//                 last = b;
//                 first = a;
//                 strenght = s;
//             }
//         }
//     }
//
// };
AuthorRecognizer.prototype.process = function(a){
    if(Array.isArray(a)){
        return a.map( x => this.process(x) );
    }
    a = a.replace(/([^a-zA-Z]|^)([A-Z])([A-Z]+)/g, function(_, pre, iniziale, thisto) {
        return pre + iniziale + thisto.toLowerCase(); } ).
    replace(/( [A-Z])(;| |$)/,(_,i,s) => i+'.'+s).
    replace(/([^ .]{2})\. /,(_,w) => w+' ');

    if(/,/.test(a)) { // last, first : OK
        return a;
    }else{ // NOT last, first
        let words = a.split(/\s+/);
        let last, first;
        let strenght = 0;
        for(let i=1; i<words.length; ++i){
            let a = words.slice(0,i).join(" ");
            let b = words.slice(i).join(" ");

            let pla = (this.names[a]||{}).pLast;
            let plb = (this.names[b]||{}).pLast;

            if(pla===plb ) continue;
            if(((!plb || pla > plb) && pla > 0.5) || (!pla && plb < 0.5)){
                let s = (this.names[a]||{last:0}).last + (this.names[b]||{first:0}).first;
                if(s>strenght) {
                    last = a;
                    first = b;
                    strenght = s;
                }
            }
            if(((!pla || plb > pla) && plb > 0.5) || (!plb && pla < 0.5)){
                if( plb >= 0.5 || pla < 0.5) {
                    let s = (this.names[b] || {last: 0}).last + (this.names[a] || {first: 0}).first;
                    if (s > strenght) {
                        last = b;
                        first = a;
                        strenght = s;
                    }
                }
            }
            break;
        }
        if(last){
            //console.log(a + " --> " + last + ", " + first + "( " + strenght + ")");
            return last + ", " + first;
        }
        if (/^([A-Z]\. *)+/.test(a)) { // F. Last
            let parts = /^(([A-Z]\. *)+)(.+)/.exec(a);
            //console.log(a + " .--> " + parts[3] + ", " + parts[1]);
            return parts[3] + ", " + parts[1];
        } else if (/(( *[A-Z]\.)+)$/.test(a)) { // Last F.
            let parts = /([^.]+)\s((\s*[A-Z]\.)+)$/.exec(a);
            //console.log(a + " -->. " + parts[1] + ", " + parts[2]);
            return parts[1] + ", " + parts[2];
            //console.log(a + " -> last " + last);
        }
        let nf = words.length-1;
        //while(words[nf-1].length<=2) nf--; // this line was included in the original script, doesn't work with the name 'De Martin'
        return words.slice(nf).join(" ") + ", " + words.slice(0,nf).join(" ");
    }
};


/**
 * Pubblication constructor
 *
 * @param p an IRIS JSON item
 * @param {AuthorRecognizer} [ap] an author recognizer used to process and adjust the author list
 *
 * @constructor
 */
function Pubblication(p,ap){
    const v = x => (x||[{value:null}])[0].value;

    this.authorProcessor = ap;
    this.id = p.handle.replace("/","_");
    this.year = v(p.metadata.dc_date_issued);
    if(this.year === "9999") this.year = 'To appear';
    this.type = MIUR_TYPES[v(p.metadata.dc_type_miur)];
    this.title = v(p.metadata.dc_title);
    this.author = this.ap(v(p.metadata.dc_description_allpeople).
    replace(/([^a-zA-Z]|^)([A-Z])([A-Z]+)/g, function(_, pre, iniziale, thisto) {
        return pre + iniziale + thisto.toLowerCase(); } ).
    replace(/( [A-Z])(;| |$)/,(_,i,s) => i+'.'+s).
    split(/\s*;\s*/));
    //ADDED
    console.log(this.author);
    //ADDED
    let fp = p.metadata.dc_relation_firstpage;
    let lp = p.metadata.dc_relation_lastpage;
    this.pages = (fp?(/:/.test(fp[0].value)?fp[0].value.replace(":","--"):
        fp[0].value+"--"+(lp?lp[0].value:"?")):
        (p.metadata.dc_relation_numberofpages?p.metadata.dc_relation_numberofpages[0].value:null));
    this.volume = (p.metadata.dc_relation_volume?/[^(]+/.exec(p.metadata.dc_relation_volume[0].value):null)
    if(p.metadata.dc_relation_volume && /\(/.test(p.metadata.dc_relation_volume[0].value)){
        this.number = /\((.+)\)/.exec(p.metadata.dc_relation_volume[0].value)[1]
    }else{
        this.number = v(p.metadata.dc_relation_issue);
    }
    this.abstract = v(p.metadata.dc_description_abstract);
    this.uri = v(p.metadata.dc_identifier_uri);
    this.journal = v(p.metadata.dc_authority_ancejournal);
    this.issn = p.lookupValues.jissn;
    this.doi = v(p.metadata.dc_identifier_doi);
    this.doi = v(p.metadata.dc_identifier_doi);
    this.conference = v(p.metadata.dc_relation_conferencename);
    if(this.conference) this.conference = this.conference.replace(/Proc. */,"");
    this.publisher = v(p.metadata.dc_publisher_name);
    this.isbn = v(p.metadata.dc_identifier_isbn);
    this.booktitle = v(p.metadata.dc_relation_ispartofbook);
    if(this.booktitle==="Titolo volume non avvalorato") this.booktitle = null;

}


Pubblication.prototype.authorProcessor = null;
// Pubblication.prototype.setProcessor = function(ap){
//     this.authorProcessor = ap;
// };
Pubblication.prototype.ap = function(authors){
    if(this.authorProcessor)
        return this.authorProcessor.process(authors);
    else
        return authors;
};

Pubblication.prototype.toBibtex = function(){
    let types = {
        [TYPE_JOURNAL] : "article",
        [TYPE_CONFERENCE] : "inproceedings",
        [TYPE_CHAPTER] : "inbook",
        [TYPE_BOOK] : "book",
        [TYPE_OTHER] : "misc"
    };

    let bibtex = "@" + types[this.type] + "{ handle_" + this.id +",\n" +
        "  author={ " + this.ap(this.author).join(' and ') + "},\n"+
        "  title={" + this.title + "}"
    ;
    for( f in this){
        if(this.hasOwnProperty(f) && f!="author" & f!="title" && this[f]){
            bibtex += ",\n  " + f + " ={" + this[f] + "}";
        }
    }
    bibtex += "}";
    return bibtex;
};



TYPE_JOURNAL = "Journal";
TYPE_CHAPTER =  "Book Chapter";
TYPE_CONFERENCE =  "Conference";
TYPE_BOOK =  "Book";
TYPE_POSTER =  "Poster";
TYPE_OTHER =  "Other";
MIUR_TYPES = {
    "262" : TYPE_JOURNAL,
    "268" : TYPE_CHAPTER,
    "273" : TYPE_CONFERENCE,
    "276" : TYPE_BOOK,
    "275" : TYPE_POSTER,
    "298" : TYPE_OTHER
};


/**
 * Manages a publication list
 *
 * @param irisJSon
 * @constructor of object PubList
 */
function PubList(irisJSon){
    this.years = [];
    this.pubs = {};
    this.ap = new AuthorRecognizer();
    if(isIrisJson(irisJSon)){
        this.process(irisJSon);
    }
}

PubList.prototype.process = function(irisJson){
    if(!isIrisJson(irisJson)){
        console.error("Not a correct JSON");
        throw "This is not apparently an IRIS JSON object";
    }
    this.ap.process(irisJson.records.map( it => it.metadata.dc_description_allpeople[0].value ));
    let ap = this.ap;
    let years = this.years;
    let pubs = this.pubs;

    irisJson.records.forEach(function(p,i) {
        var flag=0;
        let pub = new Pubblication(p,ap);
        // -- If the publication is of a past member for a year in which is no more part of Nexa set the flag
        for(let i=0;i<peoplePast.length;i++){
            if(peoplePast[i].extraCheck(pub.author, pub.year)===1){
                flag=1;
            }
        }
        // ++ If the publication is also of a current member which is part of Nexa unset the flag
        for(let j=0;j<peopleNexa.length;j++){
            if(pub.author.find(a => a.includes(peopleNexa[j].id))) flag = 0;
        }
        // -*-*- only if the flag is unset add the publication -*-*-
        if(flag === 0){
            if(!pubs[pub.id]){
                pubs[pub.id] = pub;
            }
            if(years.indexOf(pub.year)<0){
                years.push(pub.year);
            }
        }

    });
    this.years = this.years.sort().reverse();
};

PubList.prototype.getYears = function(){
    return this.years;
}

PubList.prototype.getPubs = function(){
    let allPubs = [];
    for(let h in this.pubs){

        if(this.pubs.hasOwnProperty(h)){
            allPubs.push(this.pubs[h]);
        }
    }
    return allPubs;
};



PubList.prototype.getPubsByYearType = function(){
    let groupedPubs = {};
    for(let h in this.pubs){
        if(this.pubs.hasOwnProperty(h)){
            let pub = this.pubs[h];
            if(!groupedPubs[pub.year]){
                groupedPubs[pub.year] = {};
            }
            if(!groupedPubs[pub.year][pub.type]){
                groupedPubs[pub.year][pub.type] = [];
            }
            groupedPubs[pub.year][pub.type].push(pub);
        }
    }
    return groupedPubs;
};



