WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS = !(jQuery.browser.msie &&
                                                jQuery.browser.version < "8.0");

/**
    structuredHeadings
    ==================

    Initializes the structured_headings plugin for the wymeditor instance. This
    method should be called by the passed wymeditor instance in the `postInit`
    function of the wymeditor instantiation.
*/
WYMeditor.editor.prototype.structuredHeadings = function () {
    var wym = this,
        wymBasePath = WYMeditor.computeBasePath(WYMeditor.computeWymPath()),
        iframeHead = jQuery(wym._doc).find('head')[0],
        stylesheetHref,
        cssLink,
        cssRequest;

    cssLink = wym._doc.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';

    if (!WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS) {
        stylesheetHref = '/plugins/structured_headings/structured_headings_ie7.css';
        cssLink.href = '../..' + stylesheetHref; // Adjust path for iframe
        iframeHead.appendChild(cssLink);

        wym.setupHeadingNumbering();

    } else {
        stylesheetHref = '/plugins/structured_headings/structured_headings.css';
        cssLink.href = '../..' + stylesheetHref; // Adjust path for iframe

        iframeHead.appendChild(cssLink);

        // Get stylesheet CSS and store it in WYMeditor so that it can be accessed
        // to put on other pages.
        cssRequest = new XMLHttpRequest();
        cssRequest.open('GET', wymBasePath + stylesheetHref, false);
        cssRequest.send('');
        WYMeditor.structuredHeadingsCSS = cssRequest.responseText;
    }
};

/**
    WYMeditor.getStructuredHeadingsCSS
    ==================================

    Function to output the plugin CSS to the console log so that it can be
    copied over to other pages.
*/
WYMeditor.printStructuredHeadingsCSS = function () {
    if (WYMeditor.BROWSER_SUPPORTED_STRUCTURED_HEADINGS) {
        WYMeditor.console.log(WYMeditor.structuredHeadingsCSS);
    }
};

/**
    setupHeadingNumbering
    =====================

    TODO: Javascript shim to add heading numbering to IE versions 7 and lower.
*/
WYMeditor.editor.prototype.setupHeadingNumbering = function () {
    var wym = this,
        $body = jQuery(wym._doc.body),
        headerList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        headerSel = headerList.join(', '),
        prevHeaderTotal = 0;

    $body.keydown(function () {
        var headerTotal = $body.find(headerSel).length;

        if (headerTotal !== prevHeaderTotal) {
            numberHeadingsIE7(wym._doc, true);
        }

        prevHeaderTotal = headerTotal;
    });
}
