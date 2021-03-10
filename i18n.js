const fs = require('fs');
const path = require('path');

const defaultConfig = {
  path: path.join(__dirname, 'i18n'),
  defaultLang: 'en',
  availableLang: ['en'],
  lang: {}
}

class i18n {
  constructor(config) {
    this.config = {
      ...defaultConfig,
      ...config
    }

    fs.readdirSync(this.config.path).forEach((langFile)=>{
      const parsedPath = path.parse(langFile)
      const fullPath = path.join(this.config.path, langFile)
      if(parsedPath.ext!=='.json' || !this.config.availableLang.includes(parsedPath.name)) return;

      try {
        this.config.lang[parsedPath.name] = require(fullPath);
      } catch (error) {
        console.log('Error i18n: unable to parse  lang file', error);
      }
    })
  }

  translate(key,langName) {
    if(key == '_currentLang') return langName;
    
    if(key.endsWith('.')) key=key.slice(0, -1);

    let root = this.config.lang[langName]
    let translation = null;
    try {
      translation = key.split('.').reduce((parent,subPath, deepness)=>{
        if(deepness==1) return root?.[parent]?.[subPath];
        return parent?.[subPath];
      })
    } catch (error) {
      console.log(error);
    } 


    if((translation===null || translation===undefined)  && langName != this.config.defaultLang) return this.translate(key, this.config.defaultLang);
    return translation || '';
  }

  translateMiddleware(req, res) {

    const selectedLanguage = req.cookies['selected_language'];
    const languageHeader = req.headers['accept-language'];
    let langName = this.config.defaultLang;

    if(this.config.availableLang.includes(languageHeader)) {
      langName = languageHeader;
    }

    if(this.config.availableLang.includes(languageHeader.split('-')[0])){
      langName = languageHeader.split('-')[0];
    }

    if(selectedLanguage) {
      if(this.config.availableLang.includes(selectedLanguage)) {
        langName = selectedLanguage;
      }
    }

    return (key) => {
      return this.translate(key, langName);
    }
  }

  createNamespace(translateFunction, prefix) {
    return (key)=>{
      const path = `${prefix}.${key??''}`;
      return translateFunction(path)
    };
  }

}

module.exports = i18n