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

String.prototype.formatDate = function() {
    try {
        const created_at = new Date(this);
        let createdAtFormated = "";
        createdAtFormated += ('0' + created_at.getDate()).slice(-2);
        createdAtFormated += '-';
        createdAtFormated += ('0' + (created_at.getMonth() + 1)).slice(-2);
        createdAtFormated += ' ';
        createdAtFormated += ('0' + created_at.getHours()).slice(-2);
        createdAtFormated += ':';
        createdAtFormated += ('0' + created_at.getMinutes()).slice(-2);

        return createdAtFormated;
    } catch (error) {
        console.log(error);
    }

    return false;
}

Array.prototype.containsObject = function(obj) {
    var x;
    for (x in this) {
        if (this.hasOwnProperty(x) && this[x] === obj) {
            return true;
        }
    }

    return false;
};