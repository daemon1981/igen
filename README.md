IGen
====

Internalization Generator

Set your templates location and type

Requirements
------------

Linux OS with `grep -p` working
Node.js (version >= 0.10)

Getting Started
---------------

```
var IGen = require('igen');

var iGen = new IGen({
  keys: {
    module: 'handlebars',
    options: {
      path:           "./path/to/templates", // templates directory     (String, required)
      helperName:     "t"                    // name of the helper      (String, required)
      undectableKeys: []                     // list of undectable keys (String, required)
    }
  },
  translations: {
    module: 'csv',
    options: {
      file:           "./file.csv",  // location of the translation "CSV" file (String)
      indexHeader:    0,             // index of the header                    (Number, default 0)
      indexStartBody: 1,             // starting index of the body             (Number, default 1)
      keyColumn:      "dev",         // column of the translation keys         (Number|String, default 0)
      refLanguage:    "fr",          // column of the ref translation language (Number|String, default 0)
      languages: {
        fr: {
          column:   "fr" // (String|Number, required)
          filename: "fr" // (String, required)
        },
        en: {
          column:   "en"
          filename: "en"
        }
      }
    }
  },
  generator: {
    module: 'node-export',
    options: {
      wd: "./locales"   // location of the generated files (String)
    }
  },
  reporter: {
    module: 'json',
    options: {
      file: "./locales/reporting"   // location of the generated files (String)
    }
  }
});

iGen.run(function(err, result){
  if (err) return console.log(err);
});
```

Installation
------------

```
npm cache clear
npm install -g nave
nave use 0.10.31
npm install -g mocha jshint
git clone https://github.com/daemon1981/igen.git
cd igen
npm install
make test
```