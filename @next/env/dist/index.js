(()=>{var e={383:e=>{"use strict";function _searchLast(e,t){const n=Array.from(e.matchAll(t));return n.length>0?n.slice(-1)[0].index:-1}function _interpolate(e,t,n){const r=_searchLast(e,/(?!(?<=\\))\$/g);if(r===-1)return e;const o=e.slice(r);const s=/((?!(?<=\\))\${?([\w]+)(?::-([^}\\]*))?}?)/;const i=o.match(s);if(i!=null){const[,r,o,s]=i;return _interpolate(e.replace(r,t[o]||s||n.parsed[o]||""),t,n)}return e}function _resolveEscapeSequences(e){return e.replace(/\\\$/g,"$")}function expand(e){const t=e.ignoreProcessEnv?{}:process.env;for(const n in e.parsed){const r=Object.prototype.hasOwnProperty.call(t,n)?t[n]:e.parsed[n];e.parsed[n]=_resolveEscapeSequences(_interpolate(r,t,e))}for(const n in e.parsed){t[n]=e.parsed[n]}return e}e.exports.j=expand},234:(e,t,n)=>{const r=n(147);const o=n(17);const s=n(37);const i=n(113);const c=n(803);const a=c.version;const l=/(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;function parse(e){const t={};let n=e.toString();n=n.replace(/\r\n?/gm,"\n");let r;while((r=l.exec(n))!=null){const e=r[1];let n=r[2]||"";n=n.trim();const o=n[0];n=n.replace(/^(['"`])([\s\S]*)\1$/gm,"$2");if(o==='"'){n=n.replace(/\\n/g,"\n");n=n.replace(/\\r/g,"\r")}t[e]=n}return t}function _parseVault(e){const t=_vaultPath(e);const n=p.configDotenv({path:t});if(!n.parsed){throw new Error(`MISSING_DATA: Cannot parse ${t} for an unknown reason`)}const r=_dotenvKey(e).split(",");const o=r.length;let s;for(let e=0;e<o;e++){try{const t=r[e].trim();const o=_instructions(n,t);s=p.decrypt(o.ciphertext,o.key);break}catch(t){if(e+1>=o){throw t}}}return p.parse(s)}function _log(e){console.log(`[dotenv@${a}][INFO] ${e}`)}function _warn(e){console.log(`[dotenv@${a}][WARN] ${e}`)}function _debug(e){console.log(`[dotenv@${a}][DEBUG] ${e}`)}function _dotenvKey(e){if(e&&e.DOTENV_KEY&&e.DOTENV_KEY.length>0){return e.DOTENV_KEY}if(process.env.DOTENV_KEY&&process.env.DOTENV_KEY.length>0){return process.env.DOTENV_KEY}return""}function _instructions(e,t){let n;try{n=new URL(t)}catch(e){if(e.code==="ERR_INVALID_URL"){throw new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenv.org/vault/.env.vault?environment=development")}throw e}const r=n.password;if(!r){throw new Error("INVALID_DOTENV_KEY: Missing key part")}const o=n.searchParams.get("environment");if(!o){throw new Error("INVALID_DOTENV_KEY: Missing environment part")}const s=`DOTENV_VAULT_${o.toUpperCase()}`;const i=e.parsed[s];if(!i){throw new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${s} in your .env.vault file.`)}return{ciphertext:i,key:r}}function _vaultPath(e){let t=o.resolve(process.cwd(),".env");if(e&&e.path&&e.path.length>0){t=e.path}return t.endsWith(".vault")?t:`${t}.vault`}function _resolveHome(e){return e[0]==="~"?o.join(s.homedir(),e.slice(1)):e}function _configVault(e){_log("Loading env from encrypted .env.vault");const t=p._parseVault(e);let n=process.env;if(e&&e.processEnv!=null){n=e.processEnv}p.populate(n,t,e);return{parsed:t}}function configDotenv(e){let t=o.resolve(process.cwd(),".env");let n="utf8";const s=Boolean(e&&e.debug);if(e){if(e.path!=null){t=_resolveHome(e.path)}if(e.encoding!=null){n=e.encoding}}try{const o=p.parse(r.readFileSync(t,{encoding:n}));let s=process.env;if(e&&e.processEnv!=null){s=e.processEnv}p.populate(s,o,e);return{parsed:o}}catch(e){if(s){_debug(`Failed to load ${t} ${e.message}`)}return{error:e}}}function config(e){const t=_vaultPath(e);if(_dotenvKey(e).length===0){return p.configDotenv(e)}if(!r.existsSync(t)){_warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${t}. Did you forget to build it?`);return p.configDotenv(e)}return p._configVault(e)}function decrypt(e,t){const n=Buffer.from(t.slice(-64),"hex");let r=Buffer.from(e,"base64");const o=r.slice(0,12);const s=r.slice(-16);r=r.slice(12,-16);try{const e=i.createDecipheriv("aes-256-gcm",n,o);e.setAuthTag(s);return`${e.update(r)}${e.final()}`}catch(e){const t=e instanceof RangeError;const n=e.message==="Invalid key length";const r=e.message==="Unsupported state or unable to authenticate data";if(t||n){const e="INVALID_DOTENV_KEY: It must be 64 characters long (or more)";throw new Error(e)}else if(r){const e="DECRYPTION_FAILED: Please check your DOTENV_KEY";throw new Error(e)}else{console.error("Error: ",e.code);console.error("Error: ",e.message);throw e}}}function populate(e,t,n={}){const r=Boolean(n&&n.debug);const o=Boolean(n&&n.override);if(typeof t!=="object"){throw new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate")}for(const n of Object.keys(t)){if(Object.prototype.hasOwnProperty.call(e,n)){if(o===true){e[n]=t[n]}if(r){if(o===true){_debug(`"${n}" is already defined and WAS overwritten`)}else{_debug(`"${n}" is already defined and was NOT overwritten`)}}}else{e[n]=t[n]}}}const p={configDotenv:configDotenv,_configVault:_configVault,_parseVault:_parseVault,config:config,decrypt:decrypt,parse:parse,populate:populate};e.exports.configDotenv=p.configDotenv;e.exports._configVault=p._configVault;e.exports._parseVault=p._parseVault;e.exports.config=p.config;e.exports.decrypt=p.decrypt;e.exports.parse=p.parse;e.exports.populate=p.populate;e.exports=p},113:e=>{"use strict";e.exports=require("crypto")},147:e=>{"use strict";e.exports=require("fs")},37:e=>{"use strict";e.exports=require("os")},17:e=>{"use strict";e.exports=require("path")},803:e=>{"use strict";e.exports=JSON.parse('{"name":"dotenv","version":"16.3.1","description":"Loads environment variables from .env file","main":"lib/main.js","types":"lib/main.d.ts","exports":{".":{"types":"./lib/main.d.ts","require":"./lib/main.js","default":"./lib/main.js"},"./config":"./config.js","./config.js":"./config.js","./lib/env-options":"./lib/env-options.js","./lib/env-options.js":"./lib/env-options.js","./lib/cli-options":"./lib/cli-options.js","./lib/cli-options.js":"./lib/cli-options.js","./package.json":"./package.json"},"scripts":{"dts-check":"tsc --project tests/types/tsconfig.json","lint":"standard","lint-readme":"standard-markdown","pretest":"npm run lint && npm run dts-check","test":"tap tests/*.js --100 -Rspec","prerelease":"npm test","release":"standard-version"},"repository":{"type":"git","url":"git://github.com/motdotla/dotenv.git"},"funding":"https://github.com/motdotla/dotenv?sponsor=1","keywords":["dotenv","env",".env","environment","variables","config","settings"],"readmeFilename":"README.md","license":"BSD-2-Clause","devDependencies":{"@definitelytyped/dtslint":"^0.0.133","@types/node":"^18.11.3","decache":"^4.6.1","sinon":"^14.0.1","standard":"^17.0.0","standard-markdown":"^7.1.0","standard-version":"^9.5.0","tap":"^16.3.0","tar":"^6.1.11","typescript":"^4.8.4"},"engines":{"node":">=12"},"browser":{"fs":false}}')}};var t={};function __nccwpck_require__(n){var r=t[n];if(r!==undefined){return r.exports}var o=t[n]={exports:{}};var s=true;try{e[n](o,o.exports,__nccwpck_require__);s=false}finally{if(s)delete t[n]}return o.exports}(()=>{__nccwpck_require__.n=e=>{var t=e&&e.__esModule?()=>e["default"]:()=>e;__nccwpck_require__.d(t,{a:t});return t}})();(()=>{__nccwpck_require__.d=(e,t)=>{for(var n in t){if(__nccwpck_require__.o(t,n)&&!__nccwpck_require__.o(e,n)){Object.defineProperty(e,n,{enumerable:true,get:t[n]})}}}})();(()=>{__nccwpck_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)})();(()=>{__nccwpck_require__.r=e=>{if(typeof Symbol!=="undefined"&&Symbol.toStringTag){Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}Object.defineProperty(e,"__esModule",{value:true})}})();if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var n={};(()=>{"use strict";__nccwpck_require__.r(n);__nccwpck_require__.d(n,{initialEnv:()=>a,updateInitialEnv:()=>updateInitialEnv,processEnv:()=>processEnv,resetEnv:()=>resetEnv,loadEnvConfig:()=>loadEnvConfig});var e=__nccwpck_require__(147);var t=__nccwpck_require__.n(e);var r=__nccwpck_require__(17);var o=__nccwpck_require__.n(r);var s=__nccwpck_require__(234);var i=__nccwpck_require__.n(s);var c=__nccwpck_require__(383);let a=undefined;let l=undefined;let p=[];let u=[];function updateInitialEnv(e){Object.assign(a||{},e)}function replaceProcessEnv(e){Object.keys(process.env).forEach((t=>{if(!t.startsWith("__NEXT_PRIVATE")){if(e[t]===undefined||e[t]===""){delete process.env[t]}}}));Object.entries(e).forEach((([e,t])=>{process.env[e]=t}))}function processEnv(e,t,n=console,o=false,i){var l;if(!a){a=Object.assign({},process.env)}if(!o&&(process.env.__NEXT_PROCESSED_ENV||e.length===0)){return process.env}process.env.__NEXT_PROCESSED_ENV="true";const p=Object.assign({},a);const _={};for(const o of e){try{let e={};e.parsed=s.parse(o.contents);e=(0,c.j)(e);if(e.parsed&&!u.some((e=>e.contents===o.contents&&e.path===o.path))){i===null||i===void 0?void 0:i(o.path)}for(const t of Object.keys(e.parsed||{})){if(typeof _[t]==="undefined"&&typeof p[t]==="undefined"){_[t]=(l=e.parsed)===null||l===void 0?void 0:l[t]}}}catch(e){n.error(`Failed to load env from ${r.join(t||"",o.path)}`,e)}}return Object.assign(process.env,_)}function resetEnv(){if(a){replaceProcessEnv(a)}}function loadEnvConfig(t,n,o=console,s=false,i){if(!a){a=Object.assign({},process.env)}if(l&&!s){return{combinedEnv:l,loadedEnvFiles:p}}replaceProcessEnv(a);u=p;p=[];const c=process.env.NODE_ENV==="test";const _=c?"test":n?"development":"production";const d=[`.env.${_}.local`,_!=="test"&&`.env.local`,`.env.${_}`,".env"].filter(Boolean);for(const n of d){const s=r.join(t,n);try{const t=e.statSync(s);if(!t.isFile()){continue}const r=e.readFileSync(s,"utf8");p.push({path:n,contents:r})}catch(e){if(e.code!=="ENOENT"){o.error(`Failed to load env from ${n}`,e)}}}l=processEnv(p,t,o,s,i);return{combinedEnv:l,loadedEnvFiles:p}}})();module.exports=n})();