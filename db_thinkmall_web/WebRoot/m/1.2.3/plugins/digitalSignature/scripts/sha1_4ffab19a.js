/*创建时间hSea 2016-04-07 20:06:24 PM */
define('1.2.3/plugins/digitalSignature/scripts/sha1_4ffab19a', function(require,exports,module){function a(a){function b(a,b){var c=a<<b|a>>>32-b;return c}function c(a){var b,c,d="";for(b=7;b>=0;b--)c=a>>>4*b&15,d+=c.toString(16);return d}function d(a){a=a.replace(/\r\n/g,"\n");for(var b="",c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(d>>6|192),b+=String.fromCharCode(63&d|128)):(b+=String.fromCharCode(d>>12|224),b+=String.fromCharCode(d>>6&63|128),b+=String.fromCharCode(63&d|128))}return b}var e,f,g,h,i,j,k,l,m,n=new Array(80),o=1732584193,p=4023233417,q=2562383102,r=271733878,s=3285377520;a=d(a);var t=a.length,u=new Array;for(f=0;t-3>f;f+=4)g=a.charCodeAt(f)<<24|a.charCodeAt(f+1)<<16|a.charCodeAt(f+2)<<8|a.charCodeAt(f+3),u.push(g);switch(t%4){case 0:f=2147483648;break;case 1:f=a.charCodeAt(t-1)<<24|8388608;break;case 2:f=a.charCodeAt(t-2)<<24|a.charCodeAt(t-1)<<16|32768;break;case 3:f=a.charCodeAt(t-3)<<24|a.charCodeAt(t-2)<<16|a.charCodeAt(t-1)<<8|128}for(u.push(f);u.length%16!=14;)u.push(0);for(u.push(t>>>29),u.push(t<<3&4294967295),e=0;e<u.length;e+=16){for(f=0;16>f;f++)n[f]=u[e+f];for(f=16;79>=f;f++)n[f]=b(n[f-3]^n[f-8]^n[f-14]^n[f-16],1);for(h=o,i=p,j=q,k=r,l=s,f=0;19>=f;f++)m=b(h,5)+(i&j|~i&k)+l+n[f]+1518500249&4294967295,l=k,k=j,j=b(i,30),i=h,h=m;for(f=20;39>=f;f++)m=b(h,5)+(i^j^k)+l+n[f]+1859775393&4294967295,l=k,k=j,j=b(i,30),i=h,h=m;for(f=40;59>=f;f++)m=b(h,5)+(i&j|i&k|j&k)+l+n[f]+2400959708&4294967295,l=k,k=j,j=b(i,30),i=h,h=m;for(f=60;79>=f;f++)m=b(h,5)+(i^j^k)+l+n[f]+3395469782&4294967295,l=k,k=j,j=b(i,30),i=h,h=m;o=o+h&4294967295,p=p+i&4294967295,q=q+j&4294967295,r=r+k&4294967295,s=s+l&4294967295}var m=c(o)+c(p)+c(q)+c(r)+c(s);return m.toLowerCase()}module.exports={sha1:a}});
/*创建时间 2016-04-07 20:06:24 PM */