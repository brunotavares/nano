var Router = {

    _currentHash: void 0,
    _callback: void 0,

    setup: function(callback) {
        var self = this,
            docMode = document.documentMode,
            supportsHash = 'onhashchange' in window && (docMode === undefined || docMode > 7)
            hash = self.getHash();

        self._callback = callback;

        if (supportsHash) {
            $(window).on('hashchange', $.proxy(self.onHashChange, self));
        }
        else {
            window.setInterval($.proxy(self.onHashChange, self), 50);
        }

        if (hash.length) {
            self.onHashChange();
        }
    },

    getHash: function() {
        return window.location.hash.substr(1);
    },

    onHashChange: function () {
        var self = this,
            hash = self.getHash();

        if (hash !== self._currentHash) {
            self._currentHash = hash;

            if (self._callback) {
                self._callback(hash);
            }
        }
    }
};