module.exports = new Proxy({}, {
    get(target, p) {
        return p.toString();
    }
});