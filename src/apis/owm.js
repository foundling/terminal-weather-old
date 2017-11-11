
function toRequestPath({ proto, host, path , qps}) {
     
    return `${proto}://${host}${path}?${qps}`;

};

module.exports = { toRequestPath };



