String.prototype.capitalize = function() {
    let str = this.split(/\r?\n/);
    str.forEach((s, i) => {
        const fix = s.charAt(0).toUpperCase() + s.slice(1);
        str[i] = fix;
    });

    str = str.join('/n');

    str = str.split(' ');
    str.forEach((s, i) => {
        const fix = s.charAt(0).toUpperCase() + s.slice(1);
        str[i] = fix;
    });

    return str.join(' ');
}